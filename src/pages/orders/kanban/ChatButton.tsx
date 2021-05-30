import { Button, ButtonProps, Text } from '@chakra-ui/react';
import { ReactComponent as ChatIcon } from 'common/img/chat.svg';
import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import { t } from 'utils/i18n';

const MotionButton = motion<ButtonProps>(Button);

interface ChatButtonProps {
  isNewMessage: boolean;
}

export const ChatButton = ({ isNewMessage }: ChatButtonProps) => {
  const controls = useAnimation();

  React.useEffect(() => {
    if (isNewMessage) {
      controls.start({
        scale: [1, 1.06, 1.06, 1, 1],
        transition: {
          duration: 1,
          ease: 'easeInOut',
          times: [0, 0.2, 0.2, 0.8, 1],
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 0.8,
        },
      });
    } else {
      controls.stop();
    }
  }, [isNewMessage, controls]);

  return (
    <MotionButton
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
