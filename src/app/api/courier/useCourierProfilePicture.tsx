import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useCourierProfilePicture = (
  courierId: string | undefined,
  size: string = '_160x160'
) => {
  // context
  const api = useContextApi();
  // state
  const [pictureUrl, setPictureUrl] = React.useState<string | null>(null);
  // side effects
  React.useEffect(() => {
    if (courierId) {
      (async () => {
        const url = await api.courier().getCourierProfilePictureURL(courierId, size);
        if (url) setPictureUrl(url);
      })();
    }
  }, [api, courierId]);
  // result
  return pictureUrl;
};
