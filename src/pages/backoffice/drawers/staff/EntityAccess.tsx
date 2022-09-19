import { UserPermissionRules } from '@appjusto/types';
import { Checkbox, CheckboxGroup, Td, Tr } from '@chakra-ui/react';

interface EntityAccessProps {
  name: string;
  value: UserPermissionRules;
  updateAcess: (value: UserPermissionRules) => void;
}

export const EntityAccess = ({
  name,
  value,
  updateAcess,
}: EntityAccessProps) => {
  return (
    <Tr>
      <Td>{name}</Td>
      <CheckboxGroup
        colorScheme="green"
        value={value as string[]}
        onChange={(value) => updateAcess(value as UserPermissionRules)}
      >
        <Td>
          <Checkbox value="c">{'Criar'}</Checkbox>
        </Td>
        <Td>
          <Checkbox value="r">{'Ler'}</Checkbox>
        </Td>
        <Td>
          <Checkbox value="u">{'Alterar'}</Checkbox>
        </Td>
        <Td>
          <Checkbox value="d">{'Apagar'}</Checkbox>
        </Td>
      </CheckboxGroup>
    </Tr>
  );
};
