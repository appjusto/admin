import { BackofficeAccess } from '@appjusto/types';
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
  RadioGroup,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useAgent } from 'app/api/agent/useAgent';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextAppRequests } from 'app/state/requests/context';
import CustomRadio from 'common/components/form/CustomRadio';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { EntityAcess } from './EntityAcess';

const initAcess = {
  orders: [],
  couriers: [],
  consumers: [],
  businesses: [],
  platform: [],
} as BackofficeAccess;

type GenericMode = 'owner' | 'viewer' | 'custom';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  agentId: string;
};

export const AgentBaseDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { agentId } = useParams<Params>();
  const isNew = agentId === 'new';
  const { dispatchAppRequestResult } = useContextAppRequests();
  // adapt to create and update agent <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  const { agent, createAgente, createResult } = useAgent(agentId);
  const { deleteAccount, deleteAccountResult } = useAuthentication();
  // state
  const [email, setEmail] = React.useState('');
  const [access, setAccess] = React.useState(initAcess);
  const [genericMode, setGenericMode] = React.useState<GenericMode>('custom');
  const [isDeleting, setIsDeleting] = React.useState(false);
  // handlers
  const handleSave = () => {
    const isAccessValid = () => {
      return true;
    };
    if (!email) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-base-drawer-no-email',
        message: { title: 'favor informar o email do agente.' },
      });
    } else if (!isAccessValid) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-base-drawer-no-valid-access',
        message: { title: 'As permissões informadas não são válidas.' },
      });
    } else {
      createAgente({ email, access });
    }
  };
  const handleDeleteAccount = () => {
    if (!agent?.id) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-base-drawer-valid-no-user-id',
        message: { title: 'Não foi possível encontrar o id deste usuário.' },
      });
    } else {
      deleteAccount({ accountId: agent.id });
    }
  };
  // side effects
  React.useEffect(() => {
    if (genericMode === 'custom') setAccess(initAcess);
    else if (genericMode === 'owner') {
      setAccess({
        orders: ['read', 'write'],
        couriers: ['read', 'write'],
        consumers: ['read', 'write'],
        businesses: ['read', 'write'],
        platform: ['read', 'write'],
      });
    } else if (genericMode === 'viewer') {
      setAccess({
        orders: ['read'],
        couriers: ['read'],
        consumers: ['read'],
        businesses: ['read'],
        platform: ['read'],
      });
    }
  }, [genericMode]);
  //UI
  console.log('acess', access);
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
                // w="300px"
                id="add-agent-email-input"
                label={t('E-mail do agente')}
                placeholder={t('Digite o e-mail do agente')}
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value.toLowerCase())
                }
              />
            ) : (
              <>
                <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                  {t('Email:')}{' '}
                  <Text as="span" fontWeight="500">
                    {agent?.email ?? 'N/E'}
                  </Text>
                </Text>
                <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                  {t('Nome:')}{' '}
                  <Text as="span" fontWeight="500">
                    {`${agent?.name ?? 'N/E'}` + ` ${agent?.surname ?? ''}`}
                  </Text>
                </Text>
                <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                  {t('Criado em:')}{' '}
                  <Text as="span" fontWeight="500">
                    {getDateAndHour(agent?.createdOn)}
                  </Text>
                </Text>
              </>
            )}
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle mt="4">{t('Permissões')}</SectionTitle>
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
              <HStack
                alignItems="flex-start"
                color="black"
                spacing={8}
                fontSize="16px"
                lineHeight="22px"
              >
                <Text fontSize="16px" color="black" fontWeight="700" lineHeight="22px">
                  {t('Definição geral:')}
                </Text>
                <CustomRadio value="owner">{t('Permtir tudo')}</CustomRadio>
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
                  </Tr>
                </Thead>
                <Tbody>
                  <EntityAcess
                    name={t('Pedidos')}
                    value={access.orders}
                    updateAcess={(value) => {
                      setAccess((prev) => ({
                        ...prev,
                        ['orders']: value,
                      }));
                    }}
                  />
                  <EntityAcess
                    name={t('Entregadores')}
                    value={access.couriers}
                    updateAcess={(value) => {
                      setAccess((prev) => ({
                        ...prev,
                        ['couriers']: value,
                      }));
                    }}
                  />
                  <EntityAcess
                    name={t('Consumidores')}
                    value={access.consumers}
                    updateAcess={(value) => {
                      setAccess((prev) => ({
                        ...prev,
                        ['consumers']: value,
                      }));
                    }}
                  />
                  <EntityAcess
                    name={t('Restaurantes')}
                    value={access.businesses}
                    updateAcess={(value) => {
                      setAccess((prev) => ({
                        ...prev,
                        ['businesses']: value,
                      }));
                    }}
                  />
                  <EntityAcess
                    name={t('Plataforma')}
                    value={access.platform}
                    updateAcess={(value) => {
                      setAccess((prev) => ({
                        ...prev,
                        ['platform']: value,
                      }));
                    }}
                  />
                </Tbody>
              </Table>
            </Box>
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
                  isLoading={createResult.isLoading}
                  loadingText={t('Salvando')}
                >
                  {t('Salvar alterações')}
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
