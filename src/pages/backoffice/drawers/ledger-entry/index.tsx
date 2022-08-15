import {
  AccountType,
  LedgerEntry,
  LedgerEntryOperation,
  LedgerEntryStatus,
} from '@appjusto/types';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Link,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useObserveLedgerEntry } from 'app/api/ledger/useObserveLedgerEntry';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import CustomRadio from 'common/components/form/CustomRadio';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import {
  flavorsPTOptions,
  ledgerEntryStatusPTOptions,
} from 'pages/backoffice/utils';
import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  entryId: string;
};

export const LedgerEntryDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { entryId } = useParams<Params>();
  const { userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const entry = useObserveLedgerEntry(entryId);
  // state
  const [orderId, setOrderId] = React.useState('');
  const [operation, setOperation] =
    React.useState<LedgerEntryOperation>('delivery');
  const [fromAccountId, setFromAccountId] = React.useState('');
  const [fromAccountType, setFromAccountType] =
    React.useState<AccountType>('platform');
  const [fromToken, setFromToken] = React.useState('');
  const [toAccountId, setToAccountId] = React.useState('');
  const [toAccountType, setToAccountType] =
    React.useState<AccountType>('courier');
  const [description, setDescription] = React.useState('');
  const [entryValue, setEntryValue] = React.useState(0);
  const [status, setStatus] = React.useState<LedgerEntryStatus>('pending');
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = entryId === 'new';
  const canUpdate = !isNew && userAbility?.can('update', 'invoices');
  // const isLoading = isNew
  //   ? submitPushCampaignResult.isLoading
  //   : updatePushCampaignResult.isLoading;
  // handlers
  const handleSubmit = () => {
    const validation = true;
    if (!validation) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'PushDrawer-submit-error',
        message: {
          title: 'Informações inválidas.',
          description: 'A data e horário informados não são válidos.',
        },
      });
    }
    let newEntry = {
      orderId,
      operation,
      value: entryValue,
      status,
      from: {
        accountId: fromAccountId,
        accountType: fromAccountType,
        token: fromToken,
      },
      to: {
        accountId: toAccountId,
        accountType: toAccountType,
      },
      description,
    } as Partial<LedgerEntry>;
    if (isNew) {
      // submitPushCampaign(newEntry);
      console.log(newEntry);
    } else {
      // updatePushCampaign({ entryId, changes: newEntry });
      console.log(newEntry);
    }
  };
  // side effects
  React.useEffect(() => {
    if (!entry) return;
    if (entry.orderId) setOrderId(entry.orderId);
    setOperation(entry.operation);
    if (entry.from.accountId) setFromAccountId(entry.from.accountId);
    setFromAccountType(entry.from.accountType);
    if (entry.from.token) setFromToken(entry.from.token);
    if (entry.to.accountId) setToAccountId(entry.to.accountId);
    setToAccountType(entry.to.accountType);
    if (entry.description) setDescription(entry.description);
    setEntryValue(entry.value);
    setStatus(entry.status);
  }, [entry]);
  // React.useEffect(() => {
  //   if (
  //     submitPushCampaignResult.isSuccess ||
  //     deletePushCampaignResult.isSuccess
  //   ) {
  //     onClose();
  //   }
  // }, [
  //   onClose,
  //   submitPushCampaignResult.isSuccess,
  //   deletePushCampaignResult.isSuccess,
  // ]);
  //UI
  if (!isNew) {
    return (
      <Drawer placement="right" size="lg" onClose={onClose} {...props}>
        <DrawerOverlay>
          <DrawerContent mt={{ base: '16', lg: '0' }}>
            <DrawerCloseButton
              bg="green.500"
              mr="12px"
              _focus={{ outline: 'none' }}
            />
            <DrawerHeader pb="2">
              <Text
                color="black"
                fontSize="2xl"
                fontWeight="700"
                lineHeight="28px"
                mb="2"
              >
                {t('Registro')}
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28">
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('ID do pedido:')}{' '}
                <Link
                  as={RouterLink}
                  to={`/backoffice/orders/${entry?.orderId}`}
                  fontWeight="500"
                  textDecor="underline"
                >
                  {entry?.orderId ?? 'N/E'}
                </Link>
              </Text>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Data:')}{' '}
                <Text as="span" fontWeight="500">
                  {getDateAndHour(entry?.createdOn)}
                </Text>
              </Text>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Operação:')}{' '}
                <Text as="span" fontWeight="500">
                  {entry?.operation ?? 'N/E'}
                </Text>
              </Text>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Descrição:')}{' '}
                <Text as="span" fontWeight="500">
                  {entry?.description ?? 'N/E'}
                </Text>
              </Text>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Tipo:')}{' '}
                <Text as="span" fontWeight="500">
                  {`De ${
                    entry?.from.accountType
                      ? flavorsPTOptions[entry?.from.accountType]
                      : 'N/E'
                  }`}
                </Text>
                <Text as="span" fontWeight="500">
                  {` para ${
                    entry?.to.accountType
                      ? flavorsPTOptions[entry?.to.accountType]
                      : 'N/E'
                  }`}
                </Text>
              </Text>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Conta de destino:')}{' '}
                <Text as="span" fontWeight="500">
                  {entry?.to.accountId ?? 'N/E'}
                </Text>
              </Text>
              {!canUpdate && (
                <Text
                  mt="2"
                  fontSize="15px"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('Status:')}{' '}
                  <Text as="span" fontWeight="500">
                    {entry?.status
                      ? ledgerEntryStatusPTOptions[entry.status]
                      : 'N/E'}
                  </Text>
                </Text>
              )}
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Valor:')}{' '}
                <Text as="span" fontWeight="500">
                  {entry?.value ? formatCurrency(entry?.value) : 'N/E'}
                </Text>
              </Text>
              {canUpdate && (
                <>
                  <SectionTitle>{t('Status')}</SectionTitle>
                  <RadioGroup
                    mt="2"
                    onChange={(value: LedgerEntryStatus) => setStatus(value)}
                    value={status}
                    defaultValue="1"
                    colorScheme="green"
                    color="black"
                    fontSize="15px"
                    lineHeight="21px"
                  >
                    <VStack mt="4" spacing={2} alignItems="flex-start">
                      <CustomRadio value="pending">{t('Pendente')}</CustomRadio>
                      <CustomRadio value="approved">
                        {t('Aprovada')}
                      </CustomRadio>
                      <CustomRadio value="processing">
                        {t('Processando')}
                      </CustomRadio>
                      <CustomRadio value="paid">{t('Paga')}</CustomRadio>
                      <CustomRadio value="canceled">
                        {t('Cancelada')}
                      </CustomRadio>
                    </VStack>
                  </RadioGroup>
                </>
              )}
            </DrawerBody>
            {canUpdate && (
              <DrawerFooter borderTop="1px solid #F2F6EA">
                {isDeleting ? (
                  <Box
                    mt="8"
                    w="100%"
                    bg="#FFF8F8"
                    border="1px solid red"
                    borderRadius="lg"
                    p="6"
                  >
                    <Text color="red">
                      {t(`Tem certeza que deseja excluir esta transferência?`)}
                    </Text>
                    <HStack mt="4" spacing={4}>
                      <Button
                        width="full"
                        fontSize="15px"
                        onClick={() => setIsDeleting(false)}
                      >
                        {t(`Manter transferência`)}
                      </Button>
                      <Button
                        width="full"
                        variant="danger"
                        fontSize="15px"
                        // onClick={() => deletePushCampaign(entryId)}
                        // isLoading={deletePushCampaignResult.isLoading}
                      >
                        {t(`Excluir`)}
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <HStack w="100%" spacing={4}>
                    <Button
                      width="full"
                      fontSize="15px"
                      type="submit"
                      // isLoading={isLoading}
                      loadingText={t('Salvando')}
                    >
                      {t('Salvar alterações')}
                    </Button>
                    <Button
                      width="full"
                      fontSize="15px"
                      variant="dangerLight"
                      onClick={() => setIsDeleting(true)}
                    >
                      {t('Excluir transferência')}
                    </Button>
                  </HStack>
                )}
              </DrawerFooter>
            )}
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  }
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}
        >
          <DrawerContent mt={{ base: '16', lg: '0' }}>
            <DrawerCloseButton
              bg="green.500"
              mr="12px"
              _focus={{ outline: 'none' }}
            />
            <DrawerHeader pb="2">
              <Text
                color="black"
                fontSize="2xl"
                fontWeight="700"
                lineHeight="28px"
                mb="2"
              >
                {t('Nova transferência')}
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28">
              <SectionTitle mt="0">{t('Pedido')}</SectionTitle>
              <CustomInput
                id="entry-order-id"
                label={t('ID do pedido')}
                placeholder={t('Digite o ID do pedido, se houver')}
                value={orderId}
                onChange={(ev) => setOrderId(ev.target.value)}
              />
              <SectionTitle>{t('Conta de origem')}</SectionTitle>
              <RadioGroup
                mt="2"
                onChange={(value: AccountType) => setFromAccountType(value)}
                value={fromAccountType}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <HStack spacing={4}>
                  <CustomRadio value="platform">{t('Plataforma')}</CustomRadio>
                  <CustomRadio value="courier">{t('Entregador')}</CustomRadio>
                  <CustomRadio value="business">{t('Restaurante')}</CustomRadio>
                </HStack>
              </RadioGroup>
              <CustomInput
                id="entry-from-account-id"
                label={t('ID da conta *')}
                placeholder={t('Digite o id da conta')}
                value={fromAccountId}
                onChange={(ev) => setFromAccountId(ev.target.value)}
                isRequired
              />
              <CustomInput
                id="entry-from-token"
                label={t('Token da conta')}
                placeholder={t('Digite o id da conta, se houver')}
                value={fromToken}
                onChange={(ev) => setFromToken(ev.target.value)}
                isRequired
              />
              <SectionTitle>{t('Conta de destino')}</SectionTitle>
              <RadioGroup
                mt="2"
                onChange={(value: AccountType) => setToAccountType(value)}
                value={toAccountType}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <HStack spacing={4}>
                  <CustomRadio value="platform">{t('Plataforma')}</CustomRadio>
                  <CustomRadio value="courier">{t('Entregador')}</CustomRadio>
                  <CustomRadio value="business">{t('Restaurante')}</CustomRadio>
                </HStack>
              </RadioGroup>
              <CustomInput
                id="entry-to-account-id"
                label={t('ID da conta *')}
                placeholder={t('Digite o id da conta')}
                value={toAccountId}
                onChange={(ev) => setToAccountId(ev.target.value)}
                isRequired
              />
              <SectionTitle>{t('Dados da operação')}</SectionTitle>
              <RadioGroup
                mt="2"
                onChange={(value: LedgerEntryOperation) => setOperation(value)}
                value={operation}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <HStack spacing={4}>
                  <CustomRadio value="delivery">{t('Delivery')}</CustomRadio>
                </HStack>
              </RadioGroup>
              <Textarea
                id="antry-description"
                label={t('Descrição')}
                placeholder={t('Digite a descrição da operação')}
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
              />
              <CurrencyInput
                id="entry-value"
                value={entryValue}
                label={t('Valor da transferência *')}
                placeholder={t('0,00')}
                onChangeValue={(value) => setEntryValue(value)}
                maxLength={6}
                isRequired
              />
              <Text mt="4" fontSize="15px">
                {t('* campos obrigatórios')}
              </Text>
            </DrawerBody>
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <HStack w="100%" spacing={4}>
                <Button
                  width="full"
                  fontSize="15px"
                  type="submit"
                  // isLoading={isLoading}
                  loadingText={t('Salvando')}
                >
                  {t('Salvar')}
                </Button>
                <Button
                  width="full"
                  fontSize="15px"
                  variant="dangerLight"
                  onClick={onClose}
                >
                  {t('Cancelar')}
                </Button>
              </HStack>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </DrawerOverlay>
    </Drawer>
  );
};
