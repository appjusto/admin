import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';

export const useImportMenu = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: importMenu, mutationResult: importMenuResult } =
    useCustomMutation(
      async (data: { url: string; discount: number }) =>
        api.business().importMenu(businessId!, data.url, data.discount),
      'importMenu'
    );
  // result
  return {
    importMenu,
    importMenuResult,
  };
};
