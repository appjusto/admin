import axios from 'axios';

export type UF =
  | 'AC'
  | 'AL'
  | 'AM'
  | 'AP'
  | 'BA'
  | 'CE'
  | 'DF'
  | 'ES'
  | 'GO'
  | 'MA'
  | 'MG'
  | 'MS'
  | 'MT'
  | 'PA'
  | 'PB'
  | 'PE'
  | 'PI'
  | 'PR'
  | 'RJ'
  | 'RN'
  | 'RO'
  | 'RR'
  | 'RS'
  | 'SC'
  | 'SE'
  | 'SP'
  | 'TO';

export interface IBGEResult {
  id: string;
  nome: string;
}

const IBGEUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export const getCitiesByState = async (uf: UF) => {
  try {
    const result = await axios.get(`${IBGEUrl}/${uf}/municipios`);
    return result?.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
