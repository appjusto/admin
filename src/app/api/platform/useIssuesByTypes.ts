import { useContextApi } from 'app/state/api/context';
import { WithId, Issue, IssueType } from 'appjusto-types';
import React from 'react';
import * as Sentry from '@sentry/react';

export const useIssuesByType = (types: IssueType[]) => {
  // context
  const api = useContextApi();
  // state
  const [issues, setIssues] = React.useState<WithId<Issue>[] | null>();

  // side effects
  React.useEffect(() => {
    (async () => {
      try {
        const data = await api.platform().fetchIssues(types);
        setIssues(data);
      } catch (error) {
        Sentry.captureException({ name: 'useIssuesByType', error });
        setIssues(null);
      }
    })();
  }, [types, api]);
  // return
  return issues;
};
