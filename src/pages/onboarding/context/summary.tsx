import { useContextBusiness } from 'app/state/business/context';
import React from 'react';

type SummaryUpdateChanges = {
  state: 'logistics' | 'insurance';
  value: number;
};

interface SummaryContextProps {
  commission: number;
  // logistics: number;
  insurance: number;
  total: number;
  updateState(changes: SummaryUpdateChanges): void;
}

const SummaryContext = React.createContext<SummaryContextProps>(
  {} as SummaryContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const SummaryProvider = ({ children }: Props) => {
  const { platformFees } = useContextBusiness();
  // state
  const [commission, setCommission] = React.useState(0);
  const [logistics, setLogistics] = React.useState(0);
  const [insurance, setInsurance] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  // handlers
  const updateState = React.useCallback((changes: SummaryUpdateChanges) => {
    const { state, value } = changes;
    if (state === 'logistics') {
      setLogistics(value);
    } else if (state === 'insurance') {
      setInsurance(value);
    }
  }, []);
  // side effects
  React.useEffect(() => {
    if (!platformFees?.commissions.food.percent) return;
    const baseCommission = platformFees?.commissions.food.percent;
    setCommission(baseCommission + logistics);
  }, [platformFees?.commissions.food.percent, logistics]);
  React.useEffect(() => {
    const result = commission + insurance;
    setTotal(result);
  }, [commission, insurance]);
  // UI
  return (
    <SummaryContext.Provider
      value={{ commission, insurance, total, updateState }}
    >
      {children}
    </SummaryContext.Provider>
  );
};

export const useContextSummary = () => {
  return React.useContext(SummaryContext);
};
