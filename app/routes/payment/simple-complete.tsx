import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PaymentResult {
  success: boolean;
  message: string;
  impUid: string;
  merchantUid: string;
}

function SimpleCompletePage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentResult, setPaymentResult] = useState<PaymentResult>({
    success: false,
    message: '결제 정보를 확인 중입니다...',
    impUid: '',
    merchantUid: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // URL 쿼리 파라미터에서 결제 정보 추출
    const searchParams = new URLSearchParams(location.search);
    const impUid = searchParams.get('imp_uid');
    const merchantUid = searchParams.get('merchant_uid');
    
    if (!impUid || !merchantUid) {
      setPaymentResult({
        success: false,
        message: '결제 정보가 올바르지 않습니다.',
        impUid: '',
        merchantUid: ''
      });
      setIsLoading(false);
      return;
    }

    // 결제 검증 함수
    const verifyPayment = async () => {
      try {
        // 여기서는 간단히 성공으로 처리합니다.
        // 실제로는 백엔드 API를 호출하여 결제를 검증해야 합니다.
        setPaymentResult({
          success: true,
          message: '결제가 성공적으로 완료되었습니다.',
          impUid: impUid || '',
          merchantUid: merchantUid || ''
        });
      } catch (error) {
        console.error('결제 검증 중 오류 발생:', error);
        setPaymentResult({
          success: false,
          message: '결제 검증에 실패했습니다.',
          impUid: impUid || '',
          merchantUid: merchantUid || ''
        });
      } finally {
        setIsLoading(false);
      }
    };

    // 결제 검증 실행
    verifyPayment();
  }, [location]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>결제 결과</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        {isLoading ? (
          <div>
            <p>결제 정보를 확인 중입니다...</p>
          </div>
        ) : (
          <div>
            <div style={{ 
              fontSize: '72px', 
              marginBottom: '20px',
              color: paymentResult.success ? '#4CAF50' : '#F44336'
            }}>
              {paymentResult.success ? '✓' : '✗'}
            </div>
            
            <h2 style={{ 
              color: paymentResult.success ? '#4CAF50' : '#F44336',
              marginBottom: '20px'
            }}>
              {paymentResult.success ? '결제 성공' : '결제 실패'}
            </h2>
            
            <p style={{ marginBottom: '20px' }}>{paymentResult.message}</p>
            
            {paymentResult.success && (
              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <p><strong>주문 번호:</strong> {paymentResult.merchantUid}</p>
                <p><strong>결제 번호:</strong> {paymentResult.impUid}</p>
              </div>
            )}
            
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '20px',
                cursor: 'pointer'
              }}
            >
              홈으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// React Router v6 이상에서 사용하는 Component 내보내기
export function Component(): JSX.Element {
  return <SimpleCompletePage />;
}

export default SimpleCompletePage;
