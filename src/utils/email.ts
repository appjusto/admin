const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const COMMONLY_EMAIL_TYPOS = ['gnail.com', 'gamil.com'];

export const isEmailValid = (email: string) => {
  const match = EMAIL_REGEX.exec(email);
  if (!match) return false;
  const domain = match[5];
  const domSplit = domain.split('.');
  const commercial = domSplit[1];
  const country = domSplit[2];
  if (domSplit.length < 2 || domSplit.length > 3) return false;
  if (commercial && commercial.length !== 3) return false;
  if (country && country.length > 2) return false;
  if (COMMONLY_EMAIL_TYPOS.includes(domain)) return false;
  return true;
};
