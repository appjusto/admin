export type Message = { title: string; description?: string };

export type BasicError = {
  status: boolean;
  error: null | unknown;
  message?: Message;
};

export const initialError = { status: false, error: null } as BasicError;
