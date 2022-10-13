import { Flavor } from '@appjusto/types';

export type TargetOptions = 'inner-page' | 'outer-page';

export interface Banner {
  flavor: Flavor;
  target: TargetOptions;
  pageTitle?: string;
  link: string;
  enabled: boolean;
}

export type BannerFilesValidationResult = {
  status: boolean;
  message?: string;
};
