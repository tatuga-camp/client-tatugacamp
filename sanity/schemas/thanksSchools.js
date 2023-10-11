export default {
  name: 'thanksSchools',
  title: 'the list of the school we have been there',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(1).max(80).warning('must fill the data'),
    },

    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().warning('must fill the data'),
    },
  ],
};
