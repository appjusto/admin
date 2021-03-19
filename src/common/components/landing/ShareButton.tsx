import { Button, ButtonProps } from '@chakra-ui/react';
import { BiShareAlt } from 'react-icons/bi';
import { t } from 'utils/i18n';

// import { usePageContext } from '../context/'

// import { modalConfOptions } from './ModalConfirmation'

const ShareButton: React.FC<ButtonProps> = ({ ...props }) => {
  //const { contextDispatch } = usePageContext()
  return (
    <Button
      leftIcon={<BiShareAlt />}
      maxW="240px"
      onClick={
        /*() => contextDispatch({
          type: "handle_modalConfirmation", payload: modalConfOptions.sharing
        })
      */ () => {}
      }
      {...props}
    >
      {t('Divulgar o AppJusto')}
    </Button>
  );
};

export default ShareButton;
