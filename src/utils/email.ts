const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const DOMAIN_REGEX = /.com\w/;
const COMMONLY_EMAIL_TYPOS = ['gnail.com', 'gamil.com'];

export const isEmailValid = (email: string) => {
  const match = EMAIL_REGEX.exec(email);
  if (!match) return false;
  const domain = match[5];
  if (domain.endsWith('.com.com')) return false;
  if (DOMAIN_REGEX.test(domain)) return false;
  if (COMMONLY_EMAIL_TYPOS.includes(domain)) return false;
  return true;
};
