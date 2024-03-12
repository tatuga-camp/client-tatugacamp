import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Image from "next/image";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { HiLanguage } from "react-icons/hi2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Head from "next/head";
import { MdNoAccounts, MdSubscriptions } from "react-icons/md";
import { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import {
  GetUserCookieService,
  GetUserService,
  UpdateUserService,
  UploadProfilePictureService,
} from "../../services/user";
import { User } from "../../models";
import TatugaClassLayout from "../../layouts/tatugaClassLayout";
import { sideMenusEnglish, sideMenusThai } from "../../data/menubarsMain";
import { ProtalSessionService } from "../../services/stripe-api/portal-session";
import Loading from "../../components/loadings/loading";

const options = ["Thai", "English"];
type SetUserData = {
  firstName: string;
  lastName: string;
  phone: string;
  school: string;
  picture: string;
  email: string;
  language?: "Thai" | "English";
};
function Setting({ userSideServer }: { userSideServer: User }) {
  const [languageValue, setLanguageValue] = React.useState(options[0]);
  const [inputLanguageValue, setInputLanguageValue] = React.useState("");
  const [userData, setUserData] = useState<SetUserData>({
    firstName: "",
    lastName: "",
    phone: "",
    school: "",
    picture: "",
    email: "",
    language: options[0] as "Thai",
  });
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService(),
  });
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(() => files[0]);
    }
  };

  //check auth wheter the sesstion is expire or not
  useEffect(() => {
    if (user.data) {
      setUserData(() => {
        return {
          firstName: user.data?.firstName as string,
          lastName: user.data?.lastName as string,
          school: user.data?.school as string,
          phone: user.data?.phone as string,
          email: user.data?.email as string,
          picture: user.data?.picture as string,
          language: user.data?.language as "Thai" | "English",
        };
      });
      setLanguageValue(() => user?.data?.language);
    }
  }, [user.isSuccess, user.isRefetching]);
  //handle summit file
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!file) {
        return Swal.fire({
          title: "No file chosen❗",
          html: "please select one image to be your avatar",
          icon: "error",
        });
      }
      const formData = new FormData();
      formData.append("file", file);
      setLoading((prev) => (prev = true));
      await UploadProfilePictureService({ formData });
      await user.refetch();
      setLoading((prev) => (prev = false));
      Swal.fire("success", "upload image is successful", "success");
    } catch (err: any) {
      setLoading((prev) => (prev = false));
      console.error(err);
      if (err.props.response.data.statusCode === 413) {
        Swal.fire({
          title: "error",
          html: "Your file is too large. We only allow image files with a maximum size of 1024x1024 pixels.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "error",
          html: err?.props?.response?.data?.message,
          icon: "error",
        });
      }
    }
  };

  //handle change in user data form for updating
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handlePortalSession = async () => {
    try {
      Swal.fire({
        title: "..กำลังเปลี่ยนเส้นทาง",
        allowEnterKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const url = await ProtalSessionService();
      window.location.href = url;
    } catch (err) {
      console.error(err);
    }
  };
  //handle summit user's data
  const handleSubmitData = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const userUpdate = await UpdateUserService({
        firstName: userData.firstName,
        lastName: userData.lastName,
        school: userData.school,
        phone: userData.phone,
        language: userData.language as string,
      });
      Swal.fire({
        title: "...Updating",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await user.refetch();
      Swal.fire("success", "update your profile successfully😃", "success");
    } catch (err: any) {
      Swal.fire("error", err.props.response.data.message.toString(), "error");
    }
  };

  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
        <title>setting - account</title>
      </Head>
      <TatugaClassLayout
        sideMenus={
          userSideServer.language === "Thai" ? sideMenusThai : sideMenusEnglish
        }
        user={userSideServer}
      >
        <div
          className={`w-full h-full py-10   mt-10 md:mt-0  flex flex-col items-center md:justify-center
         bg-[url('/svgs/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover `}
        >
          <div
            className=" h-5/6 w-5/6 md:max-w-xl lg:max-w-3xl
         md:mt-0 bg-white md:p-10 lg:px-20 p-2 rounded-xl mt-20 border-2 border-solid "
          >
            <div className="flex flex-col items-center justify-center  md:block">
              <span className="text-4xl font-medium text-gray-800 ">
                Account setting
              </span>
              <div className="flex gap-x-5 md:gap-5 mt-5  items-center justify-center">
                {user?.data?.picture ? (
                  <div
                    className="relative lg:w-60 lg:h-48 md:w-40 md:h-40 w-20 h-20 rounded-md overflow-hidden 
                flex justify-center items-center"
                  >
                    {loading ? (
                      <Loading />
                    ) : (
                      <Image
                        src={user.data.picture}
                        className="object-cover"
                        alt={`profile picture of ${user.data.firstName}`}
                        fill
                        sizes="(max-width: 768px) 100vw"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-white rounded-md flex items-center justify-center">
                    {loading ? (
                      <Loading />
                    ) : (
                      <div className="relative w-40 h-40 bg-blue-500  rounded-md overflow-hidden flex justify-center items-center">
                        <span className="text-8xl font-Kanit font-semibold text-white">
                          {user?.data?.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col w-3/5 md:w-full gap-y-5 ">
                  <span className="md:text-xl text-sm">
                    Change your profile here
                  </span>

                  <form
                    onSubmit={handleSubmit}
                    className="flex md:w-max w-full  flex-col  gap-2 justify-start items-start "
                  >
                    <label className="w-3/4 flex flex-col gap-1 ">
                      {user?.data?.language === "Thai" && "เลือกรูปภาพ"}
                      {user?.data?.language === "English" && "pick your image"}
                      <input
                        aria-label="upload profile picture"
                        onChange={handleFileInputChange}
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        className="text-sm text-grey-500
            file:mr-5 md:file:w-max file:w-20 w-full file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-medium 
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                      />
                    </label>
                    <button
                      className=" md:w-28 w-20 text-center  h-max px-0 md:px-6 py-2 text-sm rounded-full border-none  bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 focus:border-solid hover:scale-110 transition duration-200
               hover:bg-red-700"
                    >
                      upload
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmitData}
              className=" mt-10 max-w-3xl flex flex-col items-center justify-center md:block "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 lg:gap-x-20 gap-2">
                <div>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    First Name
                  </label>
                  <input
                    value={userData.firstName}
                    onChange={handleChange}
                    name="firstName"
                    className="appearance-none block w-60 md:w-40 lg:w-full bg-[#EDBA02]
                 text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-whit  border-none
                  border-red-500 rounded py-3 px-4 mb-3 leading-tight ring-2 ring-black  
                 focus:outline-none e"
                    id="grid-first-name"
                    type="text"
                    maxLength={50}
                    placeholder="Update your first name here"
                  />
                </div>
                <div>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name"
                  >
                    Last Name
                  </label>
                  <input
                    value={userData.lastName}
                    onChange={handleChange}
                    name="lastName"
                    className="appearance-none block w-60 md:w-40 lg:w-full ring-2 ring-black
                bg-[#EDBA02] text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-whit  border-none
                 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    maxLength={50}
                    placeholder="update your last name here"
                  />
                </div>

                <div>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name"
                  >
                    Phone number
                  </label>
                  <input
                    value={userData.phone}
                    onChange={handleChange}
                    name="phone"
                    className="appearance-none block w-60 md:w-40 lg:w-full ring-2 ring-black
                bg-[#EDBA02] text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-red-500 placeholder:font-normal border-none
                 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    maxLength={50}
                    pattern="(\+)?[0-9]+"
                    placeholder="update your phone number here"
                  />
                </div>
                <div>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name"
                  >
                    School
                  </label>
                  <input
                    value={userData.school}
                    onChange={handleChange}
                    name="school"
                    className="appearance-none block w-60 md:w-40 lg:w-full ring-2 ring-black
                bg-[#EDBA02] text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-red-500 placeholder:font-normal border-none
                rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    maxLength={50}
                    placeholder="update your school name here"
                  />
                </div>
              </div>

              <div className="w-full h-[1px] bg-black mt-10"></div>
              <div className="mt-5 w-full flex flex-col justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center md:items-start  pb-10">
                  <div className="flex h-max  items-center justify-start gap-2">
                    <span className="md:text-xl text-md">Language setting</span>
                    <div className="flex text-xl items-center justify-center text-center h-5 w-5 bg-[#EDBA02] p-1 rounded-full text-white">
                      <HiLanguage />
                    </div>
                  </div>
                  <Autocomplete
                    className="mt-10"
                    value={languageValue}
                    onChange={(event, newValue) => {
                      setUserData((prev) => {
                        return {
                          ...prev,
                          language: newValue as "Thai" | "English",
                        };
                      });
                      setLanguageValue(() => newValue as string);
                    }}
                    inputValue={inputLanguageValue}
                    onInputChange={(event, newInputValue) => {
                      setInputLanguageValue(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={options}
                    sx={{ width: 250 }}
                    renderInput={(params) => (
                      <TextField {...params} label="language" />
                    )}
                  />
                </div>
              </div>
              <div className="w-full h-[1px] bg-black mt-5"></div>
              <div className="mt flex flex-col items-start mb-10 mt-5">
                <div className="flex gap-2 items-center">
                  <span className="font-Kanit text-xl">
                    {user?.data?.language === "Thai"
                      ? "จัดการระบบสมาชิก"
                      : user?.data?.language && "manage your subscription"}
                  </span>
                  <MdSubscriptions />
                </div>

                {user?.data?.plan === "FREE" ? (
                  <div
                    className="w-max flex justify-center items-center gap-1 h-max p-2 bg-gray-200 px-5 text-black rounded-md
                   font-Kanit font-medium mt-2 "
                  >
                    {user?.data.language === "Thai"
                      ? "คุณยังไม่เป็นสมาชิก"
                      : user?.data?.language && "you are not member yet"}
                    <MdNoAccounts />
                  </div>
                ) : (
                  <button
                    onClick={handlePortalSession}
                    type="button"
                    className="w-max px-20 h-max p-2 bg-orange-400 text-black rounded-md
                     font-Kanit font-medium mt-2 hover:bg-orange-500 transition duration-100 drop-shadow-md"
                  >
                    {user?.data?.language === "Thai"
                      ? "จัดการ"
                      : user?.data?.language && "manage"}
                  </button>
                )}
              </div>
              <button
                aria-label="update user button"
                className=" w-28  h-max px-6 py-2 text-sm mb-5 rounded-xl border-none  bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 focus:border-solid hover:scale-110 transition duration-200
               hover:bg-red-700"
              >
                update
              </button>
            </form>
          </div>
        </div>
      </TatugaClassLayout>
    </div>
  );
}

export default Setting;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;
  if (accessToken) {
    try {
      const userSideServer = await GetUserCookieService({
        access_token: accessToken,
      });

      return {
        props: {
          userSideServer,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/signIn",
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signIn",
      },
    };
  }
};
