import { Card, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useFetchCardsByAccountId = (accountId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('cards');
  // state
  const [cards, setCards] = React.useState<WithId<Card>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (accountId === undefined) return;
    if (accountId === null) {
      setCards(null);
      return;
    }
    (async () => {
      const cardsData = await api.cards().fetchCardsByAccountId(accountId);
      setCards(cardsData);
    })();
  }, [api, userCanRead, accountId]);
  // return
  return cards;
};
