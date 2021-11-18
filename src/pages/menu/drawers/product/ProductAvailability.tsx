import { Button, Flex, RadioGroup, Text } from '@chakra-ui/react';
import { useContextAppRequests } from 'app/state/requests/context';
import { BusinessSchedule, ScheduleObject } from 'appjusto-types/business';
import CustomRadio from 'common/components/form/CustomRadio';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DaySchedule } from './availability/DaySchedule';

type Availability = 'always' | 'defined';

const scheduleObj = { from: '', to: '' };

const initialState = [
  { day: 'Segunda', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Terça', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Quarta', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Quinta', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Sexta', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Sábado', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Domingo', checked: true, schedule: [{ from: '', to: '' }] },
] as BusinessSchedule;

const alwaysState = [
  { day: 'Segunda', checked: true, schedule: [] },
  { day: 'Terça', checked: true, schedule: [] },
  { day: 'Quarta', checked: true, schedule: [] },
  { day: 'Quinta', checked: true, schedule: [] },
  { day: 'Sexta', checked: true, schedule: [] },
  { day: 'Sábado', checked: true, schedule: [] },
  { day: 'Domingo', checked: true, schedule: [] },
] as BusinessSchedule;

export const ProductAvailability = () => {
  //context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { url } = useRouteMatch();
  const { product, updateProduct, updateProductResult } = useProductContext();
  const { isLoading } = updateProductResult;
  //state
  const [schedules, setSchedules] = React.useState<BusinessSchedule>(initialState);
  const [mainAvailability, setMainAvailability] = React.useState<Availability>('always');
  // handlers
  const handleCheck = (stateIndex: number, value: boolean) => {
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((item, index) => {
        if (index === stateIndex) {
          return { ...item, checked: value };
        } else {
          return item;
        }
      });
      return newState;
    });
  };
  const clearDaySchedule = (stateIndex: number) => {
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((item, index) => {
        if (index === stateIndex) {
          return { ...item, schedule: [scheduleObj] };
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
  };
  const replicateSchedule = (stateIndex: number) => {
    setSchedules((prevSchedule) => {
      const prevDay = prevSchedule[stateIndex - 1];
      const newState = prevSchedule.map((day, dayIndex) => {
        if (dayIndex === stateIndex) {
          return { ...prevDay, day: day.day };
        } else {
          return day;
        }
      });
      return newState;
    });
  };
  const schedulesValidation = (schedules: ScheduleObject[]) => {
    let result = true;
    schedules.forEach((scheduleObject) => {
      scheduleObject.schedule.forEach((item, index) => {
        if (item.from !== '' && item.to !== '') {
          if (Number(item.from) >= Number(item.to)) result = false;
          if (index > 0 && Number(item.from) <= Number(scheduleObject.schedule[index - 1].to))
            result = false;
        }
      });
    });
    return result;
  };
  const handleUpdate = () => {
    if (mainAvailability === 'always') {
      setSchedules(initialState);
      return updateProduct({ changes: { availability: alwaysState } });
    }
    const isValid = schedulesValidation(schedules);
    if (!isValid)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'ProductAvailability-valid',
        message: { title: 'Alguns horários não estão corretos.' },
      });
    const serializedSchedules = schedules.map((day) => {
      const newSchedule = day.schedule.filter((obj) => obj.from !== '' && obj.to !== '');
      return { ...day, schedule: newSchedule };
    });
    updateProduct({ changes: { availability: serializedSchedules } });
  };
  // side effects
  React.useEffect(() => {
    if (!product?.availability) return;
    if (
      product.availability.find((item) => !item.checked) === undefined &&
      product.availability.find((item) => item.schedule.length > 0) === undefined
    ) {
      setMainAvailability('always');
      return;
    }
    const initialAvailability = product.availability.map((item) => {
      if (item.schedule.length === 0) return { ...item, schedule: [scheduleObj] };
      else return item;
    });
    setMainAvailability('defined');
    setSchedules(initialAvailability);
  }, [product?.availability]);
  // UI
  if (product?.id === 'new') {
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
        onChange={(value: Availability) => setMainAvailability(value)}
        value={mainAvailability}
        defaultValue="always"
        colorScheme="green"
        color="black"
        size="lg"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="always">
            {t('Sempre disponível quando o restaurante estiver aberto')}
          </CustomRadio>
          <CustomRadio mt="2" value="defined">
            {t('Disponível em dias e horários específicos')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
      {mainAvailability === 'defined' && (
        <Flex flexDir="column" mt="4">
          {schedules.map((day, index) => {
            return (
              <DaySchedule
                index={index}
                key={day.day}
                day={day}
                handleCheck={(value: boolean) => handleCheck(index, value)}
                clearDaySchedule={() => clearDaySchedule(index)}
                onChangeValue={(scheduleIndex: number, field: string, value: string) =>
                  handleChengeValue(index, scheduleIndex, field, value)
                }
                autoCompleteSchedules={(scheduleIndex: number, field: string, value: string) =>
                  autoCompleteSchedules(index, scheduleIndex, field, value)
                }
                addScheduleItem={() => addScheduleItem(index)}
                removeScheduleItem={(itemIndex: number) => removeScheduleItem(index, itemIndex)}
                replicate={() => replicateSchedule(index)}
              />
            );
          })}
        </Flex>
      )}
      <Button mt="8" onClick={handleUpdate} isLoading={isLoading} loadingText={t('Salvando')}>
        {t('Salvar disponibilidade')}
      </Button>
    </>
  );
};
