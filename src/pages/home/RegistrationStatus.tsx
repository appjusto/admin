import {
  AspectRatio,
  Box,
  Button,
  Image,
  Link,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useBusinessProfileValidation } from 'app/api/business/profile/useBusinessProfileValidation';
import { useContextBusiness } from 'app/state/business/context';
import { AlertWarning } from 'common/components/AlertWarning';
import SharingBar from 'common/components/landing/share/SharingBar';
import submittedImg from 'common/img/submitted.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { OutsideAreaPage } from './OutsideAreaPage';
import { RegistrationItem } from './RegistrationItem';
import { Social } from './Social';

const initialState = [
  {
    status: false,
    type: 'manager',
    label: 'Perfil do administrador',
    link: 'manager-profile',
    helpText: 'Dúvidas sobre o seu perfil',
    helpLink:
      'https://appjusto.freshdesk.com/support/solutions/articles/67000631086-d%C3%BAvidas-sobre-o-perfil-e-dados-banc%C3%A1rios',
  },
  {
    status: false,
    type: 'business',
    label: 'Perfil do restaurante',
    link: 'business-profile',
    helpText: 'Como melhorar a página do restaurante',
    helpLink:
      'https://appjusto.freshdesk.com/support/solutions/articles/67000631083-como-melhorar-a-p%C3%A1gina-do-restaurante',
  },
  {
    status: false,
    type: 'banking',
    label: 'Dados bancários',
    link: 'banking-information',
    helpText: 'Dúvidas sobre os dados bancários',
    helpLink:
      'https://appjusto.freshdesk.com/support/solutions/articles/67000631086-d%C3%BAvidas-sobre-o-perfil-e-dados-banc%C3%A1rios',
  },
  {
    status: false,
    type: 'address',
    label: 'Endereço e área de entrega',
    link: 'delivery-area',
    helpText: 'Saiba como definir o raio de entrega',
    helpLink:
      'https://appjusto.freshdesk.com/support/solutions/articles/67000631084-saiba-como-definir-o-raio-de-entrega',
  },
  {
    status: false,
    type: 'menu',
    label: 'Cardápio',
    link: 'menu',
    helpText: 'Dicas para bombar seu cardápio',
    helpLink:
      'https://appjusto.freshdesk.com/support/solutions/articles/67000631085-dicas-para-bombar-seu-card%C3%A1pio',
  },
  {
    status: false,
    type: 'schedules',
    label: 'Horário de funcionamento',
    link: 'business-schedules',
    helpText: 'Dicas sobre o horário de funcionamento',
    helpLink:
      'https://appjusto.freshdesk.com/support/solutions/articles/67000631088-dicas-sobre-o-hor%C3%A1rio-de-funcionamento',
  },
];

