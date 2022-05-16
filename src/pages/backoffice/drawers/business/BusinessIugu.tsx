import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import React from 'react';
import { IuguInfos } from '../IuguInfos';

export const BusinessIugu = () => {
  //context
  const { userAbility } = useContextFirebaseUser();
  const { marketPlace, deleteMarketPlace, deleteMarketPlaceResult } =
    useContextBusinessBackoffice();
  //UI
  return (
    <IuguInfos
      account={marketPlace}
      userCanDelete={userAbility?.can('delete', 'businesses') ?? false}
      deleteAccount={deleteMarketPlace}
      result={deleteMarketPlaceResult}
    />
  );
};
