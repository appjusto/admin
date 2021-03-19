import { Checkbox, Flex, HStack, Link, Radio, RadioGroup } from '@chakra-ui/react';
import { CustomPatternInput as Input } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { TimeFormatter, TimeMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';

type Value = { from: string; to: string }[];

interface DayScheduleProps {
  index: number;
  weekDay: string;
  isChecked: boolean;
  value: Value;
  handleCheck(value: boolean): void;
  handleBreak(value: string): void;
  onChangeValue(index: number, field: string, value: string): void;
  replicate(): void;
}

export const DaySchedule = ({
  index,
  weekDay,
  isChecked,
  value,
  handleCheck,
  handleBreak,
  onChangeValue,
  replicate,
}: DayScheduleProps) => {
  // state
  const [breakValue, setBreakValue] = React.useState('1');
  // side effects
  React.useEffect(() => {
    if (value.length > 1) {
      setBreakValue('2');
    } else {
      setBreakValue('1');
    }
  }, [value]);
  return (
    <Flex flexDir="column" mt="8">
      <Checkbox
        width="120px"
        colorScheme="green"
        size="lg"
        spacing="1rem"
        iconSize="1rem"
        isChecked={isChecked}
        onChange={(e) => handleCheck(e.target.checked)}
      >
        {t(`${weekDay}`)}
      </Checkbox>
      {isChecked && (
        <RadioGroup
          mt="2"
          onChange={(value) => handleBreak(value.toString())}
          value={breakValue}
          defaultValue="1"
          colorScheme="green"
          color="black"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            <Radio mt="2" value="1">
              {t('Sem pausa')}
            </Radio>
            <Radio mt="2" value="2">
              {t('O restaurante faz uma pausa durante o dia')}
            </Radio>
          </Flex>
        </RadioGroup>
      )}
      {isChecked && (
        <HStack spacing={4}>
          {value.map((schedule, index) => (
            <Flex flexDir="row" maxW="310px">
              <Input
                w="100%"
                maxW="150px"
                id={`${weekDay}-from-1`}
                label={t('Início')}
                value={schedule.from}
                validationLength={4}
                onValueChange={(value) => onChangeValue(index, 'from', value)}
                placeholder="00:00"
                mask={TimeMask}
                formatter={TimeFormatter}
                parser={numbersOnlyParser}
                isRequired
              />
              <Input
                w="100%"
                ml="2"
                maxW="200px"
                id={`${weekDay}-to-1`}
                label={t('Término')}
                value={schedule.to}
                validationLength={4}
                onValueChange={(value) => onChangeValue(index, 'to', value)}
                placeholder="00:00"
                mask={TimeMask}
                formatter={TimeFormatter}
                parser={numbersOnlyParser}
                isRequired
              />
            </Flex>
          ))}
        </HStack>
      )}
      {index > 0 && (
        <Link
          mt="2"
          width="160px"
          color="green.600"
          fontSize="xs"
          fontWeight="700"
          onClick={replicate}
        >
          {t('Replicar horário anterior')}
        </Link>
      )}
    </Flex>
  );
};

// const [schedule, setSchedule] = React.useState(scheduleObj);
// const [schedule2, setSchedule2] = React.useState(scheduleObj);

/*const handleSchedule = (scheduleNumber: number, field: string, value: string) => {
    if (scheduleNumber === 1) {
      setSchedule((prevSchedule) => ({ ...prevSchedule, [field]: value }));
    } else {
      setSchedule2((prevSchedule) => ({ ...prevSchedule, [field]: value }));
    }
  };

  React.useEffect(() => {
    if (!checkedDay) {
      setSchedule(scheduleObj);
      setSchedule2(scheduleObj);
    }
    if (hasStop === '1') {
      setSchedule2(scheduleObj);
    }
  }, [checkedDay, hasStop]);*/
