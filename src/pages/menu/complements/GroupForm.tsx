import { Box, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { ComplementGroup, WithId } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { DrawerButtons } from '../drawers/DrawerButtons';
import { ItemsQtdButtons } from './ItemQtdButtons';

interface GroupFormProps {
  atDrawer?: boolean;
  groupId: string;
  groupData?: WithId<ComplementGroup>;
  onSuccess(): void;
}

export const GroupForm = ({ atDrawer = false, groupId, groupData, onSuccess }: GroupFormProps) => {
  // context
  const {
    updateComplementsGroup,
    updateGroupResult,
    deleteComplementsGroup,
    deleteGroupResult,
  } = useContextMenu();
  const { isLoading } = updateGroupResult;
  // state
  const [name, setName] = React.useState('');
  const [required, setRequired] = React.useState(false);
  const [minimum, setMin] = React.useState(0);
  const [maximum, setMax] = React.useState(1);
  const [error, setError] = React.useState(initialError);

  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  const submission = React.useRef(0);

  // helpers
  const minimumValue = required ? 1 : 0;

  //handler
  const handleIsRequired = (value: string) => {
    if (value === '1') {
      setRequired(false);
      setMin(0);
    } else if (value === '2') {
      setRequired(true);
      if (minimum === 0) setMin(1);
      if (maximum === 0) setMax(1);
    }
  };

  const handleMaxAndMin = (field: string, action: string) => {
    if (field === 'min') {
      if (action === 'inc') {
        setMin((prev) => {
          if (maximum < prev + 1) setMax(prev + 1);
          return prev + 1;
        });
      } else if (action === 'dec') {
        setMin((prev) => (prev > minimumValue ? prev - 1 : prev));
      }
    }
    if (field === 'max') {
      if (action === 'inc') setMax((prev) => prev + 1);
      else if (action === 'dec') setMax((prev) => (prev > 1 && prev > minimum ? prev - 1 : prev));
    }
  };

  const handleSubmit = async () => {
    submission.current += 1;
    const newGroup = {
      name,
      required,
      minimum,
      maximum,
    };
    await updateComplementsGroup({ groupId: groupData?.id, changes: newGroup });
    onSuccess();
  };

  const handleDelete = async () => {
    submission.current += 1;
    if (groupId === 'new') return;
    await deleteComplementsGroup(groupId);
    onSuccess();
  };

  // side effects
  React.useEffect(() => {
    inputRef?.current?.focus();
    if (groupData) {
      setName(groupData?.name);
      setRequired(groupData?.required);
      setMax(groupData?.maximum);
      setMin(groupData?.minimum);
    }
  }, [groupData]);

  React.useEffect(() => {
    if (updateGroupResult.isError) {
      setError({
        status: true,
        error: updateGroupResult.error,
      });
    } else if (deleteGroupResult?.isError) {
      setError({
        status: true,
        error: deleteGroupResult?.error,
      });
    }
  }, [
    updateGroupResult.isError,
    updateGroupResult.error,
    deleteGroupResult?.isError,
    deleteGroupResult?.error,
  ]);

  // UI
  return (
    <Box>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}
      >
        {!atDrawer && (
          <Text fontSize="xl" fontWeight="700" color="black">
            {t('Novo grupo de complementos')}
          </Text>
        )}
        <Input
          ref={inputRef}
          isRequired
          id="complements-group-name"
          label="Grupo de complementos"
          placeholder="Nome da grupo"
          value={name}
          handleChange={(ev) => setName(ev.target.value)}
        />
        <Text mt="8" fontSize="xl" color="black">
          {t('Obrigatoriedade')}
        </Text>
        <Text fontSize="sm">{t('Esse grupo é necessário para o pedido do prato?')}</Text>
        <RadioGroup
          onChange={(value) => handleIsRequired(value as string)}
          value={required ? '2' : '1'}
          defaultValue="1"
          colorScheme="green"
          color="black"
        >
          <Flex mt="2" flexDir="column" justifyContent="flex-start">
            <Radio mt="2" value="1">
              {t('Opcional: o cliente pode ou não selecionar itens desse grupo')}
            </Radio>
            <Radio mt="2" value="2">
              {t('Obrigatório: o cliente deve selecionar 1 ou mais itens desse grupo')}
            </Radio>
          </Flex>
        </RadioGroup>
        <Text mt="8" fontSize="xl" color="black">
          {t('Quantidade')}
        </Text>
        <Text fontSize="sm">{t('Quantos itens podem ser selecionados pelos clientes?')}</Text>
        <Flex mt="4" flexDir="row" justifyContent="flex-start">
          <ItemsQtdButtons
            isDisabled={!required}
            label={t('Mínimo')}
            mr="14"
            value={minimum}
            increment={() => handleMaxAndMin('min', 'inc')}
            decrement={() => handleMaxAndMin('min', 'dec')}
          />
          <ItemsQtdButtons
            label={t('Máximo')}
            value={maximum}
            increment={() => handleMaxAndMin('max', 'inc')}
            decrement={() => handleMaxAndMin('max', 'dec')}
          />
        </Flex>
        <DrawerButtons
          type="grupo"
          isEditing={groupId !== 'new'}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </form>
      <SuccessAndErrorHandler
        submission={submission.current}
        isError={error.status}
        error={error.error}
      />
    </Box>
  );
};