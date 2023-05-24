import { Box, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import Image from 'common/components/Image';
import leftImage from 'common/img/login-left@2x.jpg';
import rightImage from 'common/img/login-right@2x.jpg';
import logo from 'common/img/logo.svg';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { EmailForm } from './EmailForm';
import { Feedback } from './Feedback';
import { PasswordForm } from './PasswordForm';
import { ResetForm } from './RecoveryForm';
import { FeedbackType, SignInStep } from './types';

const Login = () => {
  // context
  const {
    login,
    loginResult,
    sendSignInLinkToEmail,
    sendingLinkResult,
    sendPasswordResetEmail,
    sendPasswordResetEmailResult,
    signOut,
  } = useAuthentication();
  const { isLoading, isSuccess } = loginResult;
  // state
  const [signInStep, setSignInStep] = React.useState<SignInStep>('email');
  const [email, setEmail] = React.useState('');
  const [passwd, setPasswd] = React.useState('');
  const [feedbackType, setFeedbackType] = React.useState<FeedbackType>('login');
  // handlers
  const handleLogin = () => {
    login({ email, password: passwd });
  };
  const handleSignInLink = (type: FeedbackType) => {
    setFeedbackType(type);
    if (type !== 'reset') {
      sendSignInLinkToEmail(email);
    } else {
      // recovery
      sendPasswordResetEmail(email);
    }
    setSignInStep('feedback');
  };
  const handleRestart = () => {
    setPasswd('');
    setSignInStep('email');
  };
  // side effects
  React.useEffect(() => {
    signOut({});
  }, [signOut]);
  // UI
  if (isSuccess) return <Redirect to="/app" />;
  return (
    <Flex w="100wh" h="100vh" justifyContent={{ sm: 'center' }}>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={leftImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
      <Flex
        position="relative"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w={{ base: '100%', md: '80%', lg: 1 / 3 }}
        px={{ base: '8', md: '24', lg: '8' }}
      >
        {signInStep !== 'email' && (
          <HStack
            position="absolute"
            top="8"
            left="6"
            w="fit-content"
            alignItems="center"
            cursor="pointer"
            onClick={handleRestart}
          >
            <Icon as={MdArrowBack} mt="2px" />
            <Text>{t('Voltar')}</Text>
          </HStack>
        )}
        <Image src={logo} scrollCheck={false} mb="8" />
        {signInStep === 'email' && (
          <EmailForm
            email={email}
            onEmailChange={setEmail}
            handleSubmit={() => setSignInStep('passwd')}
          />
        )}
        {signInStep === 'passwd' && (
          <PasswordForm
            passwd={passwd}
            onPasswdChange={setPasswd}
            handleSubmit={handleLogin}
            isLoading={isLoading}
            handleSignInLink={handleSignInLink}
            handleStep={setSignInStep}
          />
        )}
        {signInStep === 'reset' && (
          <ResetForm
            email={email}
            onEmailChange={setEmail}
            handleSignInLink={handleSignInLink}
          />
        )}
        {signInStep === 'feedback' && (
          <Feedback
            type={feedbackType}
            isSuccess={sendingLinkResult.isSuccess}
            isResetSuccess={sendPasswordResetEmailResult.isSuccess}
          />
        )}
      </Flex>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={rightImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
    </Flex>
  );
};

export default Login;
