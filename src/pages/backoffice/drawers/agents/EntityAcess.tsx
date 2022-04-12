import { CheckboxGroup, Td, Tr } from '@chakra-ui/react';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { AcessArray } from './types';

interface EntityAcessProps {
  name: string;
  value: AcessArray;
  updateAcess: (value: AcessArray) => void;
}

export const EntityAcess = ({ name, value, updateAcess }: EntityAcessProps) => {
  return (
    <Tr>
      <Td>{name}</Td>
      <CheckboxGroup
        colorScheme="green"
        value={value as string[]}
        onChange={(value) => updateAcess(value as AcessArray)}
      >
        <Td>
          <CustomCheckbox value="read">{'Ler'}</CustomCheckbox>
        </Td>
        <Td>
          <CustomCheckbox value="write">{'Escrever'}</CustomCheckbox>
        </Td>
      </CheckboxGroup>
    </Tr>
  );
};
