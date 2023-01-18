import { Box, Text, Tooltip } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface OrderCodeBoxProps {
  code?: string;
  hasIssues?: boolean;
}

export const OrderCodeBox = ({ code, hasIssues }: OrderCodeBoxProps) => {
  // UI
  if (hasIssues) {
    return (
      <Tooltip
        placement="top"
        label={t('Problema reportado')}
        bgColor="white"
        color="red"
      >
        <Box>
          <Text
            fontSize="lg"
            fontWeight="700"
            color={hasIssues ? 'red' : 'black'}
          >
            #{code ?? 'N/E'}
          </Text>
        </Box>
      </Tooltip>
    );
  }
  return (
    <Text fontSize="lg" fontWeight="700" color={hasIssues ? 'red' : 'black'}>
      #{code ?? 'N/E'}
    </Text>
  );
};
