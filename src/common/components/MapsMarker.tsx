import pin from '../img/iconPin.svg';
import Image from './Image';

interface MarkerProps {
  lat: number;
  lng: number;
}

export const Marker = ({ ...props }: MarkerProps) => {
  return <Image src={pin} w="32px" h="40px" mt="-26px" ml="-17px" />;
};
