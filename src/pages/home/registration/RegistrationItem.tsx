import { InfoOutlineIcon } from '@chakra-ui/icons';
import { HStack, Link, Stack, Text, VStack } from '@chakra-ui/react';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { ReactComponent as CheckmarkChecked } from 'common/img/checkmark-checked.svg';
import { ReactComponent as Checkmark } from 'common/img/checkmark.svg';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

interface RegistrationItemProps {
  type: string;
  status: boolean;
  label: string;
  link: string;
  secondarylabel?: string;
  secondaryAction?(): void;
  helpText: string;
  helpLink: string;
}

export const RegistrationItem = ({
  type,
  status,
  label,
  link,
  secondarylabel,
  secondaryAction,
  helpText,
  helpLink,
  ...props
}: RegistrationItemProps) => {
  // context
  const businessId = useContextBusinessId();
  const { isBackofficeUser } = useContextStaffProfile();
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
      <VStack spacing={4} alignItems="flex-start">
        <HStack spacing={4}>
          {status ? <CheckmarkChecked /> : <Checkmark />}
          <Text fontSize="16px" lineHeight="22px" fontWeight="700">
            {label}
          </Text>
        </HStack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          {!status && (
            <>
              <CustomButton
                mt="0"
                variant="outline"
                label={t('Preencher')}
                link={
                  type === 'manager' && isBackofficeUser
                    ? `/backoffice/businesses/${businessId}`
                    : `${path}/${link}`
                }
              />
              {secondarylabel && secondaryAction && (
                <CustomButton
                  mt="0"
                  h="48px"
                  variant="outline"
                  label={secondarylabel}
                  onClick={secondaryAction}
                />
              )}
            </>
          )}
        </Stack>
      </VStack>
      <HStack spacing={2}>
        <InfoOutlineIcon w="16px" h="16px" />
        <Link
          href={helpLink}
          isExternal
          fontSize="15px"
          lineHeight="21px"
          textDecor="underline"
        >
          {helpText}
        </Link>
      </HStack>
    </HStack>
  );
};
