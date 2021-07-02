import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useObserveInvoices } from 'app/api/order/useObserveInvoices';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { InvoicesTable } from './InvoicesTable';

const InvoicesPage = () => {
  // context
  const invoices = useObserveInvoices();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');

  // handlers

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  // UI
  return (
    <Box>
      <PageHeader title={t('Faturas')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8">
        <HStack spacing={4}>
          <CustomInput
            mt="0"
            maxW="212px"
            id="search-id"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
            label={t('ID')}
            placeholder={t('000')}
          />
          <CustomInput
            mt="0"
            type="date"
            id="search-name"
            value={searchFrom}
            onChange={(event) => setSearchFrom(event.target.value)}
            label={t('De')}
          />
          <CustomInput
            mt="0"
            type="date"
            id="search-name"
            value={searchTo}
            onChange={(event) => setSearchTo(event.target.value)}
            label={t('Até')}
          />
        </HStack>
      </Flex>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <HStack spacing={4}>
          <FilterText isActive onClick={() => {}}>
            {t('Todas')}
          </FilterText>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${invoices?.length ?? '0'} itens na lista`)}
        </Text>
      </HStack>
      <InvoicesTable invoices={invoices} />
      <Button mt="8" variant="grey" onClick={() => {}}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
    </Box>
  );
};

export default InvoicesPage;
