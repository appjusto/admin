import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { FaPercent } from 'react-icons/fa';
import { t } from 'utils/i18n';
import { CustomNumberInput } from './form/input/CustomNumberInput';

export const AverageDiscountCard = ({ ...props }: StackProps) => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  // state
  const [averageDiscount, setAverageDiscount] = React.useState('');
  // handlers
  const handleSaveAverageDiscount = () => {
    if (!averageDiscount) return;
    const changes = { averageDiscount: parseInt(averageDiscount) };
    updateBusinessProfile(changes);
  };
  React.useEffect(() => {
    if (!business?.averageDiscount) return;
    setAverageDiscount(business.averageDiscount.toString());
  }, [business?.averageDiscount]);
  // UI
  return (
    <Stack
      mt="8"
      p="6"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      borderRadius="lg"
      bgColor="#2F422C"
      spacing={4}
      {...props}
    >
      <Stack
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: 4, lg: 8 }}
        alignItems="center"
      >
        <Center w="48px" h="48px" bgColor="#fff" borderRadius="24px" overflow="hidden">
          <Icon as={FaPercent} w="16px" h="16px" />
        </Center>
        <Box maxW="612px">
          <HStack spacing={4}>
            <Text mt="1" fontSize="18px" lineHeight="26px" fontWeight="700" color="white">
              {t('Compromisso Preço Justo')}
            </Text>
            <Badge
              px="8px"
              py="2px"
              bgColor="#FFBE00"
              color="black"
              borderRadius="16px"
              fontSize="11px"
              lineHeight="18px"
              fontWeight="700"
            >
              {t('NOVIDADE')}
            </Badge>
          </HStack>
          <Text
            mt="2"
            color="white"
            minW="140px"
            maxW="590px"
            fontSize="16px"
            lineHeight="22px"
            fontWeight="500"
          >
            {t(
              'Agora você pode informar aos clientes a média de desconto no AppJusto comparado a outros apps. Essa informação ficará em destaque na exibição.'
            )}
          </Text>
        </Box>
      </Stack>
      <HStack spacing={{ base: 4, lg: 8 }}>
        <Box maxW="140px" minW="140px">
          <CustomNumberInput
            mt="0"
            id="average-discount-input"
            bgColor="white"
            fontSize="13px"
            label={t('Desconto médio %')}
            placeholder="0"
            value={averageDiscount}
            onChange={(e) => setAverageDiscount(e.target.value)}
            maxLength={2}
          />
        </Box>
        <Button
          h="60px"
          fontSize="15px"
          lineHeight="21px"
          fontWeight="700"
          onClick={handleSaveAverageDiscount}
          loadingText={t('Salvando')}
          isLoading={updateResult.isLoading}
        >
          {t('Salvar')}
        </Button>
      </HStack>
    </Stack>
  );
};
