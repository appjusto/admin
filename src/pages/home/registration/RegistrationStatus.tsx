import {
  Box,
  Button,
  Center,
  HStack,
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
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomPatternInput as Input } from 'common/components/form/input/pattern-input/CustomPatternInput';
import React from 'react';
import { getBusinessService } from 'utils/functions';
import { t } from 'utils/i18n';
import { OutsideAreaPage } from './OutsideAreaPage';
import { RegistrationItem } from './RegistrationItem';
import { RegistrationModal } from './RegistrationModal';
import { Submitted } from './Submitted';

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
    type: 'logistics',
    label: 'Entrega própria',
    link: 'fleet',
    helpText: 'Dúvidas sobre como definir sua entrega',
    helpLink:
      'https://appjusto.freshdesk.com/support/solutions/articles/67000718105-d%C3%BAvidas-sobre-modelo-de-entrega',
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
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading } = updateResult;
  const businessProfileValidation = useBusinessProfileValidation();
  // state
  const [isFetching, setIsFetching] = React.useState(true);
  const [validation, setValidation] = React.useState(initialState);
  const [rejection, setRejection] = React.useState<string[]>([]);
  const [isOusideArea, setIsOusideArea] = React.useState<boolean>();
  const [isMenuModalOpen, setIsMenuModalOpen] = React.useState<boolean>(false);
  const [referral, setReferral] = React.useState(business?.referral ?? '');
  // helpers
  const isValid = React.useMemo(
    () => validation.filter((data) => data.status === false).length === 0,
    [validation]
  );
  const pendencies = React.useMemo(
    () => validation.filter((item) => item.status === false).length,
    [validation]
  );
  const isLogistics = React.useMemo(
    () => getBusinessService(business?.services, 'logistics') !== undefined,
    [business?.services]
  );
  // handlers
  const handleSubmitRegistration = () => {
    if (isValid) {
      updateBusinessProfile({
        situation: 'submitted',
      });
    }
  };
  const handleUpdateReferral = () => {
    updateBusinessProfile({
      referral,
    });
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
        } else if (data.type === 'logistics') {
          const status = businessProfileValidation.businessLogistics;
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
    return (
      <Center>
        <Spinner size="sm" />
      </Center>
    );
  }
  if (business?.situation === 'pending') {
    return (
      <>
        <Box mt="12" maxW="800px" color="black">
          {pendencies > 0 ? (
            <Box fontSize="md" lineHeight="22px">
              <Text>
                {t('Falta pouco para que você possa submeter o seu cadastro!')}
              </Text>
              <Text>
                {t('Você possui apenas ')}
                <Text as="span" fontWeight="700">
                  {t(
                    `${pendencies} ${pendencies > 1 ? 'itens' : 'item'} ${
                      pendencies > 1 ? 'pendentes' : 'pendente'
                    }`
                  )}
                </Text>
                {t('. Vamos lá!')}
              </Text>
            </Box>
          ) : (
            <Box fontSize="md" lineHeight="22px">
              <Text>
                {t(
                  'Ótimo! Agora você já pode enviar o seu cadastro para aprovação:'
                )}
              </Text>
            </Box>
          )}
          <VStack mt="6" spacing={4} alignItems="flex-start">
            {validation.map((data) => {
              if (isLogistics && data.type === 'logistics') {
                return <></>;
              }
              return (
                <RegistrationItem
                  key={data.type}
                  type={data.type}
                  status={data.status}
                  label={data.label}
                  link={data.link}
                  helpText={data.helpText}
                  helpLink={data.helpLink}
                  secondarylabel={data.type === 'menu' ? 'Importar' : undefined}
                  secondaryAction={
                    data.type === 'menu'
                      ? () => setIsMenuModalOpen(true)
                      : undefined
                  }
                />
              );
            })}
          </VStack>
          <VStack
            mt="4"
            spacing={2}
            // justifyContent="space-between"
            alignItems="flex-start"
            border={'1px solid #F6F6F6'}
            borderRadius="lg"
            px="4"
            py={'4'}
          >
            <Text fontSize="16px" lineHeight="22px" fontWeight="700">
              Alguém te indicou o Appjusto? Digite o código da pessoa:
            </Text>
            <HStack>
              <Input
                id={`referral`}
                label={t('Código')}
                aria-label={`referral`}
                value={referral}
                minLength={5}
                maxLength={14}
                onValueChange={(value) => setReferral(value)}
                formatter={(value) => (value ?? '').toUpperCase()}
              />
              <CustomButton
                // mt="4"
                // h="48px"
                alignSelf="flex-end"
                variant="outline"
                label={'Salvar'}
                onClick={handleUpdateReferral}
              />
            </HStack>
          </VStack>
          <Button
            mt="4"
            onClick={handleSubmitRegistration}
            isDisabled={!isValid}
            isLoading={isLoading}
          >
            {t('Enviar cadastro para aprovação')}
          </Button>
        </Box>
        <RegistrationModal
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
        />
      </>
    );
  }
  if (
    business?.situation === 'submitted' ||
    business?.situation === 'verified' ||
    business?.situation === 'invalid'
  ) {
    return <Submitted />;
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
            <Text mt="4">
              {t('Após a correção, basta reenviar o cadastro.')}
            </Text>
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
          title={t('Infelizmente o seu cadastro foi bloqueado no appjusto')}
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
