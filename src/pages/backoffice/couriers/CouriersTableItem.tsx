import { CourierAlgolia, ProfileSituation } from '@appjusto/types';
import { Icon } from '@chakra-ui/react';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { situationPTOptions } from '../utils';
interface ItemProps {
  courier: CourierAlgolia;
}

export const CouriersTableItem = ({ courier }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const status = courier.situation as ProfileSituation;
  return (
    <TableItem
      key={courier.objectID}
      link={`${path}/${courier.objectID}`}
      columns={[
        { value: courier.code ?? 'N/E', styles: { maxW: '120px' } },
        {
          value: courier.createdOn
            ? getAlgoliaFieldDateAndHour(courier.createdOn)
            : 'N/I',
        },
        { value: courier.name ?? 'N/I' },
        { value: situationPTOptions[status] ?? 'N/I' },
        {
          value: (
            <Icon
              mt="-2px"
              viewBox="0 0 200 200"
              color={courier?.status === 'available' ? 'green.500' : 'gray.50'}
            >
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          ),
          styles: { textAlign: 'center' },
        },
      ]}
    />
  );
};
