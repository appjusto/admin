import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { FiPackage } from 'react-icons/fi';
import {
  MdErrorOutline,
  MdMoped,
  MdOutlineSportsMotorsports,
  MdPolicy,
  MdRestaurant,
} from 'react-icons/md';
import { RiChat3Line, RiUserSearchLine } from 'react-icons/ri';

export type IconsConfig = {
  isStaff?: boolean;
  isUnsafe?: boolean;
  isIssue?: boolean;
  isMessages?: boolean;
  isConfirmedOverLimit?: boolean;
  courierIconStatus?: { bg: string; border: string; color: string };
  isPickupOverLimit?: boolean;
  isDispatchingOverLimit?: boolean;
};

interface OrderItemIconsProps {
  config: IconsConfig;
}

export const OrderItemIcons = ({ config }: OrderItemIconsProps) => {
  const {
    isStaff,
    isUnsafe,
    isIssue,
    isMessages,
    isConfirmedOverLimit,
    courierIconStatus,
    isPickupOverLimit,
    isDispatchingOverLimit,
  } = config;
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
          border={courierIconStatus.border}
          borderRadius="lg"
        >
          <Icon
            as={MdOutlineSportsMotorsports}
            w="20px"
            h="20px"
            color={courierIconStatus.color}
          />
        </Flex>
      )}
      {isPickupOverLimit !== undefined && (
        <Flex
          w="24px"
          h="24px"
          position="relative"
          justifyContent="center"
          alignItems="center"
          bg={isPickupOverLimit ? 'red' : 'none'}
          borderRadius="lg"
        >
          <Icon
            as={FiPackage}
            w="19px"
            h="19px"
            color={isPickupOverLimit ? 'white' : '#C8D7CB'}
          />
        </Flex>
      )}
      {isDispatchingOverLimit !== undefined && (
        <Flex
          w="24px"
          h="24px"
          position="relative"
          justifyContent="center"
          alignItems="center"
          bg={isDispatchingOverLimit ? 'red' : 'none'}
          borderRadius="lg"
        >
          <Icon
            as={MdMoped}
            w="20px"
            h="20px"
            color={isDispatchingOverLimit ? 'white' : '#C8D7CB'}
          />
        </Flex>
      )}
    </>
  );
};
