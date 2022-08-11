import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { IuguInfos } from '../IuguInfos';
import { AccountManager } from './AccountManager';

export const BusinessAccount = () => {
  //context
  const { userAbility } = useContextFirebaseUser();
  const { marketPlace, deleteMarketPlace, deleteMarketPlaceResult } =
    useContextBusinessBackoffice();
  //UI
  return (
    <>
      <IuguInfos
        account={marketPlace}
        userCanDelete={userAbility?.can('delete', 'businesses') ?? false}
        deleteAccount={deleteMarketPlace}
        result={deleteMarketPlaceResult}
      />
      <AccountManager />
    </>
  );
};
