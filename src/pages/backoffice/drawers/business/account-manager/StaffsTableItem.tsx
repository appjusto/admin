import { StaffProfile, WithId } from '@appjusto/types';
import { Button, Icon, Link, Td, Tr } from '@chakra-ui/react';
import React from 'react';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';
import { UpdatedField } from '../AccountManager';

interface ItemPros {
  staff: WithId<StaffProfile>;
  handleUpdate(field: UpdatedField, userId: string): void;
  isLoadingManager: boolean;
  isLoadingCustomer: boolean;
}

export const StaffsTableItem = ({
  staff,
  handleUpdate,
  isLoadingManager,
  isLoadingCustomer,
}: ItemPros) => {
  // UI
  return (
    <Tr color="black" fontSize="xs">
      <Td>
        <Link as={RouterLink} to={`/backoffice/staff/${staff.id}`}>
          {staff.email ?? 'N/E'}
        </Link>
      </Td>

      <Td>{staff.name ?? 'N/E'}</Td>
      <Td>
        <Button
          w="full"
          variant="outline"
          size="sm"
          onClick={() => handleUpdate('accountManagerId', staff.id)}
          isLoading={isLoadingManager}
        >
          <Icon as={MdPersonAddAlt1} mr="2" />
          {t('Gerente')}
        </Button>
        <Button
          mt="4"
          w="full"
          variant="outline"
          size="sm"
          onClick={() => handleUpdate('customerSuccessId', staff.id)}
          isLoading={isLoadingCustomer}
        >
          <Icon as={MdPersonAddAlt1} mr="2" />
          {t('Customer success')}
        </Button>
      </Td>
    </Tr>
  );
};
