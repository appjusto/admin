import { Business, WithId } from '@appjusto/types';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { CustomLink } from './CustomLink';

interface Props {
  business: WithId<Business>;
}

export const BOBusinessListItem = ({ business }: Props) => {
  // context
  const { url } = useRouteMatch();
  // UI
  return (
    <CustomLink to={`${url}/business/${business?.id}`}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="sm" lineHeight="21px" color="black">
          {business?.name}
        </Text>
        <Text fontSize="sm" lineHeight="21px">
          {getDateAndHour(business?.createdOn)}
        </Text>
      </Flex>
    </CustomLink>
  );
};
