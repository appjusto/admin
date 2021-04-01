import { Box } from '@chakra-ui/react';
import React from 'react';
import { BusinessBaseDrawer } from './BusinessBaseDrawer';

interface BusinessDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const BusinessDrawer = ({ onClose, ...props }: BusinessDrawerProps) => {
  //context

  //handlers

  //UI conditions

  //UI
  return (
    <BusinessBaseDrawer
      agent={{ id: 'sajkcawhAc', name: 'Agente1' }}
      businessId="KTqDLkMSAq6vigc0ODDr"
      businessName="Itapuama Vegan"
      createdOn="02/02/2021 15:00"
      updatedOn="31/03/2021 15:00"
      managerName="Renan Costa"
      onClose={onClose}
      {...props}
    >
      <Box />
    </BusinessBaseDrawer>
  );
};
