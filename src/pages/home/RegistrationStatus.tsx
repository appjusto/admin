import { Box, Button, HStack, Icon, Image, Link, Spinner, Text, VStack } from '@chakra-ui/react';
import { useObserveProducts } from 'app/api/business/products/useObserveProducts';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { AlertError } from 'common/components/AlertError';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import SharingBar from 'common/components/landing/share/SharingBar';
import submittedImg from 'common/img/submitted.svg';
import React from 'react';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { t } from 'utils/i18n';
import { RegistrationItem } from './RegistrationItem';

const initialState = [
  {
    status: false,
    type: 'manager',
    label: 'Perfil do administrador e dados bancários',
    link: 'manager-profile',
    helpText: 'Dúvidas sobre o seu perfil e dados bancários',
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
  const { manager } = useContextManagerProfile();
  const { business } = useContextBusiness();
  const products = useObserveProducts(business?.id);
  const { bankAccount } = useBusinessBankAccount();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { isLoading, isError, error: updateError } = updateResult;

  // state
  const [isFetching, setIsFetching] = React.useState(true);
  const [validation, setValidation] = React.useState(initialState);
  const [error, setError] = React.useState(initialError);
  const [rejection, setRejection] = React.useState<string[]>([]);
  const isValid = validation.filter((data) => data.status === false).length === 0;

  // refs
  const submission = React.useRef(0);

  // helpers
  const pendencies = validation.filter((item) => item.status === false).length;

  // handlers
  const handleSubmitRegistration = () => {
    if (isValid) {
      submission.current += 1;
      updateBusinessProfile({
        situation: 'submitted',
      });
    }
  };

  // side effects
  React.useEffect(() => {
    if (business) {
      const isManagerInfosOk = manager?.phone && manager.cpf ? true : false;
      const isBankingInfosOk =
        bankAccount?.type && bankAccount?.name && bankAccount?.account && bankAccount.agency
          ? true
          : false;
      const isBusinessInfosOk =
        business?.name && business?.description && business?.cnpj && business.phone ? true : false;
      const isAddressInfosOk =
        business?.businessAddress?.address &&
        business?.businessAddress?.cep &&
        business?.businessAddress?.city &&
        business?.businessAddress?.state
          ? true
          : false;
      const isMenuOk = products?.length > 0;
      const isSchedulesOk = business?.schedules ? true : false;
      setValidation((prevState) => {
        const newState = prevState.map((data) => {
          if (data.type === 'manager') {
            const status = isManagerInfosOk && isBankingInfosOk;
            return { ...data, status };
          } else if (data.type === 'business') {
            const status = isBusinessInfosOk;
            return { ...data, status };
          } else if (data.type === 'address') {
            const status = isAddressInfosOk;
            return { ...data, status };
          } else if (data.type === 'menu') {
            const status = isMenuOk;
            return { ...data, status };
          } else {
            const status = isSchedulesOk;
            return { ...data, status };
          }
        });
        return newState;
      });
      setIsFetching(false);
    }
  }, [manager, business, bankAccount, products]);

  React.useEffect(() => {
    if (business?.situation === 'rejected') {
      setRejection(business?.profileIssues ?? []);
    }
  }, [business]);

  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: updateError,
      });
  }, [isError, updateError]);

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
        <SuccessAndErrorHandler
          submission={submission.current}
          isError={error.status}
          error={error.error}
          errorMessage={error.message}
        />
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
            `Seu cadastro foi enviado com sucesso e está em fase de análise. Em breve você receberá uma confirmação.`
          )}
        </Text>
        {/*<Text mt="4" fontSize="lg" lineHeight="26px">
          {t(
            `Seu cadastro foi enviado com sucesso e está em fase de análise. Em breve você receberá uma confirmação.
          Enquanto aguarda a confirmação, assista ao vídeo sobre o nosso lançamento:`
          )}
        </Text>
        <AspectRatio mt="6" maxW="708px" ratio={9 / 5}>
          <iframe
            title="appjusto"
            src="https://www.youtube.com/embed/rwhMIEyoFJk"
            allowFullScreen
          />
          </AspectRatio>*/}
        <HStack mt="16" spacing={2}>
          <Text fontSize="24px" lineHeight="30px" fontWeight="700">
            {t('Aproveite para seguir o AppJusto nas redes sociais')}
          </Text>
          <Link
            href="https://www.instagram.com/appjusto/"
            isExternal
            aria-label="Link para a página do Instagram do Appjusto"
            _hover={{ color: 'green.500' }}
            _focus={{ outline: 'none' }}
          >
            <Icon as={FaInstagram} w="30px" h="30px" />
          </Link>
          <Link
            href="https://www.facebook.com/appjusto"
            isExternal
            aria-label="Link para a página do Facebook do Appjusto"
            _hover={{ color: 'green.500' }}
            _focus={{ outline: 'none' }}
          >
            <Icon as={FaFacebookSquare} w="30px" h="30px" />
          </Link>
          <Link
            href="https://www.linkedin.com/company/appjusto/"
            isExternal
            aria-label="Link para a página do Linkedin do Appjusto"
            _hover={{ color: 'green.500' }}
            _focus={{ outline: 'none' }}
          >
            <Icon as={FaLinkedin} w="30px" h="30px" />
          </Link>
        </HStack>
        <Text mt="2" fontSize="lg" lineHeight="26px">
          {t('E fique por dentro das nossas novidades!')}
        </Text>
      </Box>
    );
  }
  if (business?.situation === 'rejected') {
    return (
      <>
        <AlertError
          title={t('Problemas identificados no seu cadastro')}
          description={t(
            'Por favor, corrija os itens listados abaixo para seguir com a liberação da plataforma:'
          )}
          icon={false}
          border="2px solid #DC3545"
        >
          <VStack mt="2" spacing={1} alignItems="flex-start">
            {rejection.map((issue) => (
              <Text key={issue}>* {t(`${issue}`)}</Text>
            ))}
          </VStack>
        </AlertError>
        <Button
          mt="4"
          onClick={handleSubmitRegistration}
          isDisabled={!isValid}
          isLoading={isLoading}
        >
          {t('Reenviar cadastro para aprovação')}
        </Button>
        <SuccessAndErrorHandler
          submission={submission.current}
          isError={error.status}
          error={error.error}
          errorMessage={error.message}
        />
      </>
    );
  }
  return <Box />;
};
