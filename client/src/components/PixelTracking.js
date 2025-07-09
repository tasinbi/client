import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PixelTracking = ({ facebookPixelId, googleAnalyticsId }) => {
  const location = useLocation();

  useEffect(() => {
    // Facebook Pixel
    if (facebookPixelId && window.fbq) {
      window.fbq('track', 'PageView');
    }

    // Google Analytics
    if (googleAnalyticsId && window.gtag) {
      window.gtag('config', googleAnalyticsId, {
        page_path: location.pathname,
      });
    }
  }, [location, facebookPixelId, googleAnalyticsId]);

  // Initialize Facebook Pixel
  useEffect(() => {
    if (facebookPixelId) {
      // Facebook Pixel Code
      (function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)})(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      window.fbq('init', facebookPixelId);
      window.fbq('track', 'PageView');
    }
  }, [facebookPixelId]);

  // Initialize Google Analytics
  useEffect(() => {
    if (googleAnalyticsId) {
      // Google Analytics Code
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', googleAnalyticsId);
      };
    }
  }, [googleAnalyticsId]);

  return null;
};

export default PixelTracking; 