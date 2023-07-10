import { Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface BaseDrawerStaffProps {
  staffId?: string;
  staffName?: string;
  canUpdate?: boolean;
  handleAssume(): void;
  handleRelease(): void;
  isLoading: boolean;
}

export const BaseDrawerStaff = ({
  staffId,
  staffName,
  canUpdate,
  handleAssume,
  handleRelease,
  isLoading,
}: BaseDrawerStaffProps) => {
  return (
    <Text
      mt="1"
      fontSize="15px"
      color="black"
      fontWeight="700"
      lineHeight="22px"
    >
      {t('Agente responsável:')}{' '}
      {typeof staffId === 'string' ? (
        <>
          <Text as="span" fontWeight="500">
            {staffName}
          </Text>
          {canUpdate && (
            <Text
              as="span"
              ml="2"
              fontWeight="500"
              color="red"
              textDecor="underline"
              cursor="pointer"
              onClick={handleRelease}
            >
              {isLoading ? t('(Saindo...)') : t('(Sair)')}
            </Text>
          )}
        </>
      ) : (
        <Text
          as="span"
          fontWeight="500"
          color="green.600"
          textDecor="underline"
          cursor="pointer"
          onClick={handleAssume}
        >
          {isLoading ? t('Assumindo...') : t('Assumir')}
        </Text>
      )}
    </Text>
  );
};
