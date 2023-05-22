import { DeleteIcon } from '@chakra-ui/icons';
import {
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
  Icon,
  Text,
} from '@chakra-ui/react';
import { useFetchBusinessOrdersToExport } from 'app/api/order/useFetchBusinessOrdersToExport';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import React from 'react';
import { CSVLink } from 'react-csv';
import { MdInfoOutline } from 'react-icons/md';
import { t } from 'utils/i18n';
import { getOrdersCsvData } from './utils';

interface OrderExportDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const OrderExportDrawer = (props: OrderExportDrawerProps) => {
  //context
  const { isBackofficeUser } = useContextFirebaseUser();
  const businessId = useContextBusinessId();
  // stat
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [clearDateNumber, setClearDateNumber] = React.useState(0);

  const orders = useFetchBusinessOrdersToExport(businessId, start, end);
  // helpers
  const ordersCsv = getOrdersCsvData(orders);
  const isFetched = start.length > 0 && end.length > 0 && orders !== undefined;
  const isActive = isFetched && orders!.length > 0;
  // handlers
  const clearFilters = () => {
    setClearDateNumber((prev) => prev + 1);
    setStart('');
    setEnd('');
  };
  // side effects
  console.log(orders);
  //UI
  return (
    <Drawer placement="right" size="lg" {...props}>
      <DrawerOverlay>
        <DrawerContent pt={isBackofficeUser ? '16' : 0}>
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader>
            <Text fontSize="2xl" fontWeight="700">
              {t('Exportação de dados')}
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <Text mb="4" color="gray.700">
              {t(
                'Selecione o período para o qual deseja exportar os dados dos pedidos'
              )}
            </Text>
            <CustomDateFilter
              getStart={setStart}
              getEnd={setEnd}
              clearNumber={clearDateNumber}
            />
            <Flex mt="4" justifyContent="flex-end">
              <HStack
                spacing={2}
                pl="2"
                pb={{ base: '2', md: '0' }}
                w="fit-content"
                minW={{ base: '82px', lg: '124px' }}
                color="#697667"
                cursor="pointer"
                onClick={clearFilters}
              >
                <DeleteIcon />
                <Text fontSize="15px" lineHeight="21px">
                  {t('Limpar datas')}
                </Text>
              </HStack>
            </Flex>
            {isFetched && !isActive && (
              <Flex
                mt="4"
                p="4"
                flexDir="row"
                border="1px solid black"
                borderRadius="lg"
              >
                <Icon mt="1" as={MdInfoOutline} />
                <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
                  {t('Nenhum pedido encontrado para o período informado')}
                </Text>
              </Flex>
            )}
          </DrawerBody>
          <DrawerFooter
            borderTop="1px solid #F2F6EA"
            justifyContent="flex-start"
          >
            {isActive ? (
              <CSVLink
                filename="pedidos-appjusto.csv"
                data={ordersCsv.data}
                headers={ordersCsv.headers}
              >
                <Button variant="secondary">
                  {t('Exportar pedidos para .csv')}
                </Button>
              </CSVLink>
            ) : (
              <Button variant="secondary" isDisabled>
                {t('Exportar pedidos para .csv')}
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
