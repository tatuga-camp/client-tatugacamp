import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { sanityClient, urlFor } from '../../sanity';
import Head from 'next/head';
import Script from 'next/script';
import Status from '../../components/activity/Status';
import MainContent from '../../components/activity/MainContent';
import { FacebookShareButton, TwitterShareButton } from 'next-share';
import FooterActivities from '../../components/footer/FooterActivities';
import Layout from '../../components/layout';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReactPlayer from 'react-player';
import Skeleton from '@mui/material/Skeleton';
/** @param {import('next').InferGetStaticPropsType<typeof getStaticProps> } props */
function Index(props) {
  const [likes, setLikes] = useState(props.likes);
  const [likesHasbeenClicked, setLikeHasBeenClicked] = useState(false);
  const [mouseHover, setMouseHover] = useState(() => false);
  const [currentURL, setCurrentURL] = useState();
  const [loading, setLoading] = useState(true);
  const [domLoaded, setDomLoaded] = useState(false);
  const title = `${props.data[0].title} - ${props.data[0].description}`;
  // render the component only after the DOM is loaded.
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // set current url to pass into social media link share
  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  // check whether like button has been clicked or not
  useEffect(() => {
    const readLocalstore = localStorage.getItem(props.data[0].slug.current);
    if (!readLocalstore) {
      setLikeHasBeenClicked(false);
    } else if (readLocalstore === props.data[0]._id) {
      setLikeHasBeenClicked(true);
    }
  }, [props.data]);

  // send POST requse to api in order to handle like button
  const addLike = async () => {
    localStorage.setItem(props.data[0].slug.current, props.data[0]._id);
    const readLocalstore = localStorage.getItem(props.data[0].slug.current);

    if (!readLocalstore) {
      setLikeHasBeenClicked(false);
    } else if (readLocalstore === props.data[0]._id) {
      setLikeHasBeenClicked(true);
    }
    const res = await fetch('/api/handle-likes', {
      method: 'POST',
      body: JSON.stringify({ _id: props.data[0]._id }),
    }).catch((error) => console.log(error));
    const data = await res.json();
    setLikes(data.likes);
  };

  //set loading video when it is not ready
  function handleVideoReady() {
    setLoading(false);
  }

  return (
    <Layout>
      <div
        className="w-full md:h-full  bg-[url('/blob2.svg')] md:bg-[url('/blob3.svg')]
       bg-no-repeat bg-cover pt-11"
      >
        <Head>
          <meta property="og:url" content={currentURL} />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`${props.data[0].title} - ${props.data[0].description}`}
          />
          <meta
            property="og:description"
            content={props.data[0].LongDescription}
          />
          <meta
            property="og:image"
            content={urlFor(props.data[0].mainImage.asset._ref).url()}
          />
          <meta
            property="og:image:secure_url"
            content={urlFor(props.data[0].mainImage.asset._ref).url()}
          />
          <meta
            name="twitter:image:src"
            content={urlFor(props.data[0].mainImage.asset._ref).url()}
          />

          <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
          <meta name="google" content="notranslate" key="notranslate" />
          <meta name="description" content={props?.data[0]?.LongDescription} />
          <meta
            name="keywords"
            content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for 
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, ${props.data[0].title}}`}
          />
          <meta
            name="viewport"
            content="width=device-width; initial-scale=1.0;"
          />
          <meta charSet="UTF-8" />
          <title>{title}</title>
        </Head>
        <Script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></Script>
        <Script
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
        ></Script>
        <header>
          <ul
            className="list-none flex flex-col  lg:mt-2  md:flex-row justify-center 
          items-center w-full h-full bg-transparent mt-0 md:mt-34 pl-0"
          >
            <ul xyz="fade up back-1 " className="pl-0 list-none">
              <li
                className="bg-transparent w-[20rem] h-[20rem] md:w-60 md:h-60 lg:w-96 lg:h-96 
               relative square xyz-in"
              >
                <Image
                  src={urlFor(props.data[0].mainImage.asset._ref).url()}
                  alt={props.data[0].title}
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,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"
                  fill
                  sizes="(max-width: 768px) 100vw"
                />
              </li>
            </ul>
            <li xyz="fade-100% big-100% wide-100% tall-100%">
              <ul
                className="list-none pl-0 flex flex-col square xyz-in justify-center
               text-center pr-0 items-center bg-transparent w-full mt-10  rounded-3xl h-max md:w-[503px] md:h-[376px]"
              >
                <li className="MoreSugar text-3xl md:text-[2.8rem] text-[#EDBA02]">
                  {props.data[0].title}
                </li>
                <li className="MoreSugar text-white md:text-black text-xl lg:mt-2 md:mb-2 md:text-[1.5rem]">
                  {props.data[0].categories.title}
                </li>
                <li
                  className=" px-4 py-2 rounded-md bg-[#2C7CD1]  md:drop-shadow-lg md:mb-2
                 text-white flex items-center gap-x-2 text-[20px] "
                >
                  <div className="flex flex-col justify-center gap-y-0 items-center">
                    <div className="flex justify-center items-center gap-x-4">
                      <div>
                        <FacebookShareButton
                          url={currentURL}
                          quote={props.data[0].LongDescription}
                          hashtag={`#${props.data[0].slug}`}
                          media={urlFor(
                            props.data[0].mainImage.asset._ref,
                          ).url()}
                        >
                          <div className="text-2xl  hover:text-[#F55E00] transition duration-200 ease-in-out">
                            <ion-icon name="logo-facebook"></ion-icon>
                          </div>
                        </FacebookShareButton>
                      </div>
                      <span className="font-Kanit text-sm">Share</span>
                      <div>
                        <TwitterShareButton
                          url={currentURL}
                          quote={props.data[0].LongDescription}
                          hashtag={`#${props.data[0].slug}`}
                        >
                          <div className="text-2xl hover:text-[#F55E00] transition duration-200 ease-in-out">
                            <ion-icon name="logo-twitter"></ion-icon>
                          </div>
                        </TwitterShareButton>
                      </div>
                    </div>
                  </div>
                  {likesHasbeenClicked ? (
                    <button
                      className=" border-0 w-max h-max  font-black font-Inter 
                md:text-xl gap-x-2 md:gap-x-2 px-3 rounded-xl  
              bg-white mt-0 text-[#F55E00] flex justify-center items-center
                 "
                    >
                      <span className="mt-1 text-2xl">
                        <ion-icon name="heart-circle"></ion-icon>
                      </span>
                      <div>
                        <span className="text-sm">Thanks!</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={addLike}
                      className=" border-0 w-max h-max  font-black font-Inter 
                md:text-xl gap-x-2 md:gap-x-2 px-3 rounded-xl  
              bg-white mt-0 text-[#F55E00] flex justify-center items-center
                hover:bg-[#F55E00] hover:text-white transition duration-200 ease-in-out
                 "
                    >
                      <span className="mt-1 text-2xl">
                        <ion-icon name="heart-circle"></ion-icon>
                      </span>
                      <div>{likes}</div>
                    </button>
                  )}
                </li>
                <li
                  className="sm:text-white text-white md:text-black   text-sm w-3/4 bg-[#2C7CD1]
                 sm:bg-transparent font-Kanit rounded-3xl font-normal "
                >
                  {props.data[0]?.LongDescription}
                </li>
                <li>
                  <Status status={props.data[0]} />
                </li>
              </ul>
            </li>
          </ul>

          {/* button for playing game online  */}
          {props.data[0].game && (
            <div className="w-full flex items-center justify-center mt-3">
              <Link href={props.data[0].game}>
                <div
                  className="w-max h-max p-3 bg-[#EDBA02] font-Kanit font-semibold
                   text-white rounded-md ring-2 ring-white
                 hover:scale-110 active:scale-110 transition duration-200 cursor-pointer "
                >
                  <span>กดเพื่อเล่น 🎮</span>
                </div>
              </Link>
            </div>
          )}

          {props.data[0].price && (
            <div className="w-full flex items-center py-3  md:py-1 justify-center">
              <a
                href={props.data[0].payoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline "
              >
                <IconButton
                  className="text-[#2C7CD1] md:text-[#2C7CD1] bg-white rounded-lg p-3"
                  size="small"
                  aria-label="add to shopping cart"
                >
                  <AddShoppingCartIcon />
                  <span className="font-Kanit">
                    <span>สั่งซื้อสินค้า</span>
                    {props.data[0].price}
                    <span>.- บาท</span>
                  </span>
                </IconButton>
              </a>
            </div>
          )}
        </header>
        <main
          className="w-full h-max flex mt-5 flex-col justify-center items-center 
        bg-[#2C7CD1] md:bg-transparent"
        >
          {props?.data[0]?.video && (
            <div className="w-full flex relative items-center justify-center mb-5">
              {loading && (
                <div className="absolute flex justify-center items-center flex-col">
                  <div className="md:w-[35rem] md:h-[20rem] w-72 h-40">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="font-Kanit lg:text-lg text-base">
                    📹กำลำโหลด..
                  </div>
                </div>
              )}
              {domLoaded && (
                <div className=" md:w-[35rem] md:h-[20rem] w-72 h-40 rounded-md overflow-hidden ">
                  <ReactPlayer
                    onReady={handleVideoReady}
                    loop={true}
                    playsinline
                    controls
                    width="100%"
                    height="100%"
                    url={props?.data[0]?.video}
                  />
                </div>
              )}
            </div>
          )}
          <MainContent
            picture={props.data[0].mainImage.asset._ref}
            body={props?.data[0]?.body}
            reflectionTipsStrategies={props?.data[0]?.ReflectionTipsStrategies}
            materialDetail={props?.data[0]?.materialDetail}
          />
        </main>
        <footer>
          <FooterActivities />
        </footer>
      </div>
    </Layout>
  );
}

export default Index;

export const getServerSideProps = async (context) => {
  const cardActivityId = await context.params.cardActivityId;
  const query = `*[slug.current == "${cardActivityId}"]`;

  const RawDataActivity = await sanityClient.fetch(query);
  const likes = RawDataActivity[0].likes;

  return {
    props: {
      data: RawDataActivity,
      likes: likes || 0,
    },
  };
};
