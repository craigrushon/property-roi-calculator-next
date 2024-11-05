const env = process.env;

const config = {
  itemsPerPage: Number(env.LIST_PER_PAGE) || 5
};

export default config;
