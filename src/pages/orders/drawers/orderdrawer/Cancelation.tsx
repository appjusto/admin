import { Box, Button, Flex, Image, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { Issue, IssueType, WithId } from 'appjusto-types';
import iconTraffic from 'common/img/icon-traffic.svg';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
interface CancelationProps {
  handleConfirm(issue: WithId<Issue>): void;
  handleKeep(): void;
  isLoading: boolean;
  orderCancellationCosts?: number;
}

const issueOptionsArray = ['restaurant-cancel'] as IssueType[];

export const Cancelation = ({
  handleConfirm,
  handleKeep,
  isLoading,
  orderCancellationCosts,
}: CancelationProps) => {
  //context
  const cancelOptions = useIssuesByType(issueOptionsArray);
  // state
  const [options, setOptions] = React.useState<WithId<Issue>[]>(cancelOptions ?? []);
  const [optionId, setOptionId] = React.useState('');
  const [optionsError, setOptionsError] = React.useState({ status: false, message: '' });

  // helpers
  const isCosts = typeof orderCancellationCosts === 'number' && orderCancellationCosts > 0;

  //handler
  const handleCancel = () => {
    const issue = options.filter((option) => option.id === optionId)[0];
    if (issue) return handleConfirm(issue);
  };

  //side effects
  React.useEffect(() => {
    if (cancelOptions) {
      setOptions(cancelOptions);
      setOptionId(cancelOptions[0].id);
    } else if (cancelOptions === null) {
      setOptionsError({
        status: true,
        message: 'Não foi possível carregar a lista de motivos. Tenta novamente? ',
      });
    }
  }, [cancelOptions]);

  // UI
  return (
    <Box py="4" px="6" bgColor="#FFF8F8" border="1px solid #DC3545" borderRadius="lg">
      {isCosts && (
        <Flex flexDir="column" alignItems="center">
          <Box w="60px">
            <Image src={iconTraffic} />
          </Box>
          <Text fontSize="xl" color="black">
            {t('Aviso importante:')}
          </Text>
          <Text fontSize="xl" color="#DC3545" maxW="320px" textAlign="center">
            {t(
              `Com este cancelamento será gerado um débito no valor de ${formatCurrency(
                orderCancellationCosts!
              )}`
            )}
          </Text>
        </Flex>
      )}
      <Text mt="6" fontSize={isCosts ? 'lg' : 'xl'} color={isCosts ? 'black' : '#DC3545'}>
        {t('Deseja realmente cancelar o pedido?')}
      </Text>
      <Text mt="1" fontSize="sm">
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
            <Radio mt="1" key={option.id} value={option.id} size="lg">
              {option.title}
            </Radio>
          ))}
          {optionsError.status && (
            <Text mt="2" color="#DC3545" fontWeight="700">
              {optionsError.message}
            </Text>
          )}
        </Flex>
      </RadioGroup>
      <Flex mt="6" flexDir="row" justifyContent="space-between">
        <Button w="100%" mr="2" onClick={handleKeep}>
          {t('Manter pedido')}
        </Button>
        <Button
          w="100%"
          isDisabled={optionsError.status}
          variant="danger"
          onClick={handleCancel}
          isLoading={isLoading}
        >
          {t('Cancelar pedido')}
        </Button>
      </Flex>
    </Box>
  );
};
