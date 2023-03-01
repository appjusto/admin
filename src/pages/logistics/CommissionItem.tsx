import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface CommissionItemProps {
  fee: string;
  highlight?: boolean;
}

export const CommissionItem = ({ fee, highlight }: CommissionItemProps) => {
  return (
    <Flex mt="6">
      <Box minW="48px">
        <Center
          w="46px"
          h="46px"
          bgColor={highlight ? 'green.500' : 'gray.500'}
          borderRadius="23px"
          fontWeight="700"
        >
          {fee}
        </Center>
      </Box>
      <Box ml="4">
        <Text fontSize="16px" fontWeight="700">
          {t('Comissão AppJusto')}
        </Text>
        <Text fontSize="16px">
          {t('Taxa de comissão sobre pedidos pagos pelo AppJusto')}
        </Text>
      </Box>
    </Flex>
  );
};
