import { Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface InputCounterProps {
  max: number;
  current: number;
}

export const InputCounter = ({ max, current }: InputCounterProps) => {
  return (
    <Text mt="1" color="gray.600">
      {t(`(${current} de ${max} caracteres)`)}
    </Text>
  );
};
