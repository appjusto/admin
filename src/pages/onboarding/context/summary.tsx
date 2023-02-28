import { useContextBusiness } from 'app/state/business/context';
import React from 'react';

type SummaryUpdateChanges = {
  state: 'logistics' | 'insurance';
  value: number;
};

interface SumarryContextProps {
  commission: number;
  // logistics: number;
  insurance: number;
  total: number;
  updateState(changes: SummaryUpdateChanges): void;
}

const SumarryContext = React.createContext<SumarryContextProps>(
  {} as SumarryContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const SummaryProvider = ({ children }: Props) => {
  const { platformFees } = useContextBusiness();
  // state
  const [baseCommission, setBaseCommission] = React.useState(0);
  const [commission, setCommission] = React.useState(0);
  const [insurance, setInsurance] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  // handlers
  const updateState = React.useCallback(
    (changes: SummaryUpdateChanges) => {
      const { state, value } = changes;
      if (state === 'logistics') {
        setCommission(baseCommission + value);
      } else if (state === 'insurance') {
        setInsurance(value);
      }
    },
    [baseCommission]
  );
  // side effects
  React.useEffect(() => {
    if (!platformFees?.commissions.food.percent) return;
    setBaseCommission(platformFees?.commissions.food.percent);
  }, [platformFees?.commissions.food.percent]);
  React.useEffect(() => {
    const result = commission + insurance;
    setTotal(result);
  }, [commission, insurance]);
  // UI
  return (
    <SumarryContext.Provider
      value={{ commission, insurance, total, updateState }}
    >
      {children}
    </SumarryContext.Provider>
  );
};

export const useContextSumarry = () => {
  return React.useContext(SumarryContext);
};
