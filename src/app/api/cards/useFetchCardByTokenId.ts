import { Card, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useFetchCardByTokenId = (cardTokenId?: string | null) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('cards');
  // state
  const [card, setCard] = React.useState<WithId<Card> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (cardTokenId === undefined) return;
    if (cardTokenId === null) {
      setCard(null);
      return;
    }
    (async () => {
      const cardData = await api.cards().fetchCardByTokenId(cardTokenId);
      setCard(cardData);
    })();
  }, [api, userCanRead, cardTokenId]);
  // return
  return card;
};
