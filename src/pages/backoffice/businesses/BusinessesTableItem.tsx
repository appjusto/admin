import { Icon, Td, Tr } from '@chakra-ui/react';
import { businessShouldBeOpen } from 'app/api/business/profile/utils';
import { useContextServerTime } from 'app/state/server-time';
import { BusinessAlgolia, ProfileSituation } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { situationPTOptions } from '../utils';
interface ItemProps {
  business: BusinessAlgolia;
}

type OpeningColor = 'gray.50' | 'green.500' | 'red';

export const BusinessesTableItem = ({ business }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  // states
  const [openingColor, setOpeningColor] = React.useState<OpeningColor>('gray.50');
  // helpers
  const status = business.situation as ProfileSituation;
  const step = business.onboarding;
  // side effects
  React.useEffect(() => {
    if (business.situation !== 'approved') return;
    if (!business.enabled) return;
    if (!business.schedules) return;
    console.log(business.name, business.status);
    if (business.status === 'open') {
      setOpeningColor('green.500');
      return;
    }
    const today = getServerTime();
    const shouldBeOpen = businessShouldBeOpen(today, business.schedules);
    if (shouldBeOpen) setOpeningColor('red');
  }, [business.situation, business.enabled, business.status, business.schedules, getServerTime]);
  //UI
  return (
    <Tr key={business.objectID} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{business.code ?? 'N/I'}</Td>
      <Td>{business.createdOn ? getAlgoliaFieldDateAndHour(business.createdOn) : 'N/I'}</Td>
      <Td>{business.name ?? 'N/I'}</Td>
      <Td>{situationPTOptions[status] ?? 'N/I'}</Td>
      <Td>{step ? (step === 'completed' ? 'completo' : step) : 'N/I'}</Td>
      <Td textAlign="center">
        <Icon mt="-2px" viewBox="0 0 200 200" color={openingColor}>
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      </Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${business.objectID}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
