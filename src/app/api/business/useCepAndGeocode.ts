import { BusinessAddress } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { fetchCEPInfo } from 'core/api/thirdparty/viacep';
import { isEqual, omit } from 'lodash';
import { useQuery } from 'react-query';

export const useCepAndGeocode = (
  savedAddress: BusinessAddress | undefined,
  stateAddress: BusinessAddress
) => {
  // context
  const api = useContextApi();
  // helpers
  let shouldFetchNewData = true;
  const partialSavedAddress = omit(savedAddress, 'latlng');
  if (isEqual(partialSavedAddress, stateAddress)) {
    console.log('Retrive savedAddress data...');
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
    if (shouldFetchNewData) {
      console.log('Fetching new data...');
      return api
        .maps()
        .googleGeocode(`${address}, ${number}, ${neighborhood} - ${city} - ${state}`);
    } else return savedAddress!.latlng;
  };
  const { data: geocodingResult } = useQuery(
    ['geocoding', address, number, neighborhood, city, state],
    geocode,
    {
      enabled: address?.length > 0 && number!.length > 0,
    }
  );
  // result
  return { cepResult, geocodingResult };
};
