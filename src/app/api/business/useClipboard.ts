import React from 'react';

export const useClipboard = () => {
  // state
  const [isCopied, setIsCopied] = React.useState(false);
  // handlers
  const copyToClipboard = (text: string) => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 500);
    return navigator.clipboard.writeText(text);
  };
  // result
  return { copyToClipboard, isCopied };
};
