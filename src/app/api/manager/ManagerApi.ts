import { AdminRole, CreateManagerPayload, ManagerProfile, Role, WithId } from 'appjusto-types';
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
        resultHandler(data[0]);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  public async createProfile(id: string, email: string) {
    const data = (await this.refs.getManagerRef(id).get()).data();
    if (!data) {
      await this.refs.getManagerRef(id).set({
        situation: 'pending',
        email,
      } as Partial<ManagerProfile>);
    }
  }

  async updateProfile(id: string, changes: Partial<ManagerProfile>) {
    await this.refs.getManagerRef(id).update(changes);
  }

  async createManager(email: string, key: string, role: Role | AdminRole) {
    const payload: CreateManagerPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      email,
      key,
      role,
    };
    const manager = await this.refs.getCreateManager()(payload);
    return manager.data as WithId<ManagerProfile>;
  }
}
