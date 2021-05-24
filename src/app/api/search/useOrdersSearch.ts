import { SearchResponse } from '@algolia/client-search';
import { useContextSearchApi } from 'app/state/search/context';
import { OrderStatus, OrderType } from 'appjusto-types';
import { debounce } from 'lodash';
import React from 'react';
import { SearchKind } from './types';

export const useOrdersSearch = <T extends object>(
  enabled: boolean,
  kind: SearchKind,
  typeFilter: OrderType,
  businessId?: string,
  statusFilters?: OrderStatus,
  dateFilter?: number[],
  soughtValue?: string,
  hitsPerPage: number = 20
) => {
  // context
  const api = useContextSearchApi();
  // state
  const [response, setResponse] = React.useState<SearchResponse<T>>();
  const [results, setResults] = React.useState<T[]>();
  const [isLoading, setLoading] = React.useState(false);
  // helpers
  const search = React.useCallback(
    (
      input: string,
      typeFilter: OrderType,
      businessId?: string,
      statusFilters?: OrderStatus,
      dateFilter?: number[],
      page?: number
    ) => {
      (async () => {
        setLoading(true);
        setResponse(
          await api.ordersSearch(
            kind,
            typeFilter,
            businessId,
            statusFilters,
            dateFilter,
            input,
            page,
            hitsPerPage
          )
        );
        setLoading(false);
      })();
    },
    [api, kind, hitsPerPage]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    debounce<
      (
        input: string,
        typeFilter: OrderType,
        businessId?: string,
        statusFilters?: OrderStatus,
        dateFilter?: number[],
        page?: number
      ) => void
    >(search, 500),
    [search]
  );

  const refetch = () => {
    search(soughtValue!, typeFilter, businessId);
  };
  // side effects
  // debounce search when search input changes
  React.useEffect(() => {
    if (!enabled) return;
    if (soughtValue === undefined) return;
    debouncedSearch(soughtValue, typeFilter, businessId, statusFilters, dateFilter);
  }, [enabled, soughtValue, debouncedSearch, typeFilter, businessId, statusFilters, dateFilter]);
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
    if (hasNextPage)
      debouncedSearch(
        soughtValue,
        typeFilter,
        businessId,
        statusFilters,
        dateFilter,
        response.page + 1
      );
  }, [soughtValue, response, debouncedSearch, typeFilter, businessId, statusFilters, dateFilter]);

  return { results, isLoading, fetchNextPage, refetch };
};
