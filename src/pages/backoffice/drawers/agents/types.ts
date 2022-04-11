export type Entity = 'orders' | 'couriers' | 'consumers' | 'businesses' | 'platform';

export type AcessArray = ['read'?, 'write'?];

export type AcessState = {
  [Property in Entity]: AcessArray;
};
