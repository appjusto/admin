import { Flavor } from '@appjusto/types';

export type BannerFilesValidationResult = {
  status: boolean;
  message?: string;
};

export const getBannerFilesValidation = (
  flavor: Flavor,
  webFile: File | null,
  mobFile: File | null,
  webType?: string,
  mobileType?: string
): BannerFilesValidationResult => {
  if (flavor === 'courier' && (!mobFile || !mobileType))
    return {
      status: false,
      message: 'É preciso selecionar uma imagem para mobile',
    };
  if (
    flavor !== 'courier' &&
    (webFile === null || mobFile === null || !webType || !mobileType)
  )
    return {
      status: false,
      message: 'É preciso selecionar imagens para web e mobile',
    };
  return { status: true };
};
