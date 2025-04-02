/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { preparePayment, requestPayment, verifyPayment } from "../core/payment";
import PaymentModal from "../components/PaymentModal";

// Material-UI 기본 테마 생성
const defaultTheme = createTheme();

// 결제 정보 타입 정의
interface PaymentInfo {
  merchantUid: string;
  amount: number;
  name: string;
  buyerName: string;
  buyerEmail: string;
  buyerTel: string;
  signature?: string;
  timestamp?: string;
  channelKey?: string;
}

function PaymentPage() {
  const navigate = useNavigate();

  // 컴포넌트가 마운트되면 간편 결제 페이지로 리디렉션
  useEffect(() => {
    navigate("/simple-payment", { replace: true });
  }, [navigate]);

  // 리디렉션 전에 표시할 로딩 화면
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          결제 페이지로 이동 중...
        </Typography>
        <CircularProgress />
      </Container>
    </ThemeProvider>
  );
}

export default PaymentPage;

// React Router v6.4+ Lazy Loading을 위한 Component export 추가
export const Component = PaymentPage;
