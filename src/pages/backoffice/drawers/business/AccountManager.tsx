import { ProfileSituation } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useStaffs } from 'app/api/staff/useStaffs';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { AccountManagerCard } from './account-manager/AccountManagerCard';
import { StaffsTableItem } from './account-manager/StaffsTableItem';

const situations = ['approved'] as ProfileSituation[];

export type UpdatedField = 'accountManagerId' | 'customerSuccessId';

type Updating = {
  field: UpdatedField;
  userId: string;
};

export const AccountManager = () => {
  //context
  const { user, userAbility } = useContextFirebaseUser();
  const { business } = useContextBusinessBackoffice();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading, isSuccess } = updateResult;
  // state
  const [updating, setUpdating] = React.useState<Updating | null>(null);
  const [search, setSearch] = React.useState('');
  const { staffs, fetchNextPage } = useStaffs(
    situations,
    search,
    userAbility?.cannot('update', 'account_manager')
  );
  // helpers
  const canReadAccountManager = React.useMemo(
    () => userAbility?.can('update', 'businesses'),
    [userAbility]
  );
  const isHead = React.useMemo(
    () => userAbility?.can('update', 'account_manager'),
    [userAbility]
  );
  // handlers
  const handleUpdateAccountManager = (field: UpdatedField, userId?: string) => {
    if (!userId) return;
    setUpdating({ field, userId });
    return updateBusinessProfile({ [field]: userId });
  };
  const handleRemoveAccountManager = (field: UpdatedField) => {
    if (!user?.uid) return;
    return updateBusinessProfile({ [field]: null });
  };
  // side effects
  React.useEffect(() => {
    if (!isSuccess) return;
    setUpdating(null);
  }, [isSuccess]);
  //UI
  return (
    <Box mt="6">
      <SectionTitle>{t('Gerente da conta')}</SectionTitle>
      {business?.accountManagerId ? (
        canReadAccountManager ? (
          <AccountManagerCard
            accountManagerId={business.accountManagerId}
            canRemove={isHead || user?.uid === business.accountManagerId}
            onRemove={() => handleRemoveAccountManager('accountManagerId')}
            isLoading={isLoading && updating?.field === 'accountManagerId'}
          />
        ) : (
          <Box mt="4">
            <Text>{t('Este restaurante já possui um gerente de contas')}</Text>
          </Box>
        )
      ) : (
        <Box mt="4">
          <Text>
            {t('Este restaurante ainda não possui um gerente de contas')}
          </Text>
          <Button
            mt="4"
            variant="outline"
            size="md"
            onClick={() =>
              handleUpdateAccountManager('accountManagerId', user?.uid)
            }
            isLoading={isLoading && updating?.field === 'accountManagerId'}
          >
            {t('Assumir como gerente de conta')}
          </Button>
        </Box>
      )}
      <SectionTitle>{t('Customer success')}</SectionTitle>
      {business?.customerSuccessId ? (
        canReadAccountManager ? (
          <AccountManagerCard
            accountManagerId={business.customerSuccessId}
            canRemove={isHead || user?.uid === business.customerSuccessId}
            onRemove={() => handleRemoveAccountManager('customerSuccessId')}
            isLoading={isLoading && updating?.field === 'customerSuccessId'}
          />
        ) : (
          <Box mt="4">
            <Text>{t('Este restaurante já possui um customer success')}</Text>
          </Box>
        )
      ) : (
        <Box mt="4">
          <Text>
            {t('Este restaurante ainda não possui um customer success')}
          </Text>
          <Button
            mt="4"
            variant="outline"
            size="md"
            onClick={() =>
              handleUpdateAccountManager('customerSuccessId', user?.uid)
            }
            isLoading={isLoading && updating?.field === 'customerSuccessId'}
          >
            {t('Assumir como customer success')}
          </Button>
        </Box>
      )}
      {isHead && (
        <>
          <SectionTitle>{t('Agentes')}</SectionTitle>
          <CustomInput
            mr="0"
            w="100%"
            id="search-id"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            label={t('Buscar')}
            placeholder={t('Buscar por e-mail')}
          />
          <Box overflowX="auto">
            <Table mt="4" size="md" variant="simple">
              <Thead>
                <Tr>
                  <Th>{t('email')}</Th>
                  <Th>{t('Nome')}</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {staffs && staffs.length > 0 ? (
                  staffs.map((staff) => (
                    <StaffsTableItem
                      key={staff.id}
                      staff={staff}
                      handleUpdate={handleUpdateAccountManager}
                      isLoadingManager={
                        isLoading &&
                        updating?.field === 'accountManagerId' &&
                        updating.userId === staff.id
                      }
                      isLoadingCustomer={
                        isLoading &&
                        updating?.field === 'customerSuccessId' &&
                        updating.userId === staff.id
                      }
                    />
                  ))
                ) : (
                  <Tr color="black" fontSize="xs" fontWeight="700">
                    <Td>{t('Nenhum agente encontrado.')}</Td>
                    <Td></Td>
                    <Td></Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
          <Button mt="8" size="md" variant="secondary" onClick={fetchNextPage}>
            <ArrowDownIcon mr="2" />
            {t('Carregar mais')}
          </Button>
        </>
      )}
    </Box>
  );
};
