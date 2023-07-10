import { ComplaintStatus } from '@appjusto/types';
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
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useObserveComplaint } from 'app/api/complaints/useObserveComplaint';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { BaseDrawerInfoItem } from 'common/components/backoffice/BaseDrawerInfoItem';
import { BaseDrawerStaff } from 'common/components/backoffice/BaseDrawerStaff';
import { flavorsPTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { formatComplaintDate } from './utils';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  complaintId: string;
};

export const ComplaintDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { complaintId } = useParams<Params>();
  const { userAbility } = useContextFirebaseUser();
  const { staff } = useContextStaffProfile();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { complaint, updateComplaint, updateComplaintResult } =
    useObserveComplaint(complaintId);
  // state
  const [status, setStatus] = React.useState<ComplaintStatus>();
  // helpers
  const canUpdate = React.useMemo(
    () => userAbility?.can('update', 'complaints'),
    [userAbility]
  );
  const date = formatComplaintDate(complaint?.date);
  // handlers
  const handleUpdateStaff = (operation: 'assume' | 'release') => {
    if (!staff) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'complaint-update-staff-error',
        message: {
          title: 'Dados do agente não encontrados.',
        },
      });
    }
    if (operation === 'assume') {
      const staffData = {
        id: staff.id,
        email: staff.email,
        name: staff.name ?? null,
      };
      updateComplaint({ staff: staffData });
    } else {
      updateComplaint({ staff: null });
    }
  };
  const handleUpdate = () => {
    if (!complaint) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AreaDrawer-submit-error',
        message: {
          title: 'Valores de cobertura incorretos.',
          description: 'Favor informar o fixo e/ou percentual',
        },
      });
    }
    try {
      updateComplaint({ status });
    } catch (error) {}
  };
  // side effects
  React.useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
    }
  }, [complaint]);
  //UI
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
              mb="4"
            >
              {t('Denúncia')}
            </Text>
            <BaseDrawerStaff
              staffId={complaint?.staff?.id}
              staffName={complaint?.staff?.name ?? complaint?.staff?.email}
              canUpdate={canUpdate}
              handleAssume={() => handleUpdateStaff('assume')}
              handleRelease={() => handleUpdateStaff('release')}
              isLoading={updateComplaintResult.isLoading}
            />
            <BaseDrawerInfoItem
              label={t('ID do Pedido:')}
              value={complaint?.orderId ?? 'N/E'}
              valueLink={
                complaint?.orderId
                  ? `/backoffice/orders/${complaint.orderId}`
                  : undefined
              }
            />
            <BaseDrawerInfoItem
              label={t('Perfil do autor:')}
              value={
                complaint?.flavor ? flavorsPTOptions[complaint.flavor] : 'N/E'
              }
            />
            <BaseDrawerInfoItem
              label={t('ID do autor:')}
              value={complaint?.createdBy ?? 'N/E'}
              valueLink={
                complaint?.createdBy
                  ? `/backoffice/couriers/${complaint.createdBy}`
                  : undefined
              }
            />
            <BaseDrawerInfoItem label={t('Data da ocorrência:')} value={date} />
            <BaseDrawerInfoItem
              label={t('Criada em:')}
              value={getDateAndHour(complaint?.createdAt, true)}
            />
            <BaseDrawerInfoItem
              label={t('Atualizada em:')}
              value={getDateAndHour(complaint?.updatedAt, true)}
            />
            <BaseDrawerInfoItem
              label={t('Contatar por:')}
              value={complaint?.contactBy ?? 'N/E'}
            />
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle mt="2">{t('Descrição')}</SectionTitle>
            <Box mt="4" p="4" bgColor="gray.50" borderRadius="lg">
              <Text mt="">{complaint?.description}</Text>
            </Box>
            <SectionTitle>{t('Denunciado')}</SectionTitle>
            <BaseDrawerInfoItem
              label={t('Nome:')}
              value={complaint?.against ?? 'N/E'}
            />
            <BaseDrawerInfoItem
              label={t('Local:')}
              value={complaint?.place ?? 'N/E'}
            />
            <SectionTitle>{t('Status')}</SectionTitle>
            <RadioGroup
              mt="4"
              onChange={(value: ComplaintStatus) => setStatus(value)}
              value={status}
              defaultValue="1"
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <VStack spacing={2} alignItems="flex-start">
                <Radio value="pending">{t('Pendente')}</Radio>
                <Radio value="investigating">{t('Em investigação')}</Radio>
                <Radio value="upheld">{t('Aceita')}</Radio>
                <Radio value="inconclusive">{t('Inconclusiva')}</Radio>
              </VStack>
            </RadioGroup>
          </DrawerBody>
          {canUpdate && (
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <HStack w="100%" spacing={4}>
                <Button
                  // width={isNew ? '50%' : 'full'}
                  fontSize="15px"
                  onClick={handleUpdate}
                  loadingText={t('Salvando')}
                  isLoading={updateComplaintResult.isLoading}
                >
                  {t('Salvar alterações')}
                </Button>
              </HStack>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
