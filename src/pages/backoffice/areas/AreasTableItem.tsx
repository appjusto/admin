import { Area, WithId } from '@appjusto/types';
import { Icon } from '@chakra-ui/react';
import TableItem from 'common/components/backoffice/TableItem';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface AreasTableItemProps {
  area: WithId<Area>;
}

export const AreasTableItem = ({ area }: AreasTableItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const logisticsColor = React.useMemo(() => {
    if (!area.logistics || area.logistics === 'none') return 'gray.200';
    if (area.logistics === 'appjusto') return 'green.500';
    return '#FFBE00';
  }, [area.logistics]);
  // UI
  return (
    <TableItem
      key={area.id}
      link={`${path}/${area.id}`}
      columns={[
        { value: area.state },
        { value: area.city },
        { value: getDateAndHour(area.createdAt) },
        {
          value: area.insurance ? t('Específica') : t('Padrão'),
        },
        {
          value: (
            <Icon mt="-2px" viewBox="0 0 200 200" color={logisticsColor}>
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
