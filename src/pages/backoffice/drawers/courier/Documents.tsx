import { Box, HStack, Image } from '@chakra-ui/react';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { ReactComponent as DropImage } from 'common/img/drop-image.svg';
import React from 'react';
import { t } from 'utils/i18n';

interface DocumentsProps {
  pictures: { selfie: string | null; document: string | null };
}

export const Documents = ({ pictures }: DocumentsProps) => {
  // context

  // state
  const [number, setNumber] = React.useState('');
  const [date, setDate] = React.useState('');

  // UI
  return (
    <Box mt="4">
      <HStack spacing={4}>
        <Box bg="gray.400" w="161px" h="161px" borderRadius="80.5px" overflow="hidden">
          {pictures?.selfie ? <Image src={pictures.selfie} /> : <DropImage />}
        </Box>
        <Box bg="gray.400" w="161px" h="161px" borderRadius="80.5px" overflow="hidden">
          {pictures?.document ? <Image src={pictures.document} /> : <DropImage />}
        </Box>
      </HStack>
      <Input
        id="document-number"
        label={t('Número do documento')}
        placeholder={t('00000000')}
        value={number}
        onChange={(ev) => setNumber(ev.target.value)}
      />
      <Input
        id="document-date"
        type="date"
        label={t('Validade do documento')}
        placeholder={t('00000000')}
        value={date}
        onChange={(ev) => setDate(ev.target.value)}
      />
    </Box>
  );
};
