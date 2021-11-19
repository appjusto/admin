import {
  Bank,
  Cuisine,
  IssueType,
  Issue,
  PlatformStatistics,
  FlaggedLocation,
  WithId,
} from 'appjusto-types';
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

  async addFlaggedLocation(location: FlaggedLocation) {
    return await this.refs.getFlaggedLocationsWithGeoRef().add(location);
  }

  async fetchCuisines() {
    return documentsAs<Cuisine>(
      (await this.refs.getCuisinesRef().orderBy('order', 'asc').get()).docs
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
    const result = await this.refs.getServerTimeCallable()();
    return result.data.time;
  }
}
