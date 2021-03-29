import {
  AspectRatio,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Link,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { AlertError } from 'common/components/AlertError';
import { AlertWarning } from 'common/components/AlertWarning';
import { CustomButton } from 'common/components/buttons/CustomButton';
import SharingBar from 'common/components/landing/share/SharingBar';
import { ReactComponent as CheckmarkChecked } from 'common/img/checkmark-checked.svg';
import { ReactComponent as Checkmark } from 'common/img/checkmark.svg';
import submittedImg from 'common/img/submitted.svg';
import React from 'react';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

interface RegistrationItemProps {
  status: boolean;
  label: string;
  link: string;
}

const RegistrationItem = ({ status, label, link, ...props }: RegistrationItemProps) => {
  const { path } = useRouteMatch();
  const test = false;
  return (
    <HStack
      w="100%"
      spacing={2}
      border={status ? '1px solid #F6F6F6' : '1px solid #FFBE00'}
      borderRadius="lg"
      px="4"
      py={status ? '4' : '8'}
      {...props}
    >
      <VStack spacing={1} alignItems="flex-start">
        <HStack spacing={4}>
          {status ? <CheckmarkChecked /> : <Checkmark />}
          <Text fontSize="16px" lineHeight="22px" fontWeight="700">
            {label}
          </Text>
        </HStack>
        {!status && (
          <CustomButton variant="outline" label={t('Preencher')} link={`${path}/${link}`} />
        )}
      </VStack>
    </HStack>
  );
};

const initialState = [
  {
    status: false,
    type: 'manager',
    label: 'Perfil do administrador e dados bancários',
    link: 'manager-profile',
  },
  { status: false, type: 'business', label: 'Perfil do restaurante', link: 'business-profile' },
  { status: false, type: 'address', label: 'Endereço e área de entrega', link: 'delivery-area' },
];

export const RegistrationStatus = () => {
  // context
  const manager = useContextManagerProfile();
  const business = useContextBusiness();
  const { bankAccount } = useBusinessBankAccount();
  const { updateBusinessProfile } = useBusinessProfile();

  // state
  const [isFetching, setIsFetching] = React.useState(true);
  const [validation, setValidation] = React.useState(initialState);
  const [error, setError] = React.useState({ status: false, message: '' });
  const [rejection, setRejection] = React.useState<string[]>([]);
  const isValid = validation.filter((data) => data.status === false).length === 0;

  // helpers
  const pendencies = validation.filter((item) => item.status === false).length;

  // handlers
  const handleSubmitRegistration = () => {
    if (isValid) {
      try {
        updateBusinessProfile({
          situation: 'submitted',
        });
      } catch (error) {
        console.dir(error);
        setError({
          status: true,
          message: 'Ocorreu um erro ao enviar o cadastro. Você poderia tentar novamente?',
        });
      }
    }
  };

  // side effects
  React.useEffect(() => {
    if (business) {
      const isManagerInfos = manager?.phone && manager.cpf ? true : false;
      const isBankingInfos =
        bankAccount?.type && bankAccount?.name && bankAccount?.account && bankAccount.agency
          ? true
          : false;
      const isBusinessInfos = business?.name && business?.cnpj && business.phone ? true : false;
      const isAddressInfos =
        business?.businessAddress?.address &&
        business?.businessAddress?.cep &&
        business?.businessAddress?.city &&
        business?.businessAddress?.state
          ? true
          : false;
      setValidation((prevState) => {
        const newState = prevState.map((data) => {
          if (data.type === 'manager') {
            const status = isManagerInfos && isBankingInfos;
            return { ...data, status };
          } else if (data.type === 'business') {
            const status = isBusinessInfos;
            return { ...data, status };
          } else {
            const status = isAddressInfos;
            return { ...data, status };
          }
        });
        return newState;
      });
      setIsFetching(false);
    }
  }, [manager, business, bankAccount]);

  React.useEffect(() => {
    if (business?.situation === 'rejected') {
      setRejection(business?.profileIssues ?? []);
    }
  }, [business]);

  // UI
  if (isFetching) {
    return <Spinner size="sm" />;
  }
  if (business?.situation === 'pending') {
    return (
      <Box maxW="708px" color="black">
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
              />
            );
          })}
        </VStack>
        <Button mt="4" onClick={handleSubmitRegistration} isDisabled={!isValid}>
          {t('Enviar cadastro para aprovação')}
        </Button>
        {error.status && (
          <AlertError title={t('Erro de cadastro')} description={t(`${error.message}`)} />
        )}
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
  if (business?.situation === 'submitted') {
    return (
      <Box maxW="708px" color="black">
        <Box mt="6" w="100%" maxW="406px">
          <Image src={submittedImg} />
        </Box>
        <Text mt="4" fontSize="lg" lineHeight="26px">
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
        </AspectRatio>
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
        <AlertWarning
          title={t('Seus dados não foram aprovados')}
          description={t(
            'Ocorreram alguns erros durante a validação dos dados enviados. Favor checar os seguintes pontos abaixo, antes de reenviar os dados.'
          )}
        >
          <VStack mt="2" spacing={1} alignItems="flex-start">
            {rejection.map((issue) => (
              <Text key={issue}>* {t(`${issue}`)}</Text>
            ))}
          </VStack>
        </AlertWarning>
        <Button mt="4" onClick={handleSubmitRegistration} isDisabled={!isValid}>
          {t('Reenviar cadastro para aprovação')}
        </Button>
      </>
    );
  }
  return <Box />;
};
