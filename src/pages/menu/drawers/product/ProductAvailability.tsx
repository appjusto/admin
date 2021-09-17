import { Button, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { BusinessSchedule, ScheduleObject } from 'appjusto-types/business';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DaySchedule } from './availability/DaySchedule';

type Availability = 'always' | 'defined';

const scheduleObj = { from: '', to: '' };

const initialState = [
  { day: 'Segunda', checked: false, schedule: [] },
  { day: 'Terça', checked: false, schedule: [] },
  { day: 'Quarta', checked: false, schedule: [] },
  { day: 'Quinta', checked: false, schedule: [] },
  { day: 'Sexta', checked: false, schedule: [] },
  { day: 'Sábado', checked: false, schedule: [] },
  { day: 'Domingo', checked: false, schedule: [] },
] as BusinessSchedule;

export const ProductAvailability = () => {
  //context
  const { url } = useRouteMatch();
  const { product, updateProduct, updateProductResult } = useProductContext();
  const { isLoading, isSuccess, isError, error: updateError } = updateProductResult;
  //state
  const [schedules, setSchedules] = React.useState<BusinessSchedule>(initialState);
  const [mainAvailability, setMainAvailability] = React.useState<Availability>('always');
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
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
  const clearDaySchedule = (stateIndex: number) => {
    setSchedules((prevSchedule) => {
      const newState = prevSchedule.map((item, index) => {
        if (index === stateIndex) {
          return { ...item, schedule: [] };
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
          if (Number(item.from) > Number(item.to)) result = false;
          if (index > 0 && Number(item.from) < Number(scheduleObject.schedule[index - 1].to))
            result = false;
        }
      });
    });
    return result;
  };
  const handleUpdate = () => {
    submission.current += 1;
    setError(initialError);
    if (mainAvailability === 'always') {
      return updateProduct({ changes: { availability: initialState } });
    }
    const isValid = schedulesValidation(schedules);
    if (!isValid)
      return setError({
        status: true,
        error: null,
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
    setMainAvailability('defined');
    setSchedules(product?.availability);
  }, [product?.availability]);
  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: updateError,
      });
    }
  }, [isError, updateError]);
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
          <Radio mt="2" value="always">
            {t('Sempre disponível quando o restaurante estiver aberto')}
          </Radio>
          <Radio mt="2" value="defined">
            {t('Disponível em dias e horários específicos')}
          </Radio>
        </Flex>
      </RadioGroup>
      {mainAvailability === 'defined' && (
        <Flex flexDir="column" mt="4">
          {schedules.map((day, index) => {
            return (
              <DaySchedule
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
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </>
  );
};
