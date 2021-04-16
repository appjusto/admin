export type SearchKind = 'businesses' | 'couriers' | 'consumers' | 'orders';
//export type SearchOrder = 'distance' | 'price' | 'preparation-time' | 'popularity';
export type BusinessesFilter = {
  type: 'enabled' | 'situation';
  value: string;
};

export type CouriersFilter = {
  type: 'situation';
  value: string;
};
