import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimplePaymentModal from "../components/SimplePaymentModal";

interface OrderInfo {
  name: string;
  email: string;
  phone: string;
  amount: number;
  paymentMethod: string;
}

function SimplePaymentPage(): JSX.Element {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 주문 정보 상태
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: "",
    email: "",
    phone: "",
    amount: 10000, // 기본 금액
    paymentMethod: "card",
  });

  // 입력 필드 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseInt(value, 10) : value,
    }));
  };

  // IMP 라이브러리 로드
  useEffect(() => {
    // IMP 라이브러리가 이미 로드되었는지 확인
    if (!window.IMP) {
      const script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js";
      script.async = true;
      script.onload = () => {
        // 라이브러리 로드 후 초기화
        if (window.IMP) {
          window.IMP.init("imp57468437"); // 실제 가맹점 식별코드 사용
        }
      };
      document.head.appendChild(script);
    } else {
      // 이미 로드된 경우 초기화
      window.IMP.init("imp57468437"); // 실제 가맹점 식별코드 사용
    }
  }, []);

  // 결제 처리
  const handlePayment = async () => {
    // 폼 유효성 검사
    if (!validateForm()) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 결제 모달 열기
      setIsModalOpen(true);

      // 결제 요청 정보 생성
      const merchantUid = `mid_${new Date().getTime()}`;

      // 아임포트 결제 모듈 호출
      window.IMP.request_pay(
        {
          pg: "html5_inicis.INIpayTest", // KG이니시스 테스트 모드 설정
          pay_method: orderInfo.paymentMethod,
          merchant_uid: merchantUid,
          name: "테스트 상품",
          amount: orderInfo.amount,
          buyer_email: orderInfo.email,
          buyer_name: orderInfo.name,
          buyer_tel: orderInfo.phone,
          m_redirect_url: window.location.origin + "/payment/simple-complete", // 모바일 환경에서 필요
        },
        (response: any) => {
          // 결제 모달 닫기
          setIsModalOpen(false);

          if (response.success) {
            // 결제 성공 시 완료 페이지로 이동
            navigate(
              `/payment/simple-complete?imp_uid=${response.imp_uid}&merchant_uid=${response.merchant_uid}`,
            );
          } else {
            // 결제 실패
            alert(`결제에 실패했습니다: ${response.error_msg}`);
          }

          setIsLoading(false);
        },
      );
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const requiredFields = ["name", "email", "phone"];
    return requiredFields.every(
      (field) => orderInfo[field as keyof OrderInfo].toString().trim() !== "",
    );
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>간편 결제</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            이름 *
          </label>
          <input
            type="text"
            name="name"
            value={orderInfo.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            이메일 *
          </label>
          <input
            type="email"
            name="email"
            value={orderInfo.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            전화번호 *
          </label>
          <input
            type="tel"
            name="phone"
            value={orderInfo.phone}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            결제 금액 (원)
          </label>
          <input
            type="number"
            name="amount"
            value={orderInfo.amount}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            min="1000"
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            결제 방법
          </label>
          <select
            name="paymentMethod"
            value={orderInfo.paymentMethod}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="card">신용카드</option>
            <option value="trans">실시간 계좌이체</option>
            <option value="vbank">가상계좌</option>
            <option value="phone">휴대폰 소액결제</option>
          </select>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "처리 중..." : "결제하기"}
        </button>
      </div>

      <SimplePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div style={{ textAlign: "center" }}>
          <h2>결제 진행 중...</h2>
          <p>결제 창이 나타나지 않으면 팝업 차단 설정을 확인해주세요.</p>
        </div>
      </SimplePaymentModal>
    </div>
  );
}

// React Router v6 이상에서 사용하는 Component 내보내기
export function Component(): JSX.Element {
  return <SimplePaymentPage />;
}

export default SimplePaymentPage;
