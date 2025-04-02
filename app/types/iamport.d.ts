interface IamportResponse {
  success: boolean;
  error_code?: string;
  error_msg?: string;
  imp_uid?: string;
  merchant_uid?: string;
  pay_method?: string;
  paid_amount?: number;
  status?: string;
  name?: string;
  pg_provider?: string;
  pg_tid?: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_tel?: string;
  buyer_addr?: string;
  buyer_postcode?: string;
  custom_data?: any;
  paid_at?: number;
  receipt_url?: string;
}

interface IamportRequestParams {
  pg?: string;
  pay_method?: string;
  merchant_uid: string;
  name?: string;
  amount: number;
  buyer_name?: string;
  buyer_tel?: string;
  buyer_email?: string;
  buyer_addr?: string;
  buyer_postcode?: string;
  custom_data?: any;
  tax_free?: number;
  currency?: string;
  language?: string;
  notice_url?: string | string[];
  display?: {
    card_quota?: number[];
  };
  digital?: boolean;
  vbank_due?: string;
  m_redirect_url?: string;
  app_scheme?: string;
  biz_num?: string;
}

interface IamportInstance {
  init: (accountID: string) => void;
  request_pay: (
    params: IamportRequestParams,
    callback?: (response: IamportResponse) => void,
  ) => void;
  certification: (params: any, callback?: (response: any) => void) => void;
}

interface Window {
  IMP?: IamportInstance;
}
