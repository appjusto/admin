import { WithId, ConsumerProfile } from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';

export default class ConsumerApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  observeConsumerProfile(
    consumerId: string,
    resultHandler: (result: WithId<ConsumerProfile>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getConsumerRef(consumerId).onSnapshot(
      (doc) => {
        console.log(doc.data());
        if (doc.exists) resultHandler({ ...(doc.data() as ConsumerProfile), id: consumerId });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  // update
  async updateProfile(id: string, changes: Partial<ConsumerProfile>) {
    await this.refs.getConsumerRef(id).update(changes);
  }
}
