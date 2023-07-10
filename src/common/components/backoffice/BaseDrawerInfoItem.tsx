import { Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface BaseDrawerInfoItemProps {
  label: string;
  value: string;
  valueLink?: string;
}

export const BaseDrawerInfoItem = ({
  label,
  value,
  valueLink,
}: BaseDrawerInfoItemProps) => {
  // UI
  return (
    <Text
      mt="1"
      fontSize="15px"
      color="black"
      fontWeight="700"
      lineHeight="22px"
    >
      {label}{' '}
      {valueLink ? (
        <Link as={RouterLink} to={valueLink}>
          <Text as="span" fontWeight="500">
            {value}
          </Text>
        </Link>
      ) : (
        <Text as="span" fontWeight="500">
          {value}
        </Text>
      )}
    </Text>
  );
};
