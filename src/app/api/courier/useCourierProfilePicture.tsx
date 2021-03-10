import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useCourierProfilePicture = (courierId: string | undefined) => {
  // context
  const api = useContextApi();
  // state
  const [pictureUrl, setPictureUrl] = React.useState<string | null>(null);
  // side effects
  React.useEffect(() => {
    if (courierId) {
      (async () => {
        const url = await api.courier().getCourierPictureURL(courierId);
        if (url) setPictureUrl(url);
      })();
    }
  }, [api, courierId]);
  // result
  return pictureUrl;
};
