import * as cpfutils from '@fnando/cpf';
import { useConsumerOrders } from 'app/api/consumer/useConsumerOrders';
import { useConsumerProfile } from 'app/api/consumer/useConsumerProfile';
import { useConsumerProfilePictures } from 'app/api/consumer/useConsumerProfilePictures';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { ConsumerProfile, Issue, IssueType, Order, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router';
import { consumerReducer } from './consumerReducer';

type Validation = { cpf: boolean };
interface ConsumerProfileContextProps {
  consumer?: WithId<ConsumerProfile> | null;
  pictures: { selfie?: string | null; document?: string | null };
  contextValidation: Validation;
  orders: WithId<Order>[];
  isEditingEmail: boolean;
  selfieFiles?: File[] | null;
  setSelfieFiles(files: File[] | null): void;
  documentFiles?: File[] | null;
  setDocumentFiles(files: File[] | null): void;
  setIsEditingEmail: Dispatch<SetStateAction<boolean>>;
  handleProfileChange(key: string, value: any): void;
  setContextValidation: Dispatch<SetStateAction<Validation>>;
  issueOptions?: WithId<Issue>[] | null;
}

const ConsumerProfileContext = React.createContext<ConsumerProfileContextProps>(
  {} as ConsumerProfileContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type Params = {
  consumerId: string;
};

const issueOptionsArray = ['consumer-profile-invalid'] as IssueType[];

export const ConsumerProvider = ({ children }: Props) => {
  // context
  const { consumerId } = useParams<Params>();
  const profile = useConsumerProfile(consumerId);
  // change to useConsumerProfilePictures
  const pictures = useConsumerProfilePictures(consumerId, '_1024x1024', '_1024x1024');
  const orders = useConsumerOrders(consumerId);
  const issueOptions = useIssuesByType(issueOptionsArray);
  // state
  const [consumer, dispatch] = React.useReducer(consumerReducer, {} as WithId<ConsumerProfile>);
  const [contextValidation, setContextValidation] = React.useState({
    cpf: true,
  });
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [selfieFiles, setSelfieFiles] = React.useState<File[] | null>(null);
  const [documentFiles, setDocumentFiles] = React.useState<File[] | null>(null);
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
    setContextValidation(() => {
      return {
        cpf: cpfutils.isValid(consumer?.cpf!),
      };
    });
  }, [consumer.cpf]);
  // UI
  return (
    <ConsumerProfileContext.Provider
      value={{
        consumer,
        pictures,
        contextValidation,
        orders,
        isEditingEmail,
        selfieFiles,
        setSelfieFiles,
        documentFiles,
        setDocumentFiles,
        setIsEditingEmail,
        handleProfileChange,
        setContextValidation,
        issueOptions,
      }}
    >
      {children}
    </ConsumerProfileContext.Provider>
  );
};

export const useContextConsumerProfile = () => {
  return React.useContext(ConsumerProfileContext);
};
