import { ReactComponent as android } from 'common/img/android.svg';
import { ReactComponent as monitor } from 'common/img/monitor.svg';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';
import { OperationStep } from './OperationStep';

export const Operation1 = () => {
  return (
    <BaseAccordion
      title={t('🚩 Passo 1')}
      description={t(
        'Configure o administrador geral do restaurante (acesso completo)'
      )}
    >
      <OperationStep
        icon={monitor}
        title={t(
          'Baixe e ative a extensão do AppJusto Restaurantes para o Google Chrome'
        )}
        description={t(
          'Facilita o uso do painel e garante que a campainha avise sobre novos pedidos'
        )}
        time={t('2 minutos')}
        btnLabel={t('Baixar')}
        link="http://localhost:3000"
      />
      <OperationStep
        icon={android}
        title={t('AppAndroid: gerencie seus pedidos também pelo celular')}
        description={t(
          'Clique no botão ao lado e envie o link para seu celular via whatsapp web'
        )}
        time={t('2 minutos')}
        btnLabel={t('Baixar')}
        link="http://localhost:3000"
      />
    </BaseAccordion>
  );
};
