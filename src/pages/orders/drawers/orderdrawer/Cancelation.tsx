import { Box, Button, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface CancelationProps {
  handleConfirm(): void;
  handleKeep(): void;
}

export const Cancelation = ({ handleConfirm, handleKeep }: CancelationProps) => {
  //context

  // state
  const [reason, setReason] = React.useState('1');

  // handlers

  // side effects

  // UI
  return (
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
        onChange={(value) => setReason(value.toString())}
        value={reason}
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
      <Flex mt="6" maxW="340px" flexDir="row" justifyContent="space-between">
        <Button maxW="160px" onClick={handleKeep}>
          {t('Manter pedido')}
        </Button>
        <Button maxW="160px" variant="danger" onClick={handleConfirm}>
          {t('Cancelar pedido')}
        </Button>
      </Flex>
    </Box>
  );
};
