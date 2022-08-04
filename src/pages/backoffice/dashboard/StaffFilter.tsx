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
  Tooltip
} from '@chakra-ui/react';
import React from 'react';
import { RiCheckLine, RiEqualizerLine } from 'react-icons/ri';
import { t } from 'utils/i18n';

export type StaffFilterOptions = 'all' | 'staff' | 'none';

interface StaffFilterProps {
  currentValue: StaffFilterOptions;
  handleFilter(value: StaffFilterOptions): void;
}

export const StaffFilter = ({ currentValue, handleFilter }: StaffFilterProps) => {
  // state
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  // handlers
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const handleFilterSelect = (value: StaffFilterOptions) => {
    close();
    if (value === 'staff' || value === 'none') setIsActive(true);
    else setIsActive(false);
    handleFilter(value);
  };
  // UI
  return (
    <Tooltip
      placement="top"
      label={isActive ? t('Filtro ativo') : t('Filtro')}
      aria-label={t('filtro')}
    >
      <Flex px="4" alignItems="center">
        <Popover placement="bottom-end" isOpen={isOpen} onClose={close}>
          <PopoverTrigger>
            <Center
              w="24px"
              h="24px"
              bgColor={isActive ? '#697667' : 'transparent'}
              borderRadius="lg"
              onClick={open}
            >
              <Icon
                as={RiEqualizerLine}
                w="20px"
                h="20px"
                cursor="pointer"
                color={isActive ? 'white' : '#697667'}
              />
            </Center>
          </PopoverTrigger>
          <PopoverContent maxW="160px" bg="#697667" color="white" _focus={{ outline: 'none' }}>
            <PopoverHeader fontWeight="semibold">{t('Visualizar:')}</PopoverHeader>
            <PopoverArrow bg="#697667" />
            <PopoverCloseButton mt="1" />
            <PopoverBody p="0" m="0">
              <Flex
                flexDir="row"
                alignItems="center"
                px="3"
                py="1"
                cursor="pointer"
                _hover={{ bgColor: '#EEEEEE', color: '#697667' }}
                onClick={() => handleFilterSelect('all')}
              >
                <Text>{t('Todos')}</Text>
                {currentValue === 'all' && <Icon ml="1" as={RiCheckLine} />}
              </Flex>
              <Flex
                flexDir="row"
                alignItems="center"
                px="3"
                py="1"
                cursor="pointer"
                _hover={{ bgColor: '#EEEEEE', color: '#697667' }}
                onClick={() => handleFilterSelect('staff')}
              >
                <Text>{t('Assumidos')}</Text>
                {currentValue === 'staff' && <Icon ml="1" as={RiCheckLine} />}
              </Flex>
              <Flex
                flexDir="row"
                alignItems="center"
                px="3"
                py="1"
                cursor="pointer"
                _hover={{ bgColor: '#EEEEEE', color: '#697667' }}
                onClick={() => handleFilterSelect('none')}
              >
                <Text>{t('Sem agente')}</Text>
                {currentValue === 'none' && <Icon ml="1" as={RiCheckLine} />}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Tooltip>
  );
};
