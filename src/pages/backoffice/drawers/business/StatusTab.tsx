import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  RadioGroup,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { IssueType, ProfileSituation } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

const issueOptionsArray = ['business-profile-invalid'] as IssueType[];

export const StatusTab = () => {
  // context
  const { business, handleBusinessStatusChange, marketPlace } = useContextBusinessBackoffice();
  const issueOptions = useIssuesByType(issueOptionsArray);
  // state
  const [financialIssues, setFinancialIssues] = React.useState<string[]>([]);
  // side effects
  React.useEffect(() => {
    if (marketPlace?.issues) setFinancialIssues(marketPlace.issues);
  }, [marketPlace?.issues]);
  // UI
  return (
    <Box>
      {financialIssues.length > 0 && (
        <AlertError
          title={t(
            `Problemas identificados na verificação financeira: (${financialIssues.length ?? 0})`
          )}
          icon={false}
          border="2px solid #DC3545"
          mb="6"
        >
          <VStack mt="2" spacing={1} alignItems="flex-start">
            {financialIssues.map((issue) => (
              <Text key={issue}>* {t(`${issue}`)}</Text>
            ))}
          </VStack>
        </AlertError>
      )}
      <SectionTitle mt="0">{t('Alterar status do restaurante:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value: ProfileSituation) => handleBusinessStatusChange('situation', value)}
        value={business?.situation}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="approved" isDisabled={business?.situation !== 'verified'}>
            {t('Publicado')}
          </CustomRadio>
          <CustomRadio mt="2" value="rejected">
            {t('Recusado')}
          </CustomRadio>
          <CustomRadio mt="2" value="submitted">
            {t('Aguardando aprovação')}
          </CustomRadio>
          <CustomRadio mt="2" value="pending">
            {t('Pendente')}
          </CustomRadio>
          <CustomRadio mt="2" value="blocked">
            {t('Bloquear restaurante')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
      {business?.situation === 'rejected' && (
        <>
          <SectionTitle>{t('Motivo da recusa:')}</SectionTitle>
          <CheckboxGroup
            colorScheme="green"
            value={business?.profileIssues}
            onChange={(value) => handleBusinessStatusChange('profileIssues', value as string[])}
          >
            <VStack alignItems="flex-start" mt="4" color="black" spacing={2}>
              {issueOptions?.map((issue) => (
                <Checkbox key={issue.id} iconColor="white" value={issue.title}>
                  {issue.title}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </>
      )}
      {(business?.situation === 'rejected' || business?.situation === 'blocked') && (
        <>
          <SectionTitle>
            {business?.situation === 'rejected'
              ? t('Mensagem personalizada:')
              : t('Informe o motivo do bloqueio:')}
          </SectionTitle>
          <Textarea
            mt="2"
            value={business?.profileIssuesMessage ?? ''}
            onChange={(ev) => handleBusinessStatusChange('profileIssuesMessage', ev.target.value)}
          />
        </>
      )}
    </Box>
  );
};
