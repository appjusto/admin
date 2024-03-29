import { ProfileChange, WithId } from '@appjusto/types';
import { Flex, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { CustomLink } from './CustomLink';

interface Props {
  changes: WithId<ProfileChange>;
}

export const BOProfileChangesListItem = ({ changes }: Props) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { url } = useRouteMatch();
  // UI
  return (
    <CustomLink
      display={userAbility?.can('read', `${changes.userType}s`) ? 'inline-block' : 'none'}
      to={`${url}/profile-changes/${changes?.id}`}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="sm" lineHeight="21px" color="black" maxW={{ base: '200px', lg: '260px' }}>
          {changes?.accountId}
        </Text>
        <Text fontSize="sm" lineHeight="21px">
          {getDateAndHour(changes?.createdOn)}
        </Text>
      </Flex>
    </CustomLink>
  );
};
