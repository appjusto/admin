import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { EditButton } from 'common/components/buttons/EditButton';
import managerIcon from 'common/img/manager.svg';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

export const ManagerBar = () => {
  // context
  const { path, url } = useRouteMatch();
  const isBackOffice = path.includes('backoffice');
  const { manager } = useContextManagerProfile();
  const { agent, username } = useContextAgentProfile();
  const name = manager?.name ? `, ${manager.name}!` : '!';
  return (
    <Flex
      position="fixed"
      bottom="0"
      left="0"
      w="220px"
      borderTop="1px solid #C8D7CB"
      px="4"
      py="2"
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
        {!isBackOffice && (
          <RouterLink to={`${url}/manager-profile`}>
            <EditButton />
          </RouterLink>
        )}
      </Flex>
    </Flex>
  );
};
