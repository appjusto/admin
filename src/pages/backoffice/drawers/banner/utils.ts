import { Flavor } from '@appjusto/types';
import { BannerFilesValidationResult } from './types';

export const getBannerFilesValidation = (
  flavor: Flavor,
  webFile: File | null,
  mobFile: File | null
): BannerFilesValidationResult => {
  if (flavor === 'courier' && mobFile === null)
    return {
      status: false,
      message: 'É preciso selecionar uma imagem para mobile',
    };
  if (flavor !== 'courier' && (webFile === null || mobFile === null))
    return {
      status: false,
      message: 'É preciso selecionar imagens para web e mobile',
    };
  return { status: true };
};
