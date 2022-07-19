import { Box, Button, Stack, Switch, Text, VStack } from '@chakra-ui/react';
import { usePlatformManagement } from 'app/api/platform/usePlatformManagement';
import { usePlatformParams } from 'app/api/platform/usePlatformParams';

import { useContextApi } from 'app/state/api/context';
import { CustomNumberInput } from 'common/components/form/input/CustomNumberInput';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

interface InputProps {
  label: string;
  prepend?: string;
  value?: number;
  onChange?: (valueAsNumber?: number) => void;
  type?: 'distance' | 'time';
}

interface ToggleProps {
  label: string;
  value?: boolean;
  onChange?: () => void;
}

const formatDistance = (v: number | string, type: InputProps['type']) => {
  if (!v) return;

  const factor = type === 'distance' ? 1000 : 1;
  if (typeof v === 'number') return v / factor;

  return parseFloat(v) / factor;
};

const parseDistance = (v: number | string, type: InputProps['type']) => {
  if (!v) return 0;
  const factor = type === 'distance' ? 1000 : 1;

  if (typeof v === 'number') return v * factor;

  return parseFloat(v) * factor;
};

const InputNumber: React.FunctionComponent<InputProps> = ({
  label,
  type = 'distance',
  prepend,
  value,
  onChange,
}) => {
  const formattedValue = React.useMemo(() => formatDistance(value || 0, type), [type, value]);
  const handleChange = React.useCallback(
    (e) => {
      console.log(e);
      if (!onChange) return;
      onChange(parseDistance(e, type));
    },
    [onChange, type]
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
        value={formattedValue?.toString() || ''}
        borderColor="black"
        label={t(type === 'distance' ? 'Km' : 'Segundos')}
      />
    </Box>
  );
};

const InputToggle: React.FunctionComponent<ToggleProps> = ({ label, value, onChange }) => {
  return (
    <Box w="100%">
      <Text fontSize="sm" color="black" mb="2">
        {t(label)}
      </Text>
      <Switch onChange={onChange} id={label} isChecked={value} />
    </Box>
  );
};

const GeneralParameters: React.FC = () => {
  const api = useContextApi();

  // Fetch current information
  const { platformParams } = usePlatformParams();
  const { platformManagement } = usePlatformManagement();

  // Form states
  const [maxDistancetoOrigin, setMaxDistancetoOrigin] = React.useState<number | undefined>();
  const [maxTotalDistance, setMaxTotalDistance] = React.useState<number | undefined>();
  const [maxWaitingTime, setMaxWaitingTime] = React.useState<number | undefined>();
  const [autoApproveBusiness, setAutoApproveBusiness] = React.useState<boolean | undefined>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [autoApproveCourier, setAutoApproveCourier] = React.useState<boolean | undefined>(false);
  const [backups, setBackups] = React.useState<boolean | undefined>(false);

  // Initial values
  React.useEffect(() => {
    setAutoApproveBusiness(platformParams?.business.approveAfterVerified as boolean);
    setAutoApproveCourier(platformParams?.courier.approveAfterVerified as boolean);
    setMaxDistancetoOrigin(platformParams?.matching.maxDistanceToOrigin);
    setMaxWaitingTime(platformParams?.matching.averageWaitingTime);
    setMaxTotalDistance(platformParams?.matching.maxDistance);
    setBackups(platformManagement?.backupsEnabled);
  }, [platformParams, platformManagement]);

  // Handle click function
  const handleClick = React.useCallback(async () => {
    if (!platformParams) return;

    setLoading(true);

    // New fees obj
    const newParams = { ...platformParams };
    const newManagement = { ...platformManagement };

    if (maxDistancetoOrigin !== undefined) {
      newParams.matching.maxDistanceToOrigin = maxDistancetoOrigin as number;
    }

    if (maxTotalDistance !== undefined) {
      newParams.matching.maxDistance = maxTotalDistance as number;
    }

    newParams.courier.approveAfterVerified = autoApproveCourier as boolean;
    newParams.business.approveAfterVerified = autoApproveBusiness as boolean;

    newManagement.backupsEnabled = backups;
    // Save to db
    await api.platform().updatePlatformParams(newParams);
    await api.platform().updatePlatformManagement(newManagement);

    setLoading(false);
  }, [
    platformParams,
    platformManagement,
    maxDistancetoOrigin,
    maxTotalDistance,
    autoApproveCourier,
    autoApproveBusiness,
    backups,
    api,
  ]);

  return (
    <Box minW="668px">
      <PageHeader title={t('Geral')} mb="6" />

      <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
        <VStack w="100%">
          <InputNumber
            label="Distância máxima global até a origem:"
            value={maxDistancetoOrigin}
            onChange={(valueAsNumber) => setMaxDistancetoOrigin(valueAsNumber)}
          />
          <InputNumber
            label="Distância máxima global do percurso:"
            value={maxTotalDistance}
            onChange={(valueAsNumber) => setMaxTotalDistance(valueAsNumber)}
          />
          <InputNumber
            label="Tempo de espera de aceite do entregador:"
            value={maxWaitingTime}
            type="time"
            onChange={(valueAsNumber) => setMaxWaitingTime(valueAsNumber)}
          />
        </VStack>

        <VStack w="100%">
          <InputToggle
            label="Auto aprovar negócios após IUGU:"
            value={autoApproveBusiness}
            onChange={() => setAutoApproveBusiness(!autoApproveBusiness)}
          />
          <InputToggle
            label="Auto aprovar entregadores após IUGU:"
            value={autoApproveCourier}
            onChange={() => setAutoApproveCourier(!autoApproveCourier)}
          />
          <InputToggle
            label="Ativar Backups:"
            value={backups}
            onChange={() => setBackups(!backups)}
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

export default GeneralParameters;
