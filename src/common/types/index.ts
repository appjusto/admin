export interface BackofficeProfileValidation {
  cpf?: boolean;
  phone?: boolean;
  cnpj?: boolean;
  profile?: boolean;
  cep?: boolean;
  address?: boolean;
  deliveryRange?: boolean;
  agency: boolean;
  account: boolean;
  message?: string;
}

export type ProfileBankingFields = 'account' | 'agency' | 'personType' | 'type' | 'name';
