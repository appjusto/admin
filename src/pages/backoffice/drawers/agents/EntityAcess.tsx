import { CheckboxGroup, HStack, Text } from '@chakra-ui/react';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { AcessArray } from './types';

interface EntityAcessProps {
  name: string;
  value: AcessArray;
  updateAcess: (value: AcessArray) => void;
}

export const EntityAcess = ({ name, value, updateAcess }: EntityAcessProps) => {
  return (
    <CheckboxGroup
      colorScheme="green"
      value={value as string[]}
      onChange={(value) => updateAcess(value as AcessArray)}
    >
      <HStack mt="4" spacing={4}>
        <Text fontSize="18px" color="black" fontWeight="500" lineHeight="22px" minW="122px">
          {name}:
        </Text>
        <CustomCheckbox value="read">{'Ler'}</CustomCheckbox>
        <CustomCheckbox value="write">{'Escrever'}</CustomCheckbox>
      </HStack>
    </CheckboxGroup>
  );
};
