import { ManagerPrivatePlatform, ManagerProfile, WithId } from 'appjusto-types';
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

  observePrivatePlatform(
    id: string,
    resultHandler: (profile: ManagerPrivatePlatform | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getManagerPrivatePlatormRef(id).onSnapshot(
      async (doc) => {
        if (!doc.exists) resultHandler(null);
        else resultHandler({ ...(doc.data() as ManagerPrivatePlatform) });
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
