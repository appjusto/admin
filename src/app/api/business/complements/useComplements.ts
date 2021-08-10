import { WithId } from 'appjusto-types';
import { Complement, ComplementGroup } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useContextApi } from '../../../state/api/context';

export const useComplements = (businessId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  // groups
  const [createComplementsGroup, createGroupResult] = useMutation(async (data: ComplementGroup) =>
    api.business().createComplementsGroup2(businessId!, data)
  );
  const [
    updateComplementsGroup,
    updateGroupResult,
  ] = useMutation(async (data: WithId<ComplementGroup>) =>
    api.business().updateComplementsGroup2(businessId!, data.id, data)
  );
  const [deleteComplementsGroup, deleteGroupResult] = useMutation(async (groupId: string) =>
    api.business().deleteComplementsGroup2(businessId!, groupId)
  );
  // complements
  const [
    createComplement,
    createComplementResult,
  ] = useMutation(async (data: { item: Complement; imageFile?: File | null }) =>
    api.business().createComplement2(businessId!, data.item, data.imageFile)
  );
  const [
    updateComplement,
    updateComplementResult,
  ] = useMutation(async (data: { item: WithId<Complement>; imageFile?: File | null }) =>
    api.business().updateComplement2(businessId!, data.item.id, data.item, data.imageFile)
  );
  const [deleteComplement, deleteComplementResult] = useMutation(async (complementId: string) =>
    api.business().deleteComplement2(businessId!, complementId)
  );
  // return
  return {
    createComplementsGroup,
    createGroupResult,
    updateComplementsGroup,
    updateGroupResult,
    deleteComplementsGroup,
    deleteGroupResult,
    createComplement,
    createComplementResult,
    updateComplement,
    updateComplementResult,
    deleteComplement,
    deleteComplementResult,
  };
};
