import { BusinessService } from '@appjusto/types';
import { Badge, Flex, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { t } from 'utils/i18n';
import { OptionCard } from '../OptionCard';
import { LogisticsType } from './LogisticsPage';

interface LogisticsOptionsProps {
  logistics: LogisticsType;
  logisticsAccepted?: BusinessService | null;
  handleChange(value: LogisticsType): void;
}

export const LogisticsOptions = ({
  logistics,
  logisticsAccepted,
  handleChange,
}: LogisticsOptionsProps) => {
  // context
  const { platformFees, logisticsAvailable } = useContextBusiness();
  // state
  const [availableFee, setAvailableFee] = React.useState(0);
  // helpers
  const logisticsDisabled = React.useMemo(
    () => logisticsAvailable === 'none',
    [logisticsAvailable]
  );
  const commissionBaseFee = React.useMemo(
    () => platformFees?.commissions.food.percent ?? 0,
    [platformFees?.commissions.food.percent]
  );
  const logisticsBaseFee = React.useMemo(
    () => platformFees?.logistics?.percent ?? 0,
    [platformFees?.logistics?.percent]
  );
  // TODO: colocar 8.5 no firestore
  console.log(logisticsBaseFee);
  // handlers
  // side effects
  React.useEffect(() => {
    if (!logisticsAccepted) {
      const fee = commissionBaseFee + logisticsBaseFee;
      setAvailableFee(fee);
    } else {
      const fee = commissionBaseFee + (logisticsAccepted.fee.percent ?? 0);
      setAvailableFee(fee);
    }
  }, [commissionBaseFee, logisticsBaseFee, logisticsAccepted]);
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
      <OptionCard isSelected={logistics === 'appjusto'}>
        <Flex
          minH="96px"
          flexDir="column"
          alignItems="center"
          pb="6"
          borderBottom="1px solid #F2F4F5"
        >
          <Text fontSize="sm">{t('Com logística')}</Text>
          <Text
            mt="2"
            fontSize="xl"
            fontWeight="medium"
            textAlign="center"
            color="black"
          >
            {t('R$ 69,90 por mês + 8,5% por pedido')}
          </Text>
          <Badge bgColor="#EBFBEF" color="#1C7B34" mt="6" mb="-8">
            Recomendado
          </Badge>
        </Flex>
      </OptionCard>
      <OptionCard isSelected={logistics !== 'appjusto'}>
        <Flex
          minH="96px"
          flexDir="column"
          alignItems="center"
          pb="6"
          borderBottom="1px solid #F2F4F5"
        >
          <Text fontSize="sm">{t('Sem logística')}</Text>
          <Text
            mt="2"
            fontSize="xl"
            fontWeight="medium"
            textAlign="center"
            color="black"
          >
            {t('R$69,90 por mês')}
          </Text>
        </Flex>
      </OptionCard>
    </Flex>
  );
};
