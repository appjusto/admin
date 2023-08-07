import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { ReactComponent as monitor } from 'common/img/monitor.svg';
import { ReactComponent as play } from 'common/img/play.svg';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';
import { OperationStep } from './OperationStep';

export const Operation2 = () => {
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
        description={t(
          'Passo a passo no vídeo: acesso para gerentes, caixa, atendentes'
        )}
        time={t('2 minutos')}
        btnLabel={t('Criar')}
        link="http://localhost:3000"
      />
      <OperationStep
        icon={monitor}
        title={t('Treine sua equipe')}
        description={
          <>
            <Text>
              {t(
                'Aqui, você terá acesso a vídeos objetivos sobre a operação no Appjusto, como:'
              )}
            </Text>
            <UnorderedList>
              <ListItem>{t('Como criar a senha da equipe')}</ListItem>
              <ListItem>
                {t('Configuração de cardápio e melhores práticas')}
              </ListItem>
              <ListItem>{t('Gerenciamento de pedidos')}</ListItem>
            </UnorderedList>
          </>
        }
        time={t('2 minutos')}
        btnLabel={t('Acessar')}
        link="http://localhost:3000"
      />
    </BaseAccordion>
  );
};
