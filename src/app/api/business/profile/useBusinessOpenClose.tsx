import { useToast } from '@chakra-ui/toast';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import { Business, WithId } from 'appjusto-types';
import { CustomToast } from 'common/components/CustomToast';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React from 'react';
import { useBusinessProfile } from './useBusinessProfile';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const useBusinessOpenClose = (business?: WithId<Business> | null) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  const { updateBusinessProfile } = useBusinessProfile();
  const { getServerTime } = useContextServerTime();
  // handlers
  const toast = useToast();
  const checkBusinessStatus = React.useCallback(() => {
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    const today = getServerTime();
    const day = today.getDay();
    const dayIndex = day === 0 ? 6 : day - 1;
    const daySchedule = business.schedules[dayIndex];
    let n = 0;
    let shouldBeOpen = false;
    while (daySchedule.schedule.length > n && shouldBeOpen === false) {
      const period = daySchedule.schedule[n];
      const startH = parseInt(period.from.slice(0, 2));
      const startM = parseInt(period.from.slice(2, 4));
      const endH = parseInt(period.to.slice(0, 2));
      const endM = parseInt(period.to.slice(2, 4));
      const openTime = dayjs().hour(startH).minute(startM).second(0);
      const closeTime = dayjs().hour(endH).minute(endM).second(0);
      shouldBeOpen = openTime.isSameOrBefore(today) && closeTime.isAfter(today);
      n++;
    }
    if (shouldBeOpen && business?.status === 'closed') {
      console.log('Open at', today);
      updateBusinessProfile({ status: 'open' });
    } else if (!shouldBeOpen && business?.status === 'open') {
      console.log('Closed at', today);
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
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    checkBusinessStatus();
    const openCloseInterval = setInterval(() => {
      checkBusinessStatus();
    }, 5000);
    return () => clearInterval(openCloseInterval);
  }, [
    isBackofficeUser,
    business?.situation,
    business?.enabled,
    business?.schedules,
    checkBusinessStatus,
  ]);
};
