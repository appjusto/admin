import { Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { ItemsQtdButtons } from '../complements/ItemQtdButtons';
import { DrawerButtons } from '../drawers/DrawerButtons';
import { BaseDrawer } from './BaseDrawer';

type RequiredOptions = 'Obrigatório' | 'Opcional';
interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  groupId: string;
};

export const GroupDrawer = ({ onClose, ...props }: Props) => {
  //context
  const { groupId } = useParams<Params>();
  const {
    getComplementsGroupById,
    isProductsPage,
    setIsProductPage,
    updateComplementsGroup,
    updateGroupResult,
    deleteComplementsGroup,
    deleteGroupResult,
  } = useContextMenu();
  const { isLoading } = updateGroupResult;
  // state
  const group = getComplementsGroupById(groupId);
  const [name, setName] = React.useState('');
  const [required, setRequired] = React.useState(false);
  const [minimum, setMin] = React.useState(0);
  const [maximum, setMax] = React.useState(1);
  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const minimumValue = required ? 1 : 0;
  //handler
  const handleIsRequired = (value: RequiredOptions) => {
    if (value === 'Opcional') {
      setRequired(false);
      setMin(0);
    } else if (value === 'Obrigatório') {
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
      else if (action === 'dec')
        setMax((prev) => (prev > 1 && prev > minimum ? prev - 1 : prev));
    }
  };
  const handleSubmit = async () => {
    const newGroup = {
      name,
      required,
      minimum,
      maximum,
    };
    await updateComplementsGroup({ groupId: group?.id, changes: newGroup });
    onClose();
  };
  const handleDelete = async () => {
    if (groupId === 'new') return;
    await deleteComplementsGroup(groupId);
    onClose();
  };
  // side effects
  React.useEffect(() => {
    if (isProductsPage) setIsProductPage(false);
  }, [isProductsPage, setIsProductPage]);
  React.useEffect(() => {
    inputRef?.current?.focus();
    if (group) {
      setName(group?.name);
      setRequired(group?.required);
      setMax(group?.maximum);
      setMin(group?.minimum);
    }
  }, [group]);
  // UI
  return (
    <BaseDrawer
      title={groupId === 'new' ? t('Adicionar grupo') : t('Editar grupo')}
      onSubmitHandler={handleSubmit}
      footer={() => (
        <DrawerButtons
          type="grupo"
          isEditing={groupId !== 'new'}
          onDelete={handleDelete}
          isLoading={isLoading}
          deletingLoading={deleteGroupResult.isLoading}
        />
      )}
      onClose={onClose}
      {...props}
    >
      <Text fontSize="xl" fontWeight="700" color="black">
        {t('Novo grupo de complementos')}
      </Text>
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
      <Text fontSize="sm">
        {t('Esse grupo é necessário para o pedido do prato?')}
      </Text>
      <RadioGroup
        onChange={(value) => handleIsRequired(value as RequiredOptions)}
        value={required ? 'Obrigatório' : 'Opcional'}
        defaultValue="1"
        colorScheme="green"
        color="black"
      >
        <Flex mt="2" flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="Opcional">
            {t('Opcional: o cliente pode ou não selecionar itens desse grupo')}
          </Radio>
          <Radio mt="2" value="Obrigatório">
            {t(
              'Obrigatório: o cliente deve selecionar 1 ou mais itens desse grupo'
            )}
          </Radio>
        </Flex>
      </RadioGroup>
      <Text mt="8" fontSize="xl" color="black">
        {t('Quantidade')}
      </Text>
      <Text fontSize="sm">
        {t('Quantos itens podem ser selecionados pelos clientes?')}
      </Text>
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
    </BaseDrawer>
  );
};
