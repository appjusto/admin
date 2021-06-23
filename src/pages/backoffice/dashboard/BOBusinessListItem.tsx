import { Flex, Text } from '@chakra-ui/react';
import { Business, WithId } from 'appjusto-types';
import firebase from 'firebase';
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
          {business?.createdOn &&
            getDateAndHour(business?.createdOn as firebase.firestore.Timestamp)}
        </Text>
      </Flex>
    </CustomLink>
  );
};
