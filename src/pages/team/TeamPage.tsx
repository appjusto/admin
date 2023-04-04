import { useContextBusiness } from 'app/state/business/context';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';
import { AddMembersForm } from './AddMembersForm';
import { TeamTable } from './TeamTable';

const TeamPage = () => {
  // context
  const { business, setIsGetManagersActive } = useContextBusiness();
  // side effects
  React.useEffect(() => {
    setIsGetManagersActive(true);
  }, [setIsGetManagersActive]);
  // UI
  return (
    <>
      <PageHeader
        title={t('Colaboradores')}
        subtitle={t(
          'Gerencie as pessoas que terão acesso ao painel do parceiro e ao gerenciador de pedidos. Somente proprietários e gerentes podem incluir novos colaboradores.'
        )}
      />
      <TeamTable />
      <AddMembersForm
        businessId={business?.id}
        businessManagers={business?.managers}
      />
    </>
  );
};

export default TeamPage;
