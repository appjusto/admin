import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import React from 'react';
import { IuguInfos } from '../IuguInfos';

export const BusinessIugu = () => {
  //context
  const {
    marketPlace,
    deleteMarketPlace,
    deleteMarketPlaceResult,
  } = useContextBusinessBackoffice();
  //UI
  return (
    <IuguInfos
      account={marketPlace}
      deleteAccount={deleteMarketPlace}
      result={deleteMarketPlaceResult}
    />
  );
};
