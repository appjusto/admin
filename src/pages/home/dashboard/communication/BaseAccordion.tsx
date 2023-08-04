import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Box,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface BaseAccordionProps extends AccordionProps {
  title: string;
  description: string | React.ReactNode;
}

export const BaseAccordion = ({
  title,
  description,
  children,
  ...props
}: BaseAccordionProps) => {
  return (
    <Accordion
      mt="6"
      allowToggle
      border="1px solid #C8D7CB"
      borderRadius="lg"
      pt="4"
      {...props}
    >
      <AccordionItem border="none" pb="6">
        <AccordionButton
          display="flex"
          justifyContent="space-between"
          _focus={{ outline: 'none ' }}
          _hover={{ bgColor: 'white' }}
        >
          <Text fontSize="xl" fontWeight="semibold">
            {title}
          </Text>
          <AccordionIcon w="8" h="8" />
        </AccordionButton>
        <Box mt="-2" px="4">
          {typeof description === 'string' ? (
            <Text>{description}</Text>
          ) : (
            description
          )}
        </Box>
        <AccordionPanel pb={4}>{children}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
