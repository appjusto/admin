import axios from 'axios';
//import marked from 'marked';
import React from 'react';
import { useQuery } from 'react-query';

export const useTerms = () => {
  // state
  const [unformattedTerms, setUnformattedTerms] = React.useState<string | null>();
  // helpers
  const url =
    'https://raw.githubusercontent.com/appjusto/docs/main/legal/compromissos-restaurantes.md';
  // queries
  const query = useQuery(['terms'], () => axios.get<string>(url));
  // side effects
  React.useEffect(() => {
    if (query.data?.data) setUnformattedTerms(query.data.data);
    else if (query.isError) setUnformattedTerms(null);
  }, [query]);
  // result
  return unformattedTerms;
};
