import { Icon, Link, LinkProps } from '@chakra-ui/react';
import { ElementType } from 'react';

interface ShareLinkProps extends LinkProps {
  link: string;
  label: string;
  indication?: boolean;
  variant?: 'outline' | 'dark';
  icon: ElementType<any>;
}

const ShareLink: React.FC<ShareLinkProps> = ({
  link,
  label,
  indication = false,
  icon,
  variant = 'outline',
  ...props
}) => {
  return (
    <Link
      href={link}
      fontFamily="Barlow"
      fontSize="15px"
      fontWeight="700"
      border={variant === 'outline' ? '2px solid black' : 'none'}
      bgColor={variant === 'outline' ? 'white' : '#C8D7CB'}
      color="black"
      borderRadius="8px"
      w="100%"
      h="48px"
      _hover={{ bg: '#F2F6EA' }}
      display="flex"
      flexDir="row"
      justifyContent="center"
      alignItems="center"
      {...props}
      isExternal
    >
      <Icon as={icon} w="24px" h="24px" mr="8px" />
      {label}
    </Link>
  );
};

export default ShareLink;
