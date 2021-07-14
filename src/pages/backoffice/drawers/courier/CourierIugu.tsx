import { useContextCourierProfile } from 'app/state/courier/context';
import React from 'react';
import { IuguInfos } from '../IuguInfos';

export const CourierIugu = () => {
  //context
  const { marketPlace, deleteMarketPlace, deleteMarketPlaceResult } = useContextCourierProfile();
  //UI
  return (
    <IuguInfos
      account={marketPlace}
      deleteAccount={deleteMarketPlace}
      result={deleteMarketPlaceResult}
    />
  );
};
