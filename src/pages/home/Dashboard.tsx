import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';

const Dashboard = () => {
  return (
    <PageHeader title={t('Início')} subtitle={t('Dados atualizados em 00/00/0000 às 00:00')} />
  );
};

export default Dashboard;
