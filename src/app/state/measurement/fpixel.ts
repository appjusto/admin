export const fbqPageView = () => {
  try {
    // @ts-ignore
    window.fbq('track', 'PageView');
  } catch (error) {
    console.log('fbq PageView error: ', error);
  }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const fbqTrackEvent = (name: string, options: object = {}) => {
  try {
    // @ts-ignore
    window.fbq('track', name, options);
  } catch (error) {
    console.log('fbq track error: ', error);
  }
};

export const fbqConsent = (action: 'grant' | 'revoke') => {
  try {
    // @ts-ignore
    window.fbq('consent', action);
  } catch (error) {
    console.log('fbq consent error: ', error);
  }
};
