import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
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
  const [availability, setAvailability] = React.useState('1');
  const [schedule, setSchedule] = React.useState([scheduleObj]);

  const handleSchedule = (objIndex: number, field: string, value: string) => {
    setSchedule((prevSchedule) => {
      return prevSchedule.map((item, index) => {
        if (index === objIndex) {
          return { ...item, [field]: value };
        } else {
          return item;
        }
      });
    });
  };

  const addScheduleItem = () => {
    return setSchedule((prevSchedule) => [...prevSchedule, scheduleObj]);
  };

  const removeScheduleItem = (itemIndex: number) => {
    return setSchedule((prevSchedule) => prevSchedule.filter((item, index) => index !== itemIndex));
  };

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
          onChange={(value) => setAvailability(value.toString())}
          value={availability}
          defaultValue="1"
          colorScheme="green"
          color="black"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            <Radio mt="2" value="1">
              {t('Enquanto estiver aberto')}
            </Radio>
            <Radio mt="2" value="2">
              {t('Definir horário específico')}
            </Radio>
          </Flex>
        </RadioGroup>
      )}
      {checkedDay && availability === '2' && (
        <>
          {schedule.map((item, index) => {
            return (
              <Flex key={index} flexDir="row" maxW="310px">
                <Input
                  w="100%"
                  maxW="150px"
                  id={`${weekDay}-from-${index}`}
                  label={t('De')}
                  value={item.from}
                  validationLength={4}
                  onValueChange={(value) => handleSchedule(index, 'from', value)}
                  placeholder="00:00"
                  mask={TimeMask}
                  formatter={TimeFormatter}
                  parser={numbersOnlyParser}
                />
                <Input
                  w="100%"
                  ml="2"
                  maxW="200px"
                  id={`${weekDay}-to-${index}`}
                  label={t('Até')}
                  value={item.to}
                  validationLength={4}
                  onValueChange={(value) => handleSchedule(index, 'to', value)}
                  placeholder="00:00"
                  mask={TimeMask}
                  formatter={TimeFormatter}
                  parser={numbersOnlyParser}
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
        </>
      )}
    </Flex>
  );
};
