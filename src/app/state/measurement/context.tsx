import { useMeasurement } from 'app/api/measurement/useMeasurement';
// import ReactPixel from 'react-facebook-pixel';
import React from 'react';

type ConsentResponse = 'accepted' | 'refused' | 'pending';

interface ContextProps {
  userConsent?: ConsentResponse;
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
  const [userConsent, setUserConsent] = React.useState<ConsentResponse>();
  // handlers
  const handleUserConsent = React.useCallback((response: ConsentResponse) => {
    localStorage.setItem('appjusto-consent', response);
    setUserConsent(response);
  }, []);
  // side effects
  React.useEffect(() => {
    const consent = localStorage.getItem('appjusto-consent');
    if (consent === 'true' || consent === 'accepted') setUserConsent('accepted');
    else if (consent === 'false' || consent === 'refused') setUserConsent('refused');
    else setUserConsent('pending');
  }, []);
  React.useEffect(() => {
    //if(!analytics) return;
    if (!userConsent) return;
    if (process.env.NODE_ENV !== 'production') return;
    setAnalyticsConsent();
    // const PixelId = process.env.REACT_APP_FACEBOOK_PIXEL_ID;
    // if (PixelId) ReactPixel.init(PixelId);
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
