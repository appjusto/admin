export type SearchKind = 'businesses' | 'couriers' | 'consumers' | 'orders';
//export type SearchOrder = 'distance' | 'price' | 'preparation-time' | 'popularity';
export type BusinessesFilter = {
  type: 'enabled' | 'situation';
  value: string;
};

export type SituationFilter = {
  type: 'situation';
  value: string;
};

export type OrdersFilter = {
  type: 'type' | 'status' | 'createdOn._seconds';
  value: string;
};
