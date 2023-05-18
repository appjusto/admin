import { Box, Flex } from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import Image from 'common/components/Image';
import leftImage from 'common/img/login-left@2x.jpg';
import rightImage from 'common/img/login-right@2x.jpg';
import logo from 'common/img/logo.svg';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { EmailForm } from './EmailForm';
import { Feedback } from './Feedback';
import { PasswordForm } from './PasswordForm';
import { FeedbackType, SignInStep } from './types';

const Login = () => {
  // context
  const {
    login,
    loginResult,
    sendSignInLinkToEmail,
    sendingLinkResult,
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
    sendSignInLinkToEmail(email);
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
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w={{ base: '100%', md: '80%', lg: 1 / 3 }}
        px={{ base: '8', md: '24', lg: '8' }}
      >
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
          />
        )}
        {signInStep === 'feedback' && (
          <Feedback
            type={feedbackType}
            isSuccess={sendingLinkResult.isSuccess}
            onRestart={handleRestart}
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
