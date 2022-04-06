import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUserEmail } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
// import { BsLightbulb } from 'react-icons/bs';
import { FcIdea } from 'react-icons/fc';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const initialSurvey = {
  fewOrders: false,
  appjustoProblems: false,
  notFinanciallyViable: false,
  didntAdaptToTheSystem: false,
  closingThisRestaurant: false,
  exclusivityWithAnotherPlatform: false,
  other: false,
};

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const BusinessDeleteDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const email = useContextFirebaseUserEmail();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, setIsDeleted } = useContextBusiness();
  const { deleteBusinessProfile, deleteResult } = useBusinessProfile();
  const { isLoading, isSuccess } = deleteResult;
  // state
  const [survey, setSurvey] = React.useState(initialSurvey);
  const [businessName, setBusinessName] = React.useState('');
  const [comment, setComment] = React.useState('');
  //handlers
  const handleSurvey = (key: string, value: boolean) => {
    setSurvey((prev) => {
      return { ...prev, [key]: value };
    });
  };
  const handleDelete = async () => {
    if (business?.name && businessName !== business?.name) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'BusinessDeleteDrawer-valid',
        message: { title: 'Favor preencher o nome do restaurante corretamente!' },
      });
    } else {
      setIsDeleted(true);
      if (email) localStorage.removeItem(`business-${process.env.REACT_APP_ENVIRONMENT}-${email}`);
      await deleteBusinessProfile();
    }
  };
  //UI
  if (isSuccess) return <Redirect to="/app/deleted" />;
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Flex flexDir="column">
                <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
                  {t('Excluir restaurante')}
                </Text>
                <Text fontSize="16px" color="black" fontWeight="500">
                  {t('Nome do restaurante: ')}
                  <Text as="span" fontWeight="700">
                    {business?.name ?? t('Não informado')}
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Flex
              flexDir="row"
              alignItems="center"
              border="1px solid black"
              borderRadius="lg"
              p="4"
              bgColor="#F6F6F6"
              color="black"
            >
              <Center w="48px" minW="48px" h="48px" bgColor="white" borderRadius="24px">
                <Icon as={FcIdea} w="24px" h="24px" />
              </Center>
              <Box ml="4">
                <Text mt="2">
                  {t(
                    'É possível desligar o seu restaurante, a qualquer momento e por quanto tempo desejar, e ele ficará invisível para os consumidores. Basta ir até a seção "Desligar restaurante do AppJusto" no '
                  )}
                  <Link
                    as={RouterLink}
                    to="/app/business-profile"
                    fontWeight="700"
                    textDecor="underline"
                  >
                    {t('perfil do restaurante.')}
                  </Link>
                </Text>
              </Box>
            </Flex>
            <Text mt="8" fontSize="18px" color="black">
              {t(
                'Lamentamos que tenha optado por excluir seu restaurante. Você poderia nos dizer qual(is) motivos te levaram a essa decisão?'
              )}
            </Text>
            <Stack
              mt="4"
              color="black"
              spacing={2}
              fontSize="16px"
              lineHeight="22px"
              flexDir="column"
            >
              <CustomCheckbox
                colorScheme="green"
                isChecked={survey.fewOrders}
                onChange={(e) => handleSurvey('fewOrders', e.target.checked)}
                value="fewOrders"
              >
                {t('Recebi poucos pedidos')}
              </CustomCheckbox>
              <CustomCheckbox
                colorScheme="green"
                isChecked={survey.appjustoProblems}
                onChange={(e) => handleSurvey('appjustoProblems', e.target.checked)}
                value="appjustoProblems"
              >
                {t('Problemas com o Appjusto')}
              </CustomCheckbox>
              <CustomCheckbox
                colorScheme="green"
                isChecked={survey.notFinanciallyViable}
                onChange={(e) => handleSurvey('notFinanciallyViable', e.target.checked)}
                value="notFinanciallyViable"
              >
                {t('Não foi viável financeiramente')}
              </CustomCheckbox>
              <CustomCheckbox
                colorScheme="green"
                isChecked={survey.didntAdaptToTheSystem}
                onChange={(e) => handleSurvey('didntAdaptToTheSystem', e.target.checked)}
                value="didntAdaptToTheSystem"
              >
                {t('Não me adaptei ao sistema')}
              </CustomCheckbox>
              <CustomCheckbox
                colorScheme="green"
                isChecked={survey.closingThisRestaurant}
                onChange={(e) => handleSurvey('closingThisRestaurant', e.target.checked)}
                value="closingThisRestaurant"
              >
                {t('Estou fechando este restaurante')}
              </CustomCheckbox>
              <CustomCheckbox
                colorScheme="green"
                isChecked={survey.exclusivityWithAnotherPlatform}
                onChange={(e) => handleSurvey('exclusivityWithAnotherPlatform', e.target.checked)}
                value="exclusivityWithAnotherPlatform"
              >
                {t('Exclusividade com outra plataforma')}
              </CustomCheckbox>
              <CustomCheckbox
                colorScheme="green"
                isChecked={survey.other}
                onChange={(e) => handleSurvey('other', e.target.checked)}
                value="other"
              >
                {t('Outro')}
              </CustomCheckbox>
            </Stack>
            {survey.other && (
              <Textarea
                mt="4"
                placeholder={t(
                  'Se quiser, conta brevemente como foi sua experiência com a plataforma'
                )}
                _placeholder={{ color: 'gray.600' }}
              />
            )}
            <Box mt="6" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
              <Text color="red">
                {t(
                  'Ao excluir o restaurante, todo o seu histórico de pedidos, itens adicionados, categorias, informes de transação financeira, serão apagados. Tem certeza que deseja excluir o restaurante?'
                )}
              </Text>
              {business?.name && (
                <>
                  <Text mt="4" color="red">
                    {t(`Para confirmar, digite o nome do restaurante no campo abaixo: `)}
                  </Text>
                  <Input
                    mt="2"
                    bg="white"
                    id="confirm-name"
                    label={t('Nome do restaurante')}
                    value={businessName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setBusinessName(event.target.value)
                    }
                  />
                </>
              )}
              <Stack mt="8" spacing={4} direction="row">
                <Button width="full" onClick={onClose}>
                  {t('Manter restaurante')}
                </Button>
                <Button
                  width="full"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isLoading}
                  loadingText={t('Excluindo')}
                  isDisabled={businessName !== business?.name}
                >
                  {t('Excluir restaurante')}
                </Button>
              </Stack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
