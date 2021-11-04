import { Bank, Cuisine, IssueType, Issue, PlatformStatistics } from 'appjusto-types';
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

  async fetchCuisines() {
    return documentsAs<Cuisine>(
      (await this.refs.getCuisinesRef().orderBy('order', 'asc').get()).docs
    );
  }

  async fetchBanks() {
    return documentsAs<Bank>((await this.refs.getBanksRef().orderBy('order', 'asc').get()).docs);
  }

  async fetchIssues(types: IssueType[]) {
    return documentsAs<Issue>(
      (await this.refs.getIssuesRef().where('type', 'in', types).get()).docs
    );
  }

  async getServerTime(): Promise<number> {
    const result = await this.refs.getServerTimeCallable()();
    return result.data.time;
  }
}
