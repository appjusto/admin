import { Heading, Text } from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <>
      <Heading fontSize="lg" mt="4">
        {title}
      </Heading>
      <Text fontSize="sm">{subtitle}</Text>
    </>
  );
};

export default PageHeader;
