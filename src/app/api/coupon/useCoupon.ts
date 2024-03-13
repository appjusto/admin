import { Coupon } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useCoupon = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutateAsync: createCoupon, mutationResult: createResult } =
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
  const { mutateAsync: updateCoupon, mutationResult: updateResult } =
    useCustomMutation(
      async (data: { couponId: string; changes: Partial<Coupon> }) => {
        const { couponId, changes } = data;
        return api.coupon().updateCoupon(couponId, changes);
      },
      'createCoupon'
    );
  const { mutateAsync: deleteCoupon, mutationResult: deleteResult } =
    useCustomMutation(async (couponId: string) => {
      console.log(couponId);
      return api.coupon().deleteCoupon(couponId);
    }, 'deleteCoupon');
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
