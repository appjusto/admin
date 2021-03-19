import { ElementType } from 'react';
import { Link, Icon, LinkProps } from '@chakra-ui/react';

interface ShareLinkProps extends LinkProps {
  link: string
  label: string
  indication?: boolean
  icon: ElementType<any>
}

const ShareLink: React.FC<ShareLinkProps> = ({
  link, label, indication = false, icon, ...props
}) => {
  return (
    <Link
      href={link}
      fontFamily="Barlow"
      fontSize="15px"
      fontWeight="700"
      border="2px solid black"
      borderRadius="8px"
      w="100%"
      h="48px"
      _hover={{bg: "#F2F6EA"}}
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
}

export default ShareLink;
