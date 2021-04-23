import {
  //CourierStatus,
  //CourierMode,
  WithId,
  //Fleet,
  //BankAccount,
  //CourierCompany,
  //ProfileSituation,
  CourierProfile,
} from 'appjusto-types';

/*export interface StateProps {
  status: CourierStatus;
  mode?: CourierMode;
  fleet?: WithId<Fleet>;
  bankAccount?: BankAccount;
  company?: CourierCompany;
  code?: string;
  situation: ProfileSituation;
  profileIssues?: string[];
  createdOn: firebase.firestore.Timestamp;
  updatedOn?: firebase.firestore.Timestamp;
  name?: string;
  email?: string;
  surname?: string;
  cpf?: string;
  phone?: string;
}*/

export type Actions = { type: 'update_state'; payload: Partial<WithId<CourierProfile>> };

export const courierReducer = (
  state: WithId<CourierProfile>,
  action: Actions
): WithId<CourierProfile> => {
  switch (action.type) {
    case 'update_state':
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new Error();
  }
};
