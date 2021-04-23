import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useCourierProfilePictures = (
  courierId: string | undefined,
  selfieSize: string = '_160x160',
  documentSize: string = '_160x160'
) => {
  // context
  const api = useContextApi();
  // state
  const [selfie, setSelfie] = React.useState<string | null>(null);
  const [document, setDocument] = React.useState<string | null>(null);
  // side effects
  React.useEffect(() => {
    if (courierId) {
      (async () => {
        const selfieUrl = await api.courier().getCourierProfilePictureURL(courierId, selfieSize);
        if (selfieUrl) setSelfie(selfieUrl);
        const documentUrl = await api
          .courier()
          .getCourierDocumentPictureURL(courierId, documentSize);
        if (documentUrl) setDocument(documentUrl);
      })();
    }
  }, [api, courierId]);
  // result
  return { selfie, document };
};
