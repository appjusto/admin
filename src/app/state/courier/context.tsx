import * as cnpjutils from '@fnando/cnpj';
import * as cpfutils from '@fnando/cpf';
import { useCourierPrivateData } from 'app/api/courier/useCourierPrivateData';
import { useCourierProfile } from 'app/api/courier/useCourierProfile';
import { useCourierProfilePictures } from 'app/api/courier/useCourierProfilePictures';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { CourierProfile, Issue, IssueType, MarketplaceAccountInfo, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router';
import { courierReducer } from './courierReducer';

type Validation = { cpf: boolean; cnpj: boolean; agency: boolean; account: boolean };
interface CourierProfileContextProps {
  courier: WithId<CourierProfile> | undefined | null;
  pictures: { selfie: string | null; document: string | null };
  issueOptions?: WithId<Issue>[] | null;
  marketPlace?: MarketplaceAccountInfo;
  contextValidation: Validation;
  handleProfileChange(key: string, value: any): void;
  setContextValidation: Dispatch<SetStateAction<Validation>>;
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

const issueOptionsArray = ['courier-profile-invalid'] as IssueType[];

export const CourierProvider = ({ children }: Props) => {
  // context
  const { courierId } = useParams<Params>();
  const profile = useCourierProfile(courierId);
  const pictures = useCourierProfilePictures(courierId, '', '');
  const marketPlace = useCourierPrivateData(courierId);
  const issueOptions = useIssuesByType(issueOptionsArray);

  // state
  const [courier, dispatch] = React.useReducer(courierReducer, {} as WithId<CourierProfile>);
  const [contextValidation, setContextValidation] = React.useState({
    cpf: true,
    cnpj: true,
    agency: true,
    account: true,
  });

  // handlers
  const handleProfileChange = (key: string, value: any) => {
    dispatch({ type: 'update_state', payload: { [key]: value } });
  };

  // side effects
  React.useEffect(() => {
    if (profile) {
      dispatch({
        type: 'load_state',
        payload: profile,
      });
    }
  }, [profile]);

  React.useEffect(() => {
    setContextValidation((prevState) => {
      return {
        ...prevState,
        cpf: cpfutils.isValid(courier?.cpf!),
        cnpj: cnpjutils.isValid(courier?.company?.cnpj!),
      };
    });
  }, [courier.cpf, courier.company?.cnpj]);

  // UI
  return (
    <CourierProfileContext.Provider
      value={{
        courier,
        pictures,
        issueOptions,
        marketPlace,
        contextValidation,
        handleProfileChange,
        setContextValidation,
      }}
    >
      {children}
    </CourierProfileContext.Provider>
  );
};

export const useContextCourierProfile = () => {
  return React.useContext(CourierProfileContext);
};
