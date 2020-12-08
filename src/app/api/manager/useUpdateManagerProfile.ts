import { useApi } from "app/state/api/context";
import { useContextManagerProfile } from "app/state/manager/context";
import { ManagerProfile } from "appjusto-types";
import { useMutation } from "react-query";

export const useUpdateManagerProfile = () => {
  // context
  const api = useApi();
  const profile = useContextManagerProfile();

  // mutations
  const [updateProfile, updateResult] = useMutation(async (changes: Partial<ManagerProfile>) =>
    api.manager().updateProfile(profile?.id!, changes)
  );

  // return
  return { updateProfile, updateResult };
}