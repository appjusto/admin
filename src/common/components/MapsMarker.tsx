import pin from '../img/iconPin.svg';
import Image from './Image';

interface MarkerProps {
  lat: number;
  lng: number;
  icon?: string;
  w?: string | number;
  h?: string | number;
  mt?: string;
  ml?: string;
}

export const Marker = ({
  icon = pin,
  w = '32px',
  h = '40px',
  mt = '-26px',
  ml = '-17px',
  ...props
}: MarkerProps) => {
  return <Image src={icon} w={w} h={h} mt={mt} ml={ml} />;
};
