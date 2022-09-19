import { ProfileSituation } from '@appjusto/types';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const ConsumerStatus = () => {
  // context
  const { consumer, handleProfileChange, issueOptions } =
    useContextConsumerProfile();
  // helpers
  const profileIssues = (consumer?.profileIssues as string[]) ?? [];
  // UI
  return (
    <Box>
      <SectionTitle mt="0">{t('Alterar status do cliente:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value: ProfileSituation) =>
          handleProfileChange('situation', value)
        }
        value={consumer?.situation ?? 'pending'}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="submitted">
            {t('Submetido')}
          </Radio>
          <Radio mt="2" value="pending" isDisabled>
            {t('Pendente')}
          </Radio>
          <Radio mt="2" value="approved">
            {t('Aprovado')}
          </Radio>
          <Radio mt="2" value="rejected">
            {t('Rejeitado')}
          </Radio>
          <Radio mt="2" value="blocked">
            {t('Bloquear cliente')}
          </Radio>
        </Flex>
      </RadioGroup>
      {consumer?.situation === 'rejected' && (
        <>
          <SectionTitle>{t('Motivo da recusa:')}</SectionTitle>
          <CheckboxGroup
            colorScheme="green"
            value={profileIssues}
            onChange={(value) => handleProfileChange('profileIssues', value)}
          >
            <VStack alignItems="flex-start" mt="4" color="black" spacing={2}>
              {issueOptions?.map((issue) => (
                <Checkbox key={issue.id} value={issue.title}>
                  {issue.title}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </>
      )}
      {(consumer?.situation === 'rejected' ||
        consumer?.situation === 'blocked') && (
        <>
          <SectionTitle>{t('Mensagem personalizada:')}</SectionTitle>
          <Textarea
            mt="2"
            value={consumer?.profileIssuesMessage ?? ''}
            onChange={(ev) =>
              handleProfileChange('profileIssuesMessage', ev.target.value)
            }
          />
        </>
      )}
    </Box>
  );
};
