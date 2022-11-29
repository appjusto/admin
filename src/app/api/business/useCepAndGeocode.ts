import { BusinessAddress } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { fetchCEPInfo } from 'core/api/thirdparty/viacep';
import { isEqual, omit } from 'lodash';
import React from 'react';
import { useQuery } from 'react-query';

export const useCepAndGeocode = (
  savedAddress: BusinessAddress | undefined,
  stateAddress: BusinessAddress
) => {
  // context
  const api = useContextApi();
  // state
  const [geocodingQueryStatus, setGeocodingQueryStatus] = React.useState(false);
  // helpers
  let shouldFetchNewData = true;
  const partialSavedAddress = omit(savedAddress, 'latlng');
  if (isEqual(partialSavedAddress, stateAddress)) {
    console.log('Retrive saved address data');
    shouldFetchNewData = false;
  }
  // args
  const { cep, address, number, neighborhood, city, state } = stateAddress;
  // cep
  const { data: cepResult } = useQuery(
    ['cep', cep],
    () => {
      if (!stateAddress) return;
      if (shouldFetchNewData) return fetchCEPInfo(cep);
      else return null;
    },
    {
      enabled: cep.length === 8,
    }
  );
  // geocoding
  const geocode = () => {
    if (!stateAddress) return;
    if (!number) return;
    if (shouldFetchNewData) {
      console.log('Fetching new data');
      return api
        .maps()
        .googleGeocode(
          `${address}, ${number}, ${neighborhood} - ${city} - ${state}`
        );
    } else return savedAddress!.latlng;
  };
  const { data: geocodingResult } = useQuery(
    ['geocoding', address, number, neighborhood, city, state],
    geocode,
    {
      enabled: geocodingQueryStatus,
    }
  );
  // side effects
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (address?.length > 0 && number!.length > 0) {
      timeout = setTimeout(() => {
        setGeocodingQueryStatus(true);
      }, 1500);
    } else {
      setGeocodingQueryStatus(false);
    }
    return () => clearTimeout(timeout);
  }, [address, number]);
  // result
  return { cepResult, geocodingResult };
};
