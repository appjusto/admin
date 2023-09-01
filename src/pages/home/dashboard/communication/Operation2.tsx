import { Button, Link, Text } from '@chakra-ui/react';
import { useMeasurement } from 'app/api/measurement/useMeasurement';
import { ReactComponent as monitor } from 'common/img/monitor.svg';
import { ReactComponent as play } from 'common/img/play.svg';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';
import { OperationStep } from './OperationStep';

export const Operation2 = () => {
  // context
  const { analyticsLogEvent } = useMeasurement();
  return (
    <BaseAccordion
      title={t('🚩 Passo 2')}
      description={t(
        'Configure os acessos de diferentes níveis e oriente sua equipe'
      )}
    >
      <OperationStep
        icon={play}
        title={t(
          'Crie diferentes níveis de acesso vinculados aos emails da equipe'
        )}
        description={
          <Text>
            <Link
              href="https://youtu.be/pMKgXHwnwDo"
              textDecor="underline"
              onClick={() =>
                analyticsLogEvent({ eventName: 'admin_tutorial_team_click' })
              }
              isExternal
            >
              {t('Assista o tutorial')}
            </Link>
            {t(' sobre como criar acessos para gerentes, caixa e atendentes')}
          </Text>
        }
        time={t('2 minutos')}
        action={
          <RouterLink to="/app/team">
            <Button
              mt={{ base: '4', md: '0' }}
              size="md"
              fontSize="sm"
              minW="112px"
              w={{ base: '100%', md: 'auto' }}
            >
              {t('Criar')}
            </Button>
          </RouterLink>
        }
      />
      <OperationStep
        icon={monitor}
        title={t('Treine sua equipe')}
        description={t(
          'Aqui, você terá acesso a vídeos objetivos sobre a operação no Appjusto, como: criar a senha da equipe, configuração de cardápio e melhores práticas e gerenciamento de pedidos.'
        )}
        time={t('2 minutos')}
        btnLabel={t('Acessar')}
        link="https://sites.google.com/appjusto.com.br/restaurantes/treinamentos"
        eventName="admin_training_click"
      />
    </BaseAccordion>
  );
};
