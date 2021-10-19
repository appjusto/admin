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
        setIssues(
          data.sort((a, b) => {
            if (!a.order || !b.order) return 1;
            if (a.order < b.order) return -1;
            else return 1;
          })
        );
      } catch (error) {
        Sentry.captureException({ name: 'useIssuesByType', error });
        setIssues(null);
      }
    })();
  }, [types, api]);
  // return
  return issues;
};
