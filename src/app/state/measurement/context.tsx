import { useMeasurement } from 'app/api/measurement/useMeasurement';
import React from 'react';
import ReactPixel from 'react-facebook-pixel';

type ConsentResponse = 'accept' | 'refuse';

interface ContextProps {
  userConsent: undefined | boolean;
  handleUserConsent(value: ConsentResponse): void;
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
  const handleUserConsent = React.useCallback((response: ConsentResponse) => {
    if (response === 'refuse') {
      localStorage.setItem('appjusto-consent', 'false');
      setUserConsent(false);
      return;
    }
    localStorage.setItem('appjusto-consent', 'true');
    setUserConsent(true);
  }, []);
  // side effects
  React.useEffect(() => {
    const consent = localStorage.getItem('appjusto-consent');
    if (consent === 'true') setUserConsent(true);
    else if (consent === 'false') setUserConsent(false);
  }, []);
  React.useEffect(() => {
    //if(!analytics) return;
    if (!userConsent) return;
    const PixelId = process.env.REACT_APP_FACEBOOK_PIXEL_ID;
    setAnalyticsConsent();
    if (PixelId) ReactPixel.init(PixelId);
  }, [userConsent, setAnalyticsConsent]);
  // provider
  return (
    <MeasurementContext.Provider value={{ userConsent, handleUserConsent }}>
      {children}
    </MeasurementContext.Provider>
  );
};

export const useContextMeasurement = () => {
  return React.useContext(MeasurementContext);
};
