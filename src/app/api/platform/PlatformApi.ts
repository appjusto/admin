import {
  Bank,
  Classification,
  Cuisine,
  FlaggedLocation,
  Issue,
  IssueType,
  PlatformAccess,
  PlatformFees,
  PlatformManagement,
  PlatformParams,
  PlatformStatistics,
  WithId,
} from '@appjusto/types';
import {
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { hash } from 'geokit';
import { documentsAs } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
export default class PlatformApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeStatistics(resultHandler: (result: PlatformStatistics) => void): Unsubscribe {
    const ref = this.refs.getPlatformStatisticsRef();
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        const data = querySnapshot.data();
        if (data) resultHandler(data as PlatformStatistics);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeAccess(resultHandler: (result: PlatformAccess) => void): Unsubscribe {
    const ref = this.refs.getPlatformAccessRef();
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        const data = querySnapshot.data();
        if (data) resultHandler(data as PlatformAccess);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeFlaggedLocations(
    resultHandler: (locations: WithId<FlaggedLocation>[] | null) => void
  ): Unsubscribe {
    const ref = this.refs.getFlaggedLocationsRef();
    const unsubscribe = onSnapshot(
      ref,
      (querySnapShot) => {
        if (!querySnapShot.empty) resultHandler(documentsAs<FlaggedLocation>(querySnapShot.docs));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeParams(resultHandler: (params: PlatformParams | null) => void) {
    const ref = this.refs.getPlatformParamsRef();
    return onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) resultHandler(snapshot.data() as PlatformParams);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  observeManagement(resultHandler: (params: PlatformManagement | null) => void) {
    const ref = this.refs.getPlatformManagementRef();
    return onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) resultHandler(snapshot.data() as PlatformManagement);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  observeFees(resultHandler: (fees: PlatformFees | null) => void) {
    const ref = this.refs.getPlatformFeesRef();
    return onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) resultHandler(snapshot.data() as PlatformFees);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async addFlaggedLocation(location: Partial<FlaggedLocation>) {
    const { address, coordinates } = location;
    const q = query(
      this.refs.getFlaggedLocationsRef(),
      where('address.description', '==', address?.description)
    );
    const currenLocation = await getDocs(q);
    if (!currenLocation.empty) return;
    const createdOn = serverTimestamp();
    const newLocation = {
      address,
      coordinates,
      createdOn,
      g: {
        geopoint: coordinates,
        geohash: hash({
          lat: coordinates?.latitude!,
          lng: coordinates?.longitude!,
        }),
      },
    };
    return await addDoc(this.refs.getFlaggedLocationsRef(), newLocation);
  }

  async deleteFlaggedLocation(locationId: string) {
    return await deleteDoc(this.refs.getFlaggedLocationRef(locationId));
  }

  async fetchCuisines() {
    const q = query(this.refs.getCuisinesRef(), orderBy('order', 'asc'));
    const data = await getDocs(q);
    return documentsAs<Cuisine>(data.docs);
  }

  async fetchClassifications() {
    const q = query(this.refs.getClassificationsRef(), orderBy('order', 'asc'));
    const data = await getDocs(q);
    return documentsAs<Classification>(data.docs);
  }

  async fetchBanks() {
    const q = query(this.refs.getBanksRef(), orderBy('order', 'asc'));
    const data = await getDocs(q);
    return documentsAs<Bank>(data.docs);
  }

  async fetchIssues(types: IssueType[]) {
    const q = query(this.refs.getIssuesRef(), where('type', 'in', types));
    const data = await getDocs(q);
    return data.docs.map<Issue>((doc) => doc.data() as Issue);
  }

  async getServerTime(): Promise<number> {
    try {
      const result = (await this.refs.getServerTimeCallable()()) as unknown as {
        data: { time: number };
      };
      return result.data.time;
    } catch (error) {
      console.error('getServerTimeError', error);
      return 0;
    }
  }

  async updatePlatformParams(changes: DeepPartial<PlatformParams>) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    return await updateDoc(this.refs.getPlatformParamsRef(), fullChanges);
  }

  async updatePlatformManagement(changes: DeepPartial<PlatformManagement>) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    return await updateDoc(this.refs.getPlatformManagementRef(), fullChanges);
  }

  async updatePlatformFees(changes: DeepPartial<PlatformFees>) {
    const ref = this.refs.getPlatformFeesRef();
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };

    return await updateDoc(ref, fullChanges);
  }
}
