import { Box, Button, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { FileDropzone } from 'common/components/FileDropzone';
import { CurrencyInput } from 'common/components/form/CurrencyInput';
import { Input } from 'common/components/form/Input';
import { NumberInput } from 'common/components/form/NumberInput';
import { Textarea } from 'common/components/form/Textarea';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CuisineSelect } from './CuisineSelect';

interface Props {
  redirect: string;
}

export const BusinessProfile = ({ redirect }: Props) => {
  // context
  const business = useContextBusiness();

  // state
  const [name, setName] = React.useState(business?.name ?? '');
  const [cnpj, setCNPJ] = React.useState(business?.cnpj ?? '');
  const [cuisineId, setCuisineId] = React.useState(business?.cuisine?.id ?? '');
  const [description, setDescription] = React.useState(business?.description ?? '');
  const [minimumOrder, setMinimumOrder] = React.useState(business?.minimumOrder ?? 0);
  const [logoPreviewURL, setLogoPreviewURL] = React.useState<string | undefined>();
  
  // queries & mutations
  const { logo, updateBusinessProfile, updateResult, uploadLogo, uploadResult } = useBusinessProfile();
  const { isLoading, isSuccess } = updateResult;

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
      if (business.cuisine?.id) setCuisineId(business.cuisine.id);
    }
  }, [business]);

  // handlers
  const onSubmitHandler = async () => {
    await updateBusinessProfile({
      name,
      cnpj,
      description,
      minimumOrder,
      cuisine: {
        id: cuisineId,
        name: ''
      }
    })
  }
  const onDropHandler = React.useCallback(
    async (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      const url = URL.createObjectURL(file);
      uploadLogo(file);
      setLogoPreviewURL(url);
    },
    [uploadLogo]
  );

  // UI
  if (isSuccess) return <Redirect to={redirect} push />
  return (
    <Box w="368px" marginY="16">
      <form onSubmit={(ev) => {
        ev.preventDefault();
        onSubmitHandler();
      }}>
        <Text fontSize="xl" color="black">{t('Sobre o restaurante')}</Text>
        <Text mt="2" fontSize="md">{t('Essas informações serão vistas por seus visitantes')}</Text>
        <Input mt="4" ref={nameRef} label={t('Nome')} placeholder={t('Nome')} value={name} onChange={(ev) => setName(ev.target.value)} />
        <NumberInput mt="4" label={t('CNPJ')} placeholder={t('CNPJ do seu estabelecimento')} value={cnpj} onChange={(value) => setCNPJ(value)} />
        <CuisineSelect mt="4" value={cuisineId} onChange={(ev) => setCuisineId(ev.target.value)} />
        <Textarea mt="4" label={t('Descrição')} placeholder={t('Descreva seu restaurante')} value={description} onChange={(ev) => setDescription(ev.target.value)} />
        <CurrencyInput mt="4" label={t('Valor mínimo do pedido')} placeholder={t('R$ 0,00')} value={minimumOrder} onChangeValue={(value) => setMinimumOrder(value)} />
        <Text mt="8" fontSize="xl" color="black">{t('Logo do estabelecimento')}</Text>
        <Text mt="2" fontSize="md">{t('Para o logo do estabelecimento recomendamos imagens no formato quadrado (1:1) com no mínimo 200px de largura')}</Text>
        <FileDropzone mt="4" width={200} height={200} onDropFile={onDropHandler} preview={logoPreviewURL ?? logo} />
        <Button mt="4" size="lg" onClick={onSubmitHandler} isLoading={isLoading}>{t('Avançar')}</Button>
      </form>
    </Box>
  );
}
