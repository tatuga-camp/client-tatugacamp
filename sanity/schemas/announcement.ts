import { defineType } from "sanity";

export default defineType({
  name: "announcement",
  title: "announcement",
  type: "document",
  fields: [
    {
      name: "title",
      title: "title",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "description",
      title: "description",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "type",
      title: "type",
      type: "string",
      options: {
        list: [
          { title: "success", value: "success" },
          { title: "info", value: "info" },
          { title: "warning", value: "warning" },
          { title: "error", value: "error" },
        ], // <-- predefined values
        layout: "radio", // <-- defaults to 'dropdown'
      },
    },
  ],
});
