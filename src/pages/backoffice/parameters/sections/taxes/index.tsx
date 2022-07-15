import { Box, Button, Stack, Text, VStack } from '@chakra-ui/react';
import { usePlatformFees } from 'app/api/platform/usePlatformFees';

import { useContextApi } from 'app/state/api/context';
import { CurrencyInput } from 'common/components/form/input/CurrencyInput';
import { CustomNumberInput } from 'common/components/form/input/CustomNumberInput';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

interface InputProps {
  label: string;
  prepend?: string;
  type?: 'percent' | 'currency';
  value?: number;
  onChange?: (valueAsNumber?: number) => void;
}

const formatCurrency = (v: number | string) => {
  if (!v) return;

  if (typeof v === 'number') return v / 100;

  return parseFloat(v) / 100;
};

const parseCurrency = (v: number | string) => {
  if (!v) return 0;
  if (typeof v === 'number') return v * 100;

  return parseFloat(v) * 100;
};

const InputPercent: React.FunctionComponent<InputProps> = ({ label, prepend, value, onChange }) => {
  const handleChange = React.useCallback(
    (e) => {
      if (!onChange) return;
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Box w="100%">
      <Text fontSize="sm" color="black" mb="2">
        {prepend && <strong> {prepend}</strong>}
        {t(label)}
      </Text>
      <CustomNumberInput
        id={label}
        allowDecimals
        step={0.01}
        min={0}
        mt={0}
        onChange={handleChange}
        value={value?.toString() || ''}
        borderColor="black"
        label={t('Porcentagem %')}
      />
    </Box>
  );
};

const InputFixed: React.FunctionComponent<InputProps> = ({ label, prepend, value, onChange }) => {
  const formattedValue = React.useMemo(() => formatCurrency(value || 0), [value]);
  const handleChange = React.useCallback(
    (e) => {
      console.log(e);
      if (!onChange) return;
      onChange(parseCurrency(e));
    },
    [onChange]
  );
  return (
    <Box w="100%">
      <Text fontSize="sm" color="black" mb="2">
        {prepend && <strong> {prepend}</strong>}
        {t(label)}
      </Text>
      <CurrencyInput
        id={label}
        step={0.01}
        min={0}
        onChangeValue={handleChange}
        value={formattedValue || 0}
        borderColor="black"
        label={t('R$')}
      />
    </Box>
  );
};

const TaxesParameters: React.FC = () => {
  const api = useContextApi();

  // Fetch current information
  const { platformFees } = usePlatformFees();

  // Form states
  const [platformPercentFee, setPlatformPercentFee] = React.useState<number | undefined>();
  const [platformFixedFee, setPlatformFixedFee] = React.useState<number | undefined>();
  const [insurance, setInsurance] = React.useState<number | undefined>();
  const [p2pFixedFee, setP2pFixedFee] = React.useState<number | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [percentIuguCc, setPercentIuguCc] = React.useState<number | undefined>();
  const [percentIuguPix, setPercentIuguPix] = React.useState<number | undefined>();
  const [fixedIuguCc, setFixedIuguCc] = React.useState<number | undefined>();
  const [fixedIuguPix, setFixedIuguPix] = React.useState<number | undefined>();

  // Initial values
  React.useEffect(() => {
    setPlatformPercentFee(platformFees?.commissions?.food.percent);
    setPlatformFixedFee(platformFees?.commissions?.food.fixed);
    setInsurance(platformFees?.insurance?.food.percent);
    setP2pFixedFee(platformFees?.commissions?.p2p.fixed);
    setPercentIuguCc(platformFees?.processing.iugu.credit_card.percent);
    setPercentIuguPix(platformFees?.processing.iugu.pix.percent);
    setFixedIuguCc(platformFees?.processing.iugu.credit_card.fixed);
    setFixedIuguPix(platformFees?.processing.iugu.pix.fixed);
  }, [platformFees]);

  // Handle click function
  const handleClick = React.useCallback(async () => {
    if (!platformFees) return;

    setLoading(true);

    // New fees obj
    const newFees = { ...platformFees };

    // Create props if doesnt exist
    if (!newFees.commissions) {
      newFees.commissions = { food: { percent: 0, fixed: 0 }, p2p: { percent: 0, fixed: 0 } };
    }

    if (platformPercentFee !== undefined) {
      newFees.commissions.food.percent = platformPercentFee as number;
    }
    if (platformFixedFee !== undefined) newFees.commissions.food.fixed = platformFixedFee as number;
    if (insurance !== undefined) {
      newFees.insurance.food.percent = insurance as number;
      newFees.insurance.p2p.percent = insurance as number;
    }
    if (p2pFixedFee !== undefined) newFees.commissions.p2p.fixed = p2pFixedFee;

    if (percentIuguCc !== undefined) newFees.processing.iugu.credit_card.percent = percentIuguCc;
    if (percentIuguPix !== undefined) newFees.processing.iugu.pix.percent = percentIuguPix;
    if (fixedIuguCc !== undefined) newFees.processing.iugu.credit_card.fixed = fixedIuguCc;
    if (fixedIuguPix !== undefined) newFees.processing.iugu.pix.fixed = fixedIuguPix;

    // Save to db
    await api.platform().updatePlatformFees(newFees);

    setLoading(false);
  }, [
    platformFees,
    platformPercentFee,
    platformFixedFee,
    insurance,
    p2pFixedFee,
    percentIuguCc,
    percentIuguPix,
    fixedIuguCc,
    fixedIuguPix,
    api,
  ]);

  return (
    <Box minW="668px">
      <PageHeader title={t('Taxas')} mb="6" />

      <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
        <VStack w="100%">
          <InputPercent
            label="Porcentagem do pedido (IUGU) na CC:"
            value={percentIuguCc}
            onChange={(valueAsNumber) => setPercentIuguCc(valueAsNumber)}
          />
          <InputPercent
            label="Porcentagem do pedido (IUGU) no PIX:"
            value={percentIuguPix}
            onChange={(valueAsNumber) => setPercentIuguPix(valueAsNumber)}
          />
          <InputFixed
            label="Valor fixo por pedido (IUGU) na CC:"
            value={fixedIuguCc}
            onChange={(valueAsNumber) => setFixedIuguCc(valueAsNumber)}
          />
          <InputFixed
            label="Valor fixo por pedido (IUGU) no PIX:"
            value={fixedIuguPix}
            onChange={(valueAsNumber) => setFixedIuguPix(valueAsNumber)}
          />
        </VStack>

        <VStack w="100%">
          <InputFixed
            label="valor fixo por pedido:"
            prepend="Entrega de encomendas - "
            value={p2pFixedFee}
            onChange={(valueAsNumber) => setP2pFixedFee(valueAsNumber)}
          />
          <InputFixed
            label="valor fixo por pedido:"
            prepend="Restaurantes - "
            value={platformFixedFee}
            onChange={(valueAsNumber) => setPlatformFixedFee(valueAsNumber)}
          />
          <InputPercent
            label="porcentagem por pedido:"
            prepend="Restaurantes - "
            value={platformPercentFee}
            onChange={(valueAsNumber) => setPlatformPercentFee(valueAsNumber)}
          />
          <InputPercent
            label="porcentagem por pedido:"
            prepend="Seguro - "
            value={insurance}
            onChange={(valueAsNumber) => setInsurance(valueAsNumber)}
          />
        </VStack>
      </Stack>

      <Button
        width="full"
        maxW={{ base: '220px', md: '240px' }}
        mt="6"
        fontSize={'15px'}
        onClick={handleClick}
        isLoading={loading}
        loadingText={t('Salvando')}
      >
        {t('Salvar alterações')}
      </Button>
    </Box>
  );
};

export default TaxesParameters;
