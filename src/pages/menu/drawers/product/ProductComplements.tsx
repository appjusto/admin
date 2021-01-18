import { Box, Button, ButtonProps, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { StateProps } from './productReducer';

interface ProductComplementsProps {
  state: StateProps;
  handleStateUpdate(key: string, value: string | number | React.ReactText[] | boolean): void;
}

interface IncDecButtonsProps extends ButtonProps {
  label: string;
}

const IncDecButtons = ({ label, mt, mb, ml, mr }: IncDecButtonsProps) => {
  const boxProps = { mt, mb, ml, mr };
  return (
    <Box {...boxProps}>
      <Text>{label}</Text>
      <Flex flexDir="row" alignItems="center">
        <Button maxW="48px" fontSize="3xl" variant="outline">
          -
        </Button>
        <Text fontSize="md" mx="2">
          0
        </Text>
        <Button maxW="48px" fontSize="3xl" variant="outline">
          +
        </Button>
      </Flex>
    </Box>
  );
};

export const ProductComplements = ({ state, handleStateUpdate }: ProductComplementsProps) => {
  const {
    name,
    categoryId,
    description,
    price,
    classifications,
    imageUrl,
    previewURL,
    enabled,
    externalId,
  } = state;
  const [hasComplements, setHasComplements] = React.useState(false);
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
            value=""
          />
          <Text mt="8" fontSize="xl" color="black">
            {t('Obrigatoriedade')}
          </Text>
          <Text fontSize="sm">{t('Esse grupo é necessário para o pedido do prato?')}</Text>
          <RadioGroup
            onChange={(value) => {}}
            value={'1'}
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
            <IncDecButtons label={t('Mínimo')} mr="14" />
            <IncDecButtons label={t('Máximo')} />
          </Flex>
          <Box mt="10">
            <Button w="full" maxW="220px" fontSize="sm">
              {t('Avançar')}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};
