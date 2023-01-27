import { Business, WithId } from '@appjusto/types';
import { useToast } from '@chakra-ui/toast';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import { CustomToast } from 'common/components/CustomToast';
import React from 'react';
import { businessShouldBeOpen } from './utils';

let statusUnavailableAlerted = false;

export const useBusinessOpenClose = (business?: WithId<Business> | null) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  // state
  const [isOpen, setIsOpen] = React.useState(false);
  // handlers
  const toast = useToast();
  const handleToast = React.useCallback(
    (
      type: 'error' | 'success' | 'warning',
      title: string,
      description?: string,
      duration: number = 6000
    ) => {
      if (isBackofficeUser) return;
      if (toast.isActive(title)) return;
      toast({
        id: title,
        duration,
        render: () => (
          <CustomToast
            type={type}
            message={{
              title,
              description,
            }}
          />
        ),
      });
    },
    [isBackofficeUser, toast]
  );
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
      handleToast('success', 'Seu restaurante está aberto!');
    }
    if (!shouldBeOpen && isOpen) {
      console.log(
        '%cFechando restaurante de acordo com horários estabelecidos.',
        'color: purple'
      );
      setIsOpen(false);
      handleToast(
        'warning',
        'Seu restaurante está fechado.',
        'Seu restaurante foi fechado de acordo com o horário de funcionamento definido. Se deseja continuar a receber pedidos, ajuste estas configuração na tela de "Horários" ou contate o administrador desta unidade.',
        12000
      );
    }
  }, [
    business?.situation,
    business?.enabled,
    business?.schedules,
    business?.status,
    isOpen,
    getServerTime,
    handleToast,
  ]);
  // side effects
  React.useEffect(() => {
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
    business?.situation,
    business?.enabled,
    business?.schedules,
    business?.status,
    checkBusinessStatus,
  ]);
  React.useEffect(() => {
    if (business?.status === 'unavailable' && !statusUnavailableAlerted) {
      statusUnavailableAlerted = true;
      setIsOpen(false);
      handleToast(
        'warning',
        'Fechamento de emergência ativado.',
        'Desative o fechamento de emergência para que seu restaurante possa funcionar de acordo com os horários configurados.',
        12000
      );
    }
  }, [business?.status, handleToast]);
  return isOpen;
};
