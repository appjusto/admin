import { useContextBusiness } from 'app/state/business/context';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';
import { AddMembersForm } from './AddMembersForm';
import { TeamTable } from './TeamTable';

const TeamPage = () => {
  // context
  const { managers } = useContextBusiness();
  // UI
  return (
    <>
      <PageHeader
        title={t('Colaboradores')}
        subtitle={t(
          'Gerencie as pessoas que terão acesso ao Portal do parceiro e ao Gerenciador de pedidos. Somente os administradores podem incluir novos colaboradores.'
        )}
      />
      <TeamTable managers={managers} />
      <AddMembersForm />
    </>
  );
};

export default TeamPage;
