import { As, Box, BoxProps, Button, Icon, Skeleton, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';

interface BasicInfoBoxProps extends BoxProps {
  label: string;
  icon: As<any> | undefined;
  value?: string | null;
  btnLabel?: string;
  btnVariant?: string;
  btnLink?: string;
  btnFunction?(): void;
  isLoading?: boolean;
  btnWarning?: string;
}

export const BasicInfoBox = ({
  label,
  icon,
  value,
  btnLabel,
  btnVariant,
  btnLink,
  btnFunction,
  isLoading,
  btnWarning,
  ...props
}: BasicInfoBoxProps) => {
  return (
    <Box
      w={{ lg: '328px' }}
      minH={{ lg: '99px' }}
      border="1px solid #F6F6F6"
      borderRadius="lg"
      p="4"
      {...props}
    >
      <Text fontSize="15px" fontWeight="500" lineHeight="21px">
        <Icon as={icon} mb="1" mr="2" />
        {label}
      </Text>
      {value === undefined ? (
        <Skeleton mt="1" height="30px" colorScheme="#9AA49C" />
      ) : value === null ? (
        <Text mt="2" fontSize="36px" fontWeight="500" lineHeight="30px">
          'N/E'
        </Text>
      ) : (
        <Text mt="2" fontSize="36px" fontWeight="500" lineHeight="30px">
          {value}
        </Text>
      )}
      {btnLabel && btnLink && (
        <CustomButton
          mt="4"
          w="100%"
          fontSize="15px"
          lineHeight="21px"
          link={btnLink}
          label={btnLabel}
          variant={btnVariant}
          //onClick={btnFunction}
        />
      )}
      {btnLabel && btnFunction && (
        <Button
          mt="4"
          w="100%"
          fontSize="15px"
          lineHeight="21px"
          onClick={btnFunction}
          isLoading={isLoading}
          loadingText={btnLabel}
        >
          {btnLabel}
        </Button>
      )}
      {btnWarning && (
        <Text mt="2" fontSize="13px" fontWeight="500" lineHeight="18px" textAlign="center">
          {btnWarning}
        </Text>
      )}
    </Box>
  );
};
