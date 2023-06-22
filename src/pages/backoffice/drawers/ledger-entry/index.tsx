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
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useObserveLedgerEntry } from 'app/api/ledger/useObserveLedgerEntry';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import {
  flavorsPTOptions,
  ledgerEntryOperationPTOptions,
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

type StateAccountType = AccountType | 'consumer';

export const LedgerEntryDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { entryId } = useParams<Params>();
  const { user, userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const {
    entry,
    submitLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry,
    submitLedgerEntryResult,
    updateLedgerEntryResult,
    deleteLedgerEntryResult,
  } = useObserveLedgerEntry(entryId);
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
    React.useState<StateAccountType>('courier');
  const [description, setDescription] = React.useState('');
  const [entryValue, setEntryValue] = React.useState(0);
  const [status, setStatus] = React.useState<LedgerEntryStatus>('pending');
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = entryId === 'new';
  const canUpdate =
    !isNew &&
    userAbility?.can('update', 'invoices') &&
    entry?.status &&
    !['paid', 'processing', 'canceled'].includes(entry.status);
  // handlers
  const handleSubmit = () => {
    if (!user) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'LedgerEntryDrawer-submit-error',
        message: {
          title: 'Usuário não encontrado.',
          description: 'Não foi possível encontrar o seu usuário.',
        },
      });
    }
    if (fromAccountType === 'platform' && toAccountType === 'platform') {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'LedgerEntryDrawer-submit-error',
        message: {
          title: 'Operação inválida.',
          description:
            'Não é possível transferir da plataforma para ela mesma.',
        },
      });
    }
    if (isNew) {
      const newEntry = {
        createdBy: {
          id: user.uid,
          email: user.email!,
        },
        operation,
        value: entryValue,
        status,
        from: {
          accountId: fromAccountId.length > 0 ? fromAccountId : null,
          accountType: fromAccountType,
          token: fromToken.length > 0 ? fromToken : null,
        },
        to: {
          accountId: toAccountId.length > 0 ? toAccountId : null,
          accountType: toAccountType,
        },
        description,
      } as Partial<LedgerEntry>;
      if (orderId.length > 0) newEntry.orderId = orderId;
      submitLedgerEntry(newEntry);
    } else {
      const newEntry = {
        ...entry,
        status,
        updatedBy: {
          id: user.uid,
          email: user.email!,
        },
      };
      updateLedgerEntry({ entryId, changes: newEntry });
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
  React.useEffect(() => {
    if (operation === 'same-owner-accounts') {
      if (fromAccountType === 'platform') setFromAccountType('courier');
      setToAccountType(fromAccountType);
    } else {
      setFromToken('');
    }
    if (operation === 'business-insurance') {
      setFromAccountType('platform');
      setToAccountType('business');
    } else if (operation === 'refund-credit') {
      setToAccountType('consumer');
    }
  }, [operation, fromAccountType, toAccountType]);
  React.useEffect(() => {
    if (fromAccountType === 'platform') setFromAccountId('');
  }, [fromAccountType]);
  React.useEffect(() => {
    if (toAccountType === 'platform') setToAccountId('');
  }, [toAccountType]);
  React.useEffect(() => {
    if (
      submitLedgerEntryResult.isSuccess ||
      deleteLedgerEntryResult.isSuccess
    ) {
      onClose();
    }
  }, [
    onClose,
    submitLedgerEntryResult.isSuccess,
    deleteLedgerEntryResult.isSuccess,
  ]);
  //UI
  if (!isNew) {
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
                  {t('Transferência')}
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
                  {entry?.orderId ? (
                    <Link
                      as={RouterLink}
                      to={`/backoffice/orders/${entry.orderId}`}
                      fontWeight="500"
                      textDecor="underline"
                    >
                      {entry.orderId}
                    </Link>
                  ) : (
                    <Text as="span" fontWeight="500">
                      N/E
                    </Text>
                  )}
                </Text>
                <Text
                  mt="2"
                  fontSize="15px"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('Criada em:')}{' '}
                  <Text as="span" fontWeight="500">
                    {getDateAndHour(entry?.createdOn)}
                  </Text>
                </Text>
                {entry?.updatedOn && (
                  <Text
                    mt="2"
                    fontSize="15px"
                    color="black"
                    fontWeight="700"
                    lineHeight="22px"
                  >
                    {t('Atualizada em:')}{' '}
                    <Text as="span" fontWeight="500">
                      {getDateAndHour(entry.updatedOn)}
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
                  {t('Criada por:')}{' '}
                  <Text as="span" fontWeight="500">
                    {entry?.createdBy === 'platform'
                      ? 'Plataforma'
                      : entry?.createdBy?.email ?? 'N/E'}
                  </Text>
                </Text>
                {entry?.updatedBy && (
                  <Text
                    mt="2"
                    fontSize="15px"
                    color="black"
                    fontWeight="700"
                    lineHeight="22px"
                  >
                    {t('Atualizada por:')}{' '}
                    <Text as="span" fontWeight="500">
                      {entry.updatedBy?.email ?? 'N/E'}
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
                  {t('Operação:')}{' '}
                  <Text as="span" fontWeight="500">
                    {entry?.operation
                      ? ledgerEntryOperationPTOptions[entry.operation]
                      : 'N/E'}
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
                    {entry?.from.accountType
                      ? flavorsPTOptions[entry?.from.accountType]
                      : 'N/E'}
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
                  {t('ID da conta de destino:')}{' '}
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
                        <Radio value="pending" isDisabled>
                          {t('Pendente')}
                        </Radio>
                        <Radio value="approved">{t('Aprovada')}</Radio>
                        <Radio value="rejected">{t('Rejeitada')}</Radio>
                        <Radio value="canceled" isDisabled>
                          {t('Cancelada')}
                        </Radio>
                        <Radio value="processing" isDisabled>
                          {t('Processando')}
                        </Radio>
                        <Radio value="paid" isDisabled>
                          {t('Paga')}
                        </Radio>
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
                        {t(
                          `Tem certeza que deseja excluir esta transferência?`
                        )}
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
                          onClick={() => deleteLedgerEntry(entryId)}
                          isLoading={deleteLedgerEntryResult.isLoading}
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
                        isLoading={updateLedgerEntryResult.isLoading}
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
          </form>
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
              <SectionTitle>{t('Tipo de operação')}</SectionTitle>
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
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="same-owner-accounts">
                    {t('Contas do mesmo usuário')}
                  </Radio>
                  <Radio value="business-insurance">
                    {t('Cobertura restaurante')}
                  </Radio>
                  <Radio value="refund-credit">
                    {t('Crédito de reembolso')}
                  </Radio>
                  <Radio value="others">{t('Outros')}</Radio>
                </Stack>
              </RadioGroup>
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
                isDisabled={operation === 'business-insurance'}
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio
                    value="platform"
                    isDisabled={
                      operation === 'same-owner-accounts' ||
                      operation === 'business-insurance'
                    }
                  >
                    {t('Plataforma')}
                  </Radio>
                  <Radio value="courier">{t('Entregador')}</Radio>
                  <Radio value="business">{t('Restaurante')}</Radio>
                </Stack>
              </RadioGroup>
              {fromAccountType !== 'platform' &&
                operation !== 'same-owner-accounts' && (
                  <CustomInput
                    id="entry-from-account-id"
                    label={t('ID da conta *')}
                    placeholder={t('Digite o id da conta')}
                    value={fromAccountId!}
                    onChange={(ev) => setFromAccountId(ev.target.value)}
                    isRequired
                  />
                )}
              {fromAccountType !== 'platform' &&
                operation === 'same-owner-accounts' && (
                  <>
                    <Text mt="4">
                      {t(
                        'Para transferência entre contas de um mesmo usuário, é preciso informar o token da conta de origem do Iugu'
                      )}
                    </Text>
                    <CustomInput
                      mt="2"
                      id="entry-from-token"
                      label={t('Token da conta (Api Iugu)')}
                      placeholder={t('Digite o id da conta, se houver')}
                      value={fromToken}
                      onChange={(ev) => setFromToken(ev.target.value)}
                    />
                  </>
                )}
              <SectionTitle>{t('Conta de destino')}</SectionTitle>
              <RadioGroup
                mt="2"
                onChange={(value: StateAccountType) => setToAccountType(value)}
                value={toAccountType}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
                isDisabled={
                  operation === 'same-owner-accounts' ||
                  operation === 'business-insurance' ||
                  operation === 'refund-credit'
                }
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="platform">{t('Plataforma')}</Radio>
                  <Radio value="courier">{t('Entregador')}</Radio>
                  <Radio value="business">{t('Restaurante')}</Radio>
                  <Radio value="consumer">{t('Consumidor')}</Radio>
                </Stack>
              </RadioGroup>
              {toAccountType !== 'platform' && (
                <CustomInput
                  id="entry-to-account-id"
                  label={t('ID da conta *')}
                  placeholder={t('Digite o id da conta')}
                  value={toAccountId}
                  onChange={(ev) => setToAccountId(ev.target.value)}
                  isRequired
                />
              )}
              <SectionTitle>{t('Dados da operação')}</SectionTitle>
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
                {t('(*) campos obrigatórios')}
              </Text>
            </DrawerBody>
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <HStack w="100%" spacing={4}>
                <Button
                  width="full"
                  fontSize="15px"
                  type="submit"
                  isLoading={submitLedgerEntryResult.isLoading}
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
