import { OrderCourier } from "@appjusto/types";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from "pages/backoffice/drawers/generics/SectionTitle";
import React from "react";
import { t } from "utils/i18n";

interface CourierAllocationProps {
  orderId: string;
  courier?: OrderCourier | null;
}

export const CourierAllocation = ({ orderId, courier }: CourierAllocationProps) => {
  // state
  const [courierCode, setCourierCode] = React.useState('');
  // helpers
  const isCourierAllocated = typeof courier?.id === 'string';
  // handlers
  const handleCodeInput = (value: string) => {
    const serialized = value.replace(/[\W_]+/g,'');
    setCourierCode(serialized);
  }
  const handleCourierAllocation = () => {
    console.log("Code", courierCode);
  }
  // UI
  return (
    <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
      <SectionTitle mt="0">
        {
          isCourierAllocated ? t('Entregador alocado') : t('Alocar entregador ao pedido')
        }
      </SectionTitle>
      {
        isCourierAllocated ? (
          <Box>
            <Text mt="4" fontWeight="700">
              {t('Nome:')}
              <Text as="span" fontWeight="500">
                {courier?.name ?? 'N/E'}
              </Text>
            </Text>
          </Box>
        ) : (
          <HStack mt="4">
            <CustomInput
              mt="0"
              id="courier-allocation-code"
              label={t('Informe o código do entregador')}
              placeholder={t('Ex: WNJKSDT')}
              value={courierCode}
              onChange={(ev) => handleCodeInput(ev.target.value)}
            />
            <Button
              h="60px"
              w="40%"
              onClick={handleCourierAllocation}
              // isLoading={resul.isLoading}
            >
              {t('Alocar')}
            </Button>
          </HStack>
        )
      }
    </Box>
  )
}