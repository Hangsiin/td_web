import React from "react";

interface SimplePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const ModalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const ModalContent: React.CSSProperties = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "10px",
  maxWidth: "500px",
  width: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
};

const CloseButton: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
};

const SimplePaymentModal: React.FC<SimplePaymentModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div style={ModalOverlay} onClick={onClose}>
      <div style={ModalContent} onClick={(e) => e.stopPropagation()}>
        <button style={CloseButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default SimplePaymentModal;
