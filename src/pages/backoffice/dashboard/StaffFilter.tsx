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
  Tooltip,
} from '@chakra-ui/react';
import { isEqual } from 'lodash';
import React from 'react';
import { RiCheckLine, RiEqualizerLine } from 'react-icons/ri';
import { t } from 'utils/i18n';

// where the first option should be all
export type FilterOptions = {
  label: string;
  value: string[];
}[];

interface StaffFilterProps {
  options: FilterOptions;
  currentValue: string[];
  handleFilter(value: string[]): void;
}

export const StaffFilter = ({
  options,
  currentValue,
  handleFilter,
}: StaffFilterProps) => {
  // state
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  // handlers
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const handleFilterSelect = (value: string[]) => {
    if (value !== options[0].value) setIsActive(true);
    else setIsActive(false);
    handleFilter(value);
    close();
  };
  // UI
  return (
    <Tooltip
      placement="top"
      label={isActive ? t('Filtro ativo') : t('Filtro')}
      aria-label={t('filtro')}
    >
      <Flex alignItems="center">
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
          <PopoverContent
            maxW="180px"
            bg="#697667"
            color="white"
            _focus={{ outline: 'none' }}
          >
            <PopoverHeader fontWeight="semibold">
              {t('Visualizar:')}
            </PopoverHeader>
            <PopoverArrow bg="#697667" />
            <PopoverCloseButton mt="1" />
            <PopoverBody p="0" m="0">
              {options.map((option) => (
                <Flex
                  key={option.value.join()}
                  flexDir="row"
                  alignItems="center"
                  px="3"
                  py="1"
                  cursor="pointer"
                  _hover={{ bgColor: '#EEEEEE', color: '#697667' }}
                  onClick={() => handleFilterSelect(option.value)}
                >
                  <Text>{option.label}</Text>
                  {isEqual(currentValue, option.value) && (
                    <Icon ml="1" as={RiCheckLine} />
                  )}
                </Flex>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Tooltip>
  );
};
