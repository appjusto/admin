import { Box, Heading, Text, TextProps } from '@chakra-ui/react';
import React from 'react';

interface Props extends TextProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle, ...props }: Props) => {
  return (
    <Box>
      <Heading color="black" fontSize="2xl" mt="4" {...props}>
        {title}
      </Heading>
      {subtitle && (
        <Text mt="1" fontSize="sm" maxW="580px" {...props}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
};

export default PageHeader;
