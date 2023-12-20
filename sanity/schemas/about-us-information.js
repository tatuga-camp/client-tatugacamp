export default {
  name: 'about-us-information',
  title: 'About Us - information',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(1).warning('must fill the data'),
    },
    {
      name: 'subtitle',
      title: 'subtitle',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(1).warning('must fill the data'),
    },
    {
      name: 'description',
      title: 'description',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(1).warning('must fill the data'),
    },
    {
      name: 'link',
      title: 'link',
      type: 'url',
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};
