import { Flex, Radio, RadioGroup, Switch, Text } from '@chakra-ui/react';
import { CustomNumberInput } from 'common/components/form/input/CustomNumberInput';
import React from 'react';
import { t } from 'utils/i18n';
import { Pendency } from './index';

interface PreparationTimeProps {
  preparationTime: string | undefined;
  notifyParentWithTime(time: string): void;
}

export const PreparationTime = ({
  preparationTime,
  notifyParentWithTime,
}: PreparationTimeProps) => {
  //state
  const [hasPreparationTime, setHasPreparationTime] = React.useState(false);
  const [radiosValue, setRadiosValue] = React.useState('15');
  //handlers

  //side effects
  React.useEffect(() => {
    if (hasPreparationTime && radiosValue !== '0') {
      notifyParentWithTime(radiosValue);
    }
  }, [notifyParentWithTime, hasPreparationTime, radiosValue]);

  //UI
  return (
    <>
      <Flex mt="10" flexDir="row">
        <Switch
          isChecked={hasPreparationTime}
          onChange={(ev) => {
            ev.stopPropagation();
            setHasPreparationTime(ev.target.checked);
          }}
        />
        <Text ml="4" fontSize="xl" color="black">
          {t('Definir tempo de preparo')}
          <Pendency />
        </Text>
      </Flex>
      <Text mt="1" fontSize="md">
        {t(
          'Ao definir o tempo de preparo, quando finalizado esse tempo, o pedido será automaticamente movido para ”Aguardando retirada”.'
        )}
      </Text>
      {hasPreparationTime && (
        <RadioGroup
          onChange={(value) => setRadiosValue(value.toString())}
          value={radiosValue}
          defaultValue="15"
          colorScheme="green"
        >
          <Flex flexDir="column" justifyContent="flex-start">
            <Radio mt="4" value="5" size="lg">
              {t('5 minutos')}
            </Radio>
            <Radio mt="4" value="10" size="lg">
              {t('10 minutos')}
            </Radio>
            <Radio mt="4" value="15" size="lg">
              {t('15 minutos')}
            </Radio>
            <Radio mt="4" value="20" size="lg">
              {t('20 minutos')}
            </Radio>
            <Radio mt="4" value="30" size="lg">
              {t('30 minutos')}
            </Radio>
            <Radio mt="4" value="45" size="lg">
              {t('45 minutos')}
            </Radio>
            <Flex mt="2" flexDir="row" alignItems="center">
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
                  value={preparationTime ?? '0'}
                  onChange={(ev) => notifyParentWithTime(ev.target.value)}
                />
              )}
            </Flex>
          </Flex>
        </RadioGroup>
      )}
    </>
  );
};
