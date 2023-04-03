import { Business, WithId } from '@appjusto/types';
import { useToast } from '@chakra-ui/react';
import { CustomToastAutoPlay } from 'common/components/CustomToast';
import React from 'react';

export const useCustomToastAutoPlay = (business?: WithId<Business> | null) => {
  const toast = useToast();
  React.useEffect(() => {
    if (business?.situation !== 'approved' || business?.status !== 'available')
      return;
    setTimeout(() => {
      const root = document.getElementById('root');
      let audio = document.createElement('audio');
      audio.setAttribute('id', 'audio-to-test');
      root?.appendChild(audio);
      audio
        .play()
        .then(() => console.log('Play success'))
        .catch((err) => {
          const isInteractionError = err.message.includes('user');
          if (isInteractionError && !toast.isActive('AutoPlayToast')) {
            toast({
              id: 'AutoPlayToast',
              duration: null,
              render: () => <CustomToastAutoPlay />,
            });
          }
        });
      audio.remove();
    }, 2000);
  }, [toast, business?.situation, business?.status]);
};
