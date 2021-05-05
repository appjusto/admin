import { useContextApi } from 'app/state/api/context';
import { WithId, Issue, IssueType } from 'appjusto-types';
import React from 'react';

export const useOrderCancelOpts = (type: IssueType) => {
  // context
  const api = useContextApi();
  // state
  const [cancelOptions, setCancelOptions] = React.useState<WithId<Issue>[] | null>();

  // side effects
  React.useEffect(() => {
    (async () => {
      try {
        const options = await api.platform().fetchIssues(type);
        setCancelOptions(options);
      } catch (error) {
        console.log(`fetch ${type} Error`, error);
        setCancelOptions(null);
      }
    })();
  }, [type, api]);
  // return
  return cancelOptions;
};
