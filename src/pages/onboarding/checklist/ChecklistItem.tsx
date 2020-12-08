import { Flex, FlexProps, Text } from '@chakra-ui/react';
import React from 'react';
import { ReactComponent as CheckmarkChecked } from './img/checkmark-checked.svg';
import { ReactComponent as Checkmark } from './img/checkmark.svg';

interface Props extends FlexProps {
  checked?: boolean;
  text: string;
}

export const OnboardingItem = ({ checked, text, ...props }: Props) => {
  return (
    <Flex {...props}>
      {checked ? <CheckmarkChecked /> : <Checkmark /> }
      <Text ml="4" color="black">{text}</Text>
    </Flex>
  );
}
