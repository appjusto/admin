import { InfoOutlineIcon } from '@chakra-ui/icons';
import { HStack, Link, Text, VStack } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { ReactComponent as CheckmarkChecked } from 'common/img/checkmark-checked.svg';
import { ReactComponent as Checkmark } from 'common/img/checkmark.svg';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

interface RegistrationItemProps {
  status: boolean;
  label: string;
  link: string;
  helpText: string;
  helpLink: string;
}

export const RegistrationItem = ({
  status,
  label,
  link,
  helpText,
  helpLink,
  ...props
}: RegistrationItemProps) => {
  const { path } = useRouteMatch();
  return (
    <HStack
      w="100%"
      spacing={2}
      justifyContent="space-between"
      border={status ? '1px solid #F6F6F6' : '1px solid #FFBE00'}
      borderRadius="lg"
      px="4"
      py={status ? '4' : '8'}
      {...props}
    >
      <VStack spacing={1} alignItems="flex-start">
        <HStack spacing={4}>
          {status ? <CheckmarkChecked /> : <Checkmark />}
          <Text fontSize="16px" lineHeight="22px" fontWeight="700">
            {label}
          </Text>
        </HStack>
        {!status && (
          <CustomButton variant="outline" label={t('Preencher')} link={`${path}/${link}`} />
        )}
      </VStack>
      <HStack spacing={2}>
        <InfoOutlineIcon w="16px" h="16px" />
        <Link href={helpLink} isExternal fontSize="15px" lineHeight="21px" textDecor="underline">
          {helpText}
        </Link>
      </HStack>
    </HStack>
  );
};
