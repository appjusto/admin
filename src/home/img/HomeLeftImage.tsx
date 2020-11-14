import { Image } from '@chakra-ui/react';
import React from 'react';
import image from './home-left@2x.jpg';

export default function HomeLeftImage() {
  return <Image src={image} objectFit="contain" alt="" />;
}
