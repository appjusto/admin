import { Button, ButtonProps, Text } from '@chakra-ui/react';
import { ReactComponent as ChatIcon } from 'common/img/chat.svg';
import { motion, useAnimation } from 'framer-motion';
import { ControlsAnimationDefinition } from 'framer-motion/types/animation/types';
import React from 'react';
import { t } from 'utils/i18n';

const MotionButton = motion<ButtonProps>(Button);

interface ChatButtonProps {
  isNewMessage: boolean;
}

const animation = {
  translateY: [-3, -5, 0, -1, 0],
  transition: {
    duration: 1,
    ease: 'easeInOut',
    times: [0.1, 0.1, 2, 0.2, 2],
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 0.8,
  },
} as ControlsAnimationDefinition;

export const ChatButton = ({ isNewMessage }: ChatButtonProps) => {
  // context
  const controls = useAnimation();
  //side effects
  React.useEffect(() => {
    if (isNewMessage) {
      setTimeout(() => controls.start(animation), 1000);
    } else {
      controls.stop();
    }
    return controls.stop;
  }, [isNewMessage, controls]);
  // UI
  return (
    <MotionButton
      layout
      bg={isNewMessage ? '#FFBE00' : 'white'}
      variant="outline"
      minW="100px"
      height="60px"
      borderColor="black"
      fontWeight="700"
      color="black"
      animate={controls}
    >
      <ChatIcon />
      <Text ml="4">{t('Chat')}</Text>
    </MotionButton>
  );
};
