import { SearchResponse } from '@algolia/client-search';
import { useContextSearchApi } from 'app/state/search/context';
import { debounce } from 'lodash';
import React from 'react';
import { queryLimit } from '../utils';
import { BusinessesFilter, SearchKind } from './types';

export const useBusinessesSearch = <T extends object>(
  enabled: boolean,
  kind: SearchKind,
  filters: BusinessesFilter[],
  soughtValue?: string,
  hitsPerPage: number = queryLimit
) => {
  // context
  const api = useContextSearchApi();
  // state
  const [response, setResponse] = React.useState<SearchResponse<T>>();
  const [results, setResults] = React.useState<T[]>();
  const [isLoading, setLoading] = React.useState(false);
  // helpers
  const search = React.useCallback(
    (input: string, filters: BusinessesFilter[], page?: number) => {
      (async () => {
        setLoading(true);
        const data = await api.businessSearch(kind, filters, input, page, hitsPerPage);
        setResponse(data as SearchResponse<T>);
        setLoading(false);
      })();
    },
    [api, kind, hitsPerPage]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    debounce<(input: string, filters: BusinessesFilter[], page?: number) => void>(search, 500),
    [search]
  );

  const refetch = () => {
    search(soughtValue!, filters);
  };
  // side effects
  // debounce search when search input changes
  React.useEffect(() => {
    if (!enabled) return;
    if (soughtValue === undefined) return;
    debouncedSearch(soughtValue, filters);
  }, [enabled, soughtValue, debouncedSearch, filters]);
  // update results when response changes
  React.useEffect(() => {
    if (!response) return;
    const hits = response.hits;
    if (response.page === 0) setResults(hits);
    else setResults([...(results ?? []), ...hits]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  // result
  const fetchNextPage = React.useCallback(() => {
    if (soughtValue === undefined) return;
    if (!response) return;
    const hasNextPage = response.page + 1 < response.nbPages;
    if (hasNextPage) debouncedSearch(soughtValue, filters, response.page + 1);
  }, [soughtValue, response, debouncedSearch, filters]);

  return { results, isLoading, fetchNextPage, refetch };
};
