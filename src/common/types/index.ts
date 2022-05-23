export interface BackofficeProfileValidation {
  cpf?: boolean;
  phone?: boolean;
  cnpj?: boolean;
  cep?: boolean;
  deliveryRange?: boolean;
  agency: boolean;
  account: boolean;
  message?: string;
}

export type ProfileBankingFields = 'account' | 'agency' | 'personType' | 'type' | 'name';
