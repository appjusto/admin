import {
  Box,
  Button,
  Flex,
  Radio,
  RadioGroup,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { CustomNumberInput } from 'common/components/form/input/CustomNumberInput';
import React from 'react';
import { t } from 'utils/i18n';
import { OrderBaseDrawer } from './OrderBaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  categoryId: string;
};

export const OrderDrawer = (props: Props) => {
  //context
  const isError = false;
  const error = '';
  // state
  const [hasPreparationTime, setHasPreparationTime] = React.useState(false);
  const [radiosValue, setRadiosValue] = React.useState('15');
  const [preparationTime, setPreparationTime] = React.useState('15');
  const [isCanceling, setIsCanceling] = React.useState(false);

  // const [enabled, setEnabled] = React.useState(category?.enabled ?? true);

  // handlers
  const handlePreparationTime = (value: string, from: string) => {
    if (from === 'input') {
      setPreparationTime(value);
    } else {
      if (value === '0') {
        setRadiosValue(value);
        setPreparationTime(value);
      } else {
        setRadiosValue(value);
        setPreparationTime(value);
      }
    }
  };

  // side effects

  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);

  // UI
  if (isCanceling) {
    return (
      <OrderBaseDrawer
        {...props}
        order={'001'}
        client={'Renan'}
        clientOrders={6}
        type="order"
        cancel={() => setIsCanceling(true)}
        isCanceling={isCanceling}
        isError={isError}
        error={error}
      >
        <Box py="4" px="6" bgColor="#FFF8F8" border="1px solid #DC3545" borderRadius="lg">
          <Text fontSize="xl" color="#DC3545">
            {t('Tem certeza que deseja cancelar o pedido?')}
          </Text>
          <Text mt="2" fontSize="sm" color="black">
            {t(
              'Cancelar pedidos pode prejudicar a experiência do cliente com o seu estabelecimento. Informe o motivo do cancelamento:'
            )}
          </Text>
          <RadioGroup
            onChange={(value) => handlePreparationTime(value.toString(), 'radio')}
            value={'1'}
            defaultValue="1"
            colorScheme="green"
          >
            <Flex flexDir="column" justifyContent="flex-start">
              <Radio mt="2" value="1" size="lg">
                {t('Um ou mais itens indisponíveis')}
              </Radio>
              <Radio mt="2" value="2" size="lg">
                {t('Ocorreu um problema no preparo')}
              </Radio>
              <Radio mt="2" value="3" size="lg">
                {t('Restaurante não está funcionando')}
              </Radio>
              <Radio mt="2" value="4" size="lg">
                {t('Sem entregadores disponíveis')}
              </Radio>
            </Flex>
          </RadioGroup>
          <Flex mt="6" maxW="340px" flexDir="row" justifyContent="space-between" {...props}>
            <Button maxW="160px" onClick={() => setIsCanceling(false)}>
              {t('Manter pedido')}
            </Button>
            <Button maxW="160px" variant="danger" onClick={() => {}}>
              {t('Cancelar pedido')}
            </Button>
          </Flex>
        </Box>
      </OrderBaseDrawer>
    );
  }

  return (
    <OrderBaseDrawer
      {...props}
      order={'001'}
      client={'Renan'}
      clientOrders={6}
      type="order"
      cancel={() => setIsCanceling(true)}
      isCanceling={isCanceling}
      isError={isError}
      error={error}
    >
      <Text mt="6" fontSize="xl" color="black">
        {t('Detalhes do pedido')}
      </Text>
      <Table size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('Item')}</Th>
            <Th isNumeric>{t('Qtde.')}</Th>
            <Th isNumeric>{t('Valor/Item')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr color="black" fontSize="xs">
            <Td>{t('Nome do item')}</Td>
            <Td isNumeric>{'1'}</Td>
            <Td isNumeric>{'R$ 0,00'}</Td>
          </Tr>
        </Tbody>
        <Tfoot bgColor="gray.50">
          <Tr color="black">
            <Th>{t('Valor total de itens:')}</Th>
            <Th></Th>
            <Th isNumeric>{'R$ 0,00'}</Th>
          </Tr>
        </Tfoot>
      </Table>
      <Text mt="10" fontSize="xl" color="black">
        {t('Observações')}
      </Text>
      <Text mt="1" fontSize="md">
        {t('Incluir CPF na nota, CPF: 000.000.000-00')}
      </Text>
      <Text mt="10" fontSize="xl" color="black">
        {t('Forma de pagamento')}
      </Text>
      <Text mt="1" fontSize="md">
        {t('Total pago:')}{' '}
        <Text as="span" color="black">
          {'R$ 0,00'}
        </Text>
      </Text>
      <Text mt="1" fontSize="md">
        {t('Método de pagamento:')}{' '}
        <Text as="span" color="black">
          {'pagamento via app'}
        </Text>
      </Text>
      <Flex mt="10" flexDir="row">
        <Switch
          isChecked={hasPreparationTime}
          onChange={(ev) => {
            ev.stopPropagation();
            setHasPreparationTime(ev.target.checked);
          }}
        />
        <Text ml="4" fontSize="xl" color="black">
          {t('Definir tempo de preparo')}
        </Text>
      </Flex>
      <Text mt="1" fontSize="md">
        {t(
          'Ao definir o tempo de preparo, quando finalizado esse tempo, o pedido será automaticamente movido para ”Aguardando retirada”.'
        )}
      </Text>
      {hasPreparationTime && (
        <RadioGroup
          onChange={(value) => handlePreparationTime(value.toString(), 'radio')}
          value={radiosValue}
          defaultValue="15"
          colorScheme="green"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            <Radio mt="4" value="5" size="lg">
              {t('5 minutos')}
            </Radio>
            <Radio mt="4" value="10" size="lg">
              {t('10 minutos')}
            </Radio>
            <Radio mt="4" value="15" size="lg">
              {t('15 minutos')}
            </Radio>
            <Radio mt="4" value="20" size="lg">
              {t('20 minutos')}
            </Radio>
            <Radio mt="4" value="30" size="lg">
              {t('30 minutos')}
            </Radio>
            <Radio mt="4" value="45" size="lg">
              {t('45 minutos')}
            </Radio>
            <Flex mt="2" flexDir="row" alignItems="center">
              <Radio w="360px" value="0" size="lg">
                {t('Definir manualmente')}
              </Radio>
              {radiosValue === '0' && (
                <CustomNumberInput
                  ml="2"
                  mt="0"
                  maxW="200px"
                  id="order-manual-minutes"
                  label={t('Tempo de preparo (minutos)')}
                  value={preparationTime}
                  onChange={(ev) => handlePreparationTime(ev.target.value, 'input')}
                />
              )}
            </Flex>
          </Flex>
        </RadioGroup>
      )}
    </OrderBaseDrawer>
  );
};
