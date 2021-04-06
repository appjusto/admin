import { Text } from '@chakra-ui/react';
import firebase from 'firebase/app';
import { useBusinessesContext } from 'pages/backoffice/context/BusinessesContext';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { BusinessBaseDrawer } from './BusinessBaseDrawer';

interface BusinessDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  businessId: string;
};

export const BusinessDrawer = ({ onClose, ...props }: BusinessDrawerProps) => {
  //context
  const { businessId } = useParams<Params>();
  const { getBusinessById } = useBusinessesContext();
  const business = getBusinessById(businessId);
  //handlers

  //UI conditions

  //UI
  return (
    <BusinessBaseDrawer
      agent={{ id: 'sajkcawhAc', name: 'Agente1' }}
      businessId={business?.id ?? ''}
      businessName={business?.name ?? ''}
      createdOn={
        business?.createdOn
          ? getDateAndHour(business?.createdOn as firebase.firestore.Timestamp)
          : ''
      }
      updatedOn={
        business?.updatedOn
          ? getDateAndHour(business?.updatedOn as firebase.firestore.Timestamp)
          : ''
      }
      managerName="Renan Costa"
      onClose={onClose}
      {...props}
    >
      <Text>ABRIUUUUUUUUU</Text>
    </BusinessBaseDrawer>
  );
};
