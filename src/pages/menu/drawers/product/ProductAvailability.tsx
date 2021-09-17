import { Button, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { BusinessSchedule } from 'appjusto-types/business';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DaySchedule } from './availability/DaySchedule';

const scheduleObj = { from: '', to: '' };

const initialState = [
  { day: 'Segunda', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Terça', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Quarta', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Quinta', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Sexta', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Sábado', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Domingo', checked: false, schedule: [{ from: '', to: '' }] },
] as BusinessSchedule;

export const ProductAvailability = () => {
  //context
  const { url } = useRouteMatch();
  const { productId } = useProductContext();
  //state
  const [schedules, setSchedules] = React.useState<BusinessSchedule>(initialState);
  const [mainAvailability, setMainAvailability] = React.useState<string>('1');

  // handlers
  const handleCheck = (stateIndex: number, value: boolean) => {
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((item, index) => {
        if (index === stateIndex) {
          return { ...item, checked: value, schedule: [scheduleObj] };
        } else {
          return item;
        }
      });
      return newState;
    });
  };
  const handleChengeValue = (
    stateIndex: number,
    scheduleIndex: number,
    field: string,
    value: string
  ) => {
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((day, index1) => {
        if (index1 === stateIndex) {
          const newDaySchedule = day.schedule.map((schedule, index2) => {
            if (index2 === scheduleIndex) {
              let newValue = value;
              if (value.length === 1 && Number(value) > 2) newValue = '0' + value;
              const newSchedule = { ...schedule, [field]: newValue };
              return newSchedule;
            } else {
              return schedule;
            }
          });
          return { ...day, schedule: newDaySchedule };
        } else {
          return day;
        }
      });
      return newState;
    });
  };
  const autoCompleteSchedules = (
    stateIndex: number,
    scheduleIndex: number,
    field: string,
    value: string
  ) => {
    let newValue = value;
    if (value.length < 4) {
      newValue = value + '0'.repeat(4 - value.length);
    }
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((day, index1) => {
        if (index1 === stateIndex) {
          const newDaySchedule = day.schedule.map((schedule, index2) => {
            if (index2 === scheduleIndex) {
              const newSchedule = { ...schedule, [field]: newValue };
              return newSchedule;
            } else {
              return schedule;
            }
          });
          return { ...day, schedule: newDaySchedule };
        } else {
          return day;
        }
      });
      return newState;
    });
  };

  const addScheduleItem = (stateIndex: number) => {
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((day, index1) => {
        if (index1 === stateIndex) {
          const newDaySchedule = [...day.schedule, scheduleObj];
          return { ...day, schedule: newDaySchedule };
        } else {
          return day;
        }
      });
      return newState;
    });
  };

  const removeScheduleItem = (stateIndex: number, itemIndex: number) => {
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((day, index1) => {
        if (index1 === stateIndex) {
          const newDaySchedule = day.schedule.filter((item, index) => index !== itemIndex);
          return { ...day, schedule: newDaySchedule };
        } else {
          return day;
        }
      });
      return newState;
    });
    //return setSchedule((prevSchedule) => prevSchedule.filter((item, index) => index !== itemIndex));
  };

  // UI
  if (productId === 'new') {
    const urlRedirect = url.split('/availability')[0];
    return <Redirect to={urlRedirect} />;
  }
  return (
    <>
      <Text fontSize="xl" color="black">
        {t('Dias e horários')}
      </Text>
      <Text fontSize="sm" mt="2">
        {t('Defina quais os dias e horários seus clientes poderão comprar esse ítem')}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value) => setMainAvailability(value.toString())}
        value={mainAvailability}
        defaultValue="1"
        colorScheme="green"
        color="black"
        size="lg"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="1">
            {t('Sempre disponível quando o restaurante estiver aberto')}
          </Radio>
          <Radio mt="2" value="2">
            {t('Disponível em dias e horários específicos')}
          </Radio>
        </Flex>
      </RadioGroup>
      {mainAvailability === '2' && (
        <Flex flexDir="column" mt="4">
          {schedules.map((day, index) => {
            return (
              <DaySchedule
                key={day.day}
                day={day}
                handleCheck={(value: boolean) => handleCheck(index, value)}
                onChangeValue={(scheduleIndex: number, field: string, value: string) =>
                  handleChengeValue(index, scheduleIndex, field, value)
                }
                autoCompleteSchedules={(scheduleIndex: number, field: string, value: string) =>
                  autoCompleteSchedules(index, scheduleIndex, field, value)
                }
                addScheduleItem={() => addScheduleItem(index)}
                removeScheduleItem={(itemIndex: number) => removeScheduleItem(index, itemIndex)}
              />
            );
          })}
        </Flex>
      )}
      <Button mt="8">{t('Salvar disponibilidade')}</Button>
    </>
  );
};
