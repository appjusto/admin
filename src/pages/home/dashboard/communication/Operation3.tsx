import { useContextFirebaseUser } from 'app/state/auth/context';
import { ReactComponent as like } from 'common/img/like.svg';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';
import { DeeplinkCard } from './DeeplinkCard';
import { OperationStep } from './OperationStep';

export const Operation3 = () => {
  // context
  const { userAbility } = useContextFirebaseUser();
  // UI
  return (
    <BaseAccordion
      title={t('🚩 Passo 3')}
      description={t(
        'Divulgue que seu restaurante agora faz parte de uma plataforma de impacto social!'
      )}
    >
      {userAbility?.can('update', 'businesses', 'slug') && <DeeplinkCard />}
      <OperationStep
        icon={like}
        title={t('Divulgue em canais digitais')}
        description={t(
          'Baixe gratuitamente um enxoval de divulgação digital pro seu restaurante'
        )}
        time={t('2 minutos')}
        btnLabel={t('Baixar')}
        link="http://localhost:3000"
      />
    </BaseAccordion>
  );
};
