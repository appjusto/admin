import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { Button } from './components/Button';
import Checkbox from './components/Checkbox';
import { CustomInput } from './components/CustomInput';
import { CustomTextarea } from './components/CustomTextarea';
import { IconButton } from './components/IconButton';
import Radio from './components/Radio';
import { Select } from './components/Select';
import Switch from './components/Switch';
import { colors } from './foundations/colors';
import { typography } from './foundations/typography';

const theme = extendTheme({
  ...typography,
  colors,
  textStyles: {
    inputLabel: {
      fontSize: 'xs',
      color: 'green.600',
    },
    link: {
      fontSize: 'sm',
      textDecoration: 'underline',
    },
  },
  components: {
    Button,
    Checkbox,
    CustomInput,
    CustomTextarea,
    IconButton,
    Radio,
    Select,
    Switch,
  },
});

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ChakraUIProvider = ({ children }: Props) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  );
};
