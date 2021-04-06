import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { WithId } from 'appjusto-types';
import firebase from 'firebase/app';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';
import { AddMembersForm } from './AddMembersForm';
import { TeamTable } from './TeamTable';

interface TeamMember {
  email: string;
  isManager: boolean;
  createdOn: firebase.firestore.Timestamp;
}

const TeamPage = () => {
  // context
  const manager = useManagerProfile();
  // state
  const [members, setMembers] = React.useState<WithId<TeamMember>[]>([]);
  // side effects
  React.useEffect(() => {
    if (manager) {
      const fakeMembers = [
        {
          id: 'sjclscn1',
          email: 'renancostam@gmail.com',
          isManager: true,
          createdOn: manager.createdOn,
        },
      ];
      setMembers(fakeMembers);
    }
  }, [manager]);

  // UI
  return (
    <>
      <PageHeader
        title={t('Colaboradores')}
        subtitle={t(
          'Gerencie as pessoas que terão acesso ao Portal do parceiro e ao Gerenciador de pedidos. Somente os administradores podem incluir novos colaboradores.'
        )}
      />
      <TeamTable members={members} />
      <AddMembersForm />
    </>
  );
};

export default TeamPage;
