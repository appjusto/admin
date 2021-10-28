import { useContextApi } from 'app/state/api/context';
import { User, WithId } from 'appjusto-types';
import React from 'react';
import { UserType, UsersSearchType } from './UsersApi';
import { uniqWith, isEqual } from 'lodash';
import dayjs from 'dayjs';
import firebase from 'firebase/app';

export const useObserveUsers = (
  loggedAt: UserType[],
  searchType?: UsersSearchType,
  search?: string,
  isBlocked?: boolean,
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  // state
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
    setStartAfter(undefined);
  }, [loggedAt, searchType, search, isBlocked, start, end]);
  React.useEffect(() => {
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.users().observeUsers(
      (results, last) => {
        if (!startAfter) setUsers(results);
        else
          setUsers((prev) => {
            if (prev) {
              const union = [...prev, ...results];
              return uniqWith(union, isEqual);
            }
            return results;
          });
        setLastUser(last);
      },
      loggedAt,
      searchType,
      search,
      isBlocked,
      startDate,
      endDate
    );
    return () => unsub();
  }, [api, startAfter, loggedAt, searchType, search, isBlocked, start, end]);
  // return
  return { users, fetchNextPage };
};
