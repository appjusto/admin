import { Fleet, WithId } from '@appjusto/types';
import { getDoc } from 'firebase/firestore';
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
}
