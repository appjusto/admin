import { BackofficeAccessRules } from '@appjusto/types';
import { CheckboxGroup, Td, Tr } from '@chakra-ui/react';
import CustomCheckbox from 'common/components/form/CustomCheckbox';

interface EntityAcessProps {
  name: string;
  value: BackofficeAccessRules;
  updateAcess: (value: BackofficeAccessRules) => void;
}

export const EntityAcess = ({ name, value, updateAcess }: EntityAcessProps) => {
  return (
    <Tr>
      <Td>{name}</Td>
      <CheckboxGroup
        colorScheme="green"
        value={value as string[]}
        onChange={(value) => updateAcess(value as BackofficeAccessRules)}
      >
        <Td>
          <CustomCheckbox value="read">{'Ler'}</CustomCheckbox>
        </Td>
        <Td>
          <CustomCheckbox value="write">{'Escrever'}</CustomCheckbox>
        </Td>
        <Td>
          <CustomCheckbox value="delete">{'Apagar'}</CustomCheckbox>
        </Td>
      </CheckboxGroup>
    </Tr>
  );
};
