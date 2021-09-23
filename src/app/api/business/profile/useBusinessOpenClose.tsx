import { useContextFirebaseUser } from 'app/state/auth/context';
import { Business, WithId } from 'appjusto-types';
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
  const checkBusinessStatus = React.useCallback(() => {
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    const today = new Date();
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
      shouldBeOpen =
        dayjs().hour(startH).minute(startM).isSameOrBefore(today) &&
        dayjs().hour(endH).minute(endM).isSameOrAfter(today);
      n++;
    }
    if (shouldBeOpen && business?.status === 'closed') {
      updateBusinessProfile({ status: 'open' });
    } else if (!shouldBeOpen && business?.status === 'open') {
      updateBusinessProfile({ status: 'closed' });
    }
  }, [
    business?.situation,
    business?.enabled,
    business?.schedules,
    business?.status,
    updateBusinessProfile,
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
