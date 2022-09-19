import { OrderFlag } from '@appjusto/types';
import {
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { initialAutoFlags } from 'app/state/dashboards/backoffice';
import { isEqual } from 'lodash';
import React from 'react';
import { RiEqualizerLine } from 'react-icons/ri';
import { t } from 'utils/i18n';

// where the first option should be all
export type FilterOptions = {
  label: string;
  value: string;
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
  const handleSelectAll = (isChecked: boolean) => {
    setIsActive(!isChecked);
    if (isChecked) {
      handleFilter(initialAutoFlags);
      close();
    }
  };
  const handleSelect = (values: string[]) => {
    // avoid to make the query with empty an array
    if (values.length > 0) {
      handleFilter(values);
    }
  };
  // side effects
  React.useEffect(() => {
    const isAllSelected = isEqual(currentValue.sort(), initialAutoFlags.sort());
    setIsActive(!isAllSelected);
  }, [currentValue]);
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
            maxW="220px"
            bg="#697667"
            color="white"
            _focus={{ outline: 'none' }}
          >
            <PopoverHeader fontWeight="semibold">
              {t('Visualizar:')}
            </PopoverHeader>
            <PopoverArrow bg="#697667" />
            <PopoverCloseButton mt="1" />
            <PopoverBody
              px="2"
              py="2"
              m="0"
              bg="#EEEEEE"
              border="2px solid #697667"
              borderRadius="0 0 6px 6px"
              color="black"
            >
              <Checkbox
                mb="2"
                colorScheme="green"
                isChecked={!isActive}
                onChange={(ev) => handleSelectAll(ev.target.checked)}
              >
                {t('Todos')}
              </Checkbox>
              <CheckboxGroup
                colorScheme="green"
                value={currentValue}
                onChange={(values: OrderFlag[]) => handleSelect(values)}
              >
                <VStack spacing={2} alignItems="flex-start">
                  {options.map((option) => (
                    <Checkbox key={option.value} value={option.value}>
                      {option.label}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Tooltip>
  );
};
