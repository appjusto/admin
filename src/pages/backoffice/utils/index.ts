import { CourierProfile, WithId } from '@appjusto/types';
import { isEmpty, omit, omitBy } from 'lodash';

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
  inactive: 'Inativo',
};

export const orderStatusPTOptions = {
  quote: 'Cotação',
  scheduled: 'Agendado',
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
  scheduled: 'Agendado',
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
  // order: 'Pedido',
  products: 'Produtos',
  delivery: 'Entrega',
  platform: 'Plataforma',
  food: 'Comida',
  p2p: 'p2p',
  tip: 'Gorjeta',
};

export const paymentMethodPTOptions = {
  credit_card: 'Cartão de crédito',
  pix: 'Pix',
  vr: 'VR',
  credits: 'Créditos',
};

export const invoiceStatusPTOptions = {
  in_analysis: 'Em análise',
  created: 'Criada',
  pending: 'Pendente',
  paid: 'Paga',
  partially_paid: 'Parcialmente paga',
  refunded: 'Reembolsada',
  partially_refunded: 'Parcialmente reembolsada',
  expired: 'Expirada',
  authorized: 'Autorizada',
  canceled: 'Cancelada',
  in_protest: 'Em protesto',
  chargeback: 'Estornada',
  // to payment
  unauthorized: 'Não autorizado',
};

export const ledgerEntryStatusPTOptions = {
  approved: 'Aprovada',
  canceled: 'Cancelada',
  paid: 'Paga',
  pending: 'Pendente',
  processing: 'Processando',
  rejected: 'Rejeitada',
};

export const ledgerEntryOperationPTOptions = {
  'delivery': 'Delivery',
  'same-owner-accounts': 'Entre contas de um mesmo usuário',
  'tip': 'Gorjeta',
  'business-insurance': 'Cobertura restaurante',
  'others': 'Outros',
  'outsource-credit': 'Crédito de terceirização',
  'balance-adjustment': 'Ajuste de balanço',
  'commission': 'Comissão',
};

export const pushStatusPTOptions = {
  submitted: 'Submetida',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
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
  consumer: 'Consumidor',
  business: 'Restaurante',
  backoffice: 'Backoffice',
  platform: 'Plataforma',
};

export const permissionsPTOptions = {
  orders: 'Pedidos',
  couriers: 'Entregadores',
  consumers: 'Consumidores',
  businesses: 'Restaurantes',
  account_manager: 'Ger. Contas',
  menu: 'Cardápios',
  chats: 'Chats',
  invoices: 'Faturas',
  payments: 'Faturas (P)',
  cards: 'Cartões',
  withdraws: 'Saques',
  advances: 'Adiantamentos',
  managers: 'Managers',
  recommendations: 'Recomendações',
  push_campaigns: 'Campanhas',
  staff: 'Staff',
  users: 'Usuários',
  platform: 'Plataforma',
  banners: 'Banners',
  areas: 'Áreas',
  integrations: 'Integrações',
} as { [key: string]: string };

export const adminRolePTOptions = {
  owner: 'Dono',
  manager: 'Gerente',
  collaborator: 'Colaborador',
};

export const getEditableProfile = (profile: any, isEditingEmail: boolean) => {
  const omittedKeys: (keyof WithId<CourierProfile>)[] = [
    'id',
    'code',
    'createdOn',
    'updatedOn',
    'statistics',
    'onboarded',
    'notificationToken',
    'appVersion',
    'fleet',
    'mode',
    'email',
  ];
  if (isEditingEmail) omittedKeys.pop();
  const editable = omit(profile, omittedKeys);
  const serialized = omitBy(editable, (value) => !value);
  serialized.profileIssuesMessage = !isEmpty(profile.profileIssuesMessage)
    ? profile.profileIssuesMessage
    : null;
  return serialized;
};
