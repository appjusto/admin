import { ProfileSituation, StaffProfile, UserPermissions, WithId } from '@appjusto/types';
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
  Flex,
  HStack,
  RadioGroup,
  Skeleton,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useStaff } from 'app/api/staff/useStaff';
import { useContextAppRequests } from 'app/state/requests/context';
import CustomRadio from 'common/components/form/CustomRadio';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { permissionsPTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { EntityAccess } from './EntityAccess';
import { GenericMode, getGenericModePermissions } from './utils';

const initAcess = {
  orders: [],
  couriers: [],
  consumers: [],
  businesses: [],
  menu: [],
  chats: [],
  invoices: [],
  withdraws: [],
  advances: [],
  managers: [],
  recommendations: [],
  staff: [],
  users: [],
  platform: [],
} as UserPermissions;

type Situation = {
  before?: ProfileSituation;
  after?: ProfileSituation;
};

const isPermissionsValid = (permissions: UserPermissions) => {
  let rules = [] as string[];
  Object.keys(permissions).forEach((key) => {
    const rule = permissions[key as keyof UserPermissions];
    rules.push(...(rule as string[]));
  });
  if (rules.length === 0) return false;
  else return true;
};

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  staffId: string;
};

export const StaffBaseDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { staffId } = useParams<Params>();
  const isNew = staffId === 'new';
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { getStaff, createStaff, createResult, updateStaffSituation, updateSituationResult } =
    useStaff();
  const { deleteAccount, deleteAccountResult } = useAuthentication();
  // state
  const [email, setEmail] = React.useState('');
  const [staffProfile, setStaffProfile] = React.useState<WithId<StaffProfile> | null>();
  const [permissions, setPermissions] = React.useState(initAcess);
  const [situation, setSituation] = React.useState<Situation>({});
  const [genericMode, setGenericMode] = React.useState<GenericMode>('custom');
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isFetchingData = !isNew && staffProfile === undefined;
  const agentName = (staffProfile?.name ?? 'N/E') + ' ' + (staffProfile?.surname ?? '');
  const isSituationChanged = situation.before !== situation.after;
  // handlers
  const handleSave = () => {
    if (isNew && !email) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-base-drawer-no-email',
        message: { title: 'É preciso informar o email do agente.' },
      });
    } else if (!isPermissionsValid(permissions)) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-base-drawer-no-valid-permissions',
        message: { title: 'As permissões informadas não são válidas.' },
      });
    } else if (situation.after && situation.before !== situation.after) {
      updateStaffSituation({ staffId, situation: situation.after });
    } else {
      createStaff({ email, permissions });
    }
  };
  const handleDeleteAccount = async () => {
    if (!staffProfile?.id) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-base-drawer-valid-no-user-id',
        message: { title: 'Não foi possível encontrar o id deste usuário.' },
      });
    } else {
      await deleteAccount({ accountId: staffProfile.id });
    }
  };
  // side effects
  React.useEffect(() => {
    if (staffId === 'new') return;
    (async () => {
      const data = await getStaff(staffId);
      setStaffProfile(data?.staff ?? null);
      if (data?.permissions) setPermissions(data.permissions);
      if (data?.staff?.situation)
        setSituation({
          before: data.staff.situation,
          after: data.staff.situation,
        });
    })();
  }, [staffId, getStaff]);
  React.useEffect(() => {
    if (!staffProfile) return;
    setEmail(staffProfile.email);
  }, [staffProfile]);
  React.useEffect(() => {
    const changedPermissions = getGenericModePermissions(genericMode);
    setPermissions(changedPermissions);
  }, [genericMode]);
  React.useEffect(() => {
    if (deleteAccountResult.isSuccess || createResult.isSuccess) onClose();
  }, [deleteAccountResult.isSuccess, createResult.isSuccess, onClose]);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', lg: '0' }}>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {isNew ? t('Adicionar agente') : t('Agente')}
            </Text>
            {isNew ? (
              <CustomInput
                mt="8"
                id="add-agent-email-input"
                label={t('E-mail do agente')}
                placeholder={t('Digite o e-mail do agente')}
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value.toLowerCase())
                }
              />
            ) : isFetchingData ? (
              <>
                <HStack mt="1" spacing={2}>
                  <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                    {t('Email:')}
                  </Text>
                  <Skeleton w="100%" height="20px" maxW="200px" />
                </HStack>
                <HStack mt="1" spacing={2}>
                  <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                    {t('Nome:')}
                  </Text>
                  <Skeleton w="100%" height="20px" maxW="200px" />
                </HStack>
                <HStack mt="1" spacing={2}>
                  <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                    {t('Criado em:')}
                  </Text>
                  <Skeleton w="100%" height="20px" maxW="200px" />
                </HStack>
              </>
            ) : (
              <>
                <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                  {t('Email:')}{' '}
                  <Text as="span" fontWeight="500">
                    {staffProfile?.email ?? 'N/E'}
                  </Text>
                </Text>
                <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                  {t('Nome:')}{' '}
                  <Text as="span" fontWeight="500">
                    {agentName}
                  </Text>
                </Text>
                <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                  {t('Criado em:')}{' '}
                  <Text as="span" fontWeight="500">
                    {getDateAndHour(staffProfile?.createdOn)}
                  </Text>
                </Text>
              </>
            )}
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle mt="4">
              {isFetchingData ? t('Carregando permissões...') : t('Permissões')}
            </SectionTitle>
            <Text>{t('Defina as permissões deste agente, para cada entidade')}</Text>
            <RadioGroup
              mt="4"
              onChange={(value) => setGenericMode(value as GenericMode)}
              value={genericMode}
              defaultValue="1"
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <Text fontSize="16px" color="black" fontWeight="700" lineHeight="22px">
                {t('Definição geral:')}
              </Text>
              <HStack
                mt="4"
                alignItems="flex-start"
                color="black"
                spacing={8}
                fontSize="16px"
                lineHeight="22px"
              >
                <CustomRadio value="owner">{t('Permtir tudo')}</CustomRadio>
                <CustomRadio value="orders-manager">{t('Pedidos')}</CustomRadio>
                <CustomRadio value="businesses-manager">{t('Restaurantes')}</CustomRadio>
                <CustomRadio value="couriers-manager">{t('Entregadores')}</CustomRadio>
              </HStack>
              <HStack
                mt="4"
                alignItems="flex-start"
                color="black"
                spacing={8}
                fontSize="16px"
                lineHeight="22px"
              >
                <CustomRadio value="consumers-manager">{t('Consumidores')}</CustomRadio>
                <CustomRadio value="viewer">{t('Apenas leitura')}</CustomRadio>
                <CustomRadio value="custom">{t('Customizado')}</CustomRadio>
              </HStack>
            </RadioGroup>
            <Box mt="6">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>{t('Entidade')}</Th>
                    <Th>{t('permissões')}</Th>
                    <Th></Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(permissions).map((key) => (
                    <EntityAccess
                      key={key}
                      name={permissionsPTOptions[key]}
                      value={permissions[key as keyof UserPermissions]}
                      updateAcess={(value) => {
                        setPermissions((prev) => ({
                          ...prev,
                          [key]: value,
                        }));
                      }}
                    />
                  ))}
                </Tbody>
              </Table>
            </Box>
            {!isNew && (
              <>
                <SectionTitle mt="8">{t('Status')}</SectionTitle>
                <Text>
                  {t(
                    'Quando criado, o status do agente é definido como pendente e sua aprovação é automática, quando o mesmo loga com sucesso na plataforma'
                  )}
                </Text>
                <RadioGroup
                  mt="2"
                  onChange={(value: ProfileSituation) =>
                    setSituation((prev) => ({ ...prev, after: value }))
                  }
                  value={situation.after}
                  defaultValue="1"
                  colorScheme="green"
                  color="black"
                  fontSize="15px"
                  lineHeight="21px"
                >
                  <Flex flexDir="column" justifyContent="flex-start">
                    <CustomRadio mt="2" value="approved">
                      {t('Aprovado')}
                    </CustomRadio>
                    <CustomRadio mt="2" value="verified" isDisabled>
                      {t('Verificado')}
                    </CustomRadio>
                    <CustomRadio mt="2" value="pending" isDisabled>
                      {t('Pendente')}
                    </CustomRadio>
                    <CustomRadio mt="2" value="blocked">
                      {t('Bloquear agente')}
                    </CustomRadio>
                  </Flex>
                </RadioGroup>
              </>
            )}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            {isDeleting ? (
              <Box mt="8" w="100%" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
                <Text color="red">{t(`Tem certeza que deseja excluir este agente?`)}</Text>
                <HStack mt="4" spacing={4}>
                  <Button width="full" onClick={() => setIsDeleting(false)}>
                    {t(`Manter agente`)}
                  </Button>
                  <Button
                    width="full"
                    variant="danger"
                    onClick={handleDeleteAccount}
                    isLoading={deleteAccountResult.isLoading}
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
                  onClick={handleSave}
                  isLoading={
                    createResult.isLoading || updateSituationResult.isLoading ? true : false
                  }
                  loadingText={t('Salvando')}
                >
                  {isSituationChanged ? t('Salvar novo status') : t('Salvar alterações')}
                </Button>
                {isNew ? (
                  <Button width="full" fontSize="15px" variant="dangerLight" onClick={onClose}>
                    {t('Cancelar')}
                  </Button>
                ) : (
                  <Button
                    width="full"
                    fontSize="15px"
                    variant="dangerLight"
                    onClick={() => setIsDeleting(true)}
                  >
                    {t('Excluir agente')}
                  </Button>
                )}
              </HStack>
            )}
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
