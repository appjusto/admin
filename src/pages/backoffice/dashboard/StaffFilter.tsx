import {
  Center,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { RiEqualizerLine } from 'react-icons/ri';
import { t } from 'utils/i18n';

export type StaffFilterOptions = 'all' | 'my';

interface StaffFilterProps {
  handleFilter(value: StaffFilterOptions): void;
}

export const StaffFilter = ({ handleFilter }: StaffFilterProps) => {
  // UI
  return (
    <Flex px="4" alignItems="center">
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Center>
            <Icon as={RiEqualizerLine} w="20px" h="20px" cursor="pointer" />
          </Center>
        </PopoverTrigger>
        <PopoverContent maxW="160px" bg="#697667" color="white" _focus={{ outline: 'none' }}>
          <PopoverHeader fontWeight="semibold">{t('Visualizar:')}</PopoverHeader>
          <PopoverArrow bg="#697667" />
          <PopoverCloseButton mt="1" />
          <PopoverBody p="0" m="0">
            <Text
              px="3"
              py="1"
              cursor="pointer"
              _hover={{ bgColor: '#EEEEEE', color: '#697667' }}
              onClick={() => handleFilter('all')}
            >
              {t('Todos')}
            </Text>
            <Text
              px="3"
              py="1"
              cursor="pointer"
              _hover={{ bgColor: '#EEEEEE', color: '#697667' }}
              onClick={() => handleFilter('my')}
            >
              {t('Os meus')}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
