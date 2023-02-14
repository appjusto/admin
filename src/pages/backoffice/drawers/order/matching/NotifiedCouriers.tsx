import { Box } from '@chakra-ui/react';
import React from 'react';

interface NotifiedCouriersProps {
  fetchNextOrderNotifiedCouriers?: () => void;
  children: React.ReactNode;
}

export const NotifiedCouriers = ({
  fetchNextOrderNotifiedCouriers,
  children,
}: NotifiedCouriersProps) => {
  // refs
  const listRef = React.useRef<HTMLDivElement>(null);
  // side effects
  React.useEffect(() => {
    if (!listRef.current || !fetchNextOrderNotifiedCouriers) return;
    const handleScrollTop = () => {
      if (listRef.current) {
        let shouldLoad =
          listRef.current.scrollHeight - listRef.current.scrollTop < 350;
        if (shouldLoad) {
          fetchNextOrderNotifiedCouriers();
        }
      }
    };
    listRef.current.addEventListener('scroll', handleScrollTop);
    return () => document.removeEventListener('scroll', handleScrollTop);
  }, [listRef, fetchNextOrderNotifiedCouriers]);
  // UI
  return (
    <Box
      ref={listRef}
      mt="4"
      p="2"
      minH="200px"
      maxH="300px"
      overflowY="scroll"
      border="1px solid #ECF0E3"
      borderRadius="lg"
    >
      {children}
    </Box>
  );
};
