import { Box, Button, Heading, Text } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useUpdateStaffProfile } from 'app/api/staff/useUpdateStaffProfile';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPasswordInput } from 'common/components/form/input/CustomPasswordInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

const StaffProfile = () => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { staff } = useContextStaffProfile();
  const { sendSignInLinkToEmail, sendingLinkResult } = useAuthentication();
  const { updateProfile, updateResult } = useUpdateStaffProfile(staff);
  const { isLoading, isError, error: updateError } = updateResult;

  // state
  const [name, setName] = React.useState(staff?.name ?? '');
  const [surname, setSurname] = React.useState(staff?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(staff?.phone ?? '');
  const [cpf, setCPF] = React.useState(staff?.cpf ?? '');
  const [isEditingPasswd, setIsEditingPasswd] = React.useState(true);
  const [passwd, setPasswd] = React.useState('');
  const [passwdConfirm, setPasswdConfirm] = React.useState('');
  const [passwdIsValid, setPasswdIsValid] = React.useState(false);
  const [currentPasswd, setCurrentPasswd] = React.useState('');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);
  const passwdRef = React.useRef<HTMLInputElement>(null);
  const passwdConfirmRef = React.useRef<HTMLInputElement>(null);
  const currentPasswdRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(cpf);
  const isReauthenticationRequired = React.useCallback(() => {
    if (
      updateError &&
      JSON.stringify(updateError).includes('recent authentication')
    )
      return true;
    else return false;
  }, [updateError]);

  // handlers
  const clearState = React.useCallback(() => {
    setName('');
    setSurname('');
    setPhoneNumber('');
    setCPF('');
  }, []);

  const onSubmitHandler = async () => {
    if (!isCPFValid()) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-valid-cpf',
        message: { title: 'O CPF informado não é válido.' },
      });
      return cpfRef?.current?.focus();
    }
    if (phoneNumber.length < 11) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'agent-valid-phone',
        message: { title: 'O celular informado não é válido.' },
      });
      return phoneNumberRef?.current?.focus();
    }
    if (passwd) {
      if (passwd !== passwdConfirm) {
        dispatchAppRequestResult({
          status: 'error',
          requestId: 'agent-valid-pass',
          message: { title: 'As senhas informadas não são iguais.' },
        });
        return passwdRef?.current?.focus();
      }
      if (!passwdIsValid) {
        dispatchAppRequestResult({
          status: 'error',
          requestId: 'agent-valid-password',
          message: { title: 'A senha informada não é válida.' },
        });
        return passwdRef?.current?.focus();
      }
      const data = {
        changes: {
          name,
          surname,
          phone: phoneNumber,
          cpf,
          isPasswordActive: true,
        },
        password: passwd,
        currentPassword: currentPasswd,
      };
      await updateProfile(data);
    } else {
      const data = {
        changes: {
          name,
          surname,
          phone: phoneNumber,
          cpf,
          isPasswordActive: true,
        },
      };
      await updateProfile(data);
    }
  };

  // side effects
  React.useEffect(() => {
    clearState();
    if (staff) {
      if (staff.name) setName(staff.name);
      if (staff.surname) setSurname(staff.surname);
      if (staff.phone) setPhoneNumber(staff.phone);
      if (staff.cpf) setCPF(staff.cpf);
      if (staff.isPasswordActive) setIsEditingPasswd(false);
    }
  }, [staff, clearState]);

  React.useEffect(() => {
    if (isError) {
      if (isReauthenticationRequired()) {
        console.warn('User reauthentication required');
        currentPasswdRef.current?.focus();
      }
    }
  }, [isError, isReauthenticationRequired]);

  // UI
  return (
    <Box maxW="368px">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <PageHeader
          title={t('Informe seus dados')}
          subtitle={t('Informações do agente appjusto')}
        />
        <CustomInput
          id="staff-profile-email"
          label={t('E-mail')}
          value={staff?.email ?? ''}
          isDisabled
        />
        <CustomInput
          isRequired
          id="staff-profile-name"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <CustomInput
          isRequired
          id="staff-profile-lastname"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
        />
        <CustomPatternInput
          isRequired
          ref={phoneNumberRef}
          id="staff-phone"
          label={t('Celular')}
          placeholder={t('Número do seu celular')}
          mask={phoneMask}
          parser={numbersOnlyParser}
          formatter={phoneFormatter}
          value={phoneNumber}
          onValueChange={(value) => setPhoneNumber(value)}
          validationLength={11}
        />
        <CustomPatternInput
          isRequired
          ref={cpfRef}
          id="staff-cpf"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
          externalValidation={{ active: true, status: isCPFValid() }}
        />
        {isEditingPasswd ? (
          <>
            <Heading mt="8" color="black" fontSize="xl">
              {staff?.isPasswordActive
                ? t('Alterar senha')
                : t('Senha de acesso')}
            </Heading>
            <Text mt="1" fontSize="sm" maxW="580px">
              {t(
                'Se preferir, você pode definir uma senha de acesso a plataforma. Quem estiver com o login e senha não precisará do link de confirmação enviado por e-mail.'
              )}
            </Text>
            {isReauthenticationRequired() ? (
              staff?.isPasswordActive ? (
                <>
                  <Text
                    mt="4"
                    p="2"
                    fontSize="sm"
                    maxW="580px"
                    bg="#FFFFCC"
                    border="1px solid #FFBE00"
                    borderRadius="lg"
                  >
                    {t(
                      'Como já faz algum tempo desde o seu último login, é preciso informar a sua senha atual, para prosseguir.'
                    )}
                  </Text>
                  <CustomPasswordInput
                    ref={currentPasswdRef}
                    mt="2"
                    id="manager-current-password"
                    label={t('Senha atual')}
                    placeholder={t('Digite a sua senha atual')}
                    value={currentPasswd}
                    handleChange={(ev) => setCurrentPasswd(ev.target.value)}
                    getValidity={setPasswdIsValid}
                  />
                  <Text mt="4" fontSize="xs" maxW="580px">
                    {t(
                      'A senha precisará ter no mínimo 8 caracteres, com pelo menos uma letra maíuscula e um número.'
                    )}
                  </Text>
                  <CustomPasswordInput
                    ref={passwdRef}
                    mt="2"
                    id="manager-password"
                    label={t('Senha de acesso')}
                    placeholder={t('Digite uma senha')}
                    value={passwd}
                    handleChange={(ev) => setPasswd(ev.target.value)}
                    getValidity={setPasswdIsValid}
                  />
                  <CustomPasswordInput
                    ref={passwdConfirmRef}
                    isRequired={passwd ? true : false}
                    isDisabled={!passwd ? true : false}
                    id="manager-password-confirmation"
                    label={t('Confirmar senha')}
                    placeholder={t('Digite a senha novamente')}
                    value={passwdConfirm}
                    handleChange={(ev) => setPasswdConfirm(ev.target.value)}
                  />
                </>
              ) : (
                <Box mb="8">
                  <Text
                    mt="4"
                    p="2"
                    fontSize="sm"
                    maxW="580px"
                    bg="#FFFFCC"
                    border="1px solid #FFBE00"
                    borderRadius="lg"
                  >
                    {t(
                      'Como já faz algum tempo desde o seu último login, e ainda não há senha cadastrada, é preciso realizar um novo login (por meio do link de acesso que é enviado ao seu e-mail) antes de cadastrar sua senha. Deseja enviar o link de acesso?'
                    )}
                  </Text>
                  <Button
                    mt="4"
                    w="100%"
                    onClick={() => sendSignInLinkToEmail(staff?.email!)}
                    isLoading={sendingLinkResult.isLoading}
                  >
                    {t('Enviar link de acesso')}
                  </Button>
                  {sendingLinkResult.isSuccess && (
                    <AlertSuccess
                      title={t('Pronto!')}
                      description={t(
                        'O link de acesso foi enviado para seu e-mail.'
                      )}
                    />
                  )}
                </Box>
              )
            ) : (
              <>
                <Text mt="4" fontSize="xs" maxW="580px">
                  {t(
                    'A senha precisará ter no mínimo 8 caracteres, com pelo menos uma letra maíuscula e um número.'
                  )}
                </Text>
                <CustomPasswordInput
                  ref={passwdRef}
                  mt="2"
                  id="manager-password"
                  label={t('Senha de acesso')}
                  placeholder={t('Digite uma senha')}
                  value={passwd}
                  handleChange={(ev) => setPasswd(ev.target.value)}
                  getValidity={setPasswdIsValid}
                />
                <CustomPasswordInput
                  ref={passwdConfirmRef}
                  isRequired={passwd ? true : false}
                  isDisabled={!passwd ? true : false}
                  id="manager-password-confirmation"
                  label={t('Confirmar senha')}
                  placeholder={t('Digite a senha novamente')}
                  value={passwdConfirm}
                  handleChange={(ev) => setPasswdConfirm(ev.target.value)}
                />
              </>
            )}
          </>
        ) : (
          <Text mt="6" color="black">
            <Text
              w="auto"
              as="span"
              textDecor="underline"
              cursor="pointer"
              onClick={() => setIsEditingPasswd(true)}
            >
              {t('Editar senha de acesso')}
            </Text>
          </Text>
        )}
        <PageFooter isLoading={isLoading} />
      </form>
    </Box>
  );
};

export default StaffProfile;
