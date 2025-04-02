/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import React from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  createTheme,
  ThemeProvider,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Material-UI 기본 테마 생성
const defaultTheme = createTheme();

// 간단한 스타일 정의
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 500,
  maxHeight: "90vh",
  overflow: "auto",
  p: 4,
  borderRadius: 2,
  bgcolor: "background.paper", // 배경색 추가
  boxShadow: 24, // 그림자 추가
};

const closeButtonStyle = {
  position: "absolute",
  top: 8,
  right: 8,
};

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

function PaymentModal({ isOpen, onClose, title, children }: PaymentModalProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="payment-modal-title"
      >
        <Paper sx={modalStyle}>
          <Box sx={closeButtonStyle}>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {title && (
            <Typography
              id="payment-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              {title}
            </Typography>
          )}

          {children}
        </Paper>
      </Modal>
    </ThemeProvider>
  );
}

export default PaymentModal;
