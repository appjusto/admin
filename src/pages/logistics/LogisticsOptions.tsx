import { BusinessService } from '@appjusto/types';
import {
  Box,
  Flex,
  Icon,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { ReactComponent as motocycleGray } from 'common/img/motocycle-gray.svg';
import { ReactComponent as motocycleGreen } from 'common/img/motocycle-green.svg';
import { ReactComponent as motocycleYellow } from 'common/img/motocycle-yellow.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { FeeDescriptionItem } from '../FeeDescriptionItem';
import { OptionCard } from '../OptionCard';
import { LogisticsItem } from './LogisticsItem';
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
  const { platformFees } = useContextBusiness();
  // state
  const [availableFee, setAvailableFee] = React.useState(0);
  // helpers
  const commissionBaseFee = React.useMemo(
    () => platformFees?.commissions.food.percent ?? 0,
    [platformFees?.commissions.food.percent]
  );
  const logisticsBaseFee = React.useMemo(
    () => platformFees?.logistics?.percent ?? 0,
    [platformFees?.logistics?.percent]
  );
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
  return (
    <Box maxW="600px">
      <RadioGroup
        mt="8"
        value={logistics}
        onChange={(value) => handleChange(value as LogisticsType)}
      >
        <VStack spacing={4} alignItems="flex-start">
          <OptionCard isSelected={logistics === 'appjusto'}>
            <Flex>
              <Radio value="appjusto">
                <Text ml="2" fontSize="18px" fontWeight="700">
                  {t('Logística AppJusto')}
                </Text>
              </Radio>
              <Icon as={motocycleGreen} ml="6" w="48px" h="48px" />
            </Flex>
            <LogisticsItem title={t('Com Logística AppJusto')} icon>
              <Text>
                {t('A entrega é feita por ')}
                <Text as="span" fontWeight="700">
                  {t('nossa rede entregadores e por parceiros')}
                </Text>
              </Text>
            </LogisticsItem>
            <LogisticsItem title={t('Sem Mensalidades')} icon>
              <Text>
                {t('Uma vantagem do AppJusto é que ')}
                <Text as="span" fontWeight="700">
                  {t('não cobramos mensalidade')}
                </Text>
              </Text>
            </LogisticsItem>
            <FeeDescriptionItem
              title={t('Comissão AppJusto')}
              description={t(
                'Taxa de comissão sobre pedidos pagos pelo AppJusto'
              )}
              fee={availableFee}
              highlight
            />
          </OptionCard>
          <OptionCard isSelected={logistics === 'appjusto'}>
            <Flex>
              <Radio value="appjusto">
                <Text ml="2" fontSize="18px" fontWeight="700">
                  {t('Logística por Parceiros')}
                </Text>
              </Radio>
              <Icon as={motocycleYellow} ml="6" w="48px" h="48px" />
            </Flex>
            <LogisticsItem title={t('Com Logística por Parceiros')} icon>
              <Text>
                {t(
                  'O AppJusto ainda está construindo a rede de entregadores na sua cidade. Até lá '
                )}
                <Text as="span" fontWeight="700">
                  {t('suas entregas serão feitas por empresas parceiras')}
                </Text>
              </Text>
            </LogisticsItem>
            <LogisticsItem title={t('Sem Mensalidades')} icon>
              <Text>
                {t('Uma vantagem do AppJusto é que ')}
                <Text as="span" fontWeight="700">
                  {t('não cobramos mensalidade')}
                </Text>
              </Text>
            </LogisticsItem>
            <FeeDescriptionItem
              title={t('Comissão AppJusto')}
              description={t(
                'Taxa de comissão sobre pedidos pagos pelo AppJusto'
              )}
              fee={availableFee}
              highlight
            />
          </OptionCard>
          <OptionCard isSelected={logistics === 'private'}>
            <Flex>
              <Radio value="private">
                <Text ml="2" fontSize="18px" fontWeight="700">
                  {t('Logística Própria')}
                </Text>
              </Radio>
              <Icon as={motocycleGray} ml="6" w="48px" h="48px" />
            </Flex>
            <LogisticsItem title={t('Sem Logística AppJusto')}>
              <Text>
                {t('A entrega é feita por ')}
                <Text as="span" fontWeight="700">
                  {t('sua rede de entregadores')}
                </Text>
              </Text>
            </LogisticsItem>
            <LogisticsItem title={t('Sem Mensalidades')} icon>
              <Text>
                {t('Uma vantagem do AppJusto é que ')}
                <Text as="span" fontWeight="700">
                  {t('não cobramos mensalidade')}
                </Text>
              </Text>
            </LogisticsItem>
            <FeeDescriptionItem
              title={t('Comissão AppJusto')}
              description={t(
                'Taxa de comissão sobre pedidos pagos pelo AppJusto'
              )}
              fee={commissionBaseFee}
            />
          </OptionCard>
        </VStack>
      </RadioGroup>
    </Box>
  );
};
