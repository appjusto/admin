import { Badge, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface FilterProps {
  isActive: boolean;
  label: string;
  onClick(): void;
  isAlert?: boolean;
}

export const FilterText = ({
  isActive,
  label,
  onClick,
  isAlert,
  ...props
}: FilterProps) => {
  return (
    <Text
      pb="2"
      px="4"
      fontSize="16px"
      lineHeight="24px"
      fontWeight="500"
      _hover={{ textDecor: 'none' }}
      _focus={{ boxShadow: 'none' }}
      borderBottom={isActive ? '4px solid #78E08F' : 'none'}
      cursor="pointer"
      onClick={onClick}
      aria-label={`nav-${label}`}
      {...props}
    >
      {label}
      {isAlert && (
        <Badge
          mt="-2"
          ml="2"
          px="8px"
          py="2px"
          bgColor="#FFBE00"
          color="black"
          borderRadius="16px"
          fontSize="11px"
          lineHeight="18px"
          fontWeight="700"
        >
          {t('PENDENTE')}
        </Badge>
      )}
    </Text>
  );
};
