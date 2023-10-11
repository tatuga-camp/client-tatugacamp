export default {
  name: 'homepagePosts',
  title: 'homepage post',
  type: 'document',
  fields: [
    {
      name: 'tag',
      title: 'tag',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'blockContent',
    },
    {
      name: 'description',
      title: 'description',
      type: 'blockContent',
    },

    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'button',
      title: 'button',
      type: 'string',
    },
    {
      name: 'link',
      title: 'link',
      type: 'string',
    },
  ],
};
