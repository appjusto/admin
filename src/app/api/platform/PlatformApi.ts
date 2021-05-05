import { Bank, Cuisine, IssueType, Issue } from 'appjusto-types';
import { documentsAs } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';

export default class PlatformApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  async fetchCuisines() {
    return documentsAs<Cuisine>((await this.refs.getCuisinesRef().get()).docs);
  }

  async fetchBanks() {
    return documentsAs<Bank>((await this.refs.getBanksRef().orderBy('order', 'asc').get()).docs);
  }

  async fetchIssues(type: IssueType) {
    return documentsAs<Issue>(
      (await this.refs.getIssuesRef().where('type', '==', type).get()).docs
    );
  }
}
