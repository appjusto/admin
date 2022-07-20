import { StaffProfile, WithId } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useStaffs } from 'app/api/staff/useStaffs';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { AccountManagerCard } from './account-manager/AccountManagerCard';
import { StaffsTableItem } from './account-manager/StaffsTableItem';

export const AccountManager = () => {
  //context
  const { business } = useContextBusinessBackoffice();
  // state
  const [accountManager, setAccountManager] = React.useState<WithId<StaffProfile> | null>();
  const [search, setSearch] = React.useState('');
  const { staffs, fetchNextPage } = useStaffs(search);
  // side effects
  React.useEffect(() => {
    if(business?.accountManagerId === undefined || !staffs) return;
    if(business.accountManagerId === null) {
      setAccountManager(null);
      return;
    }
    const manager = staffs.find(staff => staff.id === business?.accountManagerId);
    setAccountManager(manager);
  }, [business?.accountManagerId, staffs])
  //UI
  return (
    <Box mt="6">
      <SectionTitle>{t('Gerente da conta')}</SectionTitle>
      {
        accountManager ? (
          <AccountManagerCard accountManager={accountManager} />
          ) : (
          <Box mt="4">
            <Text>{t('Este restaurante ainda não possui um gerente de contas')}</Text>
          </Box>
        )
      }
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
    </Box>
  );
};
