import {
  Box,
  Button,
  FormControl,
  FormControlProps,
  FormLabel,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface InputFileProps extends FormControlProps {
  id: string;
  imageUrl?: string | null;
  getFile(file: File): void;
}

export const InputFile = ({
  id,
  imageUrl,
  getFile,
  ...props
}: InputFileProps) => {
  // state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>();
  // handlers
  const handleGetFile = React.useCallback(() => {
    if (!selectedFile) return;
    getFile(selectedFile);
  }, [getFile, selectedFile]);
  // side effects
  React.useEffect(() => {
    if (!imageUrl) return;
    setPreviewUrl(imageUrl);
  }, [imageUrl]);
  React.useEffect(() => {
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(undefined);
    }
  }, [selectedFile]);
  React.useEffect(() => {
    handleGetFile();
  }, [handleGetFile]);
  // UI
  return (
    <Box mt="2">
      <FormControl
        id={id}
        {...props}
        border="1px solid #C8D7CB"
        borderRadius="lg"
        p="2"
      >
        <FormLabel mb="0">
          <Button variant="secondary" size="md" as="span" cursor="pointer">
            {t('Selecionar imagem')}
          </Button>
          <Text ml="4" as="span">
            {selectedFile?.name ?? ''}
          </Text>
        </FormLabel>
        <Input
          accept="image/*"
          type="file"
          onChange={(ev) =>
            setSelectedFile(ev.target.files ? ev.target.files[0] : null)
          }
          display="none"
        />
      </FormControl>
      {previewUrl && (
        <Box mt="2" bgColor="gray.200" borderRadius="lg" p="2">
          <Image src={previewUrl} />
        </Box>
      )}
    </Box>
  );
};
