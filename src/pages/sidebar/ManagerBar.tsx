import { Box, Flex, FlexProps, Image, Link, Text } from '@chakra-ui/react';
import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { EditButton } from 'common/components/buttons/EditButton';
import managerIcon from 'common/img/manager.svg';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

export const ManagerBar = (props: FlexProps) => {
  // context
  const { path, url } = useRouteMatch();
  const { manager } = useContextManagerProfile();
  const { username } = useContextAgentProfile();
  const isBackOffice = path.includes('backoffice');
  const name = manager?.name ? `, ${manager.name}!` : '!';
  return (
    <Flex
      mt={{ base: '4', lg: '0' }}
      position={{ base: 'relative', md: 'fixed' }}
      bottom={{ md: '0' }}
      left={{ md: '0' }}
      w={{ base: isBackOffice ? '100vw' : '75vw', md: '220px' }}
      borderTop={{ lg: '1px solid #C8D7CB' }}
      bgColor="#EEEEEE"
      px="4"
      py="2"
      {...props}
    >
      <Flex mr="2" justifyContent="center" alignItems="center">
        <Image src={managerIcon} width="24px" height="24px" />
      </Flex>
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <Box maxW="160px">
          {isBackOffice ? (
            <Text color="black" fontSize="xs" lineHeight="lg" mb="-6px">
              {username}
            </Text>
          ) : (
            <Text color="black" fontSize="xs" lineHeight="lg" mb="-6px">
              {t('Olá') + `${name}`}
            </Text>
          )}
          <Link as={RouterLink} to="/logout" textDecor="underline">
            {t('Sair')}
          </Link>
        </Box>
        <RouterLink to={isBackOffice ? `${url}/agent-profile` : `${url}/manager-profile`}>
          <EditButton />
        </RouterLink>
      </Flex>
    </Flex>
  );
};
