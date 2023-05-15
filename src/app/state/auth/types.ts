import { CRUD } from '@appjusto/types';
import { Ability, MongoQuery } from '@casl/ability';

export type Actions = 'create' | 'read' | 'update' | 'delete';

// To add new entities is required:
// 1. Add string to Entities union type below;
// 2. Add entity to ./utils fullStaffPermissions object;
// 3. Add especific rules to the entity in backoffice generic modes - if needed
// in pages/backoffice/drawers/staff/utils;
// 4. Add translation to permissionsPTOptions in pages/backoffice/utils;
// 5. Add link to BackOfficeLinks;
// 6. Add BackofficeAccess type and backofficeAccess object configs in
// src/utils/access.

export type Entities =
  | 'orders'
  | 'account_manager'
  | 'businesses'
  | 'menu'
  | 'couriers'
  | 'consumers'
  | 'chats'
  | 'invoices'
  | 'withdraws'
  | 'advances'
  | 'managers'
  | 'recommendations'
  | 'push_campaigns'
  | 'staff'
  | 'users'
  | 'platform'
  | 'banners'
  | 'areas'
  | 'integrations';

export type AppAbility = Ability<[Actions, Entities | any]>;

type Rule =
  | {
      rule: CRUD;
      conditions: MongoQuery<string[]>;
    }
  | CRUD;

export type FullPermissions = {
  [key in Entities]: Rule[];
};
