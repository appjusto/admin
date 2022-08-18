import { Order, WithId } from '@appjusto/types';
import { Box, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import {
  MdErrorOutline,
  MdMoped,
  MdPolicy,
  MdRestaurant,
} from 'react-icons/md';
import { RiChat3Line, RiUserSearchLine } from 'react-icons/ri';
import { useRouteMatch } from 'react-router-dom';
import { getTimestampMilliseconds, getTimeUntilNow } from 'utils/functions';
import { ListType } from './BOList';
import { CustomLink } from './CustomLink';
import { getOrderMatchingColor } from './utils';

interface Props {
  listType: ListType;
  order: WithId<Order>;
}

type IconsConfig = {
  isStaff?: boolean;
  isUnsafe?: boolean;
  isIssue?: boolean;
  isMessages?: boolean;
  isConfirmedOverLimit?: boolean;
  courierIconStatus?: { bg: string; color: string };
};

const renderIcons = (iconsConfig: IconsConfig) => {
  // props
  const {
    isStaff,
    isUnsafe,
    isIssue,
    isMessages,
    isConfirmedOverLimit,
    courierIconStatus,
  } = iconsConfig;
  // UI
  return (
    <>
      {isStaff !== undefined && (
        <Flex
          w="24px"
          h="24px"
          justifyContent="center"
          alignItems="center"
          bg={isStaff ? '#6CE787' : 'none'}
          borderRadius="lg"
        >
          <RiUserSearchLine color={isStaff ? 'black' : '#C8D7CB'} />
        </Flex>
      )}
      {isUnsafe !== undefined && (
        <Flex
          w="24px"
          h="24px"
          justifyContent="center"
          alignItems="center"
          borderRadius="12px"
          border="2px solid"
          borderColor={isUnsafe ? 'red' : 'transparent'}
        >
          <MdPolicy color={isUnsafe ? 'red' : '#C8D7CB'} />
        </Flex>
      )}
      {isIssue !== undefined && (
        <Flex
          w="24px"
          h="24px"
          justifyContent="center"
          alignItems="center"
          bg={isIssue ? 'red' : 'none'}
          borderRadius="lg"
        >
          <MdErrorOutline color={isIssue ? 'white' : '#C8D7CB'} />
        </Flex>
      )}
      {isMessages !== undefined && (
        <Flex
          w="24px"
          h="24px"
          justifyContent="center"
          alignItems="center"
          bg={isMessages ? '#6CE787' : 'none'}
          borderRadius="lg"
        >
          <Icon as={RiChat3Line} color={isMessages ? 'black' : '#C8D7CB'} />
        </Flex>
      )}
      {isConfirmedOverLimit !== undefined && (
        <Flex
          w="24px"
          h="24px"
          justifyContent="center"
          alignItems="center"
          bg={isConfirmedOverLimit ? 'red' : 'none'}
          borderRadius="lg"
        >
          <Icon
            as={MdRestaurant}
            color={isConfirmedOverLimit ? 'white' : '#C8D7CB'}
          />
        </Flex>
      )}
      {courierIconStatus !== undefined && (
        <Flex
          w="24px"
          h="24px"
          position="relative"
          justifyContent="center"
          alignItems="center"
          bg={courierIconStatus.bg}
          borderRadius="lg"
        >
          <Icon
            as={MdMoped}
            w="20px"
            h="20px"
            color={courierIconStatus.color}
          />
        </Flex>
      )}
    </>
  );
};

export const BOOrderListItem = ({ listType, order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  const { isBackofficeSuperuser } = useContextFirebaseUser();
  // state
  const [orderDT, setOrderDT] = React.useState<number>();
  // refs
  const itemRef = React.useRef<HTMLDivElement>(null);
  // helpers
  let iconsConfig = {} as IconsConfig;
  if (isBackofficeSuperuser) {
    iconsConfig.isStaff = typeof order.staff?.id === 'string';
  }
  if (listType === 'orders-watched') {
    iconsConfig.isMessages = order.flags && order.flags.includes('chat');
  }
  if (listType === 'orders-watched' || listType === 'orders-unsafe') {
    iconsConfig.isUnsafe = order.flags && order.flags.includes('unsafe');
  }
  if (listType === 'orders-watched' || listType === 'orders-issue') {
    iconsConfig.isIssue = order.flags && order.flags.includes('issue');
  }
  if (listType === 'orders-watched' || listType === 'orders-warning') {
    const courierIconStatus = getOrderMatchingColor(
      order.status,
      order.dispatchingStatus,
      order.courier?.id
    );
    const isConfirmedOverLimit =
      order.flags && order.flags.includes('waiting-confirmation');
    iconsConfig = {
      ...iconsConfig,
      isConfirmedOverLimit,
      courierIconStatus,
    };
  }
  // side effects
  React.useEffect(() => {
    const setNewTime = () => {
      const now = getServerTime().getTime();
      const comparisonTime = order.scheduledTo
        ? order.timestamps.confirmed
        : order.timestamps.charged;
      const chargedOn = getTimestampMilliseconds(comparisonTime as Timestamp);
      const time = chargedOn ? getTimeUntilNow(now, chargedOn) : null;
      if (time) setOrderDT(time);
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    return () => clearInterval(timeInterval);
  }, [getServerTime, order]);
  // UI
  return (
    <CustomLink
      to={`${url}/order/${order?.id}`}
      bg={orderDT && orderDT > 40 ? '#FBD7D7' : 'white'}
      py="4"
    >
      <Flex ref={itemRef} flexDir="row" justifyContent="space-between">
        <Box>
          <Image
            src={order?.type === 'food' ? foodIcon : p2pIcon}
            w="24px"
            h="24px"
          />
        </Box>
        <Text fontSize="sm" lineHeight="21px" color="black">
          #{order?.code}
        </Text>
        <Text fontSize="sm" lineHeight="21px">
          {orderDT ? `${orderDT}min` : 'Agora'}
        </Text>
        {renderIcons(iconsConfig)}
      </Flex>
    </CustomLink>
  );
};
