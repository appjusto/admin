import { Flex, FlexProps, Text } from '@chakra-ui/react';
import { ReactComponent as CheckmarkChecked } from 'common/img/checkmark-checked.svg';
import { ReactComponent as Checkmark } from 'common/img/checkmark.svg';
import React from 'react';

interface Props extends FlexProps {
  checked?: boolean;
  currentStep?: boolean;
  text: string;
}

export const OnboardingItem = ({ checked, currentStep, text, ...props }: Props) => {
  return (
    <Flex {...props}>
      {checked ? <CheckmarkChecked /> : <Checkmark />}
      <Text ml="4" color="black" fontWeight={currentStep ? 'bold' : 'normal'}>
        {text}
      </Text>
    </Flex>
  );
};
