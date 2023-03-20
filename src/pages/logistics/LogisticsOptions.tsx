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
      <Box maxW="468px">
        <RadioGroup
          mt="8"
          value={logistics}
          onChange={(value) => handleChange(value as LogisticsType)}
        >
          <VStack spacing={4} alignItems="flex-start">
            <OptionCard isSelected={logistics === 'private'}>
              <Flex>
                <Radio value="private">
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Entrega Própria')}
                  </Text>
                </Radio>
                <Icon as={motocycleGray} ml="6" w="48px" h="48px" />
              </Flex>
              <FeeDescriptionItem fee={commissionBaseFee} />
              <LogisticsItem
                title={t('A entrega será realizada pelo próprio restaurante')}
                iconDisabled
              ></LogisticsItem>
            </OptionCard>

            <OptionCard isSelected={logistics === 'appjusto'}>
              <Flex>
                <Radio value="appjusto" isDisabled>
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Entrega AppJusto')}
                  </Text>
                </Radio>
                <Icon as={motocycleGreen} ml="6" w="48px" h="48px" />
              </Flex>
              <Box
                mt="4"
                p="4"
                color="black"
                bgColor="yellow"
                border="1px solid black"
                borderRadius="lg"
              >
                <Text>
                  {t(
                    'O AppJusto ainda não possui rede de entregadores na sua cidade. Mas não se preocupe, avisaremos assim que este serviço estiver disponível.'
                  )}
                </Text>
              </Box>
              <Box>
                <FeeDescriptionItem fee={availableFee} isDisabled />
                <LogisticsItem
                  title={t(
                    'A entrega será realizada por nossa rede de entregadores e por parceiros   '
                  )}
                  isDisabled
                />
              </Box>
            </OptionCard>
          </VStack>
        </RadioGroup>
      </Box>
    );
  }
  return (
    <Box maxW="468px">
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
                  {t('Entrega AppJusto')}
                </Text>
              </Radio>
              <Icon as={motocycleGreen} ml="6" w="48px" h="48px" />
            </Flex>
            <FeeDescriptionItem fee={availableFee} />
            {logisticsAvailable === 'appjusto' ? (
              <LogisticsItem
                title={t(
                  'A entrega será realizada por nossa rede de entregadores e por parceiros   '
                )}
              />
            ) : (
              <Box
                mt="4"
                p="4"
                color="black"
                bgColor="yellow"
                border="1px solid black"
                borderRadius="lg"
              >
                <Text>
                  {t(
                    'O AppJusto ainda não possui rede própria de entregadores na sua cidade. Mas não se preocupe, realizaremos suas entregas por meio de empresas parceiras.'
                  )}
                </Text>
              </Box>
            )}
          </OptionCard>
          <OptionCard isSelected={logistics === 'private'}>
            <Flex>
              <Radio value="private">
                <Text ml="2" fontSize="18px" fontWeight="700">
                  {t('Entrega Própria')}
                </Text>
              </Radio>
              <Icon as={motocycleGray} ml="6" w="48px" h="48px" />
            </Flex>
            <FeeDescriptionItem fee={commissionBaseFee} />
            <LogisticsItem
              title={t('A entrega será realizada pelo próprio restaurante')}
              iconDisabled
            ></LogisticsItem>
          </OptionCard>
        </VStack>
      </RadioGroup>
    </Box>
  );
};
