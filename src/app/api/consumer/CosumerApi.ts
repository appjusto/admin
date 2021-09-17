import { WithId, ConsumerProfile } from 'appjusto-types';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';
import { documentsAs } from 'core/fb';
import * as Sentry from '@sentry/react';

export default class ConsumerApi {
  constructor(private refs: FirebaseRefs) {}

  observeNewConsumers(
    resultHandler: (consumers: WithId<ConsumerProfile>[]) => void,
    start: Date
  ): firebase.Unsubscribe {
    let query = this.refs.getConsumersRef().where('createdOn', '>=', start);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<ConsumerProfile>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeConsumerProfile(
    consumerId: string,
    resultHandler: (result: WithId<ConsumerProfile>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getConsumerRef(consumerId).onSnapshot(
      (doc) => {
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
