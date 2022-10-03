import { IuguMarketplaceAccountAdvanceByAmountSimulation } from '@appjusto/types/payment/iugu';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useReceivablesSimulation = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [simulation, setSimulation] =
    React.useState<IuguMarketplaceAccountAdvanceByAmountSimulation>();
  const [simulationId, setSimulationId] = React.useState<string>();
  const [advancedValue, setAdvancedValue] = React.useState<number>();
  const [advanceFee, setAdvanceFee] = React.useState<number>();
  const [receivedValue, setReceivedValue] = React.useState<number>();
  // mutations
  const {
    mutateAsync: fetchReceivablesSimulation,
    mutationResult: receivablesSimulationResult,
  } = useCustomMutation(
    async (amount: number) => {
      if (!businessId) return;
      const result = await api
        .business()
        .fetchAdvanceSimulation(businessId, amount);
      if (result) setSimulation(result);
      return;
    },
    'fetchReceivablesSimulation',
    false
  );
  // side effects
  React.useEffect(() => {
    if (!simulation) return;
    const { advanceable_amount_cents, advancement_fee_cents, simulation_id } =
      simulation.nearest;
    setSimulationId(simulation_id);
    setAdvancedValue(advanceable_amount_cents);
    setAdvanceFee(advancement_fee_cents);
    setReceivedValue(advanceable_amount_cents - advancement_fee_cents);
  }, [simulation]);
  // return
  return {
    fetchReceivablesSimulation,
    receivablesSimulationResult,
    simulationId,
    advancedValue,
    advanceFee,
    receivedValue,
  };
};
