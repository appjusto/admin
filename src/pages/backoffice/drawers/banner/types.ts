import { Flavor } from '@appjusto/types';
import { FieldValue } from 'firebase/firestore';

export interface BannersOrdering {
  [key: string]: string[];
  // consumer?: string[];
  // business?: string[];
  // courier?: string[];
}

export type TargetOptions = 'inner-page' | 'outer-page';

export interface Banner {
  // withId
  id: string;
  // doc fields
  ordering: number;
  flavor: Flavor;
  target: TargetOptions;
  pageTitle?: string;
  link: string;
  enabled: boolean;
  createdOn: FieldValue;
  updatedOn: FieldValue;
}

export type BannerFilesValidationResult = {
  status: boolean;
  message?: string;
};
