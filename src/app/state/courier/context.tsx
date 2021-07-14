import * as cnpjutils from '@fnando/cnpj';
import * as cpfutils from '@fnando/cpf';
import { useCourierOrders } from 'app/api/courier/useCourierOrders';
import { useCourierPrivateData } from 'app/api/courier/useCourierPrivateData';
import { useCourierProfile } from 'app/api/courier/useCourierProfile';
import { useCourierProfilePictures } from 'app/api/courier/useCourierProfilePictures';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import {
  CourierProfile,
  Issue,
  IssueType,
  MarketplaceAccountInfo,
  Order,
  WithId,
} from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { MutateFunction, MutationResult } from 'react-query';
import { useParams } from 'react-router';
import { courierReducer } from './courierReducer';

type Validation = { cpf: boolean; cnpj: boolean; agency: boolean; account: boolean };
interface CourierProfileContextProps {
  courier: WithId<CourierProfile> | undefined | null;
  pictures: { selfie?: string | null; document?: string | null };
  selfieFiles?: File[] | null;
  setSelfieFiles(files: File[] | null): void;
  documentFiles?: File[] | null;
  setDocumentFiles(files: File[] | null): void;
  issueOptions?: WithId<Issue>[] | null;
  marketPlace?: MarketplaceAccountInfo | null;
  deleteMarketPlace: MutateFunction<void, unknown, undefined, unknown>;
  deleteMarketPlaceResult: MutationResult<void, unknown>;
  contextValidation: Validation;
  orders?: WithId<Order>[] | null;
  dateStart?: string;
  dateEnd?: string;
  handleProfileChange(key: string, value: any): void;
  setContextValidation: Dispatch<SetStateAction<Validation>>;
  setDateStart(start: string): void;
  setDateEnd(end: string): void;
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
  const { marketPlace, deleteMarketPlace, deleteMarketPlaceResult } = useCourierPrivateData(
    courierId
  );
  const issueOptions = useIssuesByType(issueOptionsArray);

  // state
  const [courier, dispatch] = React.useReducer(courierReducer, {} as WithId<CourierProfile>);
  const [contextValidation, setContextValidation] = React.useState({
    cpf: true,
    cnpj: true,
    agency: true,
    account: true,
  });
  const [selfieFiles, setSelfieFiles] = React.useState<File[] | null>(null);
  const [documentFiles, setDocumentFiles] = React.useState<File[] | null>(null);
  const [dateStart, setDateStart] = React.useState<string>();
  const [dateEnd, setDateEnd] = React.useState<string>();
  const orders = useCourierOrders(courierId, dateStart, dateEnd);

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
        selfieFiles,
        setSelfieFiles,
        documentFiles,
        setDocumentFiles,
        issueOptions,
        marketPlace,
        deleteMarketPlace,
        deleteMarketPlaceResult,
        contextValidation,
        orders,
        dateStart,
        dateEnd,
        handleProfileChange,
        setContextValidation,
        setDateStart,
        setDateEnd,
      }}
    >
      {children}
    </CourierProfileContext.Provider>
  );
};

export const useContextCourierProfile = () => {
  return React.useContext(CourierProfileContext);
};
