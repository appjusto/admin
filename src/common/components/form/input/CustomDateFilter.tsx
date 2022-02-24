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
type DateValidation = { status: boolean; message?: string };

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
  const [isDatesValid, setisDatesValid] = React.useState<DateValidation>({ status: false });
  // handlers
  const handleDate = (type: 'start' | 'end', value: string) => {
    if (value.length > 10) return;
    if (type === 'start') setStart(value);
    if (type === 'end') setEnd(value);
  };
  // side effects
  React.useEffect(() => {
    let startDate = null;
    let endDate = null;
    if (start.length === 10) startDate = dayjs(start).toDate();
    if (end.length === 10) endDate = dayjs(end).toDate();
    if (startDate && endDate) {
      if (startDate > endDate) {
        setisDatesValid({
          status: false,
          message: 'As datas informadas não são válidas.',
        });
      } else setisDatesValid({ status: true });
    }
  }, [start, end]);
  React.useEffect(() => {
    if (!isDatesValid.status) return;
    getStart(start);
    getEnd(end);
  }, [isDatesValid, start, end, getStart, getEnd]);
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
          onChange={(event) => handleDate('start', event.target.value)}
          label={t('De')}
          isInvalid={isDatesValid['message'] !== undefined}
        />
        <CustomInput
          mt="0"
          type="date"
          id="search-name"
          value={end ?? ''}
          onChange={(event) => handleDate('end', event.target.value)}
          label={t('Até')}
          isInvalid={isDatesValid['message'] !== undefined}
        />
      </Stack>
      {showWarning && isDatesValid.message && <AlertWarning description={isDatesValid.message} />}
    </Box>
  );
};
