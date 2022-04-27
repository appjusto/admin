import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextCourierProfile } from 'app/state/courier/context';
import React from 'react';
import { IuguInfos } from '../IuguInfos';

export const CourierIugu = () => {
  //context
  const { userAbility } = useContextFirebaseUser();
  const { marketPlace, deleteMarketPlace, deleteMarketPlaceResult } = useContextCourierProfile();
  //UI
  return (
    <IuguInfos
      account={marketPlace}
      userCanDelete={userAbility?.can('delete', 'couriers') ?? false}
      deleteAccount={deleteMarketPlace}
      result={deleteMarketPlaceResult}
    />
  );
};
