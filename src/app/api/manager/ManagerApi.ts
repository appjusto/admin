import firebase from 'firebase/app';
import { ManagerProfile, WithId } from 'appjusto-types';

export default class ProfileApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // private helpers
  private getProfileRef(id: string) {
    return this.firestore.collection('managers').doc(id);
  }
  private async createProfile(id: string) {
    await this.getProfileRef(id).set({
      situation: 'pending',
    } as Partial<ManagerProfile>);
  }

  // public
  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<ManagerProfile>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getProfileRef(id).onSnapshot(
      async (doc) => {
        // ensure profile exists
        if (!doc.exists) await this.createProfile(id);
        else resultHandler({ ...(doc.data() as ManagerProfile), id });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
}
