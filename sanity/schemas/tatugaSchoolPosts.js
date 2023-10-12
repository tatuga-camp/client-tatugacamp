export default {
  name: 'tatugaSchoolPosts',
  title: 'Tatuga school posts',
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
      type: 'string',
    },
    {
      name: 'subTitle',
      title: 'sub-title',
      type: 'string',
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
  ],
};
