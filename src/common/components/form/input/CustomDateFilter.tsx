import { Box, BoxProps, Stack } from '@chakra-ui/react';
import { AlertWarning } from 'common/components/AlertWarning';
import { CustomInput } from 'common/components/form/input/CustomInput';
import dayjs from 'dayjs';
import React from 'react';
import { t } from 'utils/i18n';

interface DateFilterPros extends BoxProps {
  getStart(start: string): void;
  getEnd(end: string): void;
  clearNumber?: number; // parent state that changes when clear date is required
  showWarning?: boolean;
}

const currentYear = new Date().getFullYear();

export const CustomDateFilter = ({
  getStart,
  getEnd,
  clearNumber,
  showWarning = false,
  ...props
}: DateFilterPros) => {
  // state
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  // handlers
  const dateValidation = React.useCallback((value: string) => {
    if (value === '') return true;
    let date = dayjs(value).year();
    return date >= 2021 && date <= currentYear;
  }, []);
  // side effects
  React.useEffect(() => {
    if (dateValidation(start)) getStart(start);
    if (dateValidation(end)) getEnd(end);
  }, [start, end, getStart, getEnd, dateValidation]);
  React.useEffect(() => {
    if (clearNumber === undefined) return;
    setStart('');
    setEnd('');
  }, [clearNumber]);
  // UI
  return (
    <Box {...props}>
      <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
        <CustomInput
          mt="0"
          type="date"
          id="search-name"
          value={start ?? ''}
          onChange={(event) => setStart(event.target.value)}
          label={t('De')}
          isInvalid={!dateValidation(start)}
        />
        <CustomInput
          mt="0"
          type="date"
          id="search-name"
          value={end ?? ''}
          onChange={(event) => setEnd(event.target.value)}
          label={t('Até')}
          isInvalid={!dateValidation(end)}
        />
      </Stack>
      {showWarning && (!dateValidation(start) || !dateValidation(end)) && (
        <AlertWarning
          description={t(
            'As datas devem partir de 2021 e não podem possuir ano maior que o ano atual.'
          )}
        />
      )}
    </Box>
  );
};
