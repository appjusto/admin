import { useContextApi } from 'app/state/api/context';
import { fetchCEPInfo } from 'core/api/thirdparty/viacep';
import { useQuery } from 'react-query';

export const useCepAndGeocode = (
  cep: string,
  address: string,
  number: string,
  neighborhood?: string,
  city?: string,
  state?: string
) => {
  // context
  const api = useContextApi();
  // cep
  const { data: cepResult } = useQuery(['cep', cep], () => fetchCEPInfo(cep), {
    enabled: cep.length === 8,
  });
  // geocoding
  const geocode = () =>
    api.maps().googleGeocode(`${address}, ${number}, ${neighborhood} - ${city} - ${state}`);
  const { data: geocodingResult } = useQuery(
    ['geocoding', address, number, neighborhood, city, state],
    geocode,
    {
      enabled: address?.length > 0 && number.length > 0,
    }
  );
  // result
  return { cepResult, geocodingResult };
};
