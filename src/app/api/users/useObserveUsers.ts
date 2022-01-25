import { useContextApi } from 'app/state/api/context';
import { User, UserType, WithId } from 'appjusto-types';
import React from 'react';
import { UsersSearchType } from './UsersApi';
import dayjs from 'dayjs';
import firebase from 'firebase/app';

const initialMap = new Map();

export const useObserveUsers = (
  loggedAt: UserType[],
  isBlocked: boolean,
  searchType?: UsersSearchType,
  search?: string,
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  // state
  const [usersMap, setUsersMap] = React.useState<Map<string | undefined, WithId<User>[]>>(
    initialMap
  );
  const [users, setUsers] = React.useState<WithId<User>[]>();
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastUser, setLastUser] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastUser);
  }, [lastUser]);
  // side effects
  React.useEffect(() => {
    if (start && !end) return;
    setUsersMap(initialMap);
    setStartAfter(undefined);
  }, [loggedAt, searchType, search, isBlocked, start, end]);
  React.useEffect(() => {
    let loggedFilter = loggedAt.length === 3 ? null : loggedAt;
    let textSearch = search && search.length > 8 ? search : null;
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.users().observeUsers(
      (results, last) => {
        setUsersMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastUser(last);
      },
      loggedFilter,
      isBlocked,
      searchType,
      textSearch,
      startDate,
      endDate,
      startAfter
    );
    return () => unsub();
  }, [api, startAfter, loggedAt, searchType, search, isBlocked, start, end]);
  React.useEffect(() => {
    setUsers(Array.from(usersMap.values()).reduce((result, orders) => [...result, ...orders], []));
  }, [usersMap]);
  // return
  return { users, fetchNextPage };
};
