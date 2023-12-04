import React from 'react';

function Custom404() {
  return (
    <div className="w-screen h-screen flex items-center justify-center font-Kanit text-3xl">
      <h1>Page not found</h1>
    </div>
  );
}

export default Custom404;

export async function getStaticProps(ctx) {
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
}
