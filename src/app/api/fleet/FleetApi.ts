import { Fleet, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import {
  addDoc,
  getDoc,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export default class FleetApi {
  constructor(private refs: FirebaseRefs) {}

  observeFleet(
    fleetId: string,
    resultHandler: (result: WithId<Fleet> | null) => void
  ) {
    const fleetRef = this.refs.getFleetRef(fleetId);
    return customDocumentSnapshot(fleetRef, resultHandler);
  }

  observeBusinessFleet(
    businessId: string,
    resultHandler: (result: WithId<Fleet>[] | null) => void
  ) {
    const q = query(
      this.refs.getFleetsRef(),
      where('createdBy.id', '==', businessId)
    );
    return customCollectionSnapshot(q, resultHandler);
  }

  async getFleetById(fleetId: string) {
    const fleet = await getDoc(this.refs.getFleetRef(fleetId));
    return fleet.data() as Fleet;
  }

  async createFleet(data: Partial<Fleet>) {
    try {
      const timestamp = serverTimestamp();
      const fleetDoc = await addDoc(this.refs.getFleetsRef(), {
        ...data,
        createdOn: timestamp,
      });
      return fleetDoc.id;
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  }

  async updateFleet(fleetId: string, changes: Partial<Fleet>) {
    // const timestamp = serverTimestamp();
    await updateDoc(this.refs.getFleetRef(fleetId), changes);
  }
}
