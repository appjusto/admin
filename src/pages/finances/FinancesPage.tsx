import { Box, Stack } from '@chakra-ui/react';
import { useAccountInformation } from 'app/api/business/useAccountInformation';
import { useObserveBusinessAdvances } from 'app/api/business/useObserveBusinessAdvances';
import { useObserveBusinessWithdraws } from 'app/api/business/useObserveBusinessWithdraws';
import { useContextBusinessId } from 'app/state/business/context';
import { CustomMonthInput } from 'common/components/form/input/CustomMonthInput';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import { ReactComponent as Watch } from 'common/img/icon-stopwatch.svg';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { AdvanceDetailsDrawer } from './AdvanceDetailsDrawer';
import { AdvancesDrawer } from './AdvancesDrawer';
import { AdvancesTable } from './AdvancesTable';
import { BasicInfoBox } from './BasicInfoBox';
import { PeriodTable } from './PeriodTable';
import { formatIuguValueToDisplay } from './utils';
import { WithdrawsDrawer } from './WithdrawsDrawer';
import { WithdrawsTable } from './WithdrawsTable';

const FinancesPage = () => {
  // context
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const businessId = useContextBusinessId();
  const { accountInformation, refreshAccountInformation } =
    useAccountInformation(businessId);
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [month, setMonth] = React.useState<Date | null>(new Date());
  const [receivableBalance, setReceivableBalance] = React.useState<
    string | null
  >();
  const [availableWithdraw, setAvailableWithdraw] = React.useState<
    string | null
  >();
  // page data with filters
  const advances = useObserveBusinessAdvances(businessId, month);
  const withdraws = useObserveBusinessWithdraws(businessId, month);
  // handlers
  const closeDrawerHandler = () => {
    refreshAccountInformation();
    history.replace(path);
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
    setReceivableBalance(
      accountInformation?.receivable_balance
        ? formatIuguValueToDisplay(accountInformation.receivable_balance)
        : null
    );
    setAvailableWithdraw(
      accountInformation?.balance_available_for_withdraw ?? null
    );
  }, [accountInformation]);
  // UI
  return (
    <>
      <PageHeader
        title={t('Financeiro')}
        subtitle={t(`Dados atualizados em ${dateTime}`)}
      />
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
          value={receivableBalance}
          btnLabel={t('Ver detalhes')}
          btnVariant="outline"
          btnLink={`${url}/advances`}
          // isAvailable={canAdvanceReceivables}
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
      <PeriodTable month={month} />
      <SectionTitle>{t('Antecipações')}</SectionTitle>
      <AdvancesTable advances={advances} />
      <SectionTitle>{t('Transferências')}</SectionTitle>
      <WithdrawsTable withdraws={withdraws} />
      <Switch>
        <Route path={`${path}/advances`}>
          <AdvancesDrawer
            isOpen
            onClose={closeDrawerHandler}
            receivableBalance={accountInformation?.receivable_balance}
            advanceableValue={accountInformation?.advanceable_value}
          />
        </Route>
        <Route path={`${path}/withdraw`}>
          <WithdrawsDrawer
            isOpen
            withdrawValue={availableWithdraw}
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
