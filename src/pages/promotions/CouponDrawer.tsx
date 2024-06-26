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
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCoupon } from 'app/api/coupon/useCoupon';
import { useGetCoupon } from 'app/api/coupon/useGetCoupon';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'utils/functions';
import { t } from 'utils/i18n';
import { couponParser } from './utils';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  couponId: string;
};

export const CouponDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const isBackoffice = path.includes('/backoffice');

  const query = useQuery();
  const queryType = query.get('type') as CouponType | null;

  const { couponId } = useParams<Params>();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { userAbility } = useContextFirebaseUser();
  const {
    createCoupon,
    createResult,
    updateCoupon,
    updateResult,
    deleteCoupon,
    deleteResult,
  } = useCoupon();
  const { business } = useContextBusiness();
  // state
  const coupon = useGetCoupon(couponId);
  const initialType: CouponType = queryType
    ? queryType
    : isBackoffice
    ? 'referral'
    : 'food-discount';
  const [type, setType] = React.useState<CouponType>(initialType);
  const [discount, setDiscount] = React.useState(0);
  const [minOrderValue, setMinOrderValue] = React.useState(0);
  const [usagePolicy, setUsagePolicy] =
    React.useState<CouponUsagePolicy>('once');
  const [code, setCode] = React.useState('');
  const [enabled, setEnabled] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = couponId === 'new';
  const isLoading = isNew ? createResult.isLoading : updateResult.isLoading;
  // handlers
  const handleSubmit = async () => {
    if (!isBackoffice && !business?.id) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'promotion-submit-error',
        message: {
          title: 'Não foi possível encontrar as informaçoes do restaurante.',
        },
      });
    }
    if (!couponId) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'promotion-submit-error',
        message: {
          title: 'Não foi possível encontrar as informaçoes do cupom.',
        },
      });
    }
    if (code.length < 5) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'promotion-submit-error',
        message: {
          title: 'O código precisa ter entre 5 e 14 caracteres.',
        },
      });
    }
    try {
      if (isNew) {
        const changes: Pick<
          Coupon,
          | 'createdBy'
          | 'type'
          | 'code'
          | 'discount'
          | 'minOrderValue'
          | 'usagePolicy'
        > = {
          createdBy: {
            flavor: isBackoffice ? 'platform' : 'business',
            id: isBackoffice ? null : business!.id,
          },
          type,
          code,
          discount,
          minOrderValue,
          usagePolicy,
        };
        await createCoupon(changes);
      } else {
        const changes: Partial<Coupon> = {
          type,
          code,
          discount,
          minOrderValue,
          usagePolicy,
          enabled,
        };
        await updateCoupon({ couponId, changes });
      }
      onClose();
    } catch (error) {}
  };

  const handleDelete = async () => {
    if (!couponId) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'promotion-submit-error',
        message: {
          title: 'Não foi possível encontrar as informaçoes do cupom.',
        },
      });
    }
    await deleteCoupon(couponId);
    onClose();
  };
  // side effects
  React.useEffect(() => {
    if (!coupon) return;
    setType(coupon.type);
    setUsagePolicy(coupon.usagePolicy);
    setDiscount(coupon.discount ?? 0);
    setMinOrderValue(coupon.minOrderValue ?? 0);
    setCode(coupon.code);
    setEnabled(coupon.enabled);
  }, [coupon]);
  React.useEffect(() => {
    if (!isBackoffice) return;
    if (coupon?.code) return;
    if (type === 'referral') {
      setCode('REFERRAL');
    } else {
      setCode('');
    }
  }, [isBackoffice, coupon?.code, type]);
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
            <DrawerCloseButton mr="12px" _focus={{ outline: 'none' }} />
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
                  {isBackoffice ? (
                    <Radio value="referral">{t('Referência')}</Radio>
                  ) : null}
                  <Radio value="food-discount">
                    {t('Desconto nos produtos')}
                  </Radio>
                  <Radio value="delivery-discount">
                    {t('Desconto na entrega')}
                  </Radio>
                  <Radio value="delivery-free">{t('Entrega grátis')}</Radio>
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
                    <Radio value="renewable">{t('Renovável')}</Radio>
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
                  'Crie e compartilhe esse código com seus clientes, usando suas redes. O código deve conter de 5 a 14 caracteres e ser formado apenas por letras e números.'
                )}
              </Text>
              <CustomPatternInput
                mt="2"
                id="code"
                label={t('Código')}
                placeholder={t('Digite o código do novo cupom. Ex: NOVO25OFF')}
                value={code}
                parser={couponParser}
                onValueChange={setCode}
                maxLength={14}
                isRequired
                isDisabled={type === 'referral'}
              />
              <Text fontSize="xs" color="gray.700">
                <Text as="span" color={code.length < 5 ? 'red' : 'inherit'}>
                  {code?.length}
                </Text>
                /14
              </Text>
              {isBackoffice && couponId !== 'new' ? (
                <>
                  <SectionTitle mt="6">{t('Status')}</SectionTitle>
                  <Text mt="1" fontSize="xs">
                    {t(
                      'Defina se o cupom estará ativo para uso dos consumidores'
                    )}
                  </Text>
                  <Flex mt="4" gap="4" alignItems="center">
                    <Switch
                      isChecked={enabled}
                      onChange={(ev) => {
                        ev.stopPropagation();
                        setEnabled(ev.target.checked);
                      }}
                    />
                    <Text color="black">
                      {t(enabled ? 'Ativado' : 'Desativado')}
                    </Text>
                  </Flex>
                </>
              ) : null}
            </DrawerBody>
            {userAbility?.can('update', 'coupons') ? (
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
                      {t(`Tem certeza que deseja excluir este cupom?`)}
                    </Text>
                    <HStack mt="4" spacing={4}>
                      <Button
                        width="full"
                        fontSize="15px"
                        onClick={() => setIsDeleting(false)}
                      >
                        {t(`Manter cupom`)}
                      </Button>
                      <Button
                        width="full"
                        variant="danger"
                        fontSize="15px"
                        onClick={handleDelete}
                        isLoading={deleteResult.isLoading}
                        loadingText={t('Excluindo')}
                      >
                        {t(`Excluir`)}
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <HStack w="100%" spacing={4}>
                    <Button
                      width="50%"
                      fontSize="15px"
                      type="submit"
                      loadingText={t('Salvando')}
                      isLoading={isLoading}
                    >
                      {t('Salvar alterações')}
                    </Button>
                    {!isNew && userAbility?.can('delete', 'coupons') ? (
                      <Button
                        width="50%"
                        fontSize="15px"
                        variant="dangerLight"
                        onClick={() => setIsDeleting(true)}
                      >
                        {t('Excluir cupom')}
                      </Button>
                    ) : null}
                  </HStack>
                )}
              </DrawerFooter>
            ) : null}
          </DrawerContent>
        </form>
      </DrawerOverlay>
    </Drawer>
  );
};
