import { Flavor } from '@appjusto/types';
import { BannerFilesValidationResult, TargetOptions } from './types';

export const getBannerFilesValidation = (
  flavor: Flavor,
  target: TargetOptions,
  webFile: File[] | null,
  mobFile: File[] | null,
  heroFile: File[] | null
): BannerFilesValidationResult => {
  if (target === 'inner-page' && heroFile === null)
    return {
      status: false,
      message: 'É preciso selecionar uma imagem de hero',
    };
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
