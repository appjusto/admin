import firebase from 'firebase/app';
import { documentsAs } from '../../../core/fb';
import { Bank, Cuisine } from 'appjusto-types';

export default class PlatformApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // private helpers
  private getPlatformRef() {
    return this.firestore.collection('platform');
  }
  private getPlatformDatasRef() {
    return this.getPlatformRef().doc('data');
  }
  private getCuisinesRef() {
    return this.getPlatformDatasRef().collection('cuisines');
  }
  private getBanksRef() {
    return this.getPlatformDatasRef().collection('banks');
  }

  // public
  // firestore
  async fetchCuisines() {
    return documentsAs<Cuisine>((await this.getCuisinesRef().get()).docs);
  }

  async fetchBanks() {
    return documentsAs<Bank>((await this.getBanksRef().get()).docs);
  }
}
