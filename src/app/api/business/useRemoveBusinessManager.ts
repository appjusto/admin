import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { useMutation } from 'react-query';

export const useRemoveBusinessManager = () => {
  // context
  const api = useContextApi();
  const { business } = useContextBusiness();
  // mutations
  const [removeBusinessManager, result] = useMutation(async (managerEmail: string) =>
    api.business().removeBusinessManager(business!, managerEmail)
  );
  // return
  return {
    removeBusinessManager,
    result,
  };
};
