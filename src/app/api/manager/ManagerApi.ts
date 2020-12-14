import firebase from 'firebase/app';
import { ManagerProfile, WithId } from 'appjusto-types';

export default class ManagerApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // private helpers
  private getProfileRef(id: string) {
    return this.firestore.collection('managers').doc(id);
  }
  // public
  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getProfileRef(id).onSnapshot(
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

  public async createProfile(id: string, email: string) {
    await this.getProfileRef(id).set({
      situation: 'pending',
      email,
    } as Partial<ManagerProfile>);
  }

  async updateProfile(id: string, changes: Partial<ManagerProfile>) {
    await this.getProfileRef(id).update(changes);
  }
}
