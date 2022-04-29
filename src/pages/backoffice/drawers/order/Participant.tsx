import { CourierMode, Issue } from '@appjusto/types';
import { Box, Flex, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import CustomRadio from 'common/components/form/CustomRadio';
import { Textarea } from 'common/components/form/input/Textarea';
import { FieldValue } from 'firebase/firestore';
import { modePTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ParticipantProps {
  type: 'consumer' | 'business' | 'courier' | 'p2p-instructions';
  participantId?: string;
  isOutsource?: boolean;
  isOrderActive?: boolean;
  name?: string;
  mode?: CourierMode;
  instruction?: string;
  deliveries?: number;
  rejected?: number;
  address?: string;
  additionalInfo?: string;
  onboarding?: FieldValue;
  dropIssues?: Issue[] | null;
  removeCourier?(issue?: Issue, comment?: string): void;
  isLoading?: boolean;
}

export const Participant = ({
  type,
  participantId,
  isOutsource,
  isOrderActive,
  name,
  mode,
  instruction,
  deliveries,
  rejected,
  address,
  additionalInfo,
  onboarding,
  dropIssues,
  removeCourier,
  isLoading,
}: ParticipantProps) => {
  // state
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [issueId, setIssueId] = React.useState((dropIssues && dropIssues[0].id) ?? '');
  const [comment, setComment] = React.useState('');
  // handlers
  const handleRemoving = () => {
    const issue = dropIssues?.find((issue) => issue.id === issueId);
    removeCourier!(issue, comment);
  };
  // side effects
  React.useEffect(() => {
    if (dropIssues && dropIssues[0].id) setIssueId(dropIssues[0].id);
  }, [dropIssues]);
  React.useEffect(() => {
    if (!participantId) setIsRemoving(false);
  }, [participantId]);
  // UI
  if (type === 'consumer') {
    return (
      <Box mb="10">
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Nome:')}{' '}
          <Text as="span" fontWeight="500">
            {name ?? 'N/E'}
          </Text>
        </Text>
        {typeof address === 'string' && (
          <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
            {t('Endereço principal:')}{' '}
            <Text as="span" fontWeight="500">
              {address ?? 'N/E'}
            </Text>
          </Text>
        )}
        {typeof additionalInfo === 'string' && (
          <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
            {t('Complemento:')}{' '}
            <Text as="span" fontWeight="500">
              {additionalInfo ?? 'N/E'}
            </Text>
          </Text>
        )}
        <CustomButton
          minW="220px"
          h="34px"
          mt="4"
          borderColor="#697667"
          variant="outline"
          label={t('ver cadastro do cliente')}
          link={`/backoffice/consumer/${participantId}`}
          fontSize="xs"
          lineHeight="lg"
        />
      </Box>
    );
  }
  if (type === 'p2p-instructions') {
    return (
      <Box mb="10">
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Nome:')}{' '}
          <Text as="span" fontWeight="500">
            {instruction ?? 'N/E'}
          </Text>
        </Text>
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Endereço principal:')}{' '}
          <Text as="span" fontWeight="500">
            {address ?? 'N/E'}
          </Text>
        </Text>
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Complemento:')}{' '}
          <Text as="span" fontWeight="500">
            {additionalInfo ?? 'N/E'}
          </Text>
        </Text>
      </Box>
    );
  }
  if (type === 'business') {
    return (
      <Box mb="10">
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Nome:')}{' '}
          <Text as="span" fontWeight="500">
            {name ?? 'N/E'}
          </Text>
        </Text>
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Endereço principal:')}{' '}
          <Text as="span" fontWeight="500">
            {address ?? 'N/E'}
          </Text>
        </Text>
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Complemento:')}{' '}
          <Text as="span" fontWeight="500">
            {additionalInfo ?? 'N/E'}
          </Text>
        </Text>
        <CustomButton
          minW="220px"
          h="34px"
          mt="4"
          borderColor="#697667"
          variant="outline"
          label={t('Ver cadastro do restaurante')}
          link={`/backoffice/business/${participantId}`}
          fontSize="xs"
          lineHeight="lg"
        />
      </Box>
    );
  }
  return (
    <Box mb="10">
      {isOutsource ? (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Logística fora da rede')}
        </Text>
      ) : (
        <>
          <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
            {name ? t('Nome:') : t('Instrução:')}{' '}
            <Text as="span" fontWeight="500">
              {name ?? 'N/E'}
            </Text>
          </Text>
          <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
            {t('Modalidade da entrega:')}{' '}
            <Text as="span" fontWeight="500">
              {mode ? modePTOptions[mode] : 'N/E'}
            </Text>
          </Text>
        </>
      )}
      {typeof deliveries === 'number' && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Pedidos entregues:')}{' '}
          <Text as="span" fontWeight="500">
            {deliveries}
          </Text>
        </Text>
      )}
      {typeof rejected === 'number' && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Pedidos rejeitados:')}{' '}
          <Text as="span" fontWeight="500">
            {rejected}
          </Text>
        </Text>
      )}
      {onboarding && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Data do onboarding:')}{' '}
          <Text as="span" fontWeight="500">
            {getDateAndHour(onboarding)}
          </Text>
        </Text>
      )}
      {!isOutsource && (
        <Stack mt="4" w="100%" spacing={4} direction={{ base: 'column', md: 'row' }}>
          {isRemoving ? (
            <Flex
              w="100%"
              flexDir="column"
              justifyContent="center"
              bg="#FFF8F8"
              p="4"
              borderRadius="lg"
            >
              <Text fontSize="lg">{'Informe o motivo da remoção:'}</Text>
              <RadioGroup
                onChange={(value) => setIssueId(value as string)}
                value={issueId}
                colorScheme="green"
              >
                <Flex flexDir="column" justifyContent="flex-start">
                  {dropIssues &&
                    dropIssues.map((issue) => (
                      <CustomRadio mt={{ base: '3', md: '1' }} key={issue.id} value={issue.id}>
                        {issue.title}
                      </CustomRadio>
                    ))}
                </Flex>
              </RadioGroup>
              <Text mt="4" fontSize="lg">
                {'Comentário:'}
              </Text>
              <Textarea
                mt="2"
                bg="white"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Flex mt="4" w="100%" justifyContent="flex-end">
                <CustomButton
                  mt="0"
                  h="34px"
                  w="100%"
                  label={t('Manter')}
                  fontSize="xs"
                  lineHeight="lg"
                  onClick={() => setIsRemoving(false)}
                />
                <CustomButton
                  mt="0"
                  ml="4"
                  h="34px"
                  w="100%"
                  variant="danger"
                  label={t('Remover')}
                  fontSize="xs"
                  lineHeight="lg"
                  onClick={handleRemoving}
                  isLoading={isLoading}
                />
              </Flex>
            </Flex>
          ) : (
            <>
              <CustomButton
                minW="220px"
                h="34px"
                mt="0"
                borderColor="#697667"
                variant="outline"
                label={t('Ver cadastro do entregador')}
                link={`/backoffice/courier/${participantId}`}
                fontSize="xs"
                lineHeight="lg"
                isDisabled={typeof participantId !== 'string'}
              />
              {removeCourier && (
                <CustomButton
                  h="34px"
                  mt="0"
                  variant="dangerLight"
                  label={t('Remover entregador')}
                  fontSize="xs"
                  lineHeight="lg"
                  onClick={() => setIsRemoving(true)}
                  isDisabled={!isOrderActive || typeof participantId !== 'string'}
                />
              )}
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};