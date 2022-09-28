import { Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { timeFormatter } from 'common/components/form/input/pattern-input/formatters';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DaySchedule } from './availability/DaySchedule';

export type Availability = 'always-available' | 'availability-defined';

const scheduleObj = { from: '', to: '' };

export const ProductAvailability = () => {
  //context
  const { url } = useRouteMatch();
  const { productId, state, handleStateUpdate, handleProductUpdate } =
    useProductContext();
  const { mainAvailability, product } = state;
  const { availability } = product;
  //state
  // handlers
  const handleCheck = (stateIndex: number, value: boolean) => {
    const newAvailability = availability.map((item, index) => {
      if (index === stateIndex) {
        return { ...item, checked: value };
      } else {
        return item;
      }
    });
    handleProductUpdate({ availability: newAvailability });
  };
  const clearDaySchedule = (stateIndex: number) => {
    const newAvailability = availability.map((item, index) => {
      if (index === stateIndex) {
        return { ...item, schedule: [scheduleObj] };
      } else {
        return item;
      }
    });
    handleProductUpdate({ availability: newAvailability });
  };
  const handleChengeValue = (
    stateIndex: number,
    scheduleIndex: number,
    field: string,
    value: string
  ) => {
    const newAvailability = availability.map((day, index1) => {
      if (index1 === stateIndex) {
        const newDaySchedule = day.schedule.map((schedule, index2) => {
          if (index2 === scheduleIndex) {
            let newValue = value;
            if (value.length === 1 && Number(value) > 2) newValue = '0' + value;
            const newSchedule = {
              ...schedule,
              [field]: timeFormatter(newValue, true),
            };
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
    handleProductUpdate({ availability: newAvailability });
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
    const newAvailability = availability.map((day, index1) => {
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
    handleProductUpdate({ availability: newAvailability });
  };
  const addScheduleItem = (stateIndex: number) => {
    const newAvailability = availability.map((day, index1) => {
      if (index1 === stateIndex) {
        const newDaySchedule = [...day.schedule, scheduleObj];
        return { ...day, schedule: newDaySchedule };
      } else {
        return day;
      }
    });
    handleProductUpdate({ availability: newAvailability });
  };
  const removeScheduleItem = (stateIndex: number, itemIndex: number) => {
    const newAvailability = availability.map((day, index1) => {
      if (index1 === stateIndex) {
        const newDaySchedule = day.schedule.filter(
          (item, index) => index !== itemIndex
        );
        return { ...day, schedule: newDaySchedule };
      } else {
        return day;
      }
    });
    handleProductUpdate({ availability: newAvailability });
  };
  const replicateSchedule = (stateIndex: number) => {
    const prevDay = availability[stateIndex - 1];
    const newAvailability = availability.map((day, dayIndex) => {
      if (dayIndex === stateIndex) {
        return { ...prevDay, day: day.day };
      } else {
        return day;
      }
    });
    handleProductUpdate({ availability: newAvailability });
  };
  // side effects
  React.useEffect(() => {
    if (state.saveSuccess) {
      handleStateUpdate({ saveSuccess: false });
    }
  }, [state, handleStateUpdate]);
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
        {t(
          'Defina quais os dias e horários seus clientes poderão comprar esse ítem'
        )}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value: Availability) =>
          handleStateUpdate({ mainAvailability: value })
        }
        value={mainAvailability}
        defaultValue="always"
        colorScheme="green"
        color="black"
        size="lg"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="always-available">
            {t('Sempre disponível quando o restaurante estiver aberto')}
          </Radio>
          <Radio mt="2" value="availability-defined">
            {t('Disponível em dias e horários específicos')}
          </Radio>
        </Flex>
      </RadioGroup>
      {mainAvailability === 'availability-defined' && (
        <Flex flexDir="column" mt="4">
          {availability.map((day, index) => {
            return (
              <DaySchedule
                index={index}
                key={day.day}
                day={day}
                handleCheck={(value: boolean) => handleCheck(index, value)}
                clearDaySchedule={() => clearDaySchedule(index)}
                onChangeValue={(
                  scheduleIndex: number,
                  field: string,
                  value: string
                ) => handleChengeValue(index, scheduleIndex, field, value)}
                autoCompleteSchedules={(
                  scheduleIndex: number,
                  field: string,
                  value: string
                ) => autoCompleteSchedules(index, scheduleIndex, field, value)}
                addScheduleItem={() => addScheduleItem(index)}
                removeScheduleItem={(itemIndex: number) =>
                  removeScheduleItem(index, itemIndex)
                }
                replicate={() => replicateSchedule(index)}
              />
            );
          })}
        </Flex>
      )}
    </>
  );
};
