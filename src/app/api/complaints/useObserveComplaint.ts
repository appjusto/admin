import { Complaint, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveComplaint = (complaintId?: string) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('complaints');
  // state
  const [complaint, setComplaint] = React.useState<WithId<Complaint> | null>();
  // mutations
  const { mutate: updateComplaint, mutationResult: updateComplaintResult } =
    useCustomMutation(
      (data: Partial<Complaint>) =>
        api.complaints().updateComplaint(complaintId!, data),
      'updateComplaint'
    );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!complaintId) return;
    const unsub = api.complaints().observeComplaint(complaintId, setComplaint);
    return () => unsub();
  }, [api, userCanRead, complaintId]);
  // return
  return {
    complaint,
    updateComplaint,
    updateComplaintResult,
  };
};
