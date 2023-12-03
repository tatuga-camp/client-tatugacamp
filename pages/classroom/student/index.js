import React from 'react';

function Index() {
  return <div></div>;
}

export default Index;

export async function getServerSideProps(context) {
  const query = context.query;
  return {
    redirect: {
      permanent: false,
      destination: `${process.env.NEXT_PUBLIC_CLIENT_STUDENT_URL}/classroom/student?classroomCode=${query?.classroomCode}`,
    },
  };
}
