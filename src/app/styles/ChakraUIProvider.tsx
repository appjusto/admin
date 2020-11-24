import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { Button } from './components/Button';
import { Switch } from './components/Switch';
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
  },
  components: {
    Button,
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
