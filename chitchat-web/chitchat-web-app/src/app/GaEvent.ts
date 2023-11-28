import ReactGA from 'react-ga4';

const pageview = (pathname: any) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  ReactGA.send({
    hitType: 'pageview',
    page: pathname,
  });
};

export function logPageView(pathname: string) {
  pageview(pathname);
}

export function logSendMessageEvent(model_id: string) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  ReactGA.send({
    hitType: 'event',
    eventCategory: 'Message',
    eventAction: 'Send',
    eventLabel: model_id,
  });
}

export const initialize = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  ReactGA.initialize('G-6JVQ9GKBY2');
};

export const setGAUserId = (userId: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  ReactGA.gtag('set', 'user_properties', {
    user_id: userId,
  });
};
