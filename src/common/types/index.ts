export interface BackofficeProfileValidation {
  cpf: boolean;
  cnpj?: boolean;
  phone?: boolean;
  agency: boolean;
  account: boolean;
  message?: string;
}

export type ProfileBankingFields = 'account' | 'agency' | 'personType' | 'type' | 'name';
