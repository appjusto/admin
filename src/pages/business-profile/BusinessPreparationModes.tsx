import { PreparationMode } from '@appjusto/types';
import { Badge, Box, CheckboxGroup, HStack, Text } from '@chakra-ui/react';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import { t } from 'utils/i18n';

interface BusinessPreparationModesProps {
  preparationModes?: PreparationMode[];
  handleChange: (value: PreparationMode[]) => void;
  isBackoffice?: boolean;
}

export const BusinessPreparationModes = ({
  preparationModes,
  handleChange,
  isBackoffice,
}: BusinessPreparationModesProps) => {
  return (
    <Box>
      <SectionTitle>
        {t('Tipos de pedido')}
        <Badge
          ml="2"
          mt="-12px"
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
      </SectionTitle>
      {!isBackoffice && (
        <Text mt="2" fontSize="md">
          {t('Selecione os tipos de pedido que o restaurante aceita receber')}
        </Text>
      )}
      <CheckboxGroup
        colorScheme="green"
        value={preparationModes}
        onChange={(values: PreparationMode[]) => handleChange(values)}
      >
        <HStack
          mt="4"
          alignItems="flex-start"
          color="black"
          spacing={8}
          fontSize="16px"
          lineHeight="22px"
        >
          <CustomCheckbox value="realtime">{t('Tempo real')}</CustomCheckbox>
          <CustomCheckbox value="scheduled">{t('Agendado')}</CustomCheckbox>
        </HStack>
      </CheckboxGroup>
    </Box>
  );
};
