import { Box, Button, ButtonProps, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { Complement, ComplementGroup, WithId } from 'appjusto-types';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { GroupBox } from './GroupBox';

interface ItemsQuantityBoxProps extends ButtonProps {
  label: string;
  value: number;
  increment(): void;
  decrement(): void;
}

const ItemsQuantityBox = ({
  label,
  value,
  increment,
  decrement,
  mt,
  mb,
  ml,
  mr,
}: ItemsQuantityBoxProps) => {
  const boxProps = { mt, mb, ml, mr };
  return (
    <Box {...boxProps}>
      <Text>{label}</Text>
      <Flex flexDir="row" alignItems="center">
        <Button maxW="48px" fontSize="3xl" variant="outline" onClick={decrement}>
          -
        </Button>
        <Text fontSize="md" mx="2">
          {value}
        </Text>
        <Button maxW="48px" fontSize="3xl" variant="outline" onClick={increment}>
          +
        </Button>
      </Flex>
    </Box>
  );
};

interface GroupDrawerProps {
  onSaveGroup(group: ComplementGroup): void;
  groups: WithId<ComplementGroup>[];
  complements: WithId<Complement>[];
}

export const GroupDrawer = ({ groups, complements, onSaveGroup }: GroupDrawerProps) => {
  const [hasComplements, setHasComplements] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [isRequired, setIsRequired] = React.useState(false);
  const [min, setMin] = React.useState(0);
  const [max, setMax] = React.useState(0);

  React.useEffect(() => {
    if (groups?.length > 0) {
      setHasComplements(true);
    }
  }, [groups, complements]);

  //handlers
  const handleNext = () => {
    const newGroup = {
      name: groupName,
      required: isRequired,
      minimum: min,
      maximum: max,
    };
    onSaveGroup(newGroup);
  };

  return (
    <>
      <Text fontSize="xl" color="black">
        {t('Esse item possui complementos?')}
      </Text>
      <RadioGroup
        onChange={(value) => setHasComplements(value === '1' ? false : true)}
        value={hasComplements ? '2' : '1'}
        defaultValue="1"
        colorScheme="green"
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="1">
            {t('Não possui')}
          </Radio>
          <Radio mt="2" value="2">
            {t('Sim, possui complementos')}
          </Radio>
        </Flex>
      </RadioGroup>
      {groups?.length > 0 && groups.map((group) => <GroupBox group={group} />)}
      {hasComplements && (
        <>
          <Stack mt="8" mb="10" spacing={4} direction="row">
            <Button width="full" color="black" fontSize="15px">
              {t('Criar novo grupo de complementos')}
            </Button>
            <Button width="full" variant="outline" color="black" fontSize="15px">
              {t('Associar com grupo existente')}
            </Button>
          </Stack>
          <Text fontSize="xl" fontWeight="700" color="black">
            {t('Novo grupo de complementos')}
          </Text>
          <Input
            id="complements-group-name"
            label="Grupo de complementos"
            placeholder="Nome da grupo"
            value={groupName}
            handleChange={(ev) => setGroupName(ev.target.value)}
          />
          <Text mt="8" fontSize="xl" color="black">
            {t('Obrigatoriedade')}
          </Text>
          <Text fontSize="sm">{t('Esse grupo é necessário para o pedido do prato?')}</Text>
          <RadioGroup
            onChange={(value) => setIsRequired(value === '1' ? false : true)}
            value={isRequired ? '2' : '1'}
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
          <Text fontSize="sm">{t('Quantos itens podem ser selecionados?')}</Text>
          <Flex mt="4" flexDir="row" justifyContent="flex-start">
            <ItemsQuantityBox
              label={t('Mínimo')}
              mr="14"
              value={min}
              increment={() => setMin((prev) => prev + 1)}
              decrement={() => setMin((prev) => (prev > 0 ? prev - 1 : 0))}
            />
            <ItemsQuantityBox
              label={t('Máximo')}
              value={max}
              increment={() => setMax((prev) => prev + 1)}
              decrement={() => setMax((prev) => (prev > 0 ? prev - 1 : 0))}
            />
          </Flex>
          <Box mt="10">
            <Button w="full" maxW="220px" fontSize="sm" onClick={handleNext}>
              {t('Avançar')}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};
