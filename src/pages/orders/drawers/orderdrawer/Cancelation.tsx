import { Box, Button, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { Issue, WithId } from 'appjusto-types';
import { useOrdersContext } from 'pages/orders/context';
import React from 'react';
import { t } from 'utils/i18n';

interface CancelationProps {
  handleConfirm(issue: WithId<Issue>): void;
  handleKeep(): void;
}

export const Cancelation = ({ handleConfirm, handleKeep }: CancelationProps) => {
  //context
  const { fetchCancelOptions } = useOrdersContext();
  // state
  const [options, setOptions] = React.useState<WithId<Issue>[]>([]);
  const [optionId, setOptionId] = React.useState('');
  const [optionsError, setOptionsError] = React.useState({ status: false, msg: '' });

  //handler
  const handleCancel = () => {
    const issue = options.filter((option) => option.id === optionId)[0];
    if (issue) return handleConfirm(issue);
  };

  //side effects
  React.useEffect(() => {
    (async () => {
      const optionsList = await fetchCancelOptions();
      if (optionsList.length > 0) {
        setOptions(optionsList);
        setOptionId(optionsList[0].id);
      } else {
        setOptionsError({ status: true, msg: 'Desculpe, não foi possível carregar as opções.' });
      }
    })();
  }, [fetchCancelOptions]);
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
        onChange={(value) => setOptionId(value as string)}
        value={optionId}
        colorScheme="green"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          {options.map((option) => (
            <Radio mt="2" key={option.id} value={option.id} size="lg">
              {option.title}
            </Radio>
          ))}
          {optionsError.status && (
            <Text mt="4" color="#DC3545" fontWeight="700">
              {optionsError.msg}
            </Text>
          )}
        </Flex>
      </RadioGroup>
      <Flex mt="6" maxW="340px" flexDir="row" justifyContent="space-between">
        <Button maxW="160px" onClick={handleKeep}>
          {t('Manter pedido')}
        </Button>
        <Button
          maxW="160px"
          isDisabled={optionsError.status}
          variant="danger"
          onClick={handleCancel}
        >
          {t('Cancelar pedido')}
        </Button>
      </Flex>
    </Box>
  );
};
