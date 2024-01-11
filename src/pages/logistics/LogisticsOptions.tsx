import { Badge, Box, Button, Flex, Skeleton, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { OptionCard } from '../OptionCard';
import { LogisticsItem } from './LogisticsItem';
import { LogisticsType } from './LogisticsPage';

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
  if (logisticsDisabled) {
    return (
      <Flex mt="4" gap="4">
        <OptionCard isSelected={logistics === 'appjusto'}>
          <Flex flexDir="column" justifyContent="center" alignItems="center">
            <Text fontSize="sm">{t('Com logística')}</Text>
          </Flex>
        </OptionCard>
        <OptionCard isSelected={logistics !== 'appjusto'}>
          <Text fontSize="sm">{t('Sem logística')}</Text>
        </OptionCard>
      </Flex>
    );
  }
  return (
    <Flex mt="4" gap="4" flexDir={{ base: 'column', lg: 'row' }}>
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
          <Badge bgColor="#EBFBEF" color="#1C7B34" mt="6" mb="-8">
            {t('Recomendado')}
          </Badge>
        </Flex>
        <Box mt="6" pb="4" borderBottom="1px solid #F2F4F5">
          <Text fontSize="sm">{t('SERVIÇOS')}</Text>
          <LogisticsItem
            title={t('Cardápio digital de venda direta + Market place')}
          />
          <LogisticsItem
            title={t('Entrega pela rede appjusto + rede parceira')}
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
          <LogisticsItem title={t('Fraude (Chargeback)')} />
          <LogisticsItem title={t('Cancelamento após início do preparo')} />
          <LogisticsItem title={t('Cancelamento por atraso na entrega')} />
          <LogisticsItem
            title={t(
              'Defeito no produto (ex: embalagem violada, perda de qualidade, etc) desde que ocasionado por problema na entrega'
            )}
          />
          <LogisticsItem title={t('Extravio dos produtos')} />
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
        </Flex>
        <Box mt="6" pb="4" borderBottom="1px solid #F2F4F5">
          <Text fontSize="sm">{t('SERVIÇOS')}</Text>
          <LogisticsItem
            title={t('Cardápio digital de venda direta + Market place')}
          />
          <LogisticsItem
            title={t('Entrega pela rede appjusto + rede parceira')}
            isDisabled
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
          <LogisticsItem title={t('Fraude (Chargeback)')} />
          <LogisticsItem
            title={t('Cancelamento após início do preparo')}
            isDisabled
          />
          <LogisticsItem
            title={t('Cancelamento por atraso na entrega')}
            isDisabled
          />
          <LogisticsItem
            title={t(
              'Defeito no produto (ex: embalagem violada, perda de qualidade, etc) desde que ocasionado por problema na entrega'
            )}
            isDisabled
          />
          <LogisticsItem title={t('Extravio dos produtos')} isDisabled />
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
