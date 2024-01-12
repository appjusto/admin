import { Box, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { Social } from '../Social';
import { NewRegistrationItem } from './NewRegistrationItem';

export const OutsideAreaPage = () => {
  return (
    <Box mt="8" pb="10" color="black" maxW="708px">
      <Text fontSize="36px" fontWeight="700">
        {t('Sua região ainda não está ativa, mas é bem fácil agilizar isso!')}
      </Text>
      <Text mt="4" fontSize="lg">
        {t(
          'O appjusto conta com o apoio dos restaurantes e entregadores para divulgarem para seus conhecidos se cadastrarem no app quanto antes tivermos um equilíbrio da rede na sua região mais rápido vamos iniciar as operações.'
        )}
      </Text>
      <Text mt="6" fontSize="lg">
        {t(
          'Assim que liberarmos a região você será avisado por e-mail e whatsapp!'
        )}
      </Text>
      <Text mt="6" fontSize="lg">
        {t(
          'Então clique no botão abaixo e compartilhe os materiais nas suas redes sociais, para outros restaurantes também se cadastrarem:'
        )}
      </Text>
      <NewRegistrationItem
        label={t('Materiais de divulgação')}
        btnLabel={t('Visualizar')}
        btnLink="https://drive.google.com/drive/folders/1r3xKazHLAHY8-W0hb12e22ekK6DaDAua?usp=sharing"
        // helpText={t('Assista ao vídeo sobre como utilizá-los')}
        // helpLink={'http://localhost:3000'}
      />
      <Social />
    </Box>
  );
};
