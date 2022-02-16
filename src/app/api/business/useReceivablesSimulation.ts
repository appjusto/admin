import { useContextApi } from 'app/state/api/context';
import { IuguMarketplaceAccountAdvanceSimulation } from '@appjusto/types/payment/iugu';
import React from 'react';

export const useReceivablesSimulation = (businessId: string | undefined, ids: string[]) => {
  // context
  const api = useContextApi();
  // state
  const [simulation, setSimulation] = React.useState<IuguMarketplaceAccountAdvanceSimulation>();
  const [advancedValue, setAdvancedValue] = React.useState<string>();
  const [advanceFee, setAdvanceFee] = React.useState<string>();
  const [receivedValue, setReceivedValue] = React.useState<string>();
  // side effects
  React.useEffect(() => {
    if (!businessId || ids.length === 0) return;
    (async () => {
      const numberIds = ids.map((id) => Number(id));
      const result = await api.business().fetchAdvanceSimulation(businessId, numberIds);
      if (result) setSimulation(result);
    })();
  }, [api, businessId, ids]);
  React.useEffect(() => {
    if (!simulation) return;
    setAdvancedValue(simulation.total.advanced_value ?? null);
    setAdvanceFee(simulation.total.advance_fee ?? null);
    setReceivedValue(simulation.total.received_value ?? null);
  }, [simulation]);
  // return
  return { advancedValue, advanceFee, receivedValue };
};
