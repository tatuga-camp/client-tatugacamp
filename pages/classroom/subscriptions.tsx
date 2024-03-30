import React, { useEffect, useState } from "react";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import { parseCookies } from "nookies";
import { FcCheckmark } from "react-icons/fc";
import Head from "next/head";
import { useRouter } from "next/router";
import { Switch } from "@headlessui/react";
import Image from "next/image";
import TatugaClassLayout from "../../layouts/tatugaClassLayout";
import { User } from "../../models";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetUserCookieService } from "../../services/user";
import {
  MenubarsMain,
  sideMenusEnglish,
  sideMenusThai,
} from "../../data/menubarsMain";
import { ProtalSessionService } from "../../services/stripe-api/portal-session";

function Subscriptions({ user, error }: { user: User; error: any }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const tiers = [
    {
      title: `${
        user?.language === "Thai" || error
          ? "สมาชิกฟรี"
          : user?.language === "English" && "Free plan"
      }`,
      price: "0",
      description: [
        `${
          user?.language === "Thai" || error
            ? "สร้างห้องเรียนได้ไม่เกิน 5 ห้อง"
            : user?.language === "English" && "Only 5 classrooms can be created"
        }`,
        `${
          user?.language === "Thai" || error
            ? "ใช้ระบบพื้นฐานได้เต็มที่"
            : user?.language === "English" && "Can use all basic features"
        }`,
        `${
          user?.language === "Thai" || error
            ? "สามารถเก็บงานได้อย่างไม่จำกัด"
            : user?.language === "English" && "Unlimited storage"
        }`,
        `${
          user?.language === "Thai" || error
            ? "มีโฆษณา"
            : user?.language === "English" && "Ads show"
        }`,
      ],
      buttonText: `${
        user?.language === "Thai" || error
          ? "สมัครเลย"
          : user?.language === "English" && "sign up"
      }`,
      buttonVariant: "outlined",
    },
    {
      title: `${
        user?.language === "Thai" || error
          ? "สมาชิกพรีเมี่ยม"
          : user?.language === "English" && "Tatuga Premium"
      }`,
      subheader: "Unlimited",
      price: enabled ? 899 : 120,
      description: [
        `${
          user?.language === "Thai" || error
            ? "สร้างห้องเรียนไม่จำกัด"
            : user?.language === "English" && "create classroom unlimitedly"
        }`,
        `${
          user?.language === "Thai" || error
            ? "ใช้ระบบพื้นฐานได้เต็มที่"
            : user?.language === "English" && "Can use all basic features"
        }`,
        `${
          user?.language === "Thai" || error
            ? "สามารถเก็บงานได้อย่างไม่จำกัด"
            : user?.language === "English" && "Unlimited storage"
        }`,
        `${
          user?.language === "Thai" || error
            ? "ลบห้องเรียนได้"
            : user?.language === "English" && "Be able to delete classroom"
        }`,
        `${
          user?.language === "Thai" || error
            ? "ไม่มีโฆษณา"
            : user?.language === "English" && "No Ads"
        }`,
      ],
      buttonText: `${
        user?.language === "Thai" || error
          ? "สมัครเลย"
          : user?.language === "English" && "sign up"
      }`,
      buttonVariant: "contained",
    },
  ];

  const handlePortalSession = async () => {
    try {
      setLoading(true);
      const url = await ProtalSessionService();
      window.location.href = url;
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleCreateCheckOutPremium = async () => {
    if (enabled) {
      router.push({
        pathname: "/payment",
        query: {
          priceId: process.env.NEXT_PUBLIC_TATUGA_PREMIUM_PRICEID_YEARLY,
        },
      });
    } else if (!enabled) {
      router.push({
        pathname: "/payment",
        query: {
          priceId: process.env.NEXT_PUBLIC_TATUGA_PREMIUM_PRICEID,
        },
      });
    }
  };
  return (
    <div className="bg-gradient-to-t h-full lg:h-full md:h-screen from-blue-300 to-orange-100">
      <Head>
        <meta property="og:title" content={`TaTuga class subscription`} />
        <meta
          property="og:description"
          content="ห้องเรีัยน tatuga จาก tatuga camp - subscription"
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/354944872_237734125682158_5700489566341228938_n.jpg"
        />
        <meta
          property="og:image:secure_url"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/354944872_237734125682158_5700489566341228938_n.jpg"
        />
        <meta
          name="twitter:image:src"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/354944872_237734125682158_5700489566341228938_n.jpg"
        />
        <meta
          name="keywords"
          content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for 
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, `}
        />

        <meta
          name="description"
          content="ห้องเรียนจาก Tatuga camp ที่จะพาคุณครูไปสู่การบริหารห้องเรียนอย่างสะดวกและสนุก กับ tatuga class"
        />
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
        <title>subscription</title>
      </Head>
      <TatugaClassLayout
        user={user}
        sideMenus={user?.language === "Thai" ? sideMenusThai : sideMenusEnglish}
      >
        <GlobalStyles
          styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
        />
        <CssBaseline />

        {/* Hero unit */}
        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          className="w-full"
          sx={{ pt: 10, pb: 6 }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            className="font-Poppins font-bold  "
          >
            pricing
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            className="flex justify-center"
          >
            <div className="w-3/4 md:w-full">
              {user?.language === "Thai"
                ? "มาจัดการชั้นเรียนกับ tatuga class สะดวก สบาย และมีประสิทธิภาพ"
                : "Let's create you classroom with tatuga class!"}
            </div>
          </Typography>
        </Container>
        <div className="w-full flex justify-center gap-5">
          <div className="w-40 h-14 bg-white relative">
            <Image
              src="/images/logo/prompt-pay-logo.png"
              fill
              alt="image of logo propmt pay"
              className="object-contain"
            />
          </div>
        </div>
        <div className="w-full flex justify-center py-10 flex-col items-center gap-2 font-Kanit">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${enabled ? "bg-teal-900" : "bg-teal-700"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ring-black focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span
              aria-hidden="true"
              className={`${enabled ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          {enabled ? (
            <span className="font-bold text-xl">
              {user?.language === "Thai"
                ? "รายปี"
                : user?.language === "English" && "Yearly"}
            </span>
          ) : (
            <span className="font-bold text-xl">
              {user?.language === "Thai"
                ? "รายเดือน"
                : user?.language === "English" && "Monthly"}
            </span>
          )}
          <span className="font-bold text-xl">
            {enabled && error ? "รายปี" : !enabled && error && "รายเดือน"}
          </span>
        </div>
        <section
          className="w-full flex flex-col items-center pb-10 md:px-10 lg:px-0 md:flex-row md:gap-5 
         justify-center gap-10 font-Kanit"
        >
          {tiers.map((tire, index) => {
            return (
              <div
                key={index}
                className={`w-max bg-white md:w-60 lg:w-max ring-2 ring-blue-500 rounded-xl md:p-2 lg:p-5 p-5 drop-shadow-md 
                ${
                  index === 1 || index === 2
                    ? "hover:scale-110 transition duration-100"
                    : ""
                }`}
              >
                <div className="w-full flex flex-col justify-center items-center">
                  <span
                    className={`lg:text-3xl md:text-xl font-bold ${
                      index === 0 ? "text-gray-500" : "text-blue-500"
                    } `}
                  >
                    {tire.title}
                  </span>
                  {tire.subheader && (
                    <span className="w-max text-sm md:text-xs h-max p-1 rounded-md text-white bg-orange-400">
                      {tire.subheader}
                    </span>
                  )}
                </div>
                <div className="flex justify-center mt-3 items-end">
                  <span className="font-bold lg:text-8xl md:text-3xl">
                    {tire.price.toLocaleString()}
                  </span>
                  {enabled
                    ? user?.language === "Thai"
                      ? "บาท/ปี"
                      : user?.language === "English" && "yearly"
                    : user?.language === "Thai"
                    ? "บาท/เดือน"
                    : user?.language === "English" && "monthly"}
                  {enabled && error
                    ? "บาท/ปี"
                    : !enabled && error && "บาท/เดือน"}
                </div>
                <ul className="pl-0 flex flex-col gap-2 mt-5">
                  {tire.description.map((description, index) => {
                    return (
                      <li key={index} className="flex gap-2 text-sm">
                        <div
                          className="lg:w-5 lg:h-5 md:w-3 md:h-3 bg-green-200 rounded-full 
                        flex justify-center items-center md:text-base  "
                        >
                          <FcCheckmark />
                        </div>
                        {description}
                      </li>
                    );
                  })}
                </ul>
                {(index === 1 || index === 2) && (
                  <div className="w-full flex justify-center ">
                    {user?.plan === "TATUGA-STARTER" &&
                      user?.subscriptions === "active" &&
                      index === 1 && (
                        <div className="mt-5 bg-gray-400 text-white px-10 py-3  transition duration-150 rounded-3xl">
                          {user?.language === "Thai"
                            ? "คุณได้สมัครสมาชิกแล้ว"
                            : user?.language === "English" &&
                              "You are already a memeber"}
                        </div>
                      )}
                    {user?.plan === "TATUGA-STARTER" &&
                      user?.subscriptions === "active" &&
                      index === 2 && (
                        <button
                          onClick={handleCreateCheckOutPremium}
                          className="mt-5 bg-blue-400 text-white px-10 py-3 hover:bg-orange-500 transition duration-150 rounded-3xl"
                        >
                          {user?.language === "Thai"
                            ? "ย้ายมาพรีเมี่ยม"
                            : user?.language === "English" && "MOVE TO PREMIUM"}
                        </button>
                      )}

                    {user?.plan === "TATUGA-PREMIUM" &&
                      user?.subscriptions === "active" &&
                      index === 1 &&
                      (loading ? (
                        <button className="mt-5 bg-blue-400 animate-pulse text-white px-10 py-3 hover:bg-orange-500 transition duration-150 rounded-3xl">
                          {user?.language === "Thai"
                            ? "กำลังนำคุณไปยังหน้าสมาชิก.."
                            : user?.language === "English" &&
                              "Redirecting you to the member page.."}
                        </button>
                      ) : (
                        <button
                          onClick={handlePortalSession}
                          className="mt-5 bg-blue-400 text-white px-10 py-3 hover:bg-orange-500 transition duration-150 rounded-3xl"
                        >
                          {user?.language === "Thai"
                            ? "คุณได้สมัครสมาชิกแล้ว"
                            : user?.language === "English" &&
                              "You are already a memeber"}
                        </button>
                      ))}
                    {(user?.plan === "FREE" ||
                      user?.subscriptions !== "active") && (
                      <button
                        onClick={() => {
                          if (index === 1) {
                            handleCreateCheckOutPremium();
                          }
                        }}
                        className="mt-5 bg-blue-400 text-white px-10 py-3 hover:bg-orange-500 transition duration-150 rounded-3xl"
                      >
                        {error && "กรุณาล็อคอินก่อน"}
                        {user?.language === "Thai"
                          ? "สมัครเลย"
                          : user?.language === "English" && "register now"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
        {/* End hero unit */}

        {/* Footer */}
      </TatugaClassLayout>
      {/* End footer */}
    </div>
  );
}

export default Subscriptions;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const cookies = parseCookies(ctx);
  const accessToken = cookies.access_token;
  if (accessToken) {
    try {
      const userData = await GetUserCookieService({
        access_token: accessToken,
      });
      const user = userData;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  } else {
    return {
      props: {
        error: {
          statusCode: 401,
          message: "unauthorized",
        },
      },
    };
  }
};
