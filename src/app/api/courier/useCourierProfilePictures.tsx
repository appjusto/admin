import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useCourierProfilePictures = (courierId: string | undefined) => {
  // context
  const api = useContextApi();
  // state
  const [selfie, setSelfie] = React.useState<string | null>(null);
  const [document, setDocument] = React.useState<string | null>(null);
  // side effects
  React.useEffect(() => {
    if (courierId) {
      (async () => {
        const selfieUrl = await api.courier().getCourierProfilePictureURL(courierId);
        if (selfieUrl) setSelfie(selfieUrl);
        const documentUrl = await api.courier().getCourierDocumentPictureURL(courierId);
        if (documentUrl) setDocument(documentUrl);
      })();
    }
  }, [api, courierId]);
  // result
  return { selfie, document };
};
