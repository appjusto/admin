import { Stack } from '@chakra-ui/react'
import {
  FaWhatsappSquare, FaFacebookSquare, FaLinkedin, FaTwitterSquare
} from 'react-icons/fa'

import ShareLink from './ShareLink'
import useSharingUrlMsg from './useSharingUrlMsg'

const SharingBar: React.FC = () => {
  const { mainUrl, sharingMsg } = useSharingUrlMsg()
  return (
    <Stack
      w="100%"
      maxW="560px"
      direction={["column", null, "row"]}
      spacing={4}
      mt="6px"
    >
      <Stack
        w="100%"
        direction="row"
        spacing={4}
      >
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
      <Stack
        w="100%"
        direction="row"
        spacing={4}
      >
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
}

export default SharingBar;

//https://www.linkedin.com/shareArticle?mini=true&url=${mainUrl}&source=AppJusto

//https://www.facebook.com/v5.0/dialog/share?app_id=542599432471018&href=${mainUrl}%3Fsource%3Dsocial.fb&display=page&facebook%2Fclose`
