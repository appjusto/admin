import { StaffProfile, WithId } from '@appjusto/types';
import { Td, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { phoneFormatter } from 'common/components/form/input/pattern-input/formatters';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { situationPTOptions } from '../utils';

interface StaffsTableItemProps {
  staff: WithId<StaffProfile>;
}

export const StaffsTableItem = ({ staff }: StaffsTableItemProps) => {
  // context
  const { path } = useRouteMatch();
  // state
  // UI
  return (
    <Tr key={staff.email} color="black" fontSize="sm" h="66px">
      <Td>{staff.email}</Td>
      <Td>{staff.situation ? situationPTOptions[staff.situation] : 'N/I'}</Td>
      <Td>{staff.name ?? 'N/I'}</Td>
      <Td>{staff.phone ? phoneFormatter(staff.phone) : 'N/I'}</Td>
      <Td>{getDateAndHour(staff.createdOn)}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${staff.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
