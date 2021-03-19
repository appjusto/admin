import { Heading, HeadingProps } from '@chakra-ui/react';

export const SectionHeading = ({ children }: HeadingProps) => {
  return (
    <Heading color="black" fontSize="32px" fontWeight="700" lineHeight="38.4px" mb="4">
      {children}
    </Heading>
  );
};
