import { Box, Button, Center, Text } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { ManagerProfile } from 'pages/manager-profile/ManagerProfile';
import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Checklist } from './checklist/Checklist';
import { OnboardingStep } from './OnboardingStep';

const Onboarding = () => {
  const { path, url } = useRouteMatch();
  console.log(path, url);
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Center h="100vh">
          <Box>
              <Logo />
              <Box mt="8">
                <Text fontSize="xl" color="black">{t('Olá,boas vindas ao seu cadastro no AppJusto.')}</Text>
                <Text fontSize="xl" color="black">{t('Mais do que um delivery, somos um movimento por relações mais justas e transparentes.')}</Text>
              </Box>
              <Text mt="8" fontSize="md">{('Você irá passar por essas etapas para cadastrar seu restaurante:')}</Text>
              <Box mt="8">
                <Checklist />
              </Box>
              <Text mt="8" fontSize="md">{('Não se preocupe, você poderá pular qualquer etapa e voltar para preencher depois.')}</Text>
              <Text fontSize="md">{('No final desse processo, seu restaurante já estará cadastrado no AppJusto e pronto para receber pedidos. Vamos começar?')}</Text>      
              <Link to={`${url}/1`}>
                <Button size="lg" mt="8">{t('Começar')}</Button>
              </Link>
          </Box>
        </Center>
      </Route>
      <Route path={`${path}/1`}>
        <OnboardingStep>
          <ManagerProfile />
        </OnboardingStep>
      </Route>
    </Switch>
  );
}

export default Onboarding