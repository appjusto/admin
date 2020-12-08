import { Box, Button, Text } from '@chakra-ui/react';
import { useUpdateBusinessProfile } from 'app/api/business/useUpdateBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { CurrencyInput } from 'common/components/form/CurrencyInput';
import { Input } from 'common/components/form/Input';
import { NumberInput } from 'common/components/form/NumberInput';
import { Textarea } from 'common/components/form/Textarea';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface Props {
  redirect: string;
}

export const BusinessProfile = ({ redirect }: Props) => {
  // context
  const business = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useUpdateBusinessProfile();
  const { isLoading, isSuccess } = updateResult;

  // state
  const [name, setName] = React.useState(business?.name ?? '');
  const [cnpj, setCNPJ] = React.useState(business?.cnpj ?? '');
  const [description, setDescription] = React.useState(business?.description ?? '');
  const [minimumOrder, setMinimumOrder] = React.useState(business?.minimumOrder ?? 0);

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);

  // side effects
  React.useEffect(() => {
    nameRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    if (business) {
      if (business.name) setName(business.name);
      if (business.cnpj) setCNPJ(business.cnpj);
      if (business.description) setDescription(business.description);
      if (business.minimumOrder) setMinimumOrder(business.minimumOrder);
    }
  }, [business]);

  // handlers
  const submitHandler = async () => {
    await updateBusinessProfile({
      name,
      cnpj,
      description,
      minimumOrder,
    })
  }

  // UI
  if (isSuccess) return <Redirect to={redirect} push />
  return (
    <Box w="368px">
      <form onSubmit={(ev) => {
        ev.preventDefault();
        submitHandler();
      }}>
        <Text fontSize="xl" color="black">{t('Sobre o restaurante')}</Text>
        <Text>{t('Esssas informações serão vistas por seus visitantes')}</Text>
        <Input mt="4" ref={nameRef} label={t('Nome')} placeholder={t('Nome')} value={name} onChange={(ev) => setName(ev.target.value)} />
        <NumberInput mt="4" label={t('CNPJ')} placeholder={t('CNPJ do seu estabelecimento')} value={cnpj} onChange={(value) => setCNPJ(value)} />
        <Textarea mt="4" label={t('Descrição')} placeholder={t('Descreva seu restaurante')} value={description} onChange={(ev) => setDescription(ev.target.value)} />
        <CurrencyInput mt="4" label={t('Valor mínimo do pedido')} placeholder={t('R$ 0,00')} value={minimumOrder} onChangeValue={(value) => setMinimumOrder(value)} />
        <Button mt="4" size="lg" onClick={submitHandler} isLoading={isLoading}>{t('Avançar')}</Button>
      </form>
    </Box>
  );
}
