import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { ScheduleObject } from 'appjusto-types/business';
import { CustomPatternInput as Input } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { TimeFormatter, TimeMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';

interface DayScheduleProps {
  day: ScheduleObject;
  handleCheck(value: boolean): void;
  onChangeValue(index: number, field: string, value: string): void;
  autoCompleteSchedules(index: number, field: string, value: string): void;
  addScheduleItem(): void;
  removeScheduleItem(itemIndex: number): void;
}

type MainAvailability = 'when-is-open' | 'defined';

const scheduleObj = { from: '', to: '' };

export const DaySchedule = ({
  day,
  handleCheck,
  onChangeValue,
  autoCompleteSchedules,
  addScheduleItem,
  removeScheduleItem,
}: DayScheduleProps) => {
  // props
  const { day: weekDay, checked, schedule } = day;
  // state
  //const [checkedDay, setCheckedDay] = React.useState(false);
  const [availability, setAvailability] = React.useState<MainAvailability>('when-is-open');

  // handlers
  const inputValidation = (from: string, to: string, beforeTo?: string) => {
    if (from === '' || to === '') return true;
    if (from.length < 4 || to.length < 4) return true;
    if (beforeTo && beforeTo > from) return false;
    return Number(from) < Number(to);
  };

  // side effects
  React.useEffect(() => {
    if (schedule[0].from !== '') setAvailability('defined');
    else setAvailability('when-is-open');
  }, []);

  // UI
  return (
    <Flex flexDir="column" mt="8">
      <Checkbox
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
          onChange={(value: MainAvailability) => setAvailability(value)}
          value={availability}
          defaultValue="1"
          colorScheme="green"
          color="black"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            <Radio mt="2" value="when-is-open">
              {t('Enquanto estiver aberto')}
            </Radio>
            <Radio mt="2" value="defined">
              {t('Definir horário específico')}
            </Radio>
          </Flex>
        </RadioGroup>
      )}
      {checked && availability === 'defined' && (
        <>
          {schedule.map((item, index) => {
            let beforeTo = undefined;
            if (index === 1) beforeTo = schedule[0].to;
            return (
              <Flex key={index} flexDir="row" maxW="310px">
                <Input
                  w="100%"
                  maxW="150px"
                  id={`${weekDay}-from-1`}
                  label={t('Início')}
                  value={item.from}
                  validationLength={4}
                  onValueChange={(value) => onChangeValue(index, 'from', value)}
                  placeholder="00:00"
                  mask={TimeMask}
                  formatter={TimeFormatter}
                  parser={numbersOnlyParser}
                  onBlur={() => autoCompleteSchedules(index, 'from', item.from)}
                  isInvalid={!inputValidation(item.from, item.to, beforeTo)}
                  isRequired
                />
                <Input
                  w="100%"
                  ml="2"
                  maxW="200px"
                  id={`${weekDay}-to-1`}
                  label={t('Término')}
                  value={item.to}
                  validationLength={4}
                  onValueChange={(value) => onChangeValue(index, 'to', value)}
                  placeholder="00:00"
                  mask={TimeMask}
                  formatter={TimeFormatter}
                  parser={numbersOnlyParser}
                  onBlur={() => autoCompleteSchedules(index, 'to', item.to)}
                  isInvalid={!inputValidation(item.from, item.to, beforeTo)}
                  isRequired
                />
                <Flex ml="4" mt="4" minW="30px" justifyContent="center" alignItems="center">
                  {schedule.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      maxW="30px"
                      borderColor="#F2F6EA"
                      onClick={() => removeScheduleItem(index)}
                    >
                      <CloseIcon fontSize="0.6rem" />
                    </Button>
                  )}
                </Flex>
              </Flex>
            );
          })}
          {schedule.length < 2 && (
            <Text
              mt="4"
              fontSize="xs"
              fontWeight="700"
              color="green.600"
              cursor="pointer"
              onClick={addScheduleItem}
            >
              {t('Adicionar horário')}
            </Text>
          )}
        </>
      )}
    </Flex>
  );
};
