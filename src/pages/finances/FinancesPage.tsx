import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useAccountInformation } from 'app/api/business/useAccountInformation';
import { useObserveBusinessAdvances } from 'app/api/business/useObserveBusinessAdvances';
import { useObserveBusinessWithdraws } from 'app/api/business/useObserveBusinessWithdraws';
import { useRequestWithdraw } from 'app/api/business/useRequestWithdraw';
import { FirebaseError } from 'app/api/types';
import { useContextBusinessId } from 'app/state/business/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import { ReactComponent as Watch } from 'common/img/icon-stopwatch.svg';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { convertBalance } from 'utils/formatters';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { AdvanceDetailsDrawer } from './AdvanceDetailsDrawer';
import { AdvancesTable } from './AdvancesTable';
import { BasicInfoBox } from './BasicInfoBox';
import { WithdrawalsDrawer } from './WithdrawalsDrawer';
import { WithdrawsTable } from './WithdrawsTable';

const FinancesPage = () => {
  // context
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const businessId = useContextBusinessId();
  const { accountInformation, refreshAccountInformation } = useAccountInformation(businessId);
  const { requestWithdraw, requestWithdrawResult } = useRequestWithdraw(businessId);
  const { isLoading, isSuccess, isError, error: withdrawError } = requestWithdrawResult;
  // state
  const [dateTime, setDateTime] = React.useState('');
  //const [month, setMonth] = React.useState('');
  const [availableReceivable, setAvailableReceivable] = React.useState<string | null>();
  const [availableWithdraw, setAvailableWithdraw] = React.useState<string | null>();
  const [error, setError] = React.useState(initialError);
  // page data with filters
  const advances = useObserveBusinessAdvances(businessId);
  const withdraws = useObserveBusinessWithdraws(businessId);
  // refs
  const submission = React.useRef(0);
  // handlers
  const closeDrawerHandler = () => {
    refreshAccountInformation();
    history.replace(path);
  };
  const handleWithdrawRequest = async () => {
    setError(initialError);
    submission.current += 1;
    if (!availableWithdraw)
      return setError({
        status: true,
        error: null,
        message: { title: 'Não existe valor disponível para transferência.' },
      });
    const amount = convertBalance(availableWithdraw);
    await requestWithdraw(amount);
    refreshAccountInformation();
  };
  const getAdvanceById = React.useCallback(
    (advanceId: string) => {
      return advances?.find((advance) => advance.id === advanceId) ?? null;
    },
    [advances]
  );
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  React.useEffect(() => {
    if (!accountInformation) return;
    setAvailableReceivable(accountInformation.receivable_balance ?? null);
    setAvailableWithdraw(accountInformation.balance_available_for_withdraw ?? null);
  }, [accountInformation]);
  React.useEffect(() => {
    if (isError) {
      const errorMessage = (withdrawError as FirebaseError).message;
      setError({
        status: true,
        error: withdrawError,
        message: { title: errorMessage },
      });
    }
  }, [isError, withdrawError]);
  // UI
  return (
    <>
      <PageHeader title={t('Financeiro')} subtitle={t(`Dados atualizados em ${dateTime}`)} />
      <Stack mt="8" direction={{ base: 'column', md: 'row' }} spacing={4}>
        <BasicInfoBox
          label={t('Disponível para saque')}
          icon={Checked}
          value={availableWithdraw}
          btnLabel={t('Transferir para conta pessoal')}
          btnFunction={handleWithdrawRequest}
          btnWarning={t('Valor mínimo de R$ 5,00 para transferência')}
          isLoading={isLoading}
        />
        <BasicInfoBox
          label={t('Em faturamento')}
          icon={Watch}
          value={availableReceivable}
          btnLabel={t('Pedir antecipação de valores')}
          btnVariant="outline"
          btnLink={`${url}/withdrawals`}
        />
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
      <SectionTitle>{t('Antecipações')}</SectionTitle>
      <AdvancesTable advances={advances} />
      <SectionTitle>{t('Transferências')}</SectionTitle>
      <WithdrawsTable withdraws={withdraws} />
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
      <Switch>
        <Route path={`${path}/withdrawals`}>
          <WithdrawalsDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/:advanceId`}>
          <AdvanceDetailsDrawer
            isOpen
            onClose={closeDrawerHandler}
            getAdvanceById={getAdvanceById}
          />
        </Route>
      </Switch>
    </>
  );
};

export default FinancesPage;
