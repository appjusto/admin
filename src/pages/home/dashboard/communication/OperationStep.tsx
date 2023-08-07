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
  btnLabel: string;
  link: string;
}

export const OperationStep = ({
  icon,
  title,
  description,
  time,
  btnLabel,
  link,
}: OperationStepProps) => {
  return (
    <Flex
      mt="4"
      justifyContent="space-between"
      alignItems="center"
      px="4"
      py="6"
      bgColor="#F6F6F6"
      borderRadius="lg"
    >
      <Flex>
        <Center bgColor="#C8D7CB" borderRadius="lg" w="56px" h="56px">
          <Icon as={icon} w="6" h="6" />
        </Center>
        <Box ml="4">
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
      <Link href={link} isExternal>
        <Button size="md" fontSize="sm">
          {btnLabel}
        </Button>
      </Link>
    </Flex>
  );
};
