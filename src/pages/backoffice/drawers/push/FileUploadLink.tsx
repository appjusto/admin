import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box, Input, Tooltip
} from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface FileUploadLinkProps {
  labelText: string;
  value?: string;
  handleChange(value: string): void;  
}

export const FileUploadLink = ({ labelText, value, handleChange }: FileUploadLinkProps) => {
  return (
    <Box mt="4" position="relative">
      <label style={{ fontWeight: 700 }}>
        {labelText}
        <Input 
          mt="2" 
          pt="1" 
          id="push-tokens-file" 
          type="file"
          accept='.csv'
          value={value}
          onChange={(ev) => handleChange(ev.target.value)} 
        />
      </label>
      <Tooltip placement="top" label={t('Remover')}>
        <DeleteIcon 
          position="absolute" 
          top="46px" 
          right="2" 
          cursor="pointer"
          onClick={() => handleChange('')}
        />
      </Tooltip>
    </Box>
  )
}