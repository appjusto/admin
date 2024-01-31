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
  const color = isBusinessOpen ? 'green.500' : 'red';
  const statusLabel = isBusinessOpen ? 'Aberto agora' : 'Fechado';
  // UI
  return (
    <HStack mt="1" spacing={2} alignItems="center">
      <Circle mt="0.5px" size="8px" bg={color} {...props} />
      <Text fontSize="md">{t(statusLabel)}</Text>
      {business?.situation === 'approved' && !business?.enabled ? (
        <Tooltip
          placement="right"
          bg="yellow"
          color="black"
          hasArrow
          label={t(
            'O restaurante não está visível no marketplace. Para deixá-lo visível, vá até a seção de "visibilidade no marketplace" no menu "operação" ou contate o administrador desta unidade'
          )}
        >
          <Center mt="0.5px">
            <Icon w="16px" h="16px" cursor="pointer" as={MdErrorOutline} />
          </Center>
        </Tooltip>
      ) : null}
    </HStack>
  );
};
