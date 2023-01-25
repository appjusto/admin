import { Fleet, WithId } from '@appjusto/types';
import { addDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customDocumentSnapshot } from '../utils';

export default class FleetApi {
  constructor(private refs: FirebaseRefs) {}

  observeFleet(
    fleetId: string,
    resultHandler: (result: WithId<Fleet> | null) => void
  ) {
    const fleetRef = this.refs.getFleetRef(fleetId);
    return customDocumentSnapshot(fleetRef, resultHandler);
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
      console.log(error);
      return null;
    }
  }

  async updateFleet(fleetId: string, changes: Partial<Fleet>) {
    // const timestamp = serverTimestamp();
    await updateDoc(this.refs.getFleetRef(fleetId), changes);
  }
}
