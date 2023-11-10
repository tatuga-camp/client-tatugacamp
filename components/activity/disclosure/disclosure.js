import { Disclosure, Transition } from '@headlessui/react';
import { PortableText } from '@portabletext/react';
import { BsCaretDownFill } from 'react-icons/bs';
import { urlFor } from '../../../sanity';
import Image from 'next/image';
import { useState } from 'react';

export default function DisclosureComponent({ body, video }) {
  const [loading, setLoading] = useState(true);
  const myPortableTextComponents = {
    types: {
      image: ({ value }) => {
        return <SanityImage {...value} />;
      },
    },
    listItem: {
      // Ex. 1: customizing common list types
      bullet: ({ children }) => (
        <li className="list-disc pl-2 text-base lg:text-lg">{children}</li>
      ),

      // Ex. 2: rendering custom list items
      checkmarks: ({ children }) => <li>✅ {children}</li>,

      number: ({ children }) => <span>{children}</span>,
    },
    block: {
      // Ex. 1: customizing common block types
      h1: ({ children }) => (
        <h1 className={` md:text-4xl text-lg py-5`}>{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className={`text-lg md:text-2xl py-3`}>{children}</h2>
      ),
      h3: ({ children }) => (
        <>
          <h3 className={`text-lg md:text-xl py-3`}>{children}</h3>
          <br />
        </>
      ),
      normal: ({ children }) => (
        <div className="text-base lg:text-lg ">{children}</div>
      ),

      blockquote: ({ children }) => (
        <blockquote className="border-l-purple-500 border-l-2 border-solid border-r-0 border-y-0 my-5 pl-5 font-semibold">
          {children}
        </blockquote>
      ),

      // Ex. 2: rendering custom styles
      customHeading: ({ children }) => (
        <h2 className="text-lg text-primary text-purple-700">{children}</h2>
      ),
    },
    marks: {
      definition: ({ children, value }) => {
        return (
          <span className="group w-full relative cursor-pointer">
            <span
              className="w-max underline decoration-dotted font-semibold text-[#EDBA02] underline-offset-2 text-base 
            lg:text-lg"
            >
              {children}
            </span>
            <div
              className="group-hover:block z-20 group-active:block w-2/4  hidden bg-[#EDBA02] rounded-md text-left px-5
            font-Kanit font-light md:absolute md:w-80  md:right-[0%] md:left-0 "
            >
              <span className="w-max mr-1 font-normal">ความหมาย:</span>
              <span>{value.href}</span>
            </div>
          </span>
        );
      },
      em: ({ children }) => (
        <em className="text-gray-600 font-light text-base lg:text-lg">
          {children}
        </em>
      ),
      color: ({ children, value }) => (
        <span style={{ color: value.hex }}>{children}</span>
      ),
      link: ({ children, value }) => {
        return (
          <a
            href={value.href}
            className={`text-${value.hex}`}
            rel="noreferrer"
            target="_blank"
          >
            {children}
          </a>
        );
      },
    },
  };

  // check whether url of image is png or not. If not return false
  function isImage(url) {
    return /\.(|png|)$/.test(url);
  }

  const SanityImage = ({ asset }) => {
    const randomNumber = Math.floor(Math.random() * 4) + 1;

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          style={{
            backgroundImage: isImage(urlFor(asset).url())
              ? `url(/BgBlob${randomNumber.toString()}.svg)`
              : 'none',
          }}
          className={` lg:w-96 md:w-40 lg:h-96 md:h-40 h-56 w-56  bg-cover bg-no-repeat relative `}
        >
          <Image
            src={urlFor(asset).url()}
            className="object-contain"
            placeholder="blur"
            blurDataURL="data:image/png;base64,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"
            alt="some images about TaTuga camp teaching you English grammar"
            fill
            sizes="100vw"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full   pt-5">
      <div className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl rounded-2xl flex justify-center items-center flex-col gap-y-5">
        {body.body && (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="border-0 flex w-64 md:w-96 justify-between rounded-lg bg-purple-100 
              px-4 py-2 text-left text-sm lg:text-base font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>วิธีการเล่นกิจกรรม 😲</span>
                  <BsCaretDownFill
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-4 pb-2 ">
                    <PortableText
                      value={body?.body}
                      components={myPortableTextComponents}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        )}

        {body.materialDetail && (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="border-0 flex w-64 md:w-96  justify-between rounded-lg bg-purple-100 
              px-4 py-2 text-left text-sm lg:text-base  font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>รายละเอียดอุปกรณ์ 🧰</span>
                  <BsCaretDownFill
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-4 pb-2">
                    <PortableText
                      value={body?.materialDetail}
                      components={myPortableTextComponents}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        )}

        {body.reflectionTipsStrategies && (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="border-0 flex w-64 md:w-96 justify-between rounded-lg bg-purple-100 
              px-4 py-2 text-left text-sm lg:text-base  font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>เทคนิคและรายละเอียดเพิ่มเติม 🗯️</span>
                  <BsCaretDownFill
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-4 pb-2 ">
                    <PortableText
                      value={body?.reflectionTipsStrategies}
                      components={myPortableTextComponents}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        )}
      </div>
    </div>
  );
}
