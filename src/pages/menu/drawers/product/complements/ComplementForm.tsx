import { Flex, HStack, Text } from '@chakra-ui/react';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import Image from 'common/components/Image';
import { t } from 'utils/i18n';

const fallback = '/static/media/product-placeholder.png';

export const ComplementForm = () => {
  return (
    <HStack
      spacing={4}
      alignItems="flex-start"
      border="1px solid #F2F6EA"
      boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
      borderRadius="lg"
      p="4"
    >
      <Flex flexDir="column" maxW="24">
        <Image
          src={fallback}
          boxSize="24"
          objectFit="contain"
          borderRadius="lg"
          alt="Product image"
        />
        <Text mt="2" textAlign="center" fontSize="xs">
          {t('Adicionar imagem')}
        </Text>
      </Flex>
      <Flex flexDir="column" w="100%" pt="6px">
        <Input
          mt="0"
          id="complements-item-name"
          label={t('Nome do item')}
          placeholder={t('Nome do item')}
          value=""
        />
        <Textarea
          id="complements-item-description"
          label={t('Descrição do item')}
          placeholder={t('Descreva seu item')}
          value=""
        />
        <Text fontSize="xs" color="gray.700">
          0/1000
        </Text>
        <HStack spacing={4} mt="4">
          <CurrencyInput
            mt="0"
            id="complements-item-price"
            label={t('Preço')}
            value={0}
            onChangeValue={() => {}}
          />
          <Input
            id="complements-item-pdv"
            label={t('Código PDV')}
            placeholder={t('000')}
            value=""
          />
        </HStack>
      </Flex>
    </HStack>
  );
};
