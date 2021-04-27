import { Text, TextProps } from '@chakra-ui/react';

interface SectionTitleProps extends TextProps {
  children: React.ReactNode | React.ReactNode[];
}

export const SectionTitle = ({ children, ...props }: SectionTitleProps) => {
  return (
    <Text mt="8" fontSize="20px" fontWeight="500" lineHeight="26px" color="black" {...props}>
      {children}
    </Text>
  );
};
