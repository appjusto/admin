import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react';
import { IoMdTime } from 'react-icons/io';

interface OperationStepProps {
  icon: any;
  title: string;
  description: string | React.ReactNode;
  time: string;
  btnLabel?: string;
  link?: string;
  action?: React.ReactNode;
}

export const OperationStep = ({
  icon,
  title,
  description,
  time,
  btnLabel,
  link,
  action,
}: OperationStepProps) => {
  return (
    <Flex
      mt="4"
      flexDir={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      px="4"
      py="6"
      bgColor="#F6F6F6"
      borderRadius="lg"
    >
      <Flex>
        <Center
          bgColor="#C8D7CB"
          borderRadius="lg"
          w="56px"
          minW="56px"
          h="56px"
        >
          <Icon as={icon} w="6" h="6" />
        </Center>
        <Box ml="4" maxW="554px">
          <Text fontWeight="semibold">{title}</Text>
          {typeof description === 'string' ? (
            <Text>{description}</Text>
          ) : (
            description
          )}
          <HStack mt="2">
            <Icon as={IoMdTime} />
            <Text fontSize="sm">{time}</Text>
          </HStack>
        </Box>
      </Flex>
      {link && btnLabel && (
        <Link href={link} w={{ base: '100%', md: 'auto' }} isExternal>
          <Button
            mt={{ base: '4', md: '0' }}
            size="md"
            fontSize="sm"
            minW="112px"
            w={{ base: '100%', md: 'auto' }}
          >
            {btnLabel}
          </Button>
        </Link>
      )}
      {action}
    </Flex>
  );
};
