import { Box, Button, Flex, Skeleton, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { LogisticsItem } from './LogisticsItem';
import { LogisticsType } from './LogisticsPage';
import { OptionCard } from './OptionCard';

interface LogisticsOptionsProps {
  logistics: LogisticsType;
  handleChange(value: LogisticsType): void;
}

export const LogisticsOptions = ({
  logistics,
  handleChange,
}: LogisticsOptionsProps) => {
  // context
  const { platformFees, logisticsAvailable } = useContextBusiness();
  // state
  const [availableFee, setAvailableFee] = React.useState<string>();
  const [subscription, setSubscription] = React.useState<string>();
  // helpers
  const isLogisticsSelected = logistics === 'appjusto';
  const logisticsDisabled = React.useMemo(
    () => logisticsAvailable === 'none',
    [logisticsAvailable]
  );
  // side effects
  React.useEffect(() => {
    const subscriptionValue = platformFees?.subscription.value
      ? formatCurrency(platformFees.subscription.value)
      : undefined;
    setSubscription(subscriptionValue);
    const logisticsFee = platformFees?.logistics?.percent ?? 0;
    const insuranceFee = platformFees?.insurance.business.percent ?? 0;
    const logisticsBaseFee = (logisticsFee + insuranceFee)
      .toString()
      .replace('.', ',');
    setAvailableFee(logisticsBaseFee);
  }, [platformFees]);
  // UI
  return (
    <Flex
      mt="4"
      gap="4"
      flexDir={{
        base: logisticsDisabled ? 'column-reverse' : 'column',
        lg: logisticsDisabled ? 'row-reverse' : 'row',
      }}
    >
      <OptionCard isSelected={isLogisticsSelected}>
        <Flex
          minH="96px"
          flexDir="column"
          alignItems="center"
          pb="6"
          borderBottom="1px solid #F2F4F5"
        >
          <Text fontSize="14px">{t('Com logística')}</Text>
          {availableFee !== undefined && subscription !== undefined ? (
            <Text
              mt="2"
              fontSize="xl"
              fontWeight="medium"
              textAlign="center"
              color="black"
            >
              {t(`${subscription} por mês + ${availableFee}% por pedido`)}
            </Text>
          ) : (
            <Skeleton mt="2" w="56" h="5" />
          )}
          <Text mt="1" fontSize="14px" textAlign="center">
            {t(
              `Sem mensalidade para restaurantes com menos de ${
                platformFees?.subscription.ordersThreshold ?? '...'
              } pedidos por mês`
            )}
          </Text>
          {!logisticsDisabled ? (
            <Box
              py="2px"
              px="2"
              bgColor="#EBFBEF"
              color="#1C7B34"
              mt="3"
              mb="-34px"
              borderRadius="md"
            >
              <Text fontSize="xs">{t('Recomendado')}</Text>
            </Box>
          ) : (
            <Box
              py="2px"
              px="2"
              bgColor="#FFF7E4"
              color="#C39022"
              mt="3"
              mb="-34px"
              borderRadius="md"
            >
              <Text fontSize="xs">{t('Indisponível na sua região')}</Text>
            </Box>
          )}
        </Flex>
        <Box mt="6" pb="4" borderBottom="1px solid #F2F4F5">
          <Text fontSize="sm">{t('SERVIÇOS')}</Text>
          <LogisticsItem
            title={t('Cardápio digital de venda direta + Market place')}
            isDisabled={logisticsDisabled}
          />
          <LogisticsItem
            title={t('Entrega pela rede appjusto + rede parceira')}
            isDisabled={logisticsDisabled}
          />
        </Box>
        <Box mt="6" pb="4" borderBottom="1px solid #F2F4F5">
          <Text fontSize="sm">{t('TAXAS')}</Text>
          <LogisticsItem
            title={t(
              'Pagamento online: cartão de crédito (taxa financeira 2,42% + R$0,09), Pix (0,99%), VR/VA (isento)'
            )}
            isDisabled={logisticsDisabled}
          />
          <LogisticsItem
            title={t('Antecipação fácil com taxa de 2,75%')}
            isDisabled={logisticsDisabled}
          />
        </Box>
        <Box mt="6" pb="4">
          <Text fontSize="sm">{t('COBERTURA')}</Text>
          <LogisticsItem
            title={t('Fraude (Chargeback)')}
            isDisabled={logisticsDisabled}
          />
          <LogisticsItem
            title={t('Cancelamento após início do preparo')}
            isDisabled={logisticsDisabled}
          />
          <LogisticsItem
            title={t('Cancelamento por atraso na entrega')}
            isDisabled={logisticsDisabled}
          />
          <LogisticsItem
            title={t(
              'Defeito no produto (ex: embalagem violada, perda de qualidade, etc) desde que ocasionado por problema na entrega'
            )}
            isDisabled={logisticsDisabled}
          />
          <LogisticsItem
            title={t('Extravio dos produtos')}
            isDisabled={logisticsDisabled}
          />
        </Box>
        <Button
          mt="2"
          variant="outline"
          size="md"
          w="full"
          bgColor={isLogisticsSelected ? '#EBFBEF' : 'initial'}
          color={isLogisticsSelected ? '#1C7B34' : 'initial'}
          border={isLogisticsSelected ? 'none' : '1px solid'}
          _hover={{ bgColor: '#EBFBEF' }}
          onClick={() => handleChange('appjusto')}
          disabled={logisticsDisabled}
        >
          {isLogisticsSelected ? t('Selecionado') : t('Selecionar')}
        </Button>
      </OptionCard>
      <OptionCard isSelected={!isLogisticsSelected}>
        <Flex
          minH="96px"
          flexDir="column"
          alignItems="center"
          pb="6"
          borderBottom="1px solid #F2F4F5"
        >
          <Text fontSize="14px">{t('Sem logística')}</Text>
          {subscription !== undefined ? (
            <Text
              mt="2"
              fontSize="xl"
              fontWeight="medium"
              textAlign="center"
              color="black"
            >
              {t(`${subscription} por mês`)}
            </Text>
          ) : (
            <Skeleton mt="2" w="56" h="5" />
          )}
          <Text mt="1" fontSize="14px" textAlign="center">
            {t(
              `Sem mensalidade para restaurantes com menos de ${
                platformFees?.subscription.ordersThreshold ?? '...'
              } pedidos por mês`
            )}
          </Text>
          {logisticsDisabled ? (
            <Box
              py="2px"
              px="2"
              bgColor="#EBFBEF"
              color="#1C7B34"
              mt="3"
              mb="-34px"
              borderRadius="md"
            >
              <Text fontSize="xs">{t('Recomendado')}</Text>
            </Box>
          ) : null}
        </Flex>
        <Box mt="6" pb="4" borderBottom="1px solid #F2F4F5">
          <Text fontSize="sm">{t('SERVIÇOS')}</Text>
          <LogisticsItem
            title={t('Cardápio digital de venda direta + Market place')}
          />
          <LogisticsItem
            title={t('Entrega pela rede appjusto + rede parceira')}
            isDisabled
            iconDisabled
          />
        </Box>
        <Box mt="6" pb="4" borderBottom="1px solid #F2F4F5">
          <Text fontSize="sm">{t('TAXAS')}</Text>
          <LogisticsItem
            title={t(
              'Pagamento online: cartão de crédito (taxa financeira 2,42% + R$0,09), Pix (0,99%), VR/VA (isento)'
            )}
          />
          <LogisticsItem title={t('Antecipação fácil com taxa de 2,75%')} />
        </Box>
        <Box mt="6" pb="4">
          <Text fontSize="sm">{t('COBERTURA')}</Text>
          <LogisticsItem
            title={t('Fraude (Chargeback)')}
            isDisabled
            iconDisabled
          />
          <LogisticsItem
            title={t('Cancelamento após início do preparo')}
            isDisabled
            iconDisabled
          />
          <LogisticsItem
            title={t('Cancelamento por atraso na entrega')}
            isDisabled
            iconDisabled
          />
          <LogisticsItem
            title={t(
              'Defeito no produto (ex: embalagem violada, perda de qualidade, etc) desde que ocasionado por problema na entrega'
            )}
            isDisabled
            iconDisabled
          />
          <LogisticsItem
            title={t('Extravio dos produtos')}
            isDisabled
            iconDisabled
          />
        </Box>
        <Button
          mt="2"
          variant="outline"
          size="md"
          w="full"
          bgColor={!isLogisticsSelected ? '#EBFBEF' : 'initial'}
          color={!isLogisticsSelected ? '#1C7B34' : 'initial'}
          border={!isLogisticsSelected ? 'none' : '1px solid'}
          _hover={{ bgColor: '#EBFBEF' }}
          onClick={() => handleChange('private')}
        >
          {!isLogisticsSelected ? t('Selecionado') : t('Selecionar')}
        </Button>
      </OptionCard>
    </Flex>
  );
};
