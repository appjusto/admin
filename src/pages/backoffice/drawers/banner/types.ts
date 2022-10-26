import { ClientFlavor } from '@appjusto/types';
import { FieldValue } from 'firebase/firestore';

export interface BannersOrdering {
  [key: string]: string[];
}

export type TargetOptions = 'disabled' | 'page' | 'download';

export interface Banner {
  updatedBy: {
    id: string;
    email: string;
    name?: string;
  };
  name: string;
  flavor: ClientFlavor;
  target: TargetOptions;
  link?: string;
  enabled: boolean;
  createdOn: FieldValue;
  updatedOn: FieldValue;
  images?: (string | null)[];
}

export type BannerFilesValidationResult = {
  status: boolean;
  message?: string;
};
