import { CheckIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { useMeasurement } from 'app/api/measurement/useMeasurement';
import { ReactComponent as android } from 'common/img/android.svg';
import { ReactComponent as monitor } from 'common/img/monitor.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';
import { OperationStep } from './OperationStep';

const appLink =
  'https://play.google.com/store/apps/details?id=br.com.appjusto.business.live&hl=pt_BR&gl=US';

export const Operation1 = () => {
  // context
  const { analyticsLogEvent } = useMeasurement();
  // state
  const [isCopied, setIsCopied] = React.useState(false);
  // handlers
  const copyToClipboard = () => {
    setIsCopied(true);
    analyticsLogEvent({ eventName: 'admin_business_app_click' });
    setTimeout(() => setIsCopied(false), 500);
    return navigator.clipboard.writeText(appLink);
  };
  // UI
  return (
    <BaseAccordion
      title={t('🚩 Passo 1')}
      description={t(
        'Configure o administrador geral do restaurante (acesso completo)'
      )}
      defaultIndex={[0]}
    >
      <OperationStep
        icon={monitor}
        title={t(
          'Baixe e ative a extensão do appjusto restaurantes para o Google Chrome'
        )}
        description={t(
          'Facilita o uso do painel e garante que a campainha avise sobre novos pedidos'
        )}
        time={t('2 minutos')}
        btnLabel={t('Baixar')}
        link="https://chrome.google.com/webstore/detail/appjusto-admin/mcmielagmkelelpmnmjlnlpeakdmmeap?hl=pt-BR"
        eventName="admin_chrome_ex_click"
      />
      <OperationStep
        icon={android}
        title={t('AppAndroid: gerencie seus pedidos também pelo celular')}
        description={t('Clique no botão ao lado e copie o link para download')}
        time={t('2 minutos')}
        action={
          <Button
            mt={{ base: '4', md: '0' }}
            size="md"
            fontSize="sm"
            minW="112px"
            w={{ base: '100%', md: 'auto' }}
            onClick={copyToClipboard}
          >
            {t('Copiar')}
            {isCopied && <CheckIcon ml="2" />}
          </Button>
        }
      />
    </BaseAccordion>
  );
};
