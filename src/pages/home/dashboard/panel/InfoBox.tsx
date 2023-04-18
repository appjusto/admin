import {
  Box,
  BoxProps,
  Circle,
  HStack,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { isEqual } from 'lodash';
import React from 'react';

interface InfoBoxProps extends BoxProps {
  isJoined?: boolean;
  data?: any;
  title: string;
  titleColor?: string;
  circleBg?: string;
  children: React.ReactNode | React.ReactNode[];
}

const InfoBox = ({
  isJoined,
  data,
  title,
  titleColor = '#505A4F',
  circleBg,
  children,
  ...props
}: InfoBoxProps) => {
  if (isJoined)
    return (
      <Box {...props}>
        <Text color={titleColor} fontSize="15px" lineHeight="21px">
          {title}
        </Text>
        {data !== undefined ? (
          children
        ) : (
          <Box>
            <Skeleton mt="1" height="30px" colorScheme="#9AA49C" />
            <Skeleton mt="2" height="20px" mr="4" colorScheme="#9AA49C" />
          </Box>
        )}
      </Box>
    );
  return (
    <Box
      w={{ base: '100%', lg: '190px' }}
      h="132px"
      py="4"
      px="6"
      border="1px solid #E5E5E5"
      borderRadius="lg"
      alignItems="flex-start"
      {...props}
    >
      <HStack ml={circleBg ? '-16px' : '0'}>
        {circleBg && <Circle size="8px" bg={circleBg} />}
        <Text color={titleColor} fontSize="15px" lineHeight="21px">
          {title}
        </Text>
      </HStack>
      {data !== undefined ? (
        children
      ) : (
        <Box>
          <Skeleton
            mt="1"
            height="30px"
            colorScheme="#9AA49C"
            fadeDuration={0.2}
          />
          <Skeleton
            mt="2"
            height="20px"
            mr="4"
            colorScheme="#9AA49C"
            fadeDuration={0.2}
          />
        </Box>
      )}
    </Box>
  );
};

const areEqual = (prevProps: InfoBoxProps, nextProps: InfoBoxProps) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(InfoBox, areEqual);
