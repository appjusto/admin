import axios from 'axios';
//import marked from 'marked';
import React from 'react';
import { useQuery } from 'react-query';

export const useTerms = () => {
  // context
  const url =
    'https://raw.githubusercontent.com/appjusto/docs/main/legal/termos-de-uso-restaurantes.md';
  // state
  const [unformattedTerms, setUnformattedTerms] = React.useState<string | null>();
  //const [formattedTerms, setFormattedTerms] = React.useState<string | null>();

  // side effects
  const query = useQuery(['terms'], () => axios.get<string>(url));

  React.useEffect(() => {
    if (query.data?.data) setUnformattedTerms(query.data.data);
    else if (query.isError) setUnformattedTerms(null);
  }, [query]);

  /*React.useEffect(() => {
    if (unformattedTerms) setFormattedTerms(marked(unformattedTerms));
  }, [unformattedTerms]);*/
  // result
  return unformattedTerms;
};
