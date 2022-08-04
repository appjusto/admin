import { Flavor, NotificationChannel } from '@appjusto/types';
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
  Text,
  VStack,
} from '@chakra-ui/react';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import CustomRadio from 'common/components/form/CustomRadio';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { InputCounter } from './InputCounter';

type Status = 'pending' | 'approved' | 'canceled';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  pushId: string;
};

export const PushDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { pushId } = useParams<Params>();
  // state
  const [flavor, setFlavor] = React.useState<Flavor>('consumer');
  const [channel, setChannel] =
    React.useState<NotificationChannel>('marketing');
  const [isGeo, setIsGeo] = React.useState(false);
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [radius, setRadius] = React.useState('');
  const [campaign, setCampaign] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [pushDate, setPushDate] = React.useState('');
  const [pushTime, setPushTime] = React.useState('');
  const [status, setStatus] = React.useState<Status>('pending');
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = pushId === 'new';
  // side effects
  React.useEffect(() => {
    if (!isGeo) {
      setLatitude('');
      setLongitude('');
      setRadius('');
    }
  }, [isGeo]);
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
              mb="2"
            >
              {t('Notificação')}
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle mt="0">{t('Perfil')}</SectionTitle>
            <RadioGroup
              mt="2"
              onChange={(value: Flavor) => setFlavor(value)}
              value={flavor}
              defaultValue="1"
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <HStack spacing={4}>
                <CustomRadio value="consumer">{t('Consumidor')}</CustomRadio>
                <CustomRadio value="courier">{t('Entregador')}</CustomRadio>
                <CustomRadio value="business">{t('Restaurante')}</CustomRadio>
              </HStack>
            </RadioGroup>
            <SectionTitle>{t('Canal')}</SectionTitle>
            <RadioGroup
              mt="4"
              onChange={(value: NotificationChannel) => setChannel(value)}
              value={channel}
              defaultValue="1"
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <HStack spacing={4}>
                <CustomRadio value="marketing">{t('Marketing')}</CustomRadio>
                <CustomRadio value="status">{t('Status')}</CustomRadio>
                <CustomRadio value="general">{t('Geral')}</CustomRadio>
              </HStack>
            </RadioGroup>
            <SectionTitle>{t('Georreferenciada')}</SectionTitle>
            <CustomCheckbox
              mt="4"
              colorScheme="green"
              isChecked={isGeo}
              onChange={() => setIsGeo((prev) => !prev)}
            >
              {t('É georreferenciada')}
            </CustomCheckbox>
            {isGeo && (
              <>
                <HStack mt="4">
                  <NumberInput
                    mt="0"
                    id="campaign-lat"
                    label={t('Latitude')}
                    placeholder={t('Digite a latitude')}
                    value={latitude}
                    onChange={(ev) => setLatitude(ev.target.value)}
                    isCoordinates
                    isRequired
                  />
                  <NumberInput
                    mt="0"
                    id="campaign-lng"
                    label={t('Longitude')}
                    placeholder={t('Digite a longitude')}
                    value={longitude}
                    onChange={(ev) => setLongitude(ev.target.value)}
                    isCoordinates
                    isRequired
                  />
                </HStack>
                <NumberInput
                  id="campaign-radius"
                  label={t('Raio')}
                  placeholder={t('0')}
                  value={radius}
                  onChange={(ev) => setRadius(ev.target.value)}
                  isRequired
                />
              </>
            )}
            <SectionTitle>{t('Dados da notificação')}</SectionTitle>
            <CustomInput
              id="campaign-name"
              label={t('Nome da campanha')}
              placeholder={t('Digite o nome da campanha')}
              value={campaign}
              onChange={(ev) => setCampaign(ev.target.value)}
              isRequired
            />
            <CustomInput
              id="push-title"
              label={t('Título')}
              placeholder={t('Digite o título da notificação')}
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              maxLength={65}
              isRequired
            />
            <InputCounter max={65} current={title.length} />
            <Textarea
              id="push-message"
              label={t('Corpo da mensagem')}
              placeholder={t('Digite o corpo da mensagem')}
              value={message}
              onChange={(ev) => setMessage(ev.target.value)}
              maxLength={178 - title.length}
            />
            <InputCounter max={178 - title.length} current={message.length} />
            <HStack mt="4" spacing={4}>
              <CustomInput
                mt="0"
                type="date"
                id="push-date"
                value={pushDate}
                onChange={(event) => setPushDate(event.target.value)}
                label={t('Data')}
              />
              <CustomInput
                mt="0"
                type="time"
                id="push-time"
                value={pushTime}
                onChange={(event) => setPushTime(event.target.value)}
                label={t('Horário')}
              />
            </HStack>
            <SectionTitle>{t('Status')}</SectionTitle>
            <RadioGroup
              mt="2"
              onChange={(value: Status) => setStatus(value)}
              value={status}
              defaultValue="1"
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <VStack mt="4" spacing={2} alignItems="flex-start">
                <CustomRadio value="pending">{t('Pendente')}</CustomRadio>
                <CustomRadio value="approved">{t('Aprovada')}</CustomRadio>
                <CustomRadio value="canceled">{t('Cancelada')}</CustomRadio>
              </VStack>
            </RadioGroup>
          </DrawerBody>
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
                  {t(`Tem certeza que deseja excluir este agente?`)}
                </Text>
                <HStack mt="4" spacing={4}>
                  <Button width="full" onClick={() => setIsDeleting(false)}>
                    {t(`Manter agente`)}
                  </Button>
                  <Button
                    width="full"
                    variant="danger"
                    // onClick={}
                    // isLoading={deleteAccountResult.isLoading}
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
                  // onClick={handleSave}
                  // isLoading={}
                  loadingText={t('Salvando')}
                >
                  {t('Salvar alterações')}
                </Button>
                {isNew ? (
                  <Button
                    width="full"
                    fontSize="15px"
                    variant="dangerLight"
                    onClick={onClose}
                  >
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
