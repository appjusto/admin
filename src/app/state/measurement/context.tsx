import { useMeasurement } from 'app/api/measurement/useMeasurement';
import React from 'react';

type Consent = 'accept' | 'refuse';

interface ContextProps {
  userConsent: undefined | boolean;
  handleConsent(value: Consent): void;
}

const MeasurementContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const MeasurementProvider = ({ children }: Props) => {
  // context
  const { setAnalyticsConsent } = useMeasurement();
  // state
  const [userConsent, setUserConsent] = React.useState<boolean>();
  // handlers
  const handleConsent = React.useCallback(
    (value: Consent) => {
      if (userConsent) return;
      if (value === 'refuse') return;
      // save local
      localStorage.setItem('appjusto-consent', 'accept');
      // analytics
      setAnalyticsConsent();
      // state
      setUserConsent(true);
    },
    [userConsent, setAnalyticsConsent]
  );
  // side effects
  React.useEffect(() => {
    const consent = localStorage.getItem('appjusto-consent');
    if (consent) setUserConsent(true);
    else setUserConsent(false);
  }, []);
  // provider
  return (
    <MeasurementContext.Provider value={{ userConsent, handleConsent }}>
      {children}
    </MeasurementContext.Provider>
  );
};

export const useContextMeasurement = () => {
  return React.useContext(MeasurementContext);
};
