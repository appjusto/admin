import { Flex } from '@chakra-ui/react';
import { DaySchedule } from 'common/components/DaySchedule';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

const SchedulesPage = () => {
  //context
  const { url } = useRouteMatch();
  //state

  return (
    <>
      <PageHeader
        title={t('Horário')}
        subtitle={t('Defina o horário de funcionamento do restaurante.')}
      />
      <Flex flexDir="column" mt="4">
        <DaySchedule weekDay={t('Segunda')} />
        <DaySchedule weekDay={t('Terça')} />
        <DaySchedule weekDay={t('Quarta')} />
        <DaySchedule weekDay={t('Quinta')} />
        <DaySchedule weekDay={t('Sexta')} />
        <DaySchedule weekDay={t('Sábado')} />
        <DaySchedule weekDay={t('Domingo')} />
      </Flex>
    </>
  );
};

export default SchedulesPage;
