import { Button, Flex } from '@chakra-ui/react';
import { DaySchedule } from 'common/components/DaySchedule';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

const initialState = [
  { day: 'Segunda', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Terça', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Quarta', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Quinta', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Sexta', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Sábado', checked: false, schedule: [{ from: '', to: '' }] },
  { day: 'Domingo', checked: false, schedule: [{ from: '', to: '' }] },
];

const scheduleObj = { from: '', to: '' };

const SchedulesPage = () => {
  const [schedules, setSchedules] = React.useState(initialState);
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
  const handleBreak = (stateIndex: number, value: string) => {
    setSchedules((prevSchedule) => {
      let newState = prevSchedule;
      if (value === '2') {
        newState = prevSchedule.map((item, index) => {
          if (index === stateIndex) {
            const newSchedule = [...item.schedule, scheduleObj];
            return { ...item, schedule: newSchedule };
          } else {
            return item;
          }
        });
      } else {
        newState = prevSchedule.map((item, index) => {
          if (index === stateIndex) {
            const newSchedule = [item.schedule[0]];
            return { ...item, schedule: newSchedule };
          } else {
            return item;
          }
        });
      }
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
              const newSchedule = { ...schedule, [field]: value };
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

  const onSubmitHandler = (event: any) => {
    event.preventDefault();
    console.log('Submit!');
    console.dir(schedules);
  };
  return (
    <>
      <PageHeader
        title={t('Horário')}
        subtitle={t('Defina o horário de funcionamento do restaurante.')}
      />
      <Flex flexDir="column" mt="4">
        <form onSubmit={onSubmitHandler}>
          {schedules.map((day, index) => (
            <DaySchedule
              key={day.day}
              index={index}
              weekDay={t(`${day.day}`)}
              isChecked={day.checked}
              value={day.schedule}
              handleCheck={(value: boolean) => handleCheck(index, value)}
              handleBreak={(value: string) => handleBreak(index, value)}
              onChangeValue={(scheduleIndex: number, field: string, value: string) =>
                handleChengeValue(index, scheduleIndex, field, value)
              }
              replicate={() => replicateSchedule(index)}
            />
          ))}
          <Button mt="8" type="submit">
            {t('Salvar horários')}
          </Button>
        </form>
      </Flex>
    </>
  );
};

export default SchedulesPage;

/*
;*/
