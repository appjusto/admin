import * as cpfutils from '@fnando/cpf';
import { useConsumerProfile } from 'app/api/consumer/useConsumerProfile';
import { ConsumerProfile, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router';
import { consumerReducer } from './consumerReducer';

type Validation = { cpf: boolean };
interface ConsumerProfileContextProps {
  consumer: WithId<ConsumerProfile> | undefined | null;
  contextValidation: Validation;
  handleProfileChange(key: string, value: any): void;
  setContextValidation: Dispatch<SetStateAction<Validation>>;
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

export const ConsumerProvider = ({ children }: Props) => {
  // context
  const { consumerId } = useParams<Params>();
  console.log('consumerId', consumerId);
  const profile = useConsumerProfile(consumerId);
  console.log('profile', profile);
  // state
  const [consumer, dispatch] = React.useReducer(consumerReducer, {} as WithId<ConsumerProfile>);
  const [contextValidation, setContextValidation] = React.useState({
    cpf: true,
  });

  // handlers
  const handleProfileChange = (key: string, value: any) => {
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
        contextValidation,
        handleProfileChange,
        setContextValidation,
      }}
    >
      {children}
    </ConsumerProfileContext.Provider>
  );
};

export const useContextConsumerProfile = () => {
  return React.useContext(ConsumerProfileContext);
};
