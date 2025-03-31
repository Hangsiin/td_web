/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Divider,
  CheckCircleOutlineIcon
} from "@mui/material";
import { verifyPayment } from "../../core/payment";

function PaymentCompletePage() {
  const [verifyStatus, setVerifyStatus] = useState("verifying");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL 파라미터에서 결제 정보 추출 (모바일 결제 리다이렉트의 경우)
    const searchParams = new URLSearchParams(location.search);
    const impUid = searchParams.get("imp_uid");
    const merchantUid = searchParams.get("merchant_uid");

    // 라우터 state에서 결제 정보 추출 (PC 결제의 경우)
    const stateImpUid = location.state?.impUid;
    const stateMerchantUid = location.state?.merchantUid;

    // 둘 중 하나라도 있으면 결제 검증 진행
    if ((impUid && merchantUid) || (stateImpUid && stateMerchantUid)) {
      verifyPaymentStatus(impUid || stateImpUid, merchantUid || stateMerchantUid);
    } else {
      setVerifyStatus("error");
    }
  }, [location]);

  const verifyPaymentStatus = async (impUid, merchantUid) => {
    try {
      const result = await verifyPayment(impUid, merchantUid);
      
      if (result.success) {
        setVerifyStatus("success");
        setPaymentInfo({
          impUid,
          merchantUid,
          ...result
        });
      } else {
        setVerifyStatus("failed");
      }
    } catch (error) {
      console.error("결제 검증 중 오류 발생:", error);
      setVerifyStatus("error");
    }
  };

  const renderContent = () => {
    switch (verifyStatus) {
      case "verifying":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6">결제 정보를 확인 중입니다...</Typography>
          </Box>
        );
      case "success":
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              결제가 성공적으로 완료되었습니다.
            </Typography>
            {paymentInfo && (
              <Box sx={{ mt: 3, textAlign: "left" }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  주문번호: {paymentInfo.merchantUid}
                </Typography>
                <Typography variant="body1">
                  결제번호: {paymentInfo.impUid}
                </Typography>
                <Typography variant="body1">
                  결제 상태: 결제 완료
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}
          </Box>
        );
      case "failed":
        return (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              결제 검증에 실패했습니다. 고객센터로 문의해주세요.
            </Alert>
          </Box>
        );
      case "error":
        return (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              결제 정보를 확인할 수 없습니다. 고객센터로 문의해주세요.
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        결제 완료
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {renderContent()}
        
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate("/")}
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PaymentCompletePage;
