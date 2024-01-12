import { Stack } from '@chakra-ui/react';
import {
  FaFacebookSquare,
  FaLinkedin,
  FaTwitterSquare,
  FaWhatsappSquare,
} from 'react-icons/fa';
import ShareLink from './ShareLink';

const mainUrl = 'https://appjusto.com.br/';
const sharingMsg = encodeURIComponent(
  `Appjusto. Mais do que um app de entregas. Somo um movimento por relações mais justas e transparentes. Faça parte agora!\n\n${mainUrl}`
);

const SharingBar: React.FC = () => {
  return (
    <Stack
      w="100%"
      maxW="560px"
      direction={{ base: 'column', lg: 'row' }}
      spacing={4}
      mt="6px"
    >
      <Stack w="100%" direction="row" spacing={4}>
        <ShareLink
          link={`https://api.whatsapp.com/send?text=${sharingMsg}`}
          label="Whatsapp"
          icon={FaWhatsappSquare}
        />
        <ShareLink
          link={`https://www.facebook.com/sharer/sharer.php?u=${mainUrl}%3Fsource%3Dsocial.fb&display=page&facebook%2Fclose`}
          label="Facebook"
          icon={FaFacebookSquare}
        />
      </Stack>
      <Stack w="100%" direction="row" spacing={4}>
        <ShareLink
          link={`https://twitter.com/intent/tweet?text=${sharingMsg}`}
          label="Twitter"
          icon={FaTwitterSquare}
        />
        <ShareLink
          link={`https://www.linkedin.com/sharing/share-offsite/?url=${mainUrl}`}
          label="Linkedin"
          icon={FaLinkedin}
        />
      </Stack>
    </Stack>
  );
};

export default SharingBar;

//https://www.linkedin.com/shareArticle?mini=true&url=${mainUrl}&source=AppJusto

//https://www.facebook.com/v5.0/dialog/share?app_id=542599432471018&href=${mainUrl}%3Fsource%3Dsocial.fb&display=page&facebook%2Fclose`
