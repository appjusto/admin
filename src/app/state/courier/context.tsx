import { useCourierPrivateData } from 'app/api/courier/useCourierPrivateData';
import { useCourierProfile } from 'app/api/courier/useCourierProfile';
import { useCourierProfilePictures } from 'app/api/courier/useCourierProfilePictures';
import { CourierProfile, WithId } from 'appjusto-types';
import React from 'react';
import { useParams } from 'react-router';
import { courierReducer } from './courierReducer';

interface CourierProfileContextProps {
  courier: WithId<CourierProfile> | undefined | null;
  pictures: { selfie: string | null; document: string | null };
  marketPlaceIssues: string[] | undefined;
  handleProfileUpdate(key: string, value: any): void;
}

const CourierProfileContext = React.createContext<CourierProfileContextProps>(
  {} as CourierProfileContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type Params = {
  courierId: string;
};

export const CourierProvider = ({ children }: Props) => {
  // context
  const { courierId } = useParams<Params>();
  const profile = useCourierProfile(courierId);
  const pictures = useCourierProfilePictures(courierId, '', '');
  const platform = useCourierPrivateData(courierId);
  const marketPlaceIssues = platform?.marketPlace?.issues ?? undefined;
  // state
  //const [courier, setCourier] = React.useState<WithId<CourierProfile> | null | undefined>(null);
  const [courier, dispatch] = React.useReducer(courierReducer, {} as WithId<CourierProfile>);

  // handlers
  const handleProfileUpdate = (key: string, value: any) => {
    dispatch({ type: 'update_state', payload: { [key]: value } });
  };

  // side effects
  React.useEffect(() => {
    if (profile) {
      dispatch({
        type: 'update_state',
        payload: {
          ...profile,
        },
      });
    }
  }, [profile]);

  /*React.useEffect(() => {
    if (profile) setCourier(profile);
  }, [profile]);*/
  console.log(courier);
  // UI
  return (
    <CourierProfileContext.Provider
      value={{ courier, pictures, marketPlaceIssues, handleProfileUpdate }}
    >
      {children}
    </CourierProfileContext.Provider>
  );
};

export const useContextCourierProfile = () => {
  return React.useContext(CourierProfileContext);
};
