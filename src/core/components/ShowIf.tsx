import React from 'react';

export interface Props {
  test: boolean;
  children: () => React.ReactElement;
}

export const ShowIf = ({ test, children }: Props) => {
  if (test) return children();
  return null;
};
