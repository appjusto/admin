import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import { Box, Stack } from '@chakra-ui/react';
import { useAccountInformation } from 'app/api/business/useAccountInformation';
import { useObserveBusinessAdvances } from 'app/api/business/useObserveBusinessAdvances';
import { useObserveBusinessWithdraws } from 'app/api/business/useObserveBusinessWithdraws';
import { useRequestWithdraw } from 'app/api/business/useRequestWithdraw';
import { useObserveInvoicesStatusByPeriod } from 'app/api/order/useObserveInvoicesStatusByPeriod';
import { useCanAdvanceReceivables } from 'app/api/platform/useCanAdvanceReceivables';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
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
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const businessId = useContextBusinessId();
  const { accountInformation, refreshAccountInformation } = useAccountInformation(businessId);
  const { requestWithdraw, requestWithdrawResult } = useRequestWithdraw(businessId);
  const { isLoading, isSuccess } = requestWithdrawResult;
  const canAdvanceReceivables = useCanAdvanceReceivables();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [month, setMonth] = React.useState<Date | null>(new Date());
  const [availableReceivable, setAvailableReceivable] = React.useState<string | null>();
  const [availableWithdraw, setAvailableWithdraw] = React.useState<string | null>();
  const [activeWithdraw, setActiveWithdraw] = React.useState<number>();
  // page data with filters
  const { periodAmount, appjustoFee, iuguFee } = useObserveInvoicesStatusByPeriod(
    businessId,
    month,
    periodStatus
  );
  const advances = useObserveBusinessAdvances(businessId, month);
  const withdraws = useObserveBusinessWithdraws(businessId, month);
  // helpers
  const monthName = month ? getMonthName(month.getMonth()) : 'N/E';
  const year = month ? month.getFullYear() : 'N/E';
  // handlers
  const closeDrawerHandler = () => {
    refreshAccountInformation();
    history.replace(path);
  };
  const handleWithdrawRequest = () => {
    if (!availableWithdraw)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'FinancesPage-valid',
        message: { title: 'Não existe valor disponível para transferência.' },
      });
    const amount = convertBalance(availableWithdraw);
    requestWithdraw(amount);
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
    if (!withdraws) return;
    const active = withdraws.filter((w) => w.status !== 'rejected');
    setActiveWithdraw(active.length);
  }, [withdraws]);
  React.useEffect(() => {
    if (!isSuccess) return;
    refreshAccountInformation();
  }, [isSuccess, refreshAccountInformation])
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
          label={t('Vendas em processamento')}
          icon={Watch}
          value={availableReceivable}
          btnLabel={
            canAdvanceReceivables ? t('Pedir antecipação de valores') : t('Fora do horário')
          }
          btnVariant="outline"
          btnLink={`${url}/advances`}
          isAvailable={canAdvanceReceivables}
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
      <Switch>
        <Route path={`${path}/advances`}>
          <AdvancesDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/withdraw`}>
          <WithdrawsDrawer
            isOpen
            totalWithdraws={activeWithdraw}
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
