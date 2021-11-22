import { Button, HStack, Td, Text, Tr } from '@chakra-ui/react';
import { useFlaggedLocations } from 'app/api/platform/useFlaggedLocations';
import { FlaggedLocationsAlgolia } from 'appjusto-types';
import React from 'react';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface FlaggedLocationsTableItemProps {
  location: FlaggedLocationsAlgolia;
  refetch(): void;
}

export const FlaggedLocationsTableItem = ({
  location,
  refetch,
}: FlaggedLocationsTableItemProps) => {
  // context
  const { deleteFlaggedLocation, deleteFlaggedLocationResult } = useFlaggedLocations();
  const { isLoading, isSuccess } = deleteFlaggedLocationResult;
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  // side effects
  React.useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);
  // UI
  return (
    <Tr
      key={location.objectID}
      color="black"
      fontSize="15px"
      lineHeight="21px"
      bgColor={isDeleting ? 'rgb(254, 215, 215)' : 'white'}
    >
      <Td>{getAlgoliaFieldDateAndHour(location.date_timestamp)}</Td>
      <Td>{location.description}...</Td>
      {isDeleting ? (
        <Td minW={{ base: '100%', lg: '400px' }}>
          <Text>{t('Tem certeza que deseja remover este endereço?')}</Text>
          <HStack mt="2">
            <Button w="100%" size="sm" onClick={() => setIsDeleting(false)}>
              {t('Manter')}
            </Button>
            <Button
              w="100%"
              variant="danger"
              size="sm"
              onClick={() => deleteFlaggedLocation(location.objectID)}
              isLoading={isLoading}
              loadingText={t('Removendo')}
            >
              {t('Remover')}
            </Button>
          </HStack>
        </Td>
      ) : (
        <Td>
          <Button mt="0" variant="dangerLight" size="sm" onClick={() => setIsDeleting(true)}>
            {t('Remover')}
          </Button>
        </Td>
      )}
    </Tr>
  );
};
