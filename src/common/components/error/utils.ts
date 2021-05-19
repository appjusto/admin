export type BasicError = {
  status: boolean;
  error: null | unknown;
  message?: string;
};

export const initialError = { status: false, error: null } as BasicError;
