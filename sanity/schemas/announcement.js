export default {
  name: 'announcement',
  title: 'announcement',
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
      name: 'description',
      title: 'description',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(1).warning('must fill the data'),
    },
  ],
};
