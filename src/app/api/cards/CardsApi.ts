import { Card, WithId } from '@appjusto/types';
import { documentAs } from 'core/fb';
import { getDocs, query, where } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';

export default class CardsApi {
  constructor(private refs: FirebaseRefs) {}

  async fetchCardByTokenId(cardTokenId: string): Promise<WithId<Card> | null> {
    const q = query(
      this.refs.getCardsRef(),
      where('token.id', '==', cardTokenId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return documentAs<Card>(snapshot.docs[0]);
  }
}
