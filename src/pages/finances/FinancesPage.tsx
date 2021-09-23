import { Box, Stack } from '@chakra-ui/react';
import { useAccountInformation } from 'app/api/business/useAccountInformation';
import { useObserveBusinessAdvances } from 'app/api/business/useObserveBusinessAdvances';
import { useObserveBusinessWithdraws } from 'app/api/business/useObserveBusinessWithdraws';
import { useRequestWithdraw } from 'app/api/business/useRequestWithdraw';
import { useObserveInvoicesStatusByPeriod } from 'app/api/order/useObserveInvoicesStatusByPeriod';
import { FirebaseError } from 'app/api/types';
import { useContextBusinessId } from 'app/state/business/context';
import { IuguInvoiceStatus } from 'appjusto-types/payment/iugu';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomMonthInput } from 'common/components/form/input/CustomMonthInput';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import { ReactComponent as Watch } from 'common/img/icon-stopwatch.svg';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { convertBalance, getMonthName } from 'utils/formatters';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { AdvanceDetailsDrawer } from './AdvanceDetailsDrawer';
import { AdvancesDrawer } from './AdvancesDrawer';
import { AdvancesTable } from './AdvancesTable';
import { BasicInfoBox } from './BasicInfoBox';
import { PeriodTable } from './PeriodTable';
import { WithdrawsDrawer } from './WithdrawsDrawer';
import { WithdrawsTable } from './WithdrawsTable';

const periodStatus = 'paid' as IuguInvoiceStatus;

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
  const [month, setMonth] = React.useState<Date | null>(new Date());
  const [availableReceivable, setAvailableReceivable] = React.useState<string | null>();
  const [availableWithdraw, setAvailableWithdraw] = React.useState<string | null>();
  const [error, setError] = React.useState(initialError);
  // page data with filters
  const { periodAmount, appjustoFee, iuguFee } = useObserveInvoicesStatusByPeriod(
    businessId,
    month,
    periodStatus
  );
  const advances = useObserveBusinessAdvances(businessId, month);
  const withdraws = useObserveBusinessWithdraws(businessId, month);
  // refs
  const submission = React.useRef(0);
  // helpers
  const monthName = month ? getMonthName(month.getMonth()) : 'N/E';
  const year = month ? month.getFullYear() : 'N/E';
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
    if (accountInformation === undefined) return;
    setAvailableReceivable(accountInformation?.receivable_balance ?? null);
    setAvailableWithdraw(accountInformation?.balance_available_for_withdraw ?? null);
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
          valueLimit={500}
          btnLabel={t('Transferir para conta pessoal')}
          btnLink={`${url}/withdraw`}
          btnWarning={t('Valor mínimo de R$ 5,00 para transferência')}
        />
        <BasicInfoBox
          label={t('Em faturamento')}
          icon={Watch}
          value={availableReceivable}
          btnLabel={t('Pedir antecipação de valores')}
          btnVariant="outline"
          btnLink={`${url}/advances`}
        />
      </Stack>
      <SectionTitle>{t('Período')}</SectionTitle>
      <Box w={{ base: '100%', md: '200px' }}>
        <CustomMonthInput
          id="month"
          label={t('Mês selecionado')}
          dateValue={month}
          handleChange={setMonth}
        />
      </Box>
      <PeriodTable
        period={`${monthName} de ${year}`}
        amount={periodAmount}
        appjustoFee={appjustoFee}
        iuguFee={iuguFee}
      />
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
        <Route path={`${path}/advances`}>
          <AdvancesDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/withdraw`}>
          <WithdrawsDrawer
            isOpen
            totalWithdraws={withdraws?.length}
            withdrawValue={availableWithdraw}
            requestWithdraw={handleWithdrawRequest}
            isLoading={isLoading}
            isSuccess={isSuccess}
            onClose={closeDrawerHandler}
          />
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
