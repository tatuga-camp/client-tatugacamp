import Link from 'next/link';
import { useEffect, useState } from 'react';

const AdBannerStudent = (props) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="w-full">
      <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: 'block',
          overflow: 'hidden',
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        {...props}
      />
    </div>
  );
};

export default AdBannerStudent;
