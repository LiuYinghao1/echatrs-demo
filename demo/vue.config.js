module.exports = {
  devServer: {
    port: 9999,
    open: false,
    https: false,
    host: "localhost",
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target:process.env.VUE_APP_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
  },
};
