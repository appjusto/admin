import { Business, BusinessService, Fleet } from '@appjusto/types';
import {
  Box,
  Flex,
  Icon,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useFleet } from 'app/api/fleet/useFleet';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { ReactComponent as motocycleGray } from 'common/img/motocycle-gray.svg';
import { ReactComponent as motocycleGreen } from 'common/img/motocycle-green.svg';
import { ReactComponent as motocycleYellow } from 'common/img/motocycle-yellow.svg';
import { InputCounter } from 'pages/backoffice/drawers/push/InputCounter';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CommissionItem } from './CommissionItem';
import { FleetIncrementalItem } from './FleetIncrementalItem';
import { LogisticsBox } from './LogisticsBox';
import { LogisticsItem } from './LogisticsItem';
import { fleetValidation } from './utils';

type LogisticsType = 'appjusto' | 'private';

const LogisticsPage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { user } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { updateFleet } = useFleet();
  const { business, businessFleet } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isSuccess } = updateResult;
  // state
  const [logisticsAccepted, setLogisticsAccepted] =
    React.useState<BusinessService>();
  const [logistics, setLogistics] = React.useState<LogisticsType>('appjusto');
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [distanceThreshold, setDistanceThreshold] = React.useState(0);
  const [minimumFee, setMinimumFee] = React.useState(0);
  const [additionalPerKmAfterThreshold, setAdditionalPerKmAfterThreshold] =
    React.useState(0);
  const [maxDistance, setMaxDistance] = React.useState(30000);
  const [maxDistanceToOrigin, setMaxDistanceToOrigin] = React.useState(4000);
  const [isLoading, setIsLoading] = React.useState(false);
  // helpers

  // handlers
  const onSubmitHandler = async () => {
    if (!user?.uid) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'business-fleet-submit-error',
        message: {
          title: 'Não foi possível encontrar as informações do usuário.',
        },
      });
      return;
    }
    if (!business?.id) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'business-fleet-submit-error',
        message: {
          title: 'Não foi possível encontrar as informações do restaurante.',
        },
      });
      return;
    }
    setIsLoading(true);
    if (logistics === 'appjusto') {
      try {
        // save logistics service in business document
        const time = getServerTime().getTime();
        const logisticsService = {
          name: 'logistics',
          fee: {
            fixed: 0,
            percent: 0,
          },
          createdBy: {
            id: user.uid,
            email: user.email,
          },
          createdOn: time,
        } as BusinessService;
        const services = business?.services ?? [];
        services.push(logisticsService);
        updateBusinessProfile({ services });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        dispatchAppRequestResult({
          status: 'error',
          requestId: 'business-fleet-submit-error',
          message: { title: 'Não foi possível salvar as informações.' },
        });
      }
    } else {
      try {
        // removing logistics from business services
        const services =
          business?.services?.filter(
            (service) => service.name !== 'logistics'
          ) ?? [];
        // create/update fleet
        const fleetChanges = {
          type: 'private',
          name,
          description,
          distanceThreshold,
          minimumFee,
          additionalPerKmAfterThreshold,
          maxDistance,
          maxDistanceToOrigin,
          createdBy: {
            flavor: 'business',
            id: business.id,
          },
        } as Fleet;
        const isFleetvalid = fleetValidation(fleetChanges);
        if (!isFleetvalid) {
          setIsLoading(false);
          dispatchAppRequestResult({
            status: 'error',
            requestId: 'business-fleet-submit-error',
            message: { title: 'Os parâmetros da frota não são válidos.' },
          });
          return;
        }
        const createdFleetId = await updateFleet({
          changes: fleetChanges,
          id: businessFleet?.id,
        });
        const fleetId = businessFleet?.id ?? createdFleetId;
        // Add fleetId to business document
        if (!fleetId) {
          setIsLoading(false);
          dispatchAppRequestResult({
            status: 'error',
            requestId: 'business-fleet-submit-error',
            message: { title: 'Não foi possível criar a frota.' },
          });
          return;
        }
        const fleetsIdsAllowed = business?.fleetsIdsAllowed ?? [];
        fleetsIdsAllowed.push(fleetId);
        const changes = {
          fleetsIdsAllowed,
          services,
        } as Partial<Business>;
        updateBusinessProfile(changes);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        dispatchAppRequestResult({
          status: 'error',
          requestId: 'business-fleet-submit-error',
          message: { title: 'Não foi possível salvar as informações.' },
        });
      }
    }
  };
  // side effects
  React.useEffect(() => {
    if (onboarding) {
      window?.scrollTo(0, 0);
    }
  }, [onboarding]);
  React.useEffect(() => {
    if (!business) return;
    const logisticsService = business.services?.find(
      (service) => service.name === 'logistics'
    );
    if (logisticsService) setLogistics('appjusto');
    else setLogistics('private');
  }, [business]);
  React.useEffect(() => {
    if (businessFleet) {
      setName(businessFleet.name);
      setDescription(businessFleet.description);
      setDistanceThreshold(businessFleet.distanceThreshold);
      setMinimumFee(businessFleet.minimumFee);
      setAdditionalPerKmAfterThreshold(
        businessFleet.additionalPerKmAfterThreshold
      );
      setMaxDistance(businessFleet.maxDistance);
      setMaxDistanceToOrigin(businessFleet.maxDistanceToOrigin);
    }
  }, [businessFleet]);
  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW="756px">
      <form onSubmit={onSubmitHandler}>
        <PageHeader
          title={t('Logística')}
          subtitle={t(
            'Defina como será a logística de entrega do seu restaurante.'
          )}
        />
        <RadioGroup
          mt="8"
          value={logistics}
          onChange={(value) => setLogistics(value as LogisticsType)}
        >
          <VStack spacing={4} alignItems="flex-start">
            <LogisticsBox isSelected={logistics === 'appjusto'}>
              <Flex>
                <Radio value="logistics">
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Logística AppJusto')}
                  </Text>
                </Radio>
                <Icon as={motocycleGreen} ml="6" w="48px" h="48px" />
              </Flex>
              <LogisticsItem title={t('Com Logística AppJusto')} icon>
                <Text>
                  {t('A entrega é feita por ')}
                  <Text as="span" fontWeight="700">
                    {t('nossa rede entregadores e por parceiros')}
                  </Text>
                </Text>
              </LogisticsItem>
              <LogisticsItem title={t('Sem Mensalidades')} icon>
                <Text>
                  {t('Uma vantagem do AppJusto é que ')}
                  <Text as="span" fontWeight="700">
                    {t('não cobramos mensalidade')}
                  </Text>
                </Text>
              </LogisticsItem>
              <CommissionItem fee="5%" highlight />
            </LogisticsBox>
            <LogisticsBox isSelected={logistics === 'appjusto'}>
              <Flex>
                <Radio value="logistics-by-partners">
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Logística por Parceiros')}
                  </Text>
                </Radio>
                <Icon as={motocycleYellow} ml="6" w="48px" h="48px" />
              </Flex>
              <LogisticsItem title={t('Com Logística por Parceiros')} icon>
                <Text>
                  {t(
                    'O AppJusto ainda está construindo a rede de entregadores na sua cidade. Até lá '
                  )}
                  <Text as="span" fontWeight="700">
                    {t('suas entregas serão feitas por empresas parceiras')}
                  </Text>
                </Text>
              </LogisticsItem>
              <LogisticsItem title={t('Sem Mensalidades')} icon>
                <Text>
                  {t('Uma vantagem do AppJusto é que ')}
                  <Text as="span" fontWeight="700">
                    {t('não cobramos mensalidade')}
                  </Text>
                </Text>
              </LogisticsItem>
              <CommissionItem fee="5%" highlight />
            </LogisticsBox>
            <LogisticsBox isSelected={logistics === 'private'}>
              <Flex>
                <Radio value="own-logistics">
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Logística Própria')}
                  </Text>
                </Radio>
                <Icon as={motocycleGray} ml="6" w="48px" h="48px" />
              </Flex>
              <LogisticsItem title={t('Sem Logística AppJusto')}>
                <Text>
                  {t('A entrega é feita por ')}
                  <Text as="span" fontWeight="700">
                    {t('sua rede de entregadores')}
                  </Text>
                </Text>
              </LogisticsItem>
              <LogisticsItem title={t('Sem Mensalidades')} icon>
                <Text>
                  {t('Uma vantagem do AppJusto é que ')}
                  <Text as="span" fontWeight="700">
                    {t('não cobramos mensalidade')}
                  </Text>
                </Text>
              </LogisticsItem>
              <CommissionItem fee="3%" />
            </LogisticsBox>
          </VStack>
        </RadioGroup>
        {logistics === 'private' && (
          <Box>
            <Text mt="6" fontSize="xl" color="black">
              {t('Defina os parâmetros da sua frota')}
            </Text>
            <CustomInput
              id="fleet-name"
              label={t('Nome da frota')}
              placeholder={t('Nome da frota em até 36 caracteres')}
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              maxLength={36}
              isRequired
            />
            <InputCounter max={36} current={name.length} />
            <Textarea
              id="fleet-description"
              label={t('Descrição')}
              placeholder={t('Descreva sua frota em até 140 caracteres')}
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              maxLength={140}
              isRequired
            />
            <InputCounter max={140} current={description.length} />
            <FleetIncrementalItem
              title={t('Pagamento Mínimo')}
              description={t(
                'Defina o valor que os entregadores dessa frota receberão ao percorrer a Distância Inicial Mínima.'
              )}
              value={minimumFee}
              onChange={setMinimumFee}
              incrementNumber={100}
              isCurrency
            />
            <FleetIncrementalItem
              title={t('Distância Inicial Mínima')}
              description={t(
                'Defina em Km a distância para o Pagamento Mínimo. Abaixo dessa distância, os entregadores dessa frota receberão o Pagamento Mínimo. Acima dessa distância, os entregadores receberão um Valor Adicional por Km Rodado.'
              )}
              value={distanceThreshold}
              onChange={setDistanceThreshold}
              incrementNumber={1000}
              unit="km"
            />
            <FleetIncrementalItem
              title={t('Valor Adicional por Km Rodado')}
              description={t(
                'Defina o valor adicional que os entregadores dessa frota receberão por Km ao percorrer uma distância acima da Distância Inicial Mínima.'
              )}
              value={additionalPerKmAfterThreshold}
              onChange={setAdditionalPerKmAfterThreshold}
              incrementNumber={10}
              isCurrency
              showCents
            />
            <FleetIncrementalItem
              title={t('Distância Máxima para Entrega')}
              description={t(
                'Defina em Km a distância máxima que os entregadores dessa frota poderão percorrer para fazer uma entrega. Pedidos recebidos com distância máxima acima da definida não serão exibidos.'
              )}
              value={maxDistance}
              onChange={setMaxDistance}
              incrementNumber={1000}
              unit="km"
              minimum={1000}
            />
          </Box>
        )}
        <PageFooter
          onboarding={onboarding}
          requiredLabel={false}
          redirect={redirect}
          isLoading={isLoading}
          // isDisabled={getActionButtonDisabledStatus()}
        />
      </form>
    </Box>
  );
};

export default LogisticsPage;
