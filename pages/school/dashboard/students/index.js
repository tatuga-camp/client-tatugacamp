import { parseCookies } from 'nookies';
import React from 'react';
import { GetUserCookie } from '../../../../service/user';

function Index() {
  return <div>Index</div>;
}

export default Index;
export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: 'unauthorized',
        },
      },
    };
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;

      if (user.role !== 'SCHOOL') {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: 'schoolUserOnly',
            },
          },
        };
      } else if (user.role === 'SCHOOL') {
        if (user?.schoolUser?.organization === 'school') {
          return {
            props: {
              user,
            },
          };
        } else if (user?.schoolUser?.organization === 'immigration') {
          return {
            redirect: {
              permanent: false,
              destination: '/school/dashboard-immigration',
            },
          };
        }
      }
    } catch (err) {
      console.log(err);
      return {
        props: {
          error: {
            statusCode: 401,
            message: 'unauthorized',
          },
        },
      };
    }
  }
}
