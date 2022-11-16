import { BusinessAlgolia, ProfileSituation } from '@appjusto/types';
import { Icon } from '@chakra-ui/react';
import { businessShouldBeOpen } from 'app/api/business/profile/utils';
import { useContextServerTime } from 'app/state/server-time';
import TableItem from 'common/components/backoffice/TableItem';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { situationPTOptions } from '../utils';
interface ItemProps {
  business: BusinessAlgolia;
}

type OpeningColor = 'gray.300' | 'green.500' | 'red';

export const BusinessesTableItem = ({ business }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  // states
  const [openingColor, setOpeningColor] =
    React.useState<OpeningColor>('gray.300');
  // helpers
  const status = business.situation as ProfileSituation;
  const step = business.onboarding;
  // side effects
  React.useEffect(() => {
    if (business.situation !== 'approved') return;
    if (!business.enabled) return;
    if (!business.schedules) return;
    if (business.status === 'open') {
      setOpeningColor('green.500');
      return;
    }
    const today = getServerTime();
    const shouldBeOpen = businessShouldBeOpen(today, business.schedules);
    if (shouldBeOpen) setOpeningColor('red');
  }, [
    business.situation,
    business.enabled,
    business.status,
    business.schedules,
    getServerTime,
  ]);
  //UI
  return (
    <TableItem
      key={business.objectID}
      link={`${path}/${business.objectID}`}
      columns={[
        { value: business.code ?? 'N/I', styles: { maxW: '120px' } },
        {
          value: business.createdOn
            ? getAlgoliaFieldDateAndHour(business.createdOn)
            : 'N/I',
        },
        { value: business.name ?? 'N/I' },
        { value: situationPTOptions[status] ?? 'N/I' },
        { value: step ? (step === 'completed' ? 'completo' : step) : 'N/I' },
        {
          value: (
            <Icon mt="-2px" viewBox="0 0 200 200" color={openingColor}>
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          ),
        },
      ]}
    />
  );
};
