import { UserPermissionRules } from '@appjusto/types';
import { CheckboxGroup, Td, Tr } from '@chakra-ui/react';
import CustomCheckbox from 'common/components/form/CustomCheckbox';

interface EntityAccessProps {
  name: string;
  value: UserPermissionRules;
  updateAcess: (value: UserPermissionRules) => void;
}

export const EntityAccess = ({ name, value, updateAcess }: EntityAccessProps) => {
  return (
    <Tr>
      <Td>{name}</Td>
      <CheckboxGroup
        colorScheme="green"
        value={value as string[]}
        onChange={(value) => updateAcess(value as UserPermissionRules)}
      >
        <Td>
          <CustomCheckbox value="c">{'Criar'}</CustomCheckbox>
        </Td>
        <Td>
          <CustomCheckbox value="r">{'Ler'}</CustomCheckbox>
        </Td>
        <Td>
          <CustomCheckbox value="u">{'Alterar'}</CustomCheckbox>
        </Td>
        <Td>
          <CustomCheckbox value="d">{'Apagar'}</CustomCheckbox>
        </Td>
      </CheckboxGroup>
    </Tr>
  );
};
