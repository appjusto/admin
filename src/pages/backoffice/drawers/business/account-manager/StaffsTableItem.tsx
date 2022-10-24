import { StaffProfile, WithId } from '@appjusto/types';
import { Button, HStack, Link, Td, Text, Tr } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

interface ItemPros {
  staff: WithId<StaffProfile>;
}

export const StaffsTableItem = ({ staff }: ItemPros) => {
  // context
  const { business } = useContextBusinessBackoffice();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading, isSuccess } = updateResult;
  // state
  const [isConfirming, setIsConfirming] = React.useState(false);
  // handlers
  const handleUpdateAccountManager = () => {
    return updateBusinessProfile({ accountManagerId: staff.id });
  };
  // side effects
  React.useEffect(() => {
    if (!isSuccess) return;
    setIsConfirming(false);
  }, [isSuccess]);
  // UI
  return (
    <Tr color="black" fontSize="xs">
      <Td>
        <Link as={RouterLink} to={`/backoffice/staff/${staff.id}`}>
          {staff.email ?? 'N/E'}
        </Link>
      </Td>
      {isConfirming ? (
        <>
          <Td colSpan={2} bgColor="#FFF8F8" borderRadius="lg">
            <Text fontSize="15px" fontWeight="700">
              {t('Deseja confirmar?')}
            </Text>
            <HStack mt="2">
              <Button
                w="100%"
                size="sm"
                variant="dangerLight"
                onClick={() => setIsConfirming(false)}
              >
                {t('Não')}
              </Button>
              <Button
                w="100%"
                size="sm"
                onClick={handleUpdateAccountManager}
                isLoading={isLoading}
                loadingText={t('Confirmando...')}
              >
                {t('Sim')}
              </Button>
            </HStack>
          </Td>
        </>
      ) : (
        <>
          <Td>{staff.name ?? 'N/E'}</Td>
          <Td>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirming(true)}
            >
              {t('Definir como gerente')}
            </Button>
          </Td>
        </>
      )}
    </Tr>
  );
};
