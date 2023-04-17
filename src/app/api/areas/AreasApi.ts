import { Area, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import {
  addDoc,
  deleteDoc,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAt,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { documentsAs } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';
import { customDocumentSnapshot } from '../utils';

export default class AreasApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeAreas(
    resultHandler: (
      areas: WithId<Area>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    state?: string,
    city?: string,
    startAfter?: QueryDocumentSnapshot<DocumentData>
  ): Unsubscribe {
    let q = query(this.refs.getAreasRef(), limit(20));
    if (state) q = query(q, where('state', '==', state));
    if (city) q = query(q, where('city', '==', city));
    if (startAfter) q = query(q, startAt(startAfter));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[querySnapshot.size - 1]
            : undefined;
        resultHandler(documentsAs<Area>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  observeArea(
    id: string,
    resultHandler: (area: WithId<Area> | null) => void
  ): Unsubscribe {
    const areaRef = this.refs.getAreaRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot<Area>(areaRef, resultHandler);
  }
  async fetchAreaByCity(state: string, city: string) {
    try {
      const q = query(
        this.refs.getAreasRef(),
        where('state', '==', state),
        where('city', '==', city)
      );
      const data = await getDocs(q);
      if (data.empty) return null;
      return documentsAs<Area>(data.docs);
    } catch (error) {
      console.error(error);
      return documentsAs<Area>([]);
    }
  }
  async createArea(area: Partial<Area>) {
    const areasRef = this.refs.getAreasRef();
    const timestamp = serverTimestamp();
    const newArea = {
      ...area,
      createdAt: timestamp,
      updatedAt: timestamp,
    } as Area;
    return await addDoc(areasRef, newArea);
  }
  async updateArea(id: string, changes: Partial<Area>) {
    const areaRef = this.refs.getAreaRef(id);
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedAt: timestamp,
    };
    return await updateDoc(areaRef, fullChanges);
  }
  async deleteArea(id: string) {
    const areaRef = this.refs.getAreaRef(id);
    return await deleteDoc(areaRef);
  }
}
