import firebase from 'firebase/app';
import { BusinessManagerProfile, WithId } from 'appjusto-types';

export default class ProfileApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // private helpers
  private getProfileRef(id: string) {
    return this.firestore.collection('business').doc('access').collection('managers').doc(id);
  }
  private async createProfile(id: string) {
    await this.getProfileRef(id).set({
      situation: 'pending',
    } as BusinessManagerProfile);
  }

  // public
  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<BusinessManagerProfile>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getProfileRef(id).onSnapshot(
      async (doc) => {
        // ensure profile exists
        if (!doc.exists) await this.createProfile(id);
        else resultHandler({ ...(doc.data() as BusinessManagerProfile), id });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
}
