import { Heading, Text } from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <>
      <Heading color="black" fontSize="2xl" mt="4">
        {title}
      </Heading>
      <Text mt="1" fontSize="sm">
        {subtitle}
      </Text>
    </>
  );
};

export default PageHeader;
