import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  Text
} from '@chakra-ui/react';
import { useObserveLedgerEntry } from 'app/api/order/useObserveLedgerEntry';
import { flavorsPTOptions, ledgerEntryStatusPTOptions } from 'pages/backoffice/utils';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  entryId: string;
};

export const LedgerEntryDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { entryId } = useParams<Params>();
  const entry = useObserveLedgerEntry(entryId);
  // state
  // side effects
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', lg: '0' }}>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {t('Registro')}
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('ID do pedido:')}{' '}
              <Link
                as={RouterLink}
                to={`/backoffice/orders/${entry?.orderId}`}
                fontWeight="500"
                textDecor="underline"
              >
                {entry?.orderId ?? 'N/E'}
              </Link>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(entry?.createdOn)}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Operação:')}{' '}
              <Text as="span" fontWeight="500">
                {entry?.operation ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Descrição:')}{' '}
              <Text as="span" fontWeight="500">
                {entry?.description ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Tipo:')}{' '}
              <Text as="span" fontWeight="500">
                {
                  `De ${
                    entry?.from.accountType ? 
                    flavorsPTOptions[entry?.from.accountType] : 'N/E'
                  }`
                }
              </Text>
              <Text as="span" fontWeight="500">
                {
                  ` para ${
                    entry?.to.accountType ? 
                    flavorsPTOptions[entry?.to.accountType] : 'N/E'
                  }`
                }
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Conta de destino:')}{' '}
              <Text as="span" fontWeight="500">
                {entry?.to.accountId ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {
                  entry?.status ? ledgerEntryStatusPTOptions[entry.status] : 
                  'N/E'
                }
              </Text>
            </Text>
            
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Valor:')}{' '}
              <Text as="span" fontWeight="500">
                {entry?.value ? formatCurrency(entry?.value) : 'N/E'}
              </Text>
            </Text>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
