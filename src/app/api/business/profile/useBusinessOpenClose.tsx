import { Business, WithId } from '@appjusto/types';
import { useToast } from '@chakra-ui/toast';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import { CustomToast } from 'common/components/CustomToast';
import React from 'react';
import { useBusinessProfile } from './useBusinessProfile';
import { businessShouldBeOpen } from './utils';

export const useBusinessOpenClose = (business?: WithId<Business> | null) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  const { role } = useContextFirebaseUser();
  const { updateBusinessProfile } = useBusinessProfile();
  const { getServerTime } = useContextServerTime();
  // handlers
  const toast = useToast();
  const checkBusinessStatus = React.useCallback(() => {
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    const today = getServerTime();
    console.log('getServerTime result: ', today);
    const shouldBeOpen = businessShouldBeOpen(today, business.schedules);
    console.log('shouldBeOpen', shouldBeOpen);
    if (shouldBeOpen && business?.status === 'closed') {
      updateBusinessProfile({ status: 'open' });
    } else if (!shouldBeOpen && business?.status === 'open') {
      console.log('FECHANDO!');
      updateBusinessProfile({ status: 'closed' });
      toast({
        duration: 12000,
        render: () => (
          <CustomToast
            type="warning"
            message={{
              title: 'Seu restaurante está fechado.',
              description:
                'Seu restaurante foi fechado de acordo com o horário de funcionamento definido. Para começar a receber pedidos ajuste estas configuração na tela de "Horários" ou contate o administrador desta unidade.',
            }}
          />
        ),
      });
    }
  }, [
    business?.situation,
    business?.enabled,
    business?.schedules,
    business?.status,
    getServerTime,
    updateBusinessProfile,
    toast,
  ]);
  // side effects
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!role) return;
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    console.log('User role:', role);
    checkBusinessStatus();
    const openCloseInterval = setInterval(() => {
      checkBusinessStatus();
    }, 5000);
    return () => clearInterval(openCloseInterval);
  }, [
    isBackofficeUser,
    role,
    business?.situation,
    business?.enabled,
    business?.schedules,
    checkBusinessStatus,
  ]);
};
