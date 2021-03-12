import { Checkbox, Flex, HStack, Radio, RadioGroup } from '@chakra-ui/react';
import { CustomPatternInput as Input } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { TimeFormatter, TimeMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';

interface DayScheduleProps {
  weekDay: string;
}

const scheduleObj = { from: '', to: '' };

export const DaySchedule = ({ weekDay }: DayScheduleProps) => {
  const [checkedDay, setCheckedDay] = React.useState(false);
  const [hasStop, setHasStop] = React.useState('1');
  const [schedule, setSchedule] = React.useState(scheduleObj);
  const [schedule2, setSchedule2] = React.useState(scheduleObj);

  const handleSchedule = (scheduleNumber: number, field: string, value: string) => {
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
  }, [checkedDay, hasStop]);

  return (
    <Flex flexDir="column" mt="8">
      <Checkbox
        colorScheme="green"
        size="lg"
        spacing="1rem"
        iconSize="1rem"
        isChecked={checkedDay}
        onChange={(e) => setCheckedDay(e.target.checked)}
      >
        {weekDay}
      </Checkbox>
      {checkedDay && (
        <RadioGroup
          mt="2"
          onChange={(value) => setHasStop(value.toString())}
          value={hasStop}
          defaultValue="1"
          colorScheme="green"
          color="black"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            <Radio mt="2" value="1">
              {t('Sem pausa')}
            </Radio>
            <Radio mt="2" value="2">
              {t('O restaurante faz uma pausa durante o dia?')}
            </Radio>
          </Flex>
        </RadioGroup>
      )}
      {checkedDay && (
        <HStack spacing={4}>
          <Flex flexDir="row" maxW="310px">
            <Input
              w="100%"
              maxW="150px"
              id={`${weekDay}-from-1`}
              label={t('Início')}
              value={schedule.from}
              validationLength={4}
              onValueChange={(value) => handleSchedule(1, 'from', value)}
              placeholder="00:00"
              mask={TimeMask}
              formatter={TimeFormatter}
              parser={numbersOnlyParser}
            />
            <Input
              w="100%"
              ml="2"
              maxW="200px"
              id={`${weekDay}-to-1`}
              label={t('Término')}
              value={schedule.to}
              validationLength={4}
              onValueChange={(value) => handleSchedule(1, 'to', value)}
              placeholder="00:00"
              mask={TimeMask}
              formatter={TimeFormatter}
              parser={numbersOnlyParser}
            />
          </Flex>
          {hasStop === '2' && (
            <Flex flexDir="row" maxW="310px">
              <Input
                w="100%"
                maxW="150px"
                id={`${weekDay}-from-2`}
                label={t('Início')}
                value={schedule2.from}
                validationLength={4}
                onValueChange={(value) => handleSchedule(2, 'from', value)}
                placeholder="00:00"
                mask={TimeMask}
                formatter={TimeFormatter}
                parser={numbersOnlyParser}
              />
              <Input
                w="200%"
                ml="2"
                maxW="200px"
                id={`${weekDay}-to-2`}
                label={t('Término')}
                value={schedule2.to}
                validationLength={4}
                onValueChange={(value) => handleSchedule(2, 'to', value)}
                placeholder="00:00"
                mask={TimeMask}
                formatter={TimeFormatter}
                parser={numbersOnlyParser}
              />
            </Flex>
          )}
        </HStack>
      )}
    </Flex>
  );
};
