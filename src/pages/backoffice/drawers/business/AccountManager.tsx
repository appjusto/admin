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

export const AccountManager = () => {
  //context
  const { user, userAbility } = useContextFirebaseUser();
  const { business } = useContextBusinessBackoffice();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  // state
  const [search, setSearch] = React.useState('');
  const { staffs, fetchNextPage } = useStaffs(
    situations,
    search,
    userAbility?.cannot('update', 'account_manager')
  );
  // helpers
  const isHead = userAbility?.can('update', 'account_manager');
  // handlers
  const handleUpdateAccountManager = () => {
    if (!user?.uid) return;
    return updateBusinessProfile({ accountManagerId: user.uid });
  };
  //UI
  return (
    <Box mt="6">
      <SectionTitle>{t('Gerente da conta')}</SectionTitle>
      {business?.accountManagerId ? (
        isHead || user?.uid === business.accountManagerId ? (
          <AccountManagerCard
            accountManagerId={business.accountManagerId}
            canRemove={isHead || user?.uid === business.accountManagerId}
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
            onClick={handleUpdateAccountManager}
            isLoading={updateResult.isLoading}
          >
            {t('Assumir restaurante')}
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
                    <StaffsTableItem key={staff.id} staff={staff} />
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
