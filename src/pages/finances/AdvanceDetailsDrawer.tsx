import { WithId } from '@appjusto/types';
import { Text } from '@chakra-ui/react';
import { CustomAccountAdvance } from 'app/api/business/types';
import React from 'react';
import { useParams } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';

interface AdvanceDetailsDrawerProps {
  isOpen: boolean;
  getAdvanceById(advanceId: string): WithId<CustomAccountAdvance> | null;
  onClose(): void;
}

type Params = {
  advanceId: string;
};

export const AdvanceDetailsDrawer = ({
  onClose,
  getAdvanceById,
  ...props
}: AdvanceDetailsDrawerProps) => {
  // context
  const { advanceId } = useParams<Params>();
  // state
  const [advance, setAdvance] =
    React.useState<WithId<CustomAccountAdvance> | null>();
  // helpers
  const received = (advance?.amount ?? 0) - (advance?.fee ?? 0);
  // side effects
  React.useEffect(() => {
    setAdvance(getAdvanceById(advanceId));
  }, [advanceId, getAdvanceById]);
  // UI
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Detalhes da antecipação')}
      {...props}
    >
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Criada em:')}{' '}
        <Text as="span" fontWeight="500">
          {advance?.createdOn ? getDateAndHour(advance.createdOn) : 'N/E'}
        </Text>
      </Text>
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Valor solicitado:')}{' '}
        <Text as="span" fontWeight="500">
          {advance?.amount ? formatCurrency(advance.amount) : 'N/E'}
        </Text>
      </Text>
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Taxa:')}{' '}
        <Text as="span" color="red" fontWeight="500">
          - {advance?.fee ? formatCurrency(advance.fee) : 'N/E'}
        </Text>
      </Text>
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Valor antecipado:')}{' '}
        <Text as="span" color="green.700" fontWeight="500">
          {formatCurrency(received)}
        </Text>
      </Text>
    </FinancesBaseDrawer>
  );
};
