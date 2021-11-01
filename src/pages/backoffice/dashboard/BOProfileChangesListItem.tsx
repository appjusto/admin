import { Flex, Text } from '@chakra-ui/react';
import { ProfileChange, WithId } from 'appjusto-types';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { CustomLink } from './CustomLink';

interface Props {
  changes: WithId<ProfileChange>;
}

export const BOProfileChangesListItem = ({ changes }: Props) => {
  // context
  const { url } = useRouteMatch();
  // UI
  return (
    <CustomLink to={`${url}/profile-changes/${changes?.id}`}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="sm" lineHeight="21px" color="black">
          {changes?.accountId}
        </Text>
        <Text fontSize="sm" lineHeight="21px">
          {getDateAndHour(changes?.createdOn)}
        </Text>
      </Flex>
    </CustomLink>
  );
};
