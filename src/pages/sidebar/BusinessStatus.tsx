import {
  Center,
  Circle,
  HStack,
  Icon,
  SquareProps,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useOrdersContext } from 'app/state/order';
import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { t } from 'utils/i18n';

export const BusinessStatus = (props: SquareProps) => {
  // context
  const { business } = useContextBusiness();
  const { isBusinessOpen } = useOrdersContext();
  // helpers
  const color = React.useMemo(() => {
    if (isBusinessOpen && business?.enabled) return 'green.500';
    else return 'red';
  }, [business?.enabled, isBusinessOpen]);
  const label = React.useMemo(() => {
    if (!business?.enabled) return 'Invisível';
    if (isBusinessOpen) return 'Aberto agora';
    else return 'Fechado';
  }, [business?.enabled, isBusinessOpen]);
  // UI
  return (
    <HStack mt="1" spacing={2} alignItems="center">
      <Circle mt="0.5px" size="8px" bg={color} {...props} />
      <Text fontSize="md">{t(label)}</Text>
      {!business?.enabled && (
        <Tooltip
          placement="right"
          bg="yellow"
          color="black"
          hasArrow
          label={t(
            'Seu restaurante não aparecerá para seus clientes. Para deixá-lo visível, vá até a seção de "visibilidade" no menu "operação" ou contate o administrador desta unidade.'
          )}
        >
          <Center mt="0.5px">
            <Icon w="16px" h="16px" cursor="pointer" as={MdErrorOutline} />
          </Center>
        </Tooltip>
      )}
    </HStack>
  );
};
