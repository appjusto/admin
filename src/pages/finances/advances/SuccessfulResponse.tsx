import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { FinancesBaseDrawer } from '../FinancesBaseDrawer';

interface SuccessfullResponseProps {
  isOpen: boolean;
  onClose(): void;
  receivedValue?: number;
}

export const SuccessfullResponse = ({
  receivedValue,
  onClose,
  ...props
}: SuccessfullResponseProps) => {
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Antecipação dos valores')}
      isReviewing
      {...props}
    >
      <Flex w="100%" h="100%" flexDir="column" justifyContent="center">
        <Box>
          <Icon as={Checked} w="36px" h="36px" />
          <Text
            mt="2"
            fontSize="24px"
            fontWeight="500"
            lineHeight="30px"
            color="black"
          >
            {t('Antecipação realizada com sucesso!')}
          </Text>
          <Text mt="1" fontSize="18px" fontWeight="500" lineHeight="26px">
            {t(
              `Em até 1 dia útil o valor de ${formatCurrency(
                receivedValue!
              )} estará disponível para saque.`
            )}
          </Text>
        </Box>
      </Flex>
    </FinancesBaseDrawer>
  );
};
