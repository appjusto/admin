import { ScheduleObject } from '@appjusto/types';
import { CloseIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Text,
} from '@chakra-ui/react';
import { CustomPatternInput as Input } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  timeFormatter,
  TimeMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';

interface DayScheduleProps {
  index: number;
  day: ScheduleObject;
  handleCheck(value: boolean): void;
  clearDaySchedule(): void;
  onChangeValue(index: number, field: string, value: string): void;
  autoCompleteSchedules(index: number, field: string, value: string): void;
  addScheduleItem(): void;
  removeScheduleItem(itemIndex: number): void;
  replicate(): void;
}

type MainAvailability = 'when-is-open' | 'defined';

export const DaySchedule = ({
  index,
  day,
  handleCheck,
  clearDaySchedule,
  onChangeValue,
  autoCompleteSchedules,
  addScheduleItem,
  removeScheduleItem,
  replicate,
}: DayScheduleProps) => {
  // props
  const { day: weekDay, checked, schedule } = day;
  // state
  const [availability, setAvailability] =
    React.useState<MainAvailability>('when-is-open');
  const [warning, setWarning] = React.useState<string>();
  // helpers
  const weekDayLowerCase = weekDay.toLowerCase();
  // handlers
  const inputValidation = (from: string, to: string, beforeTo?: string) => {
    if (from === '' || to === '') return true;
    if (from.length < 4 || to.length < 4) return true;
    if (beforeTo && beforeTo >= from) return false;
    return Number(from) < Number(to);
  };
  const handleAvailability = (value: MainAvailability) => {
    setAvailability(value);
    if (value === 'when-is-open') clearDaySchedule();
  };
  const handleChangeItemsNumber = (
    type: 'add' | 'remove',
    itemIndex?: number
  ) => {
    if (type === 'add') {
      if (schedule[0].from === '')
        return setWarning('Favor preencher os horários do primeiro turno');
      addScheduleItem();
    } else if (itemIndex) removeScheduleItem(itemIndex);
  };
  // side effects
  React.useEffect(() => {
    setWarning(undefined);
    if (schedule.length > 0 && schedule[0].from !== '')
      setAvailability('defined');
    else setAvailability('when-is-open');
  }, [schedule]);
  // UI
  return (
    <Flex flexDir="column" mt="8">
      <Checkbox
        aria-label={`${weekDayLowerCase}-checkbox`}
        colorScheme="green"
        size="lg"
        spacing="1rem"
        iconSize="1rem"
        isChecked={checked}
        onChange={(e) => handleCheck(e.target.checked)}
      >
        {weekDay}
      </Checkbox>
      {checked && (
        <RadioGroup
          mt="2"
          onChange={handleAvailability}
          value={availability}
          defaultValue="when-is-open"
          colorScheme="green"
          color="black"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            <Radio
              mt="2"
              value="when-is-open"
              aria-label={`${weekDayLowerCase}-no-break`}
            >
              {t('Enquanto estiver aberto')}
            </Radio>
            <Radio
              mt="2"
              value="defined"
              aria-label={`${weekDayLowerCase}-defined`}
            >
              {t('Definir horário específico')}
            </Radio>
          </Flex>
        </RadioGroup>
      )}
      {checked && availability === 'defined' && (
        <>
          {schedule.map((item, index) => {
            let beforeTo = undefined;
            if (index > 0) beforeTo = schedule[index - 1].to;
            return (
              <Flex key={index} flexDir="row" maxW="310px">
                <Input
                  w="100%"
                  maxW="150px"
                  id={`${weekDayLowerCase}-from-${index}`}
                  label={t('Início')}
                  aria-label={`${weekDayLowerCase}-from-${index}`}
                  value={item.from}
                  validationLength={4}
                  onValueChange={(value) => onChangeValue(index, 'from', value)}
                  placeholder="00:00"
                  mask={TimeMask}
                  formatter={timeFormatter}
                  parser={numbersOnlyParser}
                  onBlur={() => autoCompleteSchedules(index, 'from', item.from)}
                  isInvalid={!inputValidation(item.from, item.to, beforeTo)}
                  isRequired
                />
                <Input
                  w="100%"
                  ml="2"
                  maxW="200px"
                  id={`${weekDayLowerCase}-to-${index}`}
                  label={t('Término')}
                  aria-label={`${weekDayLowerCase}-to-${index}`}
                  value={item.to}
                  validationLength={4}
                  onValueChange={(value) => onChangeValue(index, 'to', value)}
                  placeholder="00:00"
                  mask={TimeMask}
                  formatter={timeFormatter}
                  parser={numbersOnlyParser}
                  onBlur={() => autoCompleteSchedules(index, 'to', item.to)}
                  isInvalid={!inputValidation(item.from, item.to, beforeTo)}
                  isRequired
                />
                <Flex
                  ml="4"
                  mt="4"
                  minW="30px"
                  justifyContent="center"
                  alignItems="center"
                >
                  {schedule.length > 1 && (
                    <Button
                      aria-label={`${weekDayLowerCase}-close-${index}`}
                      variant="outline"
                      size="sm"
                      maxW="30px"
                      borderColor="#F2F6EA"
                      onClick={() => handleChangeItemsNumber('remove', index)}
                    >
                      <CloseIcon fontSize="0.6rem" />
                    </Button>
                  )}
                </Flex>
              </Flex>
            );
          })}
          {warning !== undefined && (
            <Text mt="2" fontSize="xs" fontWeight="700" color="red">
              <InfoOutlineIcon mt="-2px" mr="2" />
              {warning}
            </Text>
          )}
          {schedule.length < 4 && (
            <Text
              mt="4"
              fontSize="xs"
              fontWeight="700"
              color="green.600"
              cursor="pointer"
              aria-label={`adicionar-turno-${weekDayLowerCase}`}
              onClick={() => handleChangeItemsNumber('add')}
              _hover={{ textDecor: 'underline' }}
            >
              {t('Adicionar turno')}
            </Text>
          )}
        </>
      )}
      {index > 0 && (
        <Text
          mt="4"
          fontSize="xs"
          fontWeight="700"
          color="green.600"
          cursor="pointer"
          aria-label={`replicar-anterior-${weekDayLowerCase}`}
          onClick={replicate}
          _hover={{ textDecor: 'underline' }}
        >
          {t('Replicar horário anterior')}
        </Text>
      )}
    </Flex>
  );
};
