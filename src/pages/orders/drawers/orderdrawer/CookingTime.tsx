import { CookingTimeMode } from '@appjusto/types';
import { Box, Flex, Radio, RadioGroup, Switch, Text } from '@chakra-ui/react';
import { useOrdersContext } from 'app/state/order';
import { CustomNumberInput } from 'common/components/form/input/CustomNumberInput';
import React from 'react';
import { t } from 'utils/i18n';

interface CookingTimeProps {
  orderId: string;
  cookingTime?: number | null;
  averageCookingTime?: number | null;
  cookingTimeMode?: CookingTimeMode;
}

const radioOptions = ['10', '20', '25', '30', '40', '45', '50', '60'];

export const CookingTime = ({
  orderId,
  cookingTime,
  averageCookingTime,
  cookingTimeMode,
}: CookingTimeProps) => {
  // context
  const { setOrderCookingTime } = useOrdersContext();

  //state
  const [enable, setEnable] = React.useState(false);
  const [inputTime, setInputTime] = React.useState('');
  const [radiosValue, setRadiosValue] = React.useState('20');

  //handlers
  const onInputTimeBlur = () => {
    let time = parseInt(inputTime);
    if (!isNaN(time)) {
      time = time * 60;
      setOrderCookingTime(orderId, time);
    }
  };

  const handleEnable = (status: boolean) => {
    setEnable(status);
    if (!status) {
      setOrderCookingTime(orderId, null);
      setInputTime('');
    } else {
      setRadiosValue('20');
      setOrderCookingTime(orderId, 1200);
    }
  };

  const handleRadios = (value: string) => {
    setRadiosValue(value);
    if (value !== '0') {
      const time = parseInt(value) * 60;
      setOrderCookingTime(orderId, time);
    } else {
      setInputTime('');
    }
  };

  //side effects
  React.useEffect(() => {
    if (cookingTime) {
      setEnable(true);
      const timeInMinutes = (cookingTime / 60).toString();
      if (radioOptions.includes(timeInMinutes)) {
        setRadiosValue(timeInMinutes);
      } else {
        setRadiosValue('0');
        setInputTime(timeInMinutes);
      }
    } else if (averageCookingTime) {
      setEnable(true);
      const timeInMinutes = (averageCookingTime / 60).toString();
      setRadiosValue(timeInMinutes);
      setOrderCookingTime(orderId, averageCookingTime);
    }
  }, [
    cookingTimeMode,
    cookingTime,
    averageCookingTime,
    orderId,
    setOrderCookingTime,
  ]);

  //UI
  if (cookingTimeMode === 'auto') return <Box />;
  return (
    <>
      <Flex mt="10" flexDir="row">
        <Switch
          isChecked={enable}
          onChange={(ev) => {
            ev.stopPropagation();
            handleEnable(ev.target.checked);
          }}
        />
        <Text ml="4" fontSize="xl" color="black">
          {t('Definir tempo de preparo')}
        </Text>
      </Flex>
      <Text mt="1" fontSize="md">
        {t(
          'Ao definir o tempo de preparo, quando finalizado esse tempo, o pedido será automaticamente movido para ”Aguardando retirada”.'
        )}
      </Text>
      {enable && (
        <RadioGroup
          onChange={(value) => handleRadios(value.toString())}
          value={radiosValue}
          defaultValue="15"
          colorScheme="green"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            {radioOptions.map((option) => (
              <Radio key={option} mt="4" value={option} size="lg">
                {t(`${option} minutos`)}
              </Radio>
            ))}
            <Flex mt="4" flexDir="row" alignItems="center">
              <Radio w="360px" value="0" size="lg">
                {t('Definir manualmente')}
              </Radio>
              {radiosValue === '0' && (
                <CustomNumberInput
                  ml="2"
                  mt="0"
                  maxW="200px"
                  id="order-manual-minutes"
                  label={t('Tempo de preparo (minutos)')}
                  value={inputTime ?? '0'}
                  onChange={(ev) => setInputTime(ev.target.value)}
                  onBlur={onInputTimeBlur}
                />
              )}
            </Flex>
          </Flex>
        </RadioGroup>
      )}
    </>
  );
};
