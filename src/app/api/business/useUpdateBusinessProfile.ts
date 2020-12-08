import { useApi } from "app/state/api/context";
import { useContextBusiness } from "app/state/business/context";
import { Business } from "appjusto-types";
import { useMutation } from "react-query";

export const useUpdateBusinessProfile = () => {
  // context
  const api = useApi();
  const business = useContextBusiness();

  // mutations
  const [updateBusinessProfile, updateResult] = useMutation(async (changes: Partial<Business>) =>
    api.business().updateBusinessProfile(business?.id!, changes)
  );

  // return
  return { updateBusinessProfile, updateResult };
}