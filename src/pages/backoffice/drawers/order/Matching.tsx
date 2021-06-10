import { Box, Text } from '@chakra-ui/react';
import { useObserveOrderMatching } from 'app/api/order/useObserveOrderMatching';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { CourierNotifiedBox } from './matching/CourierNotifiedBox';
import { LogsTable } from './matching/LogsTable';

interface MatchingProps {
  orderId?: string;
}

export const Matching = ({ orderId }: MatchingProps) => {
  // context
  const { matching, updateCourierNotified, updateResult } = useObserveOrderMatching(orderId);
  const { isLoading, isSuccess, isError, error } = updateResult;
  // state
  const [logs, setLogs] = React.useState<string[]>();
  const [attemps, setAttemps] = React.useState<number>(0);
  const [couriersNotified, setCouriersNotified] = React.useState<string[]>();
  const [courierRemoving, setCourierRemoving] = React.useState<string | null>(null);
  //const [couriersRejections, setCouriersRejections] = React.useState<OrderMatchingRejection[]>();

  // refs
  const submission = React.useRef(0);

  // handlers
  const removeCourierNotified = async (courierId: string) => {
    submission.current += 1;
    setCourierRemoving(courierId);
    const newArray = couriersNotified?.filter((id) => id !== courierId);
    await updateCourierNotified(newArray);
    setCourierRemoving(null);
  };

  // side effects
  React.useEffect(() => {
    if (matching === undefined) return;
    if (matching === null) {
      setCouriersNotified([]);
      //setCouriersRejections([]);
      setLogs([]);
      return;
    }
    setCouriersNotified(matching.couriersNotified);
    //setCouriersRejections(matching.rejections);
    setLogs(matching.logs);
  }, [matching]);

  React.useEffect(() => {
    if (!logs) return;
    const hashNumber = logs.map((log) => log.split(' ')[0]);
    const AttempsCounter = (array: string[]) => {
      let total = 0;
      array.forEach((item, index) => {
        if (item !== array[index - 1]) return (total += 1);
      });
      return total;
    };
    const result = AttempsCounter(hashNumber);
    setAttemps(result);
  }, [logs]);

  // UI
  return (
    <>
      <SectionTitle>{t('Tentativas: ') + attemps}</SectionTitle>
      <SectionTitle>{t('Entregadores notificados')}</SectionTitle>
      <Box
        mt="4"
        p="2"
        minH="200px"
        maxH="300px"
        overflowY="scroll"
        border="1px solid #ECF0E3"
        borderRadius="lg"
      >
        {!couriersNotified ? (
          <Text>{t('Carregando dados...')}</Text>
        ) : (
          couriersNotified.map((courierId) => (
            <CourierNotifiedBox
              key={courierId}
              courierId={courierId}
              removeCourier={removeCourierNotified}
              courierRemoving={courierRemoving}
              isLoading={isLoading}
            />
          ))
        )}
      </Box>
      <SectionTitle>{t('Logs do pedido')}</SectionTitle>
      <Box mt="4" maxH="300px" overflowY="scroll" border="1px solid #ECF0E3" borderRadius="lg">
        <LogsTable logs={logs} />
      </Box>
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
      />
    </>
  );
};
