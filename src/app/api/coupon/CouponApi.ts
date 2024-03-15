import { Coupon, Flavor, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentAs, documentsAs } from 'core/fb';
import {
  addDoc,
  deleteDoc,
  DocumentData,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAt,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';

export default class CouponApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeCoupons(
    resultHandler: (
      coupons: WithId<Coupon>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    startAfter?: QueryDocumentSnapshot<DocumentData>,
    flavor?: Flavor,
    code?: string,
    enabled?: boolean
  ): Unsubscribe {
    let q = query(
      this.refs.getCouponsRef(),
      orderBy('enabledAt', 'desc'),
      limit(20)
    );
    if (startAfter) q = query(q, startAt(startAfter));
    if (flavor) q = query(q, where('createdBy.flavor', '==', flavor));
    if (code) q = query(q, where('code', '==', code));
    if (enabled !== undefined) q = query(q, where('enabled', '==', enabled));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[querySnapshot.size - 1]
            : undefined;
        resultHandler(documentsAs<Coupon>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeBusinessCoupons(
    businessId: string,
    resultHandler: (coupons: WithId<Coupon>[]) => void
  ): Unsubscribe {
    let q = query(
      this.refs.getCouponsRef(),
      orderBy('enabledAt', 'desc'),
      where('createdBy.id', '==', businessId)
    );
    // returns the unsubscribe function
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        resultHandler(documentsAs<Coupon>(snapshot.docs));
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
        resultHandler([]);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async getCoupon(couponId: string) {
    const docRef = this.refs.getCouponRef(couponId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return documentAs<Coupon>(snapshot);
  }

  async createCoupon(
    data: Pick<
      Coupon,
      | 'createdBy'
      | 'type'
      | 'code'
      | 'discount'
      | 'minOrderValue'
      | 'usagePolicy'
    >
  ) {
    const coupon: Coupon = {
      ...data,
      enabled: true,
      enabledAt: serverTimestamp() as Timestamp,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    await addDoc(this.refs.getCouponsRef(), coupon);
  }

  async updateCoupon(couponId: string, changes: Partial<Coupon>) {
    const fullChanges: Partial<Coupon> = {
      ...changes,
      updatedAt: serverTimestamp() as Timestamp,
    };
    if (changes.usagePolicy === 'renewable' && changes.enabled) {
      fullChanges.enabledAt = serverTimestamp() as Timestamp;
    }
    await updateDoc(this.refs.getCouponRef(couponId), fullChanges);
  }

  async deleteCoupon(couponId: string) {
    console.log('deleteCoupon id: ', couponId);
    const docRef = this.refs.getCouponRef(couponId);
    console.log(docRef);
    await deleteDoc(docRef);
  }
}
