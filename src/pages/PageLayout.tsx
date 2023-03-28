import { Container, Flex, FlexProps } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useRouteMatch } from 'react-router-dom';
import MainHeader from './MainHeader';
import { MenuMobile } from './MenuMobile';
import Sidebar from './sidebar/Sidebar';

export const layoutFullWidth = 'fill-available';

interface PageLayoutProps extends FlexProps {
  maxW?: string;
  mt?: string;
}

const PageLayout = ({
  maxW = '1012px',
  mt = '0',
  children,
}: PageLayoutProps) => {
  // context
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  // helpers
  const isBackOffice = path.includes('backoffice');
  // UI
  return (
    <Flex w="100vw" minH="100vh" mt={mt}>
      <MenuMobile />
      <Sidebar />
      <Flex
        w={{ base: '100%', lg: '78%', xl: '84.73%' }}
        justifyContent="center"
        overflowX="hidden"
      >
        <Container
          position="relative"
          w={layoutFullWidth}
          maxW={{ lg: maxW }}
          pt={{
            base: isBackOffice ? '16' : isBackofficeUser ? '6' : '120px',
            lg: isBackOffice ? '10' : isBackofficeUser ? '6' : '100px',
          }}
          pb={{ base: '8', md: '14' }}
          overflowX="hidden"
        >
          {!isBackOffice && <MainHeader maxW={{ lg: maxW }} />}
          {children}
        </Container>
      </Flex>
    </Flex>
  );
};

export default PageLayout;
