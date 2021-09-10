import { Box, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import { ReactComponent as Watch } from 'common/img/icon-stopwatch.svg';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { FinancesTable } from './FinancesTable';
import { WithdrawalsDrawer } from './WithdrawalsDrawer';

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
  const { path, url } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  //const [month, setMonth] = React.useState('');
  const [periods, setPeriods] = React.useState<Period[]>();

  // handlers
  const closeDrawerHandler = () => history.replace(path);

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
      <Stack mt="8" direction={{ base: 'column', md: 'row' }} spacing={4}>
        <Box minW={{ lg: '328px' }} border="1px solid #F6F6F6" borderRadius="lg" p="4">
          <Text fontSize="15px" fontWeight="500" lineHeight="21px">
            <Icon as={Checked} mr="2" />
            {t('Disponível para saque')}
          </Text>
          <Text mt="2" fontSize="36px" fontWeight="500" lineHeight="30px">
            R$ 000,00
          </Text>
          <Button mt="4" w="100%" fontSize="15px" lineHeight="21px">
            {t('Transferir para conta pessoal')}
          </Button>
          <Text mt="2" fontSize="13px" fontWeight="500" lineHeight="18px" textAlign="center">
            {t('Valor mínimo de R$ 5,00 para transferência')}
          </Text>
        </Box>
        <Box minW={{ lg: '328px' }} border="1px solid #F6F6F6" borderRadius="lg" p="4">
          <Text fontSize="15px" fontWeight="500" lineHeight="21px">
            <Icon as={Watch} mr="2" />
            {t('Em faturamento')}
          </Text>
          <Text mt="2" fontSize="36px" fontWeight="500" lineHeight="30px">
            R$ 000,00
          </Text>
          <CustomButton
            mt="4"
            w="100%"
            fontSize="15px"
            lineHeight="21px"
            link={`${url}/withdrawals`}
            label={t('Pedir antecipação de valores')}
            variant="outline"
          />
        </Box>
      </Stack>
      <Flex flexDir={{ base: 'column', md: 'row' }} justifyContent="space-between">
        <Box mt="8" maxW="200px">
          <Text fontSize="sm" lineHeight="21px" color="black">
            {t('Mês vigente:')}
          </Text>
          <CustomInput id="month" type="month" value={'' /*month*/} label={t('Mês vigente')} />
        </Box>
        <Box mt="8">
          <Text fontSize="sm" lineHeight="21px" color="black">
            {t('Veja os valores e taxa aplicadas em Julho 2020:')}
          </Text>
          <Stack mt="4" direction={{ base: 'column', md: 'row' }} spacing={1}>
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
          </Stack>
        </Box>
      </Flex>
      <FinancesTable periods={periods} />
      <Switch>
        <Route path={`${path}/withdrawals`}>
          <WithdrawalsDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default FinancesPage;
