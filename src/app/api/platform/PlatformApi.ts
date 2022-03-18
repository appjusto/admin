import {
  Bank,
  Classification,
  Cuisine,
  FlaggedLocation,
  Issue,
  IssueType,
  PlatformAccess,
  PlatformParams,
  PlatformStatistics,
  WithId,
} from '@appjusto/types';
import firebase from 'firebase/app';
import { hash } from 'geokit';
import { documentsAs } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';

export default class PlatformApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeStatistics(resultHandler: (result: PlatformStatistics) => void): firebase.Unsubscribe {
    let query = this.refs.getPlatformStatisticsRef();

    const unsubscribe = query.onSnapshot(
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

  observeAccess(resultHandler: (result: PlatformAccess) => void): firebase.Unsubscribe {
    let query = this.refs.getPlatformAccessRef();

    const unsubscribe = query.onSnapshot(
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
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getFlaggedLocationsRef().onSnapshot(
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
    return this.refs.getPlatformParamsRef().onSnapshot(
      (snapshot) => {
        if (snapshot.exists) resultHandler(snapshot.data() as PlatformParams);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async addFlaggedLocation(location: Partial<FlaggedLocation>) {
    const { address, coordinates } = location;
    const isNewLocation = (
      await this.refs
        .getFlaggedLocationsRef()
        .where('address.description', '==', address?.description)
        .get()
    ).empty;
    if (!isNewLocation) return;
    const createdOn = firebase.firestore.FieldValue.serverTimestamp();
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
    return await this.refs.getFlaggedLocationsRef().add(newLocation);
  }

  async deleteFlaggedLocation(locationId: string) {
    return await this.refs.getFlaggedLocationRef(locationId).delete();
  }

  async fetchCuisines() {
    return documentsAs<Cuisine>(
      (await this.refs.getCuisinesRef().orderBy('order', 'asc').get()).docs
    );
  }

  async fetchClassifications() {
    return documentsAs<Classification>(
      (await this.refs.getClassificationsRef().orderBy('order', 'asc').get()).docs
    );
  }

  async fetchBanks() {
    return documentsAs<Bank>((await this.refs.getBanksRef().orderBy('order', 'asc').get()).docs);
  }

  async fetchIssues(types: IssueType[]) {
    const docs = (await this.refs.getIssuesRef().where('type', 'in', types).get()).docs;
    const issues = docs.map<Issue>((doc) => doc.data() as Issue);
    return issues;
  }

  async getServerTime(): Promise<number> {
    try {
      const result = await this.refs.getServerTimeCallable()();
      return result.data.time;
    } catch (error) {
      console.error('getServerTimeError', error);
      return 0;
    }
  }
}
