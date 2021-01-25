import { Box, Button, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { ItemsQtdButtons } from './ItemQtdButtons';

export type NewGroup = {
  name: string;
  required: boolean;
  maximum: number;
  minimum: number;
};

interface GroupFormProps {
  submitGroup(group: NewGroup): void;
  isCreate?: boolean;
  isLoading?: boolean;
  groupData?: NewGroup;
  onSuccess(): void;
}

export const GroupForm = ({
  submitGroup,
  isCreate = false,
  isLoading = false,
  groupData,
  onSuccess,
}: GroupFormProps) => {
  const [name, setName] = React.useState('');
  const [required, setRequired] = React.useState(false);
  const [minimum, setMin] = React.useState(0);
  const [maximum, setMax] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef?.current?.focus();
    if (!isCreate && groupData) {
      setName(groupData?.name);
      setRequired(groupData?.required);
      setMax(groupData?.maximum);
      setMin(groupData?.minimum);
    }
  }, [isCreate, groupData]);

  //handler
  const handleSubmit = () => {
    const newGroup = {
      name,
      required,
      minimum,
      maximum,
    };
    submitGroup(newGroup);
    onSuccess();
  };

  if (isCreate) {
    return (
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}
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
        <Text fontSize="sm">{t('Esse grupo é necessário para o pedido do prato?')}</Text>
        <RadioGroup
          onChange={(value) => setRequired(value === '1' ? false : true)}
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
        <Text fontSize="sm">{t('Quantos itens podem ser selecionados?')}</Text>
        <Flex mt="4" flexDir="row" justifyContent="flex-start">
          <ItemsQtdButtons
            label={t('Mínimo')}
            mr="14"
            value={minimum}
            increment={() => setMin((prev) => prev + 1)}
            decrement={() => setMin((prev) => (prev > 0 ? prev - 1 : 0))}
          />
          <ItemsQtdButtons
            label={t('Máximo')}
            value={maximum}
            increment={() => setMax((prev) => prev + 1)}
            decrement={() => setMax((prev) => (prev > 0 ? prev - 1 : 0))}
          />
        </Flex>
        <Box mt="10">
          <Button
            type="submit"
            w="full"
            maxW="220px"
            fontSize="sm"
            isLoading={isLoading}
            loadingText={t('Salvando')}
          >
            {t('Criar grupo')}
          </Button>
        </Box>
      </form>
    );
  }
  return (
    <Box p="2" bg="gray.50">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          ref={inputRef}
          isRequired
          mt="0"
          id="complements-group-name"
          label="Grupo de complementos"
          placeholder="Nome da grupo"
          value={name}
          handleChange={(ev) => setName(ev.target.value)}
        />
        <Flex mt="2" flexDir="row" justifyContent="space-between">
          <RadioGroup
            onChange={(value) => setRequired(value === '1' ? false : true)}
            value={required ? '2' : '1'}
            defaultValue="1"
            colorScheme="green"
            color="black"
          >
            <Flex mt="2" flexDir="column" justifyContent="flex-start">
              <Radio mt="2" value="1">
                {t('Opcional')}
              </Radio>
              <Radio mt="2" value="2">
                {t('Obrigatório')}
              </Radio>
            </Flex>
          </RadioGroup>
          <ItemsQtdButtons
            label={t('Mínimo')}
            value={minimum}
            increment={() => setMin((prev) => prev + 1)}
            decrement={() => setMin((prev) => (prev > 0 ? prev - 1 : 0))}
          />
          <ItemsQtdButtons
            label={t('Máximo')}
            value={maximum}
            increment={() => setMax((prev) => prev + 1)}
            decrement={() => setMax((prev) => (prev > 0 ? prev - 1 : 0))}
          />
          <Flex mt="4" alignItems="flex-end">
            <Button type="submit" w="full" maxW="100px" fontSize="sm">
              {t('Salvar')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};
