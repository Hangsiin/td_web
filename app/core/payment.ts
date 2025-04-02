/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import axios from "axios";

// 결제 데이터 타입 정의
interface OrderData {
  merchantUid: string;
  amount: number;
  name: string;
  buyerName: string;
  buyerEmail: string;
  buyerTel: string;
}

interface PaymentData {
  merchantUid: string;
  channelKey?: string;
  name: string;
  amount: number;
  buyerEmail: string;
  buyerName: string;
  buyerTel: string;
  signature?: string;
  timestamp?: string;
}

interface PaymentResponse {
  success: boolean;
  imp_uid: string;
  merchant_uid: string;
  error_msg?: string;
}

// 아임포트 결제 준비 함수
export const preparePayment = async (orderData: OrderData) => {
  try {
    const response = await axios.post("/api/payments/prepare", orderData);
    return response.data;
  } catch (error) {
    console.error("결제 준비 중 오류 발생:", error);
    throw error;
  }
};

// 아임포트 결제 검증 함수
export const verifyPayment = async (impUid: string, merchantUid: string) => {
  try {
    const response = await axios.post("/api/payments/verify", {
      imp_uid: impUid,
      merchant_uid: merchantUid,
    });
    return response.data;
  } catch (error) {
    console.error("결제 검증 중 오류 발생:", error);
    throw error;
  }
};

// 결제 요청 함수
export const requestPayment = (
  paymentData: PaymentData,
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    // IMP 라이브러리가 로드될 때까지 기다림
    const waitForImp = () => {
      const IMP = (window as any).IMP;
      if (IMP) {
        // 채널 키를 사용하여 아임포트 초기화
        // 테스트 모드용 가맹점 식별코드 사용
        IMP.init(paymentData.channelKey || "imp00000000"); // 테스트 모드 사용

        IMP.request_pay(
          {
            pg: "html5_inicis.INIpayTest", // PG사 테스트 모드
            pay_method: "card", // 결제 수단
            merchant_uid: paymentData.merchantUid, // 주문번호
            name: paymentData.name, // 상품명
            amount: paymentData.amount, // 결제금액
            buyer_email: paymentData.buyerEmail, // 구매자 이메일
            buyer_name: paymentData.buyerName, // 구매자 이름
            buyer_tel: paymentData.buyerTel, // 구매자 전화번호
            m_redirect_url: window.location.origin + "/payment/complete", // 모바일 결제 후 리다이렉트 URL
            // 이니시스 결제 검증을 위한 추가 파라미터
            signature: paymentData.signature,
            timestamp: paymentData.timestamp,
            // 디버깅 용도
            digital: true, // 디지털 상품 여부
            app_scheme: "", // 앱 스킴
            biz_num: "",
          },
          (response: PaymentResponse) => {
            console.log("Payment Response:", response);
            if (response.success) {
              resolve({
                success: true,
                imp_uid: response.imp_uid,
                merchant_uid: response.merchant_uid,
              });
            } else {
              console.error("Payment failed:", response.error_msg);
              reject(new Error(response.error_msg || "결제에 실패했습니다."));
            }
          },
        );
      } else {
        // IMP가 로드되지 않았으면 100ms 후 다시 시도
        setTimeout(waitForImp, 100);
      }
    };

    // IMP 로드 여부 확인 시작
    waitForImp();
  });
};
