import { Fleet } from '@appjusto/types';
import { Box, Button } from '@chakra-ui/react';
import { useFleet } from 'app/api/fleet/useFleet';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import React from 'react';
import { t } from 'utils/i18n';
import { fleetValidation } from '../logistics/utils';
import { FleetIncrementalItem } from './FleetIncrementalItem';

export const FleetForm = () => {
  // context
  const { user } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, businessFleet } = useContextBusiness();
  const { updateFleet, updateFleetResult } = useFleet();
  const { isLoading } = updateFleetResult;
  // state
  // const [name, setName] = React.useState('');
  // const [description, setDescription] = React.useState('');
  const [distanceThreshold, setDistanceThreshold] = React.useState(0);
  const [minimumFee, setMinimumFee] = React.useState(0);
  const [additionalPerKmAfterThreshold, setAdditionalPerKmAfterThreshold] =
    React.useState(0);
  // handlers
  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    if (!business?.id || !business.name) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'business-fleet-submit-error',
        message: {
          title: 'Não foi possível encontrar as informações do restaurante.',
        },
      });
      return;
    }
    try {
      // create fleet object
      const changes = {
        type: 'private',
        situation: 'approved',
        name: business.name,
        description: `Entregas de responsabilidade do ${business.name}`,
        distanceThreshold,
        minimumFee,
        additionalPerKmAfterThreshold,
        maxDistance: business?.deliveryRange ?? 30000,
        maxDistanceToOrigin: 4000,
        createdBy: {
          flavor: 'business',
          id: business.id,
        },
      } as Fleet;
      const isFleetvalid = fleetValidation(changes);
      if (!isFleetvalid) {
        dispatchAppRequestResult({
          status: 'error',
          requestId: 'business-fleet-submit-error',
          message: { title: 'Os parâmetros da frota não são válidos.' },
        });
        return;
      }
      return updateFleet({ changes, id: businessFleet?.id });
    } catch (error) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'business-fleet-submit-error',
        message: { title: 'Não foi possível salvar as informações.' },
      });
    }
  };
  // side effects
  React.useEffect(() => {
    if (!business?.name) return;
    if (businessFleet) {
      // setDescription(businessFleet.description);
      setDistanceThreshold(businessFleet.distanceThreshold);
      setMinimumFee(businessFleet.minimumFee);
      setAdditionalPerKmAfterThreshold(
        businessFleet.additionalPerKmAfterThreshold
      );
    }
  }, [business?.name, businessFleet]);
  // UI
  return (
    <Box maxW="600px">
      <form onSubmit={onSubmitHandler}>
        {/* <CustomInput
          id="fleet-name"
          label={t('Nome da frota')}
          placeholder={t('Nome da frota em até 36 caracteres')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          maxLength={36}
          isRequired
        />
        <InputCounter max={36} current={name.length} /> */}
        {/* <CustomTextarea
          mt="4"
          id="fleet-description"
          h="120px"
          placeholder={t('Descreva sua frota em até 140 caracteres')}
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          maxLength={240}
          isRequired
        />
        <InputCounter max={240} current={description.length} /> */}
        <FleetIncrementalItem
          title={t('Pagamento Mínimo')}
          description={t(
            'Defina o valor que os clientes pagarão por entregas até a Distância Inicial Mínima.'
          )}
          value={minimumFee}
          onChange={setMinimumFee}
          incrementNumber={100}
          isCurrency
        />
        <FleetIncrementalItem
          title={t('Distância Inicial Mínima')}
          description={t(
            'Defina a distância coberta pelo Pagamento Mínimo. Acima dessa distância, os clientes pagarão o Pagamento Mínimo mais o Valor Adicional por Km Rodado.'
          )}
          value={distanceThreshold}
          onChange={setDistanceThreshold}
          incrementNumber={1000}
          unit="km"
        />
        <FleetIncrementalItem
          title={t('Valor Adicional por Km Rodado')}
          description={t(
            'Defina o valor adicional que os clientes pagarão por Km acima da Distância Inicial Mínima.'
          )}
          value={additionalPerKmAfterThreshold}
          onChange={setAdditionalPerKmAfterThreshold}
          incrementNumber={10}
          isCurrency
          showCents
        />
        <Button
          mt="6"
          minW="200px"
          type="submit"
          isLoading={isLoading}
          loadingText={t('Salvando')}
        >
          {t('Salvar')}
        </Button>
      </form>
    </Box>
  );
};
