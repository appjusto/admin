import { Business, WithId } from '@appjusto/types';
import { useToast } from '@chakra-ui/toast';
import * as Sentry from '@sentry/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import { CustomToast } from 'common/components/CustomToast';
import React from 'react';
import { useBusinessProfile } from './useBusinessProfile';
import { businessShouldBeOpen } from './utils';

const bWithSchedulesProblems = [
  'ptYK5Olovr5lSTut1Nos', // itapuama staging
  'mAJlS0yWVTgKXMvwAD3B',
  'SBGxAtt82iLhNRMKLiih',
];

export const useBusinessOpenClose = (business?: WithId<Business> | null) => {
  // context
  const { adminRole } = useContextFirebaseUser();
  const { updateBusinessProfile } = useBusinessProfile();
  const { getServerTime } = useContextServerTime();
  // handlers
  const toast = useToast();
  const checkBusinessStatus = React.useCallback(() => {
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
    const today = getServerTime();
    const shouldBeOpen = businessShouldBeOpen(today, business.schedules);
    if (business?.id && bWithSchedulesProblems.includes(business.id)) {
      Sentry.captureEvent({
        transaction: 'use-business-open-close',
        extra: {
          businessId: business.id,
          adminRole: adminRole,
          time: today,
          shouldBeOpen: shouldBeOpen,
        },
      } as Sentry.Event);
    }
    if (shouldBeOpen && business?.status === 'closed') {
      updateBusinessProfile({ status: 'open' });
    } else if (!shouldBeOpen && business?.status === 'open') {
      console.log(
        '%cFechando restaurante de acordo com horários estabelecidos.',
        'color: purple'
      );
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
    adminRole,
    business?.id,
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
    if (!adminRole) return;
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) return;
    if (!business?.schedules) return;
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
    checkBusinessStatus,
  ]);
};
