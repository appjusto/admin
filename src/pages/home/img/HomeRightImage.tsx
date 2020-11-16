import { Image } from '@chakra-ui/react';
import React from 'react';
import image from './home-right@2x.jpg';

export default function HomeRightImage() {
  return <Image src={image} objectFit="contain" alt="" />;
}
