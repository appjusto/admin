import { Image } from '@chakra-ui/react';
import React from 'react';
import image from './login-right@2x.jpg';

export default function LoginRightImage() {
  return <Image src={image} objectFit="contain" alt="" />;
}
