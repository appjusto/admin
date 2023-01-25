import { Business, BusinessService, Fleet } from '@appjusto/types';
import { Box, Button, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useFleet } from 'app/api/fleet/useFleet';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { InputCounter } from 'pages/backoffice/drawers/push/InputCounter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';
import { FleetIncrementalItem } from './FleetIncrementalItem';

type LogisticsType = 'appjusto' | 'private';

const LogisticsPage = () => {
  // context
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { user } = useContextFirebaseUser();
  const { business, businessFleet } = useContextBusiness();
  const { updateFleet } = useFleet();
  // queries & mutations
  const { updateBusinessProfile } = useBusinessProfile(business?.id);
  // state
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
        const fleetId = await updateFleet({
          changes: fleetChanges,
          id: businessFleet?.id,
        });
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
  return (
    <Box>
      <PageHeader
        title={t('Logística')}
        subtitle={t(
          'Defina como será a logística de entrega do seu restaurante'
        )}
      />
      <Box mt="6" maxW="400px">
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSubmitHandler();
          }}
        >
          <Text fontSize="xl" color="black">
            {t('Tipo de logística')}
          </Text>
          <RadioGroup
            mt="4"
            aria-label="logistics-type"
            onChange={(value: LogisticsType) => setLogistics(value)}
            value={logistics}
            defaultValue="1"
            colorScheme="green"
            color="black"
            fontSize="15px"
            lineHeight="21px"
          >
            <Stack
              direction="row"
              alignItems="flex-start"
              color="black"
              spacing={8}
              fontSize="16px"
              lineHeight="22px"
            >
              <Radio value="appjusto" aria-label="logística AppJusto">
                {t('Logística AppJusto')}
              </Radio>
              <Radio value="private" aria-label="logística própria">
                {t('Logística própria')}
              </Radio>
            </Stack>
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
              />
            </Box>
          )}
          <Button
            mt="10"
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

export default LogisticsPage;
