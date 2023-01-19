import { Center, Flex, FlexProps, Icon, Text } from '@chakra-ui/react';
import { ReactComponent as CheckmarkChecked } from 'common/img/checkmark-checked.svg';
import { ReactComponent as Checkmark } from 'common/img/checkmark.svg';

interface Props extends FlexProps {
  checked?: boolean;
  currentStep?: boolean;
  text: string;
}

export const OnboardingItem = ({
  checked,
  currentStep,
  text,
  ...props
}: Props) => {
  return (
    <Flex {...props}>
      <Center>
        {checked ? <Icon as={CheckmarkChecked} /> : <Icon as={Checkmark} />}
      </Center>
      <Text ml="4" color="black" fontWeight={currentStep ? 'bold' : 'normal'}>
        {text}
      </Text>
    </Flex>
  );
};
