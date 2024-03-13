import { Coupon, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentAs, documentsAs } from 'core/fb';
import {
  addDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';

export default class CouponApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeBusinessCoupons(
    businessId: string,
    resultHandler: (coupons: WithId<Coupon>[]) => void
  ): Unsubscribe {
    let q = query(
      this.refs.getCouponsRef(),
      orderBy('createdAt', 'desc'),
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
