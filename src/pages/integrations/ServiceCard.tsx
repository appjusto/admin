import { Badge, Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { t } from 'utils/i18n';

interface ServiceCardProps {
  logo: string;
  name: string;
  link: string;
  enabled?: boolean;
}

export const ServiceCard = ({
  logo,
  name,
  link,
  enabled,
}: ServiceCardProps) => {
  return (
    <Flex
      mt="14px"
      px={{ base: '4', md: '6' }}
      py="4"
      justifyContent="space-between"
      alignItems="center"
      border="1px solid"
      borderColor="gray.500"
      borderRadius="lg"
    >
      <Box w="60px" minW="60px" h="60px" borderRadius="lg" overflow="hidden">
        <Image src={logo} w="100%" />
      </Box>
      <Flex
        w="100%"
        maxW={{ base: '100px', md: '180px' }}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box w="100%" minW="100px" maxW="120px">
          <Text>{name}</Text>
        </Box>
        <Box w="100%" minW="80px">
          {enabled !== undefined && (
            <Badge
              p="4px 8px"
              color={enabled ? 'green.600' : 'black'}
              bgColor={enabled ? 'green.100' : 'yellow'}
              borderRadius="100px"
              fontSize="11px"
            >
              {enabled ? t('Ativada') : t('Desativada')}
            </Badge>
          )}
        </Box>
      </Flex>
      <Link to={link}>
        <Button size="md" variant="outline">
          {t('Ver detalhes')}
        </Button>
      </Link>
    </Flex>
  );
};
