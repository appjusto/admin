const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const DOMAIN_REGEX = /.com\w/;
const COMMONLY_EMAIL_TYPOS = [
  'gnail.com',
  'gamil.com',
  'gmil.com',
  'gail.com',
  'gmai.com',
  'gmail.com.br',
  'gemail.com',
  'gmail.xom',
  'outloo.com',
  'putlook.com',
  'hotrmail.com',
  'hormail.com',
  'hotmaio.com',
  'hotmil.com',
];

export const isEmailValid = (email: string) => {
  const match = EMAIL_REGEX.exec(email);
  if (!match) return false;
  const domain = match[5];
  if (domain.endsWith('.com.com') || domain.endsWith('.co') || domain.endsWith('.con'))
    return false;
  if (DOMAIN_REGEX.test(domain)) return false;
  if (COMMONLY_EMAIL_TYPOS.includes(domain)) return false;
  return true;
};

export const normalizeEmail = (email: string) => email.toLowerCase().replace('/', '');
