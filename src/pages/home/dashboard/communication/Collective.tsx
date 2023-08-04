import { CollectiveVision } from 'pages/home/CollectiveVision';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';

export const Collective = () => {
  return (
    <BaseAccordion
      title={t('Visão coletiva e compromissos')}
      description={t(
        'Alinhamento de expectativas para a construção de uma comunidade forte, engajada e com bons resultados'
      )}
    >
      <CollectiveVision />
    </BaseAccordion>
  );
};
