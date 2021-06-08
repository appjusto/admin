import { Box, HStack, Text } from '@chakra-ui/react';
import { CustomInput } from 'common/components/form/input/CustomInput';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { FinancesTable } from './FinancesTable';

const fakeState = [
  {
    id: '1',
    period: '00/00 - 00/00',
    received: 40000,
    fees: 2000,
    transfers: 38000,
    status: 'Em aberto',
  },
  {
    id: '2',
    period: '00/00 - 00/00',
    received: 40000,
    fees: 2000,
    transfers: 38000,
    status: 'Agendado para 00/00',
  },
  {
    id: '3',
    period: '00/00 - 00/00',
    received: 40000,
    fees: 2000,
    transfers: 38000,
    status: 'Agendado para 00/00',
  },
] as Period[];

export interface Period {
  id: string;
  period: string;
  received: number;
  fees: number;
  transfers: number;
  status: string;
}

const FinancesPage = () => {
  // context
  // state
  const [dateTime, setDateTime] = React.useState('');
  //const [month, setMonth] = React.useState('');
  const [periods, setPeriods] = React.useState<Period[]>();

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    setPeriods(fakeState);
  }, []);

  // UI
  return (
    <>
      <PageHeader title={t('Financeiro')} subtitle={t(`Dados atualizados em ${dateTime}`)} />
      <Box mt="8" maxW="200px">
        <CustomInput id="month" type="month" value={'' /*month*/} label={t('Mês vigente')} />
      </Box>
      <Box mt="8">
        <Text fontSize="sm" lineHeight="21px" color="black">
          {t('Veja os valores e taxa aplicadas em Julho 2020:')}
        </Text>
        <HStack mt="4" spacing={1}>
          <Box w="220px" h="132px" py="4" px="6" border="1px solid #6CE787" borderRadius="lg">
            <Text fontSize="sm" lineHeight="21px">
              {t('Repasses')}
            </Text>
            <Text mt="1" fontSize="2xl" lineHeight="30px">
              R$ 0,00
            </Text>
          </Box>
          <Box w="220px" h="132px" py="4" px="6" border="1px solid #F6F6F6" borderRadius="lg">
            <Text fontSize="sm" lineHeight="21px">
              {t('Recebido')}
            </Text>
            <Text mt="1" fontSize="2xl" lineHeight="30px">
              R$ 0,00
            </Text>
          </Box>
          <Box w="220px" h="132px" py="4" px="6" border="1px solid #F6F6F6" borderRadius="lg">
            <Text fontSize="sm" lineHeight="21px">
              {t('Taxas')}
            </Text>
            <Text mt="1" fontSize="2xl" lineHeight="30px">
              -R$ 0,00
            </Text>
          </Box>
        </HStack>
      </Box>
      <FinancesTable periods={periods} />
    </>
  );
};

export default FinancesPage;
