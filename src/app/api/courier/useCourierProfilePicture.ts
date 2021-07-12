import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';
import React from 'react';

export const useCourierProfilePicture = (courierId?: string, size: string = '_160x160') => {
  // context
  const api = useContextApi();
  // mutations
  const getSelfieImageURL = () => {
    return api.courier().getCourierProfilePictureURL(courierId!, size);
  };
  const { data: selfie } = useQuery(['courier:selfie', courierId], getSelfieImageURL);
  // result
  return selfie;
};
