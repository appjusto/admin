import { Area, AreaLogistics } from '@appjusto/types';
import {
  Box,
  Button,
  Checkbox,
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
} from '@chakra-ui/react';
import { useObserveArea } from 'app/api/areas/useObserveArea';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  areaId: string;
};

export const AreaDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { areaId } = useParams<Params>();
  const { userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const area = useObserveArea(areaId !== 'new' ? areaId : undefined);
  // state
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [logistics, setLogistics] = React.useState<AreaLogistics>('none');
  const [isInsurance, setIsInsurance] = React.useState(false);
  const [insuranceFixed, setInsuranceFixed] = React.useState('');
  const [insurancePercent, setInsurancePercent] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = areaId === 'new';
  console.log('areaId', areaId);
  const canUpdate = React.useMemo(
    () => userAbility?.can('update', 'areas'),
    [userAbility]
  );
  // handlers
  const handleSubmit = () => {
    const fixed = insuranceFixed ? parseInt(insuranceFixed) : 0;
    const percent = insurancePercent ? Number(insurancePercent) : 0;
    if (isInsurance && !fixed && !percent) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AreaDrawer-submit-error',
        message: {
          title: 'Valores de cobertura incorretos.',
          description: 'Favor informar o fixo e/ou percentual',
        },
      });
    }
    if (isNew) {
      let newArea = {
        state,
        city,
        logistics,
      } as Partial<Area>;
      if (isInsurance)
        newArea.insurance = {
          fixed: insuranceFixed ? parseInt(insuranceFixed) : 0,
          percent: insurancePercent ? Number(insurancePercent) : 0,
        };
      console.log(newArea);
      // submitPushCampaign(newCampaign);
    } else {
      let changes = {
        logistics,
      } as Partial<Area>;
      if (isInsurance) {
        changes.insurance = {
          fixed: insuranceFixed ? parseInt(insuranceFixed) : 0,
          percent: insurancePercent ? Number(insurancePercent) : 0,
        };
      } else {
        changes.insurance = null;
      }
      console.log(changes);
      // updatePushCampaign({ campaignId, changes: newCampaign });
    }
  };
  // side effects
  React.useEffect(() => {
    if (area) {
      setState(area.state);
      setCity(area.city);
    }
  }, [area]);
  //UI
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
                {t('Área')}
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28">
              <SectionTitle mt="0">{t('Local')}</SectionTitle>
              <HStack mt="4" spacing={4}>
                <CustomInput
                  mt="0"
                  id="area-state"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  label={t('Estado')}
                  isRequired
                  isDisabled={!isNew}
                />
                <CustomInput
                  mt="0"
                  id="area-city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  label={t('Cidade')}
                  isRequired
                  isDisabled={!isNew}
                />
              </HStack>
              <SectionTitle>{t('Logística')}</SectionTitle>
              <RadioGroup
                mt="2"
                onChange={(value: AreaLogistics) => setLogistics(value)}
                value={logistics}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <HStack spacing={4}>
                  <Radio value="none">{t('Nenhuma')}</Radio>
                  <Radio value="external">{t('Externa')}</Radio>
                  <Radio value="appjusto">{t('AppJusto')}</Radio>
                </HStack>
              </RadioGroup>

              <SectionTitle>{t('Cobertura')}</SectionTitle>
              <Checkbox
                mt="4"
                colorScheme="green"
                isChecked={isInsurance}
                onChange={() => setIsInsurance((prev) => !prev)}
              >
                {t('Possui taxa de cobertura específica')}
              </Checkbox>
              {isInsurance && (
                <>
                  <HStack mt="4">
                    <NumberInput
                      mt="0"
                      id="campaign-lat"
                      label={t('Fixo')}
                      placeholder={t('Digite o valor fixo')}
                      value={insuranceFixed}
                      onChange={(ev) => setInsuranceFixed(ev.target.value)}
                      isCoordinates
                      isRequired
                    />
                    <NumberInput
                      mt="0"
                      id="campaign-lng"
                      label={t('Percentual')}
                      placeholder={t('Digite o valor percentual')}
                      value={insurancePercent}
                      onChange={(ev) => setInsurancePercent(ev.target.value)}
                      isCoordinates
                      isRequired
                    />
                  </HStack>
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
                      {t(`Tem certeza que deseja excluir esta área?`)}
                    </Text>
                    <HStack mt="4" spacing={4}>
                      <Button
                        width="full"
                        fontSize="15px"
                        onClick={() => setIsDeleting(false)}
                      >
                        {t(`Manter área`)}
                      </Button>
                      <Button
                        width="full"
                        variant="danger"
                        fontSize="15px"
                        onClick={() => {}}
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
                      {t('Excluir área')}
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
};
