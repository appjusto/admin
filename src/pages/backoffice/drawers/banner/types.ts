import { ClientFlavor } from '@appjusto/types';
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
  updatedBy: {
    id: string;
    email: string;
    name?: string;
  };
  // ordering: number;
  flavor: ClientFlavor;
  target: TargetOptions;
  pageTitle?: string;
  slug?: string;
  link: string;
  enabled: boolean;
  createdOn: FieldValue;
  updatedOn: FieldValue;
}

export type BannerFilesValidationResult = {
  status: boolean;
  message?: string;
};
