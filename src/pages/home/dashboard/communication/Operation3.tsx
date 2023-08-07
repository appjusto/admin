import { ReactComponent as play } from 'common/img/play.svg';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';
import { OperationStep } from './OperationStep';

export const Operation3 = () => {
  return (
    <BaseAccordion
      title={t('🚩 Passo 3')}
      description={t(
        'Divulgue que seu restaurante agora faz parte de uma plataforma de impacto social!'
      )}
    >
      <OperationStep
        icon={play}
        title={t('Divulgue em canais digitais')}
        description={t(
          'Baixe gratuitamente um enxoval de divulgação digital pro seu restaurante'
        )}
        time={t('2 minutos')}
        btnLabel={t('Criar')}
        link="http://localhost:3000"
      />
    </BaseAccordion>
  );
};
