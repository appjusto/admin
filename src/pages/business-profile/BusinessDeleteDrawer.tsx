import { DeleteBusinessPayload } from '@appjusto/types';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUserEmail } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Redirect } from 'react-router-dom';
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

export const BusinessDeleteDrawer = ({
  onClose,
  ...props
}: BaseDrawerProps) => {
  //context
  const email = useContextFirebaseUserEmail();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const { updateLastBusinessId } = useContextManagerProfile();
  const { deleteBusinessProfile, deleteResult } = useBusinessProfile(
    business?.id
  );
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
        message: {
          title: 'Favor preencher o nome do restaurante corretamente!',
        },
      });
    } else {
      if (email)
        localStorage.removeItem(
          `business-${process.env.REACT_APP_ENVIRONMENT}-${email}`
        );
      let data = { ...survey } as Partial<DeleteBusinessPayload>;
      if (comment.length > 0) data.comment = comment;
      updateLastBusinessId(null);
      await deleteBusinessProfile(data);
    }
  };
  //UI
  if (isSuccess) return <Redirect to="/app/deleted" />;
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader pb="2">
            <Flex
              mt={{ base: '14', md: '0' }}
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Flex flexDir="column">
                <Text
                  color="black"
                  fontSize="2xl"
                  fontWeight="700"
                  lineHeight="28px"
                  mb="2"
                >
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
            {business?.situation === 'approved' && (
              <Box
                borderRadius="lg"
                p="6"
                bgColor="#FFBE00"
                color="black"
                mb="4"
              >
                <Text fontSize="18px" fontWeight="700" lineHeight="26px">
                  {t('Antes de excluir, considere desligar o restaurante')}
                </Text>
                <Text mt="2" fontSize="16px" fontWeight="500" lineHeight="22px">
                  {t(
                    'Você pode acessar o menu "operação" e desligá-lo a qualquer momento para que não seja mais exibido na plataforma.'
                  )}
                </Text>
                <Button mt="4" variant="outline" onClick={onClose}>
                  {t('Ir até o menu operação')}
                </Button>
              </Box>
            )}
            <Text mt="4" fontSize="18px" color="black">
              {t(
                'Lamentamos que tenha optado por excluir seu restaurante. Você poderia nos dizer qual ou quais motivos o trouxeram aqui?'
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
              <Checkbox
                colorScheme="green"
                isChecked={survey.fewOrders}
                onChange={(e) => handleSurvey('fewOrders', e.target.checked)}
                value="fewOrders"
              >
                {t('Recebi poucos pedidos')}
              </Checkbox>
              <Checkbox
                colorScheme="green"
                isChecked={survey.appjustoProblems}
                onChange={(e) =>
                  handleSurvey('appjustoProblems', e.target.checked)
                }
                value="appjustoProblems"
              >
                {t('Problemas com o Appjusto')}
              </Checkbox>
              <Checkbox
                colorScheme="green"
                isChecked={survey.notFinanciallyViable}
                onChange={(e) =>
                  handleSurvey('notFinanciallyViable', e.target.checked)
                }
                value="notFinanciallyViable"
              >
                {t('Não foi viável financeiramente')}
              </Checkbox>
              <Checkbox
                colorScheme="green"
                isChecked={survey.didntAdaptToTheSystem}
                onChange={(e) =>
                  handleSurvey('didntAdaptToTheSystem', e.target.checked)
                }
                value="didntAdaptToTheSystem"
              >
                {t('Não me adaptei ao sistema')}
              </Checkbox>
              <Checkbox
                colorScheme="green"
                isChecked={survey.closingThisRestaurant}
                onChange={(e) =>
                  handleSurvey('closingThisRestaurant', e.target.checked)
                }
                value="closingThisRestaurant"
              >
                {t('Estou fechando este restaurante')}
              </Checkbox>
              <Checkbox
                colorScheme="green"
                isChecked={survey.exclusivityWithAnotherPlatform}
                onChange={(e) =>
                  handleSurvey(
                    'exclusivityWithAnotherPlatform',
                    e.target.checked
                  )
                }
                value="exclusivityWithAnotherPlatform"
              >
                {t('Exclusividade com outra plataforma')}
              </Checkbox>
              <Checkbox
                colorScheme="green"
                isChecked={survey.other}
                onChange={(e) => handleSurvey('other', e.target.checked)}
                value="other"
              >
                {t('Outro')}
              </Checkbox>
            </Stack>
            {survey.other && (
              <Textarea
                mt="4"
                placeholder={t(
                  'Se quiser, conta brevemente como foi sua experiência com a plataforma'
                )}
                _placeholder={{ color: 'gray.600' }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            )}
            <Box
              mt="8"
              bg="#FFF8F8"
              border="1px solid red"
              borderRadius="lg"
              p="6"
            >
              <Text color="red">
                {t(
                  'Ao excluir o restaurante, todo o seu histórico de pedidos, itens adicionados, categorias, informes de transação financeira, serão apagados. Tem certeza que deseja excluir o restaurante?'
                )}
              </Text>
              {business?.name && (
                <>
                  <Text mt="4" color="red">
                    {t(
                      `Para confirmar, digite o nome do restaurante no campo abaixo: `
                    )}
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
                  isDisabled={
                    business?.name ? businessName !== business?.name : false
                  }
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
