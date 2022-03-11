import { isEmpty } from 'lodash';

interface GenericWithName {
  name: string;
}

export const filterItemBySearch = <T extends GenericWithName>(items: T[], search?: string) => {
  if (!search || isEmpty(search)) return items;
  const regexp = new RegExp(search, 'i');
  return items.filter((item) => regexp.test(item.name));
};
