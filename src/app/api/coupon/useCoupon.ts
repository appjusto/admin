import { Coupon } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useCoupon = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: createCoupon, mutationResult: createResult } =
    useCustomMutation(
      async (
        data: Pick<
          Coupon,
          | 'createdBy'
          | 'type'
          | 'code'
          | 'discount'
          | 'minOrderValue'
          | 'usagePolicy'
        >
      ) => {
        return api.coupon().createCoupon(data);
      },
      'createCoupon'
    );
  const { mutate: updateCoupon, mutationResult: updateResult } =
    useCustomMutation(
      async (data: {
        couponId: string;
        changes: Pick<
          Coupon,
          'type' | 'code' | 'discount' | 'minOrderValue' | 'usagePolicy'
        >;
      }) => {
        const { couponId, changes } = data;
        return api.coupon().updateCoupon(couponId, changes);
      },
      'createCoupon'
    );
  const { mutate: deleteCoupon, mutationResult: deleteResult } =
    useCustomMutation(async (couponId: string) => {
      return api.coupon().deleteCoupon(couponId);
    }, 'createCoupon');
  // return
  return {
    createCoupon,
    createResult,
    updateCoupon,
    updateResult,
    deleteCoupon,
    deleteResult,
  };
};
