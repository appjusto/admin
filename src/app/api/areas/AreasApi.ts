import { Area } from '@appjusto/types';
import { getDocs, query, where } from 'firebase/firestore';
import { documentsAs } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';

export default class AreasApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  async fetchAreaByCity(state: string, city: string) {
    try {
      const q = query(
        this.refs.getAreasRef(),
        where('state', '==', state),
        where('city', '==', city)
      );
      const data = await getDocs(q);
      return documentsAs<Area>(data.docs);
    } catch (error) {
      console.error(error);
      return documentsAs<Area>([]);
    }
  }
}
