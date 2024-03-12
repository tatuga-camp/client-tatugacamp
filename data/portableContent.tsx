import { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "../sanity/lib/image";

const SampleImageComponent = ({
  value,
  isInline,
}: {
  value: any;
  isInline: any;
}) => {
  return (
    <img
      src={urlForImage(value).url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",
      }}
    />
  );
};
export const myPortableTextComponents: PortableTextComponents = {
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ul className="py-5">{children}</ul>,
    number: ({ children }) => <ol className="mt-lg">{children}</ol>,

    // Ex. 2: rendering custom lists
    checkmarks: ({ children }) => (
      <ol className="m-auto text-lg">{children}</ol>
    ),
  },
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <li style={{ listStyleType: "disclosure-closed" }} className="pl-2 ">
        {children}
      </li>
    ),

    // Ex. 2: rendering custom list items
    checkmarks: ({ children }) => <li>✅ {children}</li>,
  },
  types: {
    image: SampleImageComponent,
    callToAction: ({ value, isInline }) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },
  block: {
    // Ex. 1: customizing common block types
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl ">{children}</h1>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-purple-500">{children}</blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a href={value.href} rel={rel}>
          {children}
        </a>
      );
    },
    color: ({ children, value }) => {
      return <span style={{ color: value.hex }}>{children}</span>;
    },
  },
};
