import axios from 'axios';

// 아임포트 결제 준비 함수
export const preparePayment = async (orderData) => {
  try {
    const response = await axios.post('/api/payments/prepare', orderData);
    return response.data;
  } catch (error) {
    console.error('결제 준비 중 오류 발생:', error);
    throw error;
  }
};

// 아임포트 결제 검증 함수
export const verifyPayment = async (impUid, merchantUid) => {
  try {
    const response = await axios.post('/api/payments/verify', {
      imp_uid: impUid,
      merchant_uid: merchantUid
    });
    return response.data;
  } catch (error) {
    console.error('결제 검증 중 오류 발생:', error);
    throw error;
  }
};
