import axios from "axios";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

// 请求拦截
service.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 相应拦截
service.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

//统一传参处理
const request = (options) => {
  if (options.method.toLowerCase() === "get") {
    options.params = options.data || {};
  }
  return service(options);
};

export default request;
