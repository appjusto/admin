import { LatLng, QueryGoogleMapsPayload } from '@appjusto/types';
import FirebaseRefs from 'app/api/FirebaseRefs';

export default class MapsApi {
  constructor(private refs: FirebaseRefs, private googleMapsApiKey?: string) {}
  async googleGeocode(address: string): Promise<LatLng | null> {
    const payload: QueryGoogleMapsPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      flavor: 'business',
      operation: 'geocode',
      address,
    };
    const result = await this.refs.getQueryGoogleMapsCallable()(payload);
    return (result.data as unknown) as LatLng | null;
  }
}
