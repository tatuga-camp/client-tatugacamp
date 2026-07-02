import { defineType } from "sanity";

export default defineType({
  name: "trainer",
  title: "trainer",
  type: "document",
  fields: [
    {
      name: "name",
      title: "name",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "title",
      title: "title",
      type: "string",
      description: "e.g. Freelance teacher from Canada",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "nationality",
      title: "nationality",
      type: "string",
      description: "Country name shown as a badge, e.g. Canada",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "description",
      title: "description",
      type: "text",
      description: "A few sentences about their time at the camp",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "feedback",
      title: "feedback",
      type: "text",
      description: "Their quote about joining us, shown as a testimonial",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().warning("must upload a photo"),
    },
  ],
});