export const RegistrationStatus = () => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { isLoading } = updateResult;
  const businessProfileValidation = useBusinessProfileValidation();
  // state
  const [isFetching, setIsFetching] = React.useState(true);
  const [validation, setValidation] = React.useState(initialState);
  const [rejection, setRejection] = React.useState<string[]>([]);
  const [isOusideArea, setIsOusideArea] = React.useState<boolean>();
  // helpers
  const isValid = validation.filter((data) => data.status === false).length === 0;
  const pendencies = validation.filter((item) => item.status === false).length;
  // handlers
  const handleSubmitRegistration = () => {
    if (isValid) {
      updateBusinessProfile({
        situation: 'submitted',
      });
    }
  };
  // side effects
  React.useEffect(() => {
    setValidation((prevState) => {
      const newState = prevState.map((data) => {
        if (data.type === 'manager') {
          const status = businessProfileValidation.managerProfile;
          return { ...data, status };
        } else if (data.type === 'business') {
          const status = businessProfileValidation.businessProfile;
          return { ...data, status };
        } else if (data.type === 'banking') {
          const status = businessProfileValidation.bankingInformation;
          return { ...data, status };
        } else if (data.type === 'address') {
          const status = businessProfileValidation.businessAddress;
          return { ...data, status };
        } else if (data.type === 'menu') {
          const status = businessProfileValidation.businessMenu;
          return { ...data, status };
        } else {
          const status = businessProfileValidation.businessSchedules;
          return { ...data, status };
        }
      });
      return newState;
    });
    setIsFetching(false);
  }, [businessProfileValidation]);
  React.useEffect(() => {
    if (business?.situation === 'rejected') {
      setRejection(business?.profileIssues ?? []);
      setIsOusideArea(
        typeof business?.profileIssues?.find(
          (issue) => issue === 'Restaurante fora da área de operação'
        ) === 'string'
      );
    }
  }, [business]);
  // UI
  if (isFetching) {
    return <Spinner size="sm" />;
  }
  if (business?.situation === 'pending') {
    return (
      <Box maxW="800px" color="black">
        {pendencies > 0 ? (
          <Text mt="6" fontSize="lg" lineHeight="26px" maxW="530px">
            {t(
              `Para continuar, você precisa preencher o restante do seu cadastro. Você possui ${pendencies} itens pendentes:`
            )}
          </Text>
        ) : (
          <>
            <Text mt="6" fontSize="lg" lineHeight="26px" maxW="530px">
              {t('Você preenchou todos os itens.')}
            </Text>
            <Text fontSize="lg" lineHeight="26px" maxW="530px">
              {t('Agora é só enviar o seu cadastro para aprovação:')}
            </Text>
          </>
        )}
        <VStack mt="4" spacing={4} alignItems="flex-start">
          {validation.map((data) => {
            return (
              <RegistrationItem
                key={data.type}
                type={data.type}
                status={data.status}
                label={data.label}
                link={data.link}
                helpText={data.helpText}
                helpLink={data.helpLink}
              />
            );
          })}
        </VStack>
        <Button
          mt="4"
          onClick={handleSubmitRegistration}
          isDisabled={!isValid}
          isLoading={isLoading}
        >
          {t('Enviar cadastro para aprovação')}
        </Button>
        <Box>
          <Text mt="20" fontSize="24px" lineHeight="30px" fontWeight="700">
            {t('Divulgue esse movimento')}
          </Text>
          <Text mt="6" mb="4" fontSize="15px" lineHeight="21px">
            {t(
              'Para chegar mais rápido a todas as cidades, o AppJusto precisa da sua ajuda. Divulgue nas suas rede e ajude o movimento a crescer:'
            )}
          </Text>
          <SharingBar />
        </Box>
      </Box>
    );
  }
  if (
    business?.situation === 'submitted' ||
    business?.situation === 'verified' ||
    business?.situation === 'invalid'
  ) {
    return (
      <Box maxW="708px" color="black">
        <Box mt="6" w="100%" maxW="406px">
          <Image src={submittedImg} />
        </Box>
        <Text mt="4" fontSize="lg" lineHeight="26px">
          {t(
            `Seu cadastro foi enviado com sucesso e está em fase de análise. Em breve você receberá uma confirmação.
          Para mais detalhes, assista ao nosso vídeo de boas-vindas:`
          )}
        </Text>
        <AspectRatio mt="6" maxW="708px" ratio={9 / 5}>
          <iframe
            title="appjusto"
            src="https://www.youtube.com/embed/R_KyvxVk-U0"
            allowFullScreen
          />
        </AspectRatio>
        <Social />
      </Box>
    );
  }
  if (business?.situation === 'rejected') {
    if (isOusideArea) {
      return <OutsideAreaPage />;
    } else {
      return (
        <>
          <AlertWarning
            title={t(
              'Olá! Avaliamos o seu cadastro, mas ele ainda precisa de ajustes para ser aprovado'
            )}
            description={t(
              'Corrija os itens listados abaixo para seguir com a liberação da plataforma:'
            )}
            icon={false}
          >
            <UnorderedList mt="1">
              {rejection.map((issue) => (
                <ListItem key={issue}>{t(`${issue}`)}</ListItem>
              ))}
            </UnorderedList>
            {business.profileIssuesMessage && (
              <Box mt="6">
                <Text fontWeight="700">
                  {t('Dica:')}{' '}
                  <Text as="span" fontWeight="500">
                    {business.profileIssuesMessage}
                  </Text>
                </Text>
              </Box>
            )}
            <Text mt="4">{t('Após a correção, basta reenviar o cadastro.')}</Text>
          </AlertWarning>
          <Button
            mt="4"
            onClick={handleSubmitRegistration}
            isDisabled={!isValid}
            isLoading={isLoading}
          >
            {t('Reenviar cadastro para aprovação')}
          </Button>
        </>
      );
    }
  }
  if (business?.situation === 'blocked') {
    return (
      <>
        <AlertWarning
          title={t('Infelizmente o seu cadastro foi bloqueado no AppJusto')}
          icon={false}
        >
          <Box mt="4">
            <Text fontWeight="700">
              {t('Motivo:')}{' '}
              <Text as="span" fontWeight="500">
                {business.profileIssuesMessage}
              </Text>
            </Text>
          </Box>
          <Text mt="4" fontWeight="500">
            {t('Para mais informações, mande uma mensagem para ')}
            <Link
              href="mailto:suporte@appjusto.com.br"
              color="blue.500"
              _focus={{ outline: 'none' }}
            >
              suporte@appjusto.com.br
            </Link>
          </Text>
        </AlertWarning>
      </>
    );
  }
  return <Box />;
};
