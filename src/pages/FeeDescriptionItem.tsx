import { Box, Flex, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface FeeDescriptionItemProps {
  fee: number;
  isDisabled?: boolean;
}

export const FeeDescriptionItem = ({
  fee,
  isDisabled,
}: FeeDescriptionItemProps) => {
  return (
    <Flex mt="4">
      <Box color={isDisabled ? 'gray.500' : 'black'}>
        <Text fontSize="20px" fontWeight="700">
          {`${fee}%`}
          <Text as="span" fontSize="16px" fontWeight="500">
            {t(' de comissão AppJusto + gateway, sobre o valor dos pedidos')}
          </Text>
        </Text>
        <Text mt="4" fontSize="16px" fontWeight="700">
          {t('O AppJusto não cobra mensalidade!')}
        </Text>
      </Box>
    </Flex>
  );
};
