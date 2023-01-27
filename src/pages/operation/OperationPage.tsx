import { Business, Fulfillment, PreparationMode } from '@appjusto/types';
import {
  Badge,
  Box,
  Button,
  Flex,
  Switch as ChakraSwitch,
  Text,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import { BusinessFulfillment } from 'pages/business-profile/BusinessFulfillment';
import { BusinessPreparationModes } from 'pages/business-profile/BusinessPreparationModes';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

const OperationPage = () => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const { isBackofficeUser } = useContextFirebaseUser();
  // queries & mutations
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading } = updateResult;
  // state
  const [minimumOrder, setMinimumOrder] = React.useState(
    business?.minimumOrder ?? 0
  );
  const [enabled, setEnabled] = React.useState(business?.enabled ?? false);
  // const [status, setStatus] = React.useState(business?.status ?? 'unavailable');
  const [maxOrdersPerHour, setMaxOrdersPerHour] = React.useState(
    String(business?.maxOrdersPerHour ?? '0')
  );
  const [minHoursForScheduledOrders, setMinHoursForScheduledOrders] =
    React.useState(String(business?.minHoursForScheduledOrders ?? '0'));
  const [preparationModes, setPreparationModes] = React.useState<
    PreparationMode[]
  >(['realtime', 'scheduled']);
  const [fulfillment, setFulfillment] = React.useState<Fulfillment[]>([
    'delivery',
  ]);
  // refs
  const minimumOrderRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const isBusinessApproved = business?.situation === 'approved';
  // handlers
  const onSubmitHandler = async () => {
    const changes = {
      minimumOrder,
      enabled,
      // status,
      maxOrdersPerHour: parseInt(maxOrdersPerHour, 10),
      minHoursForScheduledOrders: parseInt(minHoursForScheduledOrders, 10),
      preparationModes,
      fulfillment,
    } as Partial<Business>;
    try {
      updateBusinessProfile(changes);
    } catch (error) {
      // setIsLoading(false);
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'operation-submit-error',
        message: { title: 'Não foi possível salvar as informações.' },
      });
    }
  };
  // side effects
  React.useEffect(() => {
    if (business) {
      setMinimumOrder(business.minimumOrder ?? 0);
      if (business.maxOrdersPerHour)
        setMaxOrdersPerHour(String(business.maxOrdersPerHour));
      if (business.minHoursForScheduledOrders)
        setMinHoursForScheduledOrders(
          String(business.minHoursForScheduledOrders)
        );
      if (business.preparationModes)
        setPreparationModes(business.preparationModes);
      if (business.fulfillment) setFulfillment(business.fulfillment);
    }
  }, [business]);
  // UI
  return (
    <Box>
      <PageHeader
        title={t('Operação')}
        subtitle={t('Defina os parâmetros de operação do seu restaurante')}
      />
      <Box maxW={{ base: '760px', lg: '833px' }}>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSubmitHandler();
          }}
        >
          {/* <Text mt="8" fontSize="xl" color="black">
            {t('Fechamento de emergência')}
            {!isBusinessApproved && (
              <Badge ml="2" px="2" borderRadius="lg" fontSize="12px">
                {t('Disponível após aprovação')}
              </Badge>
            )}
          </Text>
          <Text mt="2" fontSize="md">
            {t(
              'Ao ativar o fechamento de emergência o seu restaurante aparecerá como fechado, desconsiderando os horários de funcionamento configurados, até que esta funcionalidade seja desativada manualmente'
            )}
          </Text>
          <Flex mt="4" alignItems="center">
            <ChakraSwitch
              isChecked={status !== 'available'}
              onChange={(ev) => {
                ev.stopPropagation();
                setStatus(ev.target.checked ? 'unavailable' : 'available');
              }}
              isDisabled={!isBusinessApproved}
            />
            <Flex ml="4" flexDir="row" minW="280px">
              <Text
                fontSize="16px"
                fontWeight="700"
                lineHeight="22px"
                opacity={!isBusinessApproved ? 0.6 : 1}
              >
                {status === 'available' ? t('Desativado') : t('Ativado')}
              </Text>
              {business?.status === 'unavailable' && (
                <HStack px="4" color="red">
                  <Icon as={RiErrorWarningLine} w="20px" h="20px" />
                  <Text>
                    {t(
                      'Seu restaurante não está disponível para receber pedidos.'
                    )}
                  </Text>
                </HStack>
              )}
            </Flex>
          </Flex> */}
          <Box maxW="400px">
            {isBackofficeUser && (
              <CurrencyInput
                ref={minimumOrderRef}
                isRequired
                id="business-min-price"
                label={t('Valor mínimo do pedido')}
                placeholder={t('R$ 0,00')}
                value={minimumOrder}
                onChangeValue={(value) => setMinimumOrder(value)}
                maxLength={8}
              />
            )}
          </Box>
          {/* preparation modes */}
          <BusinessPreparationModes
            preparationModes={preparationModes}
            handleChange={setPreparationModes}
          />
          {/* maxOrdersPerHour */}
          <Text mt="8" fontSize="xl" color="black">
            {t('Máximo de pedidos')}
          </Text>
          <Text mt="2" fontSize="md">
            {t(
              'Caso aplicável, informe a quantidade máxima de pedidos que o restaurante aceita no intervalo de 1h (0 = desativado)'
            )}
          </Text>
          <NumberInput
            id="business-max-order-per-hour"
            maxW="400px"
            label={t('Número de pedidos por hora')}
            value={maxOrdersPerHour}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setMaxOrdersPerHour(ev.target.value)
            }
            isRequired
          />
          {/* minHoursForScheduledOrders */}
          <Text mt="8" fontSize="xl" color="black">
            {t('Mínimo de horas de antecedência para pedidos agendados')}
          </Text>
          <Text mt="2" fontSize="md">
            {t(
              'Caso aplicável, informe o número mínimo de horas de antecedência para que o consumidor possa realizar um pedido agendado (0 = desativado)'
            )}
          </Text>
          <NumberInput
            id="business-min-hours-for-scheduled-orders"
            maxW="400px"
            label={t('Número mínimo de horas')}
            value={minHoursForScheduledOrders}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setMinHoursForScheduledOrders(ev.target.value)
            }
            isRequired
          />
          {/* fulfillment */}
          <BusinessFulfillment
            fulfillment={fulfillment}
            handleChange={setFulfillment}
          />
          <Text mt="8" fontSize="xl" color="black">
            {t('Visibilidade do restaurante')}
            {!isBusinessApproved && (
              <Badge ml="2" px="2" borderRadius="lg" fontSize="12px">
                {t('Disponível após aprovação')}
              </Badge>
            )}
          </Text>
          <Text mt="2" fontSize="md">
            {t(
              'Defina se o seu restaurante estará visível, ou não, para os consumidores do AppJusto'
            )}
          </Text>
          <Flex mt="4" pb="8" alignItems="center">
            <ChakraSwitch
              isChecked={enabled}
              onChange={(ev) => {
                ev.stopPropagation();
                setEnabled(ev.target.checked);
              }}
              isDisabled={!isBusinessApproved}
            />
            <Flex ml="4" flexDir="column" minW="280px">
              <Text
                fontSize="16px"
                fontWeight="700"
                lineHeight="22px"
                opacity={!isBusinessApproved ? 0.6 : 1}
              >
                {enabled ? t('Visível') : t('Invisível')}
              </Text>
            </Flex>
          </Flex>
          {/* submit */}
          <Button
            mt="6"
            minW="200px"
            fontSize="15px"
            type="submit"
            isLoading={isLoading}
            loadingText={t('Salvando')}
          >
            {t('Salvar')}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default OperationPage;
