import {
  Box,
  BoxProps,
  HStack,
  Icon,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { MdClose, MdInfoOutline } from 'react-icons/md';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface ReviewBoxProps extends BoxProps {
  label: string;
  valueToDisplay?: number | null;
  signal?: '+' | '-';
  isInfo?: boolean;
  description?: string[];
  showInfoDefault?: boolean;
}

export const ReviewBox = ({
  label,
  valueToDisplay,
  signal = '+',
  isInfo,
  description,
  showInfoDefault = false,
  ...props
}: ReviewBoxProps) => {
  // state
  const [showInfo, setShowInfo] = React.useState(false);
  // side effects
  React.useEffect(() => {
    if (!showInfoDefault) return;
    setShowInfo(showInfoDefault);
  }, [showInfoDefault]);
  // UI
  return (
    <Box mt="4" {...props}>
      <HStack>
        <Text fontSize="15px" fontWeight="500" lineHeight="21px">
          {label}
        </Text>
        {isInfo && (
          <Tooltip label={t('Clique para saber mais')} placement="top">
            <Box>
              <Icon
                as={MdInfoOutline}
                cursor="pointer"
                onClick={() => setShowInfo((prev) => !prev)}
              />
            </Box>
          </Tooltip>
        )}
      </HStack>
      {valueToDisplay === undefined ? (
        <Skeleton mt="1" maxW="294px" height="30px" colorScheme="#9AA49C" />
      ) : valueToDisplay === null ? (
        'N/E'
      ) : (
        <Text
          fontSize="24px"
          fontWeight="500"
          lineHeight="30px"
          color={signal === '+' ? 'green.700' : 'red'}
        >
          {`${signal} ${formatCurrency(valueToDisplay)}`}
        </Text>
      )}
      {showInfo && (
        <Box
          mt="4"
          p="4"
          pr="8"
          bgColor="gray.100"
          borderRadius="lg"
          position="relative"
        >
          {!showInfoDefault && (
            <Icon
              as={MdClose}
              position="absolute"
              top="2"
              right="2"
              cursor="pointer"
              color="gray.500"
              onClick={() => setShowInfo(false)}
            />
          )}
          {description &&
            description.map((info, index) => {
              return (
                <Text key={info} mt={index !== 0 ? '2' : '0'} fontSize="15px">
                  {info ?? 'N/E'}
                </Text>
              );
            })}
        </Box>
      )}
    </Box>
  );
};
