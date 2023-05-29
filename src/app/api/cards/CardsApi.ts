import { Card, WithId } from '@appjusto/types';
import { documentAs } from 'core/fb';
import { getDoc } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';

export default class CardsApi {
  constructor(private refs: FirebaseRefs) {}

  async fetchCardByTokenId(cardTokenId: string): Promise<WithId<Card> | null> {
    const ref = this.refs.getCardRef(cardTokenId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return documentAs<Card>(snapshot);
  }
}
