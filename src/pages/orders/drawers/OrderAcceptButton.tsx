import { Button, ButtonProps } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { ControlsAnimationDefinition } from 'framer-motion/types/animation/types';
import React from 'react';

const MotionButton = motion<ButtonProps>(Button);

const animation = {
  translateY: [-3, -6, 0],
  transition: {
    duration: 1,
    ease: 'easeInOut',
    times: [0.1, 0.1, 0.4],
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 0.8,
  },
} as ControlsAnimationDefinition;

interface OrderAcceptButtonProps {
  onClick(): void;
  children: any;
}

export const OrderAcceptButton = ({ onClick, children }: OrderAcceptButtonProps) => {
  // context
  const controls = useAnimation();
  //side effects
  React.useEffect(() => {
    controls.start(animation);
    return controls.stop;
  }, [controls]);
  // UI
  return (
    <MotionButton layout fontSize="20px" animate={controls} onClick={onClick}>
      {children}
    </MotionButton>
  );
};
