import { Box, Flex, Heading, HStack, Text, TextProps } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import packageInfo from '../../package.json';
import { EnvBadge } from './EnvBadge';
const version = packageInfo.version;

interface Props extends TextProps {
  title: string;
  subtitle?: string;
  showVersion?: boolean;
}

const PageHeader = ({ title, subtitle, showVersion, ...props }: Props) => {
  // UI
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading color="black" fontSize="2xl" mt="4" {...props}>
          {title}
        </Heading>
        {showVersion && (
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
        )}
      </Flex>
      {subtitle && (
        <Text mt="1" fontSize="sm" maxW="580px" {...props}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
};

export default PageHeader;
