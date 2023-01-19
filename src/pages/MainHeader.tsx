import { Box, Flex, FlexProps, HStack, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import packageInfo from '../../package.json';
import { EnvBadge } from './EnvBadge';
import BusinessInfo from './sidebar/BusinessInfo';
const version = packageInfo.version;

const MainHeader = (props: FlexProps) => {
  // UI
  return (
    <Box
      position="fixed"
      top="0"
      pt={{ base: '80px', lg: '4' }}
      w="100%"
      pr="32px"
      bgColor="white"
      zIndex="1200"
      {...props}
    >
      <Flex
        justifyContent={{ base: 'flex-end', lg: 'space-between' }}
        alignItems="flex-start"
        borderBottom="1px solid #EEEEEE"
        pb="4"
        // mb="6"
      >
        <BusinessInfo display={{ base: 'none', lg: 'initial' }} />
        <HStack alignItems="flex-start" minW="84px">
          <Text
            fontSize="11px"
            lineHeight="18px"
            fontWeight="700"
            letterSpacing="0.6px"
          >
            {t(`VERSÃO: ${version ?? 'N/E'}`)}
          </Text>
          <EnvBadge />
        </HStack>
      </Flex>
    </Box>
  );
};

export default MainHeader;
