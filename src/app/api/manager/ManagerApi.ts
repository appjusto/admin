import { ManagerProfile, WithId } from 'appjusto-types';
import { documentsAs } from 'core/fb';
import firebase from 'firebase/app';
import FirebaseRefs from '../FirebaseRefs';

export default class ManagerApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getManagerRef(id).onSnapshot(
      async (doc) => {
        if (!doc.exists) resultHandler(null);
        else resultHandler({ ...(doc.data() as ManagerProfile), id });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeProfileByEmail(
    email: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getManagersRef().where('email', '==', email);

    const unsubscribe = query.onSnapshot(
      async (querySnapshot) => {
        const data = documentsAs<ManagerProfile>(querySnapshot.docs);
        console.log(data);
        resultHandler({ ...data[0], id: 'teste' });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  public async createProfile(id: string, email: string) {
    await this.refs.getManagerRef(id).set({
      situation: 'pending',
      email,
    } as Partial<ManagerProfile>);
  }

  async updateProfile(id: string, changes: Partial<ManagerProfile>) {
    await this.refs.getManagerRef(id).update(changes);
  }
}
