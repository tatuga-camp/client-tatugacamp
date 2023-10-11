export default {
  name: 'whatWeGotCards',
  title: 'what we got as the english camp',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'description',
      type: 'string',
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
