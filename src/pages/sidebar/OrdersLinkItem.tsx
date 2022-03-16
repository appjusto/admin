import { Badge, Box, Flex, Link } from '@chakra-ui/react';
import { useOrdersContext } from 'app/state/order';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

interface LinkItemProps {
  to: string;
}

export const OrdersLinkItem = ({ to }: LinkItemProps) => {
  // contex
  const { confirmedNumber } = useOrdersContext();
  let match = useRouteMatch({
    path: to,
    exact: true,
  });
  // state
  const [alertBgColor, setAlertBgColor] = React.useState('');
  // side effects
  React.useEffect(() => {
    let alertInterval: NodeJS.Timeout;
    if (confirmedNumber > 0) {
      alertInterval = setInterval(() => {
        setAlertBgColor((prev) => {
          if (prev.length > 0) return '';
          else return '#DAFFE2';
        });
      }, 1000);
    } else {
      // @ts-ignore
      clearInterval(alertInterval);
    }
    return () => clearInterval(alertInterval);
  }, [confirmedNumber]);
  // UI
  return (
    <Flex
      alignItems="center"
      bg={match ? 'white' : alertBgColor}
      fontSize="sm"
      fontWeight={match ? '700' : ''}
      pl={match ? '0' : '6'}
      height="34px"
      cursor="pointer"
      _hover={{ bg: 'white' }}
    >
      {match ? <Box w="4px" h="36px" bg="green.500" borderRadius="8px" ml="1" mr="4" /> : null}
      <Link
        as={RouterLink}
        to={to}
        w="100%"
        height="100%"
        display="flex"
        alignItems="center"
        aria-label="sidebar-link-gerenciador-de-pedidos"
        _hover={{ textDecor: 'none' }}
        _focus={{ outline: 'none' }}
      >
        {t('Gerenciador de pedidos')}
        {confirmedNumber > 0 && (
          <Badge
            ml="2"
            w="22px"
            h="18px"
            fontSize="13px"
            borderRadius="6px"
            bgColor="#78E08F"
            color="white"
            textAlign="center"
          >
            {confirmedNumber}
          </Badge>
        )}
      </Link>
    </Flex>
  );
};
