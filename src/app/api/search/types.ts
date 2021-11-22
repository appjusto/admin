export type SearchKind = 'businesses' | 'couriers' | 'consumers' | 'orders' | 'flaggedlocations';
//export type SearchOrder = 'distance' | 'price' | 'preparation-time' | 'popularity';
export type BusinessesFilter = {
  type: 'enabled' | 'situation' | 'businessAddress.state' | 'businessAddress.city' | 'status';
  value: string;
};

export type BasicUserFilter = {
  type: 'situation' | 'courierAddress.state' | 'courierAddress.city' | 'state' | 'city' | 'status';
  value: string;
};

export type OrdersFilter = {
  type: 'type' | 'status' | 'createdOn._seconds';
  value: string;
};
