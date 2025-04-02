/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app.js";
import axios from "axios";
import crypto from "crypto";

// 환경 변수 타입 정의
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMP_API_KEY?: string;
      IMP_API_SECRET?: string;
    }
  }
}

// 타입 정의
interface RequestData {
  imp_uid?: string;
  merchant_uid?: string;
  amount?: number;
  merchantUid?: string;
  name?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerTel?: string;
}

// 아임포트 API 인증 토큰 발급 함수
async function getImpToken() {
  try {
    const response = await axios.post("https://api.iamport.kr/users/getToken", {
      imp_key: process.env.IMP_API_KEY || "imp_apikey", // 실제 배포 시 환경변수로 설정
      imp_secret: process.env.IMP_API_SECRET || "imp_secret", // 실제 배포 시 환경변수로 설정
    });
    return response.data.response.access_token;
  } catch (error) {
    console.error("아임포트 토큰 발급 중 오류:", error);
    throw new Error("아임포트 인증에 실패했습니다.");
  }
}

// 이니시스 결제 검증용 서명 생성
function generateSignature(oid: string, price: number) {
  const signKey = "SU5JTElURV9UUklQTEVERVNfS0VZU1RS"; // 제공받은 웹결제 signkey
  const timestamp = Date.now().toString();
  const message = `oid=${oid}&price=${price}&timestamp=${timestamp}`;

  return {
    signature: crypto
      .createHmac("sha256", signKey)
      .update(message)
      .digest("hex"),
    timestamp,
  };
}

// 결제 준비 API 엔드포인트
app.post("/api/payments/prepare", async (req) => {
  try {
    const data = await req.json<RequestData>();
    const { amount, merchantUid, name, buyerName, buyerEmail, buyerTel } = data;

    // 요청 데이터 로깅
    console.log("결제 준비 요청 데이터:", data);

    if (!merchantUid || !amount) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "필수 파라미터가 누락되었습니다.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // 이니시스 결제 검증용 서명 생성
    const { signature, timestamp } = generateSignature(merchantUid, amount);

    // 응답 데이터 생성
    const responseData = {
      success: true,
      merchantUid,
      amount,
      name,
      buyerName,
      buyerEmail,
      buyerTel,
      signature,
      timestamp,
      channelKey: "imp57468437", // 실제 가맹점 식별코드
    };

    console.log("결제 준비 응답 데이터:", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("결제 준비 중 오류 발생:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "결제 준비 중 오류가 발생했습니다.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

// 결제 검증 API 엔드포인트
app.post("/api/payments/verify", async (req) => {
  try {
    const data = await req.json<RequestData>();
    const { imp_uid, merchant_uid } = data;

    if (!imp_uid || !merchant_uid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "필수 파라미터가 누락되었습니다.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // 액세스 토큰 발급
    const accessToken = await getImpToken();

    // 결제 정보 조회
    const { data: responseData } = await axios.get(
      `https://api.iamport.kr/payments/${imp_uid}`,
      {
        headers: { Authorization: accessToken },
      },
    );

    const paymentData = responseData.response;

    // 여기서 DB에서 주문 정보 조회 로직 추가 가능
    // const orderData = await getOrderFromDB(merchant_uid);

    // 결제 금액 검증 (실제 구현 시 DB의 주문 금액과 비교)
    const expectedAmount = 1000; // 예시 금액, 실제로는 DB에서 조회한 금액 사용

    if (
      paymentData.status === "paid" &&
      paymentData.amount === expectedAmount
    ) {
      // 결제 성공 처리 (DB 업데이트 등)
      return new Response(
        JSON.stringify({
          success: true,
          message: "결제가 성공적으로 완료되었습니다.",
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } else {
      // 결제 실패 처리
      return new Response(
        JSON.stringify({
          success: false,
          message: "결제 금액이 일치하지 않거나 결제가 완료되지 않았습니다.",
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("결제 검증 중 오류 발생:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "결제 검증 중 오류가 발생했습니다.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

export const handler = app;
