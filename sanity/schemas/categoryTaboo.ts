import { defineType } from "sanity";

export default defineType({
  name: "categoryTaboo",
  title: "Category of taboo",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
  ],
});
