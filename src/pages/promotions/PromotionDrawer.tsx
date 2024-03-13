import { Coupon, CouponType, CouponUsagePolicy } from '@appjusto/types';
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
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'utils/functions';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  promotionId: string;
};

export const PromotionDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const query = useQuery();
  const queryType = query.get('type') as CouponType | null;
  console.log(queryType);
  const { promotionId } = useParams<Params>();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  // state
  const [type, setType] = React.useState<CouponType>(
    queryType ?? 'food-discount'
  );
  const [discount, setDiscount] = React.useState(0);
  const [minOrderValue, setMinOrderValue] = React.useState(0);
  const [usagePolicy, setUsagePolicy] =
    React.useState<CouponUsagePolicy>('once');
  const [code, setCode] = React.useState('');
  const [enabled, setEnabled] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = promotionId === 'new';
  // handlers
  const handleSubmit = () => {
    if (!business?.id) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'promotion-submit-error',
        message: {
          title: 'Não foi possível encontrar as informaçoes do restaurante.',
        },
      });
    }
    if (!promotionId) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'promotion-submit-error',
        message: {
          title: 'Não foi possível encontrar as informaçoes do cupom.',
        },
      });
    }
    try {
      const changes: Partial<Coupon> = {
        type,
        code,
        discount,
        minOrderValue,
        usagePolicy,
      };
      if (isNew) {
        const createdBy = {
          flavor: 'business',
          id: business.id,
        } as Coupon['createdBy'];
        changes.createdBy = createdBy;
        console.log(changes);
      } else {
      }
    } catch (error) {}
  };
  // side effects
  React.useEffect(() => {}, []);
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
              // bg="green.500"
              mr="12px"
              _focus={{ outline: 'none' }}
            />
            <DrawerHeader>
              <Text
                color="black"
                fontSize="2xl"
                fontWeight="700"
                lineHeight="28px"
              >
                {t('Cupom')}
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28">
              <SectionTitle mt="0">{t('Tipo')}</SectionTitle>
              <RadioGroup
                mt="3"
                value={type}
                onChange={(value: CouponType) => setType(value)}
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <Stack direction="row" spacing={4}>
                  <Radio value="delivery-free">{t('Entrega grátis')}</Radio>
                  <Radio value="delivery-discount">
                    {t('Desconto na entrega')}
                  </Radio>
                  <Radio value="food-discount">
                    {t('Desconto nos produtos')}
                  </Radio>
                </Stack>
              </RadioGroup>
              <SectionTitle mt="6">{t('Restrições de uso')}</SectionTitle>
              <RadioGroup
                mt="3"
                value={usagePolicy}
                onChange={(value: CouponUsagePolicy) => setUsagePolicy(value)}
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <VStack spacing={2}>
                  <Box w="full">
                    <Radio value="once">{t('Uso único')}</Radio>
                    <Text ml="8" fontSize="xs" color="gray.700">
                      {t('Clientes podem usar este cupom apenas uma vez')}
                    </Text>
                  </Box>
                  <Box w="full">
                    <Radio value="new-customers">
                      {t('Apenas novos clientes')}
                    </Radio>
                    <Text ml="8" fontSize="xs" color="gray.700">
                      {t('Novos clientes podem usar este cupom apenas uma vez')}
                    </Text>
                  </Box>
                  <Box w="full">
                    <Radio value="renewabled">{t('Renovável')}</Radio>
                    <Text ml="8" fontSize="xs" color="gray.700">
                      {t(
                        'Sempre que for reativado, todos os clientes poderão usar este cupom mais uma vez'
                      )}
                    </Text>
                  </Box>
                  <Box w="full">
                    <Radio value="none">{t('Sem restrições')}</Radio>
                    <Text ml="8" fontSize="xs" color="gray.700">
                      {t(
                        'Todos os clientes poderão usar este cupom uma ou mais vezes, enquanto estiver ativo'
                      )}
                    </Text>
                  </Box>
                </VStack>
              </RadioGroup>
              <SectionTitle mt="6">{t('Parâmetros')}</SectionTitle>
              <HStack mt="3">
                <CurrencyInput
                  mt="0"
                  id="discount"
                  label={t('Desconto')}
                  aria-label={t('desconto')}
                  placeholder={t('0,00')}
                  value={discount}
                  onChangeValue={(value) => setDiscount(value)}
                  maxLength={5}
                  isDisabled={type === 'delivery-free'}
                  isRequired={type !== 'delivery-free'}
                />
                <CurrencyInput
                  mt="0"
                  id="min-order-value"
                  label={t('Valor mín. em produtos')}
                  aria-label={t('valor-mínimo')}
                  placeholder={t('0,00')}
                  value={minOrderValue}
                  onChangeValue={(value) => setMinOrderValue(value)}
                  maxLength={5}
                  isRequired
                />
              </HStack>
              <SectionTitle mt="6">{t('Código do cupom')}</SectionTitle>
              <Text mt="1" fontSize="xs">
                {t(
                  'Crie e compartilhe esse código com seus clientes, usando suas redes'
                )}
              </Text>
              <CustomInput
                mt="2"
                id="code"
                label={t('Código')}
                placeholder={t('Digite o código do novo cupom. Ex: NOVO25OFF')}
                value={code}
                onChange={(ev) => setCode(ev.target.value)}
                isRequired
              />
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
                      // onClick={() => deleteArea(areaId)}
                      // isLoading={deleteAreaResult.isLoading}
                      loadingText={t('Excluindo')}
                    >
                      {t(`Excluir`)}
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <HStack w="100%" spacing={4}>
                  <Button
                    width={isNew ? '50%' : 'full'}
                    fontSize="15px"
                    type="submit"
                    loadingText={t('Salvando')}
                    // isLoading={updateAreaResult.isLoading}
                  >
                    {t('Salvar alterações')}
                  </Button>
                  {!isNew && (
                    <Button
                      width="full"
                      fontSize="15px"
                      variant="dangerLight"
                      onClick={() => setIsDeleting(true)}
                    >
                      {t('Excluir área')}
                    </Button>
                  )}
                </HStack>
              )}
            </DrawerFooter>
          </DrawerContent>
        </form>
      </DrawerOverlay>
    </Drawer>
  );
};
