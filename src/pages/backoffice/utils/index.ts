import { omit, omitBy } from 'lodash';

export const situationPTOptions = {
  pending: 'Pendente',
  submitted: 'Submetido',
  verified: 'Verificado',
  invalid: 'Inválido',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  blocked: 'Bloqueado',
  deleted: 'Deletado',
};

export const modePTOptions = {
  motorcycle: 'Moto',
  bicycling: 'Bicicleta',
  scooter: 'Scooter',
  car: 'Carro',
  walking: 'A pé',
};

export const courierLocationStatusPTOptions = {
  unavailable: 'Indisponível',
  available: 'Disponível',
  dispatching: 'Realizando entrega',
};

export const orderStatusPTOptions = {
  quote: 'Cotação',
  confirming: 'Aguardando confirmação',
  charged: 'Cobrado',
  declined: 'Recusado',
  rejected: 'Rejeitado',
  confirmed: 'Confirmado',
  preparing: 'Em preparo',
  ready: 'Pronto',
  dispatching: 'A caminho da entrega',
  delivered: 'Entregue',
  canceled: 'Cancelado',
  expired: 'Expirado',
};

export const orderStatusPTOptionsForTableItem = {
  quote: 'Cotação',
  confirming: 'Confirmando',
  charged: 'Cobrado',
  declined: 'Recusado',
  rejected: 'Rejeitado',
  confirmed: 'Confirmado',
  preparing: 'Em preparo',
  ready: 'Pronto',
  dispatching: 'Despachando',
  delivered: 'Entregue',
  canceled: 'Cancelado',
  expired: 'Expirado',
};

export const orderDispatchingStatusPTOptions = {
  'idle': 'Ocioso',
  'scheduled': 'Agendado',
  'matching': 'Buscando',
  'no-match': 'Não encontrado',
  'matched': 'Encontrado',
  'declined': 'Recusado',
  'confirmed': 'Confirmado',
  'outsourced': 'Terceirizado',
};

export const invoiceTypePTOptions = {
  products: 'Produtos',
  delivery: 'Entrega',
  platform: 'Plataforma',
  tip: 'Gorjeta',
};

export const invoiceStatusPTOptions = {
  in_analysis: 'Em análise',
  created: 'Criada',
  pending: 'Pendente',
  paid: 'Paga',
  partially_paid: 'Parcialmente paga',
  refunded: 'Reembolsada',
  expired: 'Expirada',
  authorized: 'Autorizada',
  canceled: 'Cancelada',
  in_protest: 'Em protesto',
  chargeback: 'Estornada',
};

export const iuguSituationPTOptions = {
  'pending': 'Pendente',
  'created': 'Criada',
  'configured': 'Configurada',
  'waiting-verification': 'Aguardando verificação',
  'verified': 'Verificada',
  'invalid': 'Inválida',
};

export const flavorsPTOptions = {
  courier: 'Entregador',
  consumer: 'Cliente',
  business: 'Restaurante',
  backoffice: 'Backoffice',
  platform: 'Plataforma',
};

export const permissionsPTOptions = {
  orders: 'Pedidos',
  couriers: 'Entregadores',
  consumers: 'Consumidores',
  businesses: 'Restaurantes',
  chats: 'Chats',
  invoices: 'Faturas',
  withdraws: 'Saques',
  advances: 'Adiantamentos',
  managers: 'Managers',
  recommendations: 'Recomendações',
  staff: 'Staff',
  users: 'Usuários',
  platform: 'Plataforma',
} as { [key: string]: string };

export const getEditableProfile = (profile: any, isEditingEmail: boolean) => {
  let omittedKeys = [
    'id',
    'code',
    'createdOn',
    'updatedOn',
    'statistics',
    'onboarded',
    'notificationToken',
    'email',
  ];
  if (isEditingEmail) omittedKeys.pop();
  let editable = omit(profile, omittedKeys);
  let serialized = omitBy(editable, (value) => !value);
  return serialized;
};
