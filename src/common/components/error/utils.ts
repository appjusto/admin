export type BasicError = {
  status: boolean;
  error?: unknown | null;
  message: { title: string; description?: string };
};

export const initialError = { status: false, error: null } as BasicError;
