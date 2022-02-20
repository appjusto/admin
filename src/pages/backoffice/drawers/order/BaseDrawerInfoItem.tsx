import { Text } from '@chakra-ui/react';
import React from 'react';

interface BaseDrawerInfoItemProps {
  label: string;
  value: string;
}

export const BaseDrawerInfoItem = ({ label, value }: BaseDrawerInfoItemProps) => {
  // UI
  return (
    <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
      {label}{' '}
      <Text as="span" fontWeight="500">
        {value}
      </Text>
    </Text>
  );
};
