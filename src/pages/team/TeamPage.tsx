import { useContextBusiness } from 'app/state/business/context';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';
import { AddMembersForm } from './AddMembersForm';
import { TeamTable } from './TeamTable';

const TeamPage = () => {
  // context
  const { businessManagers, setIsObservingManagers } = useContextBusiness();
  // side effects
  React.useEffect(() => {
    setIsObservingManagers(true);
  }, []);
  // UI
  return (
    <>
      <PageHeader
        title={t('Colaboradores')}
        subtitle={t(
          'Gerencie as pessoas que terão acesso ao Portal do parceiro e ao Gerenciador de pedidos. Somente os administradores podem incluir novos colaboradores.'
        )}
      />
      <TeamTable businessManagers={businessManagers} />
      <AddMembersForm />
    </>
  );
};

export default TeamPage;
