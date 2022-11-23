import { Business, WithId } from '@appjusto/types';
import { useToast } from '@chakra-ui/toast';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import { CustomToast } from 'common/components/CustomToast';
import React from 'react';
import { businessShouldBeOpen } from './utils';

export const useBusinessOpenClose = (business?: WithId<Business> | null) => {
  // context
  const { adminRole } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  // state
  const [isOpen, setIsOpen] = React.useState(false);
  // handlers
  const toast = useToast();
  const checkBusinessStatus = React.useCallback(() => {
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    if (business?.status === 'unavailable') return;
    const today = getServerTime();
    const shouldBeOpen = businessShouldBeOpen(today, business.schedules);
    if (shouldBeOpen && !isOpen) {
      setIsOpen(true);
      console.log(
        '%Abrindo restaurante de acordo com horários estabelecidos.',
        'color: purple'
      );
      toast({
        duration: 6000,
        render: () => (
          <CustomToast
            type="success"
            message={{
              title: 'Seu restaurante está aberto!',
            }}
          />
        ),
      });
    }
    if (!shouldBeOpen && isOpen) {
      console.log(
        '%cFechando restaurante de acordo com horários estabelecidos.',
        'color: purple'
      );
      setIsOpen(false);
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
    isOpen,
    getServerTime,
    toast,
  ]);
  // side effects
  React.useEffect(() => {
    if (!adminRole) return;
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    if (business?.status === 'unavailable') return;
    checkBusinessStatus();
    const openCloseInterval = setInterval(() => {
      checkBusinessStatus();
    }, 5000);
    return () => clearInterval(openCloseInterval);
  }, [
    adminRole,
    business?.situation,
    business?.enabled,
    business?.schedules,
    business?.status,
    checkBusinessStatus,
  ]);
  React.useEffect(() => {
    if (business?.status === 'unavailable') {
      setIsOpen(false);
    }
  }, [business?.status]);
  return isOpen;
};
