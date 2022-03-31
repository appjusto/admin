export type FirebaseError = {
  code: string;
  message: string;
};

export type AlgoliaCreatedOn = {
  _seconds: number;
  _nanoseconds: number;
};

export type InQueryArray<T> = [T?, T?, T?, T?, T?, T?, T?, T?, T?, T?];
