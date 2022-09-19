import { CookingTimeMode } from '@appjusto/types';
import { Flex, Radio, RadioGroup } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { t } from 'utils/i18n';

const radioOptions = ['10', '20', '25', '30', '40', '45', '50', '60'];

interface BusinessAverageCookingTimeProps {
  averageCookingTime?: number;
  getAverageCookingTime: (value: number) => void;
  cookingTimeMode?: CookingTimeMode;
}

export const BusinessAverageCookingTime = ({
  averageCookingTime,
  getAverageCookingTime,
  cookingTimeMode,
}: BusinessAverageCookingTimeProps) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [time, setTime] = React.useState('30');
  // handlers
  const notifyParentWithTime = (value: string) => {
    const time = parseInt(value) * 60;
    getAverageCookingTime(time);
  };
  // side effects
  React.useEffect(() => {
    if (!averageCookingTime) return;
    setTime(String(averageCookingTime / 60));
  }, [averageCookingTime]);
  // UI
  return (
    <RadioGroup
      onChange={notifyParentWithTime}
      value={time}
      defaultValue="15"
      colorScheme="green"
    >
      <Flex flexDir="column" justifyContent="flex-start">
        {radioOptions.map((option) => (
          <Radio
            key={option}
            mt="4"
            value={option}
            size="md"
            isDisabled={!isBackofficeUser && cookingTimeMode === 'auto'}
          >
            {t(`${option} minutos`)}
          </Radio>
        ))}
      </Flex>
    </RadioGroup>
  );
};
