import { useMeasurement } from 'app/api/measurement/useMeasurement';
import React from 'react';
import { fbqConsent, fbqPageView, fbqTrackEvent } from './fpixel';

type ConsentResponse = 'accepted' | 'refused' | 'pending';

interface ContextProps {
  userConsent?: ConsentResponse;
  handleUserConsent(value: ConsentResponse): void;
  handlePixelEvent(event: string, options?: object): void;
}

const MeasurementContext = React.createContext<ContextProps>(
  {} as ContextProps
);

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
  const handlePixelEvent = React.useCallback(
    (name: string, options?: object) => {
      if (userConsent !== 'accepted') return;
      if (name === 'pageView') {
        fbqPageView();
      } else {
        fbqTrackEvent(name, options);
      }
    },
    [userConsent]
  );
  // side effects
  React.useEffect(() => {
    const consent = localStorage.getItem('appjusto-consent');
    if (consent === 'true' || consent === 'accepted')
      setUserConsent('accepted');
    else if (consent === 'false' || consent === 'refused')
      setUserConsent('refused');
    else setUserConsent('pending');
  }, []);
  React.useEffect(() => {
    if (userConsent !== 'accepted' || process.env.NODE_ENV === 'development') {
      fbqConsent('revoke');
      return;
    }
    fbqConsent('grant');
    setAnalyticsConsent();
  }, [userConsent, setAnalyticsConsent]);
  // provider
  return (
    <MeasurementContext.Provider
      value={{ userConsent, handleUserConsent, handlePixelEvent }}
    >
      {children}
    </MeasurementContext.Provider>
  );
};

export const useContextMeasurement = () => {
  return React.useContext(MeasurementContext);
};
