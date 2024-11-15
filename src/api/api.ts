import axios, {Axios} from 'axios';
const RETRY_HEADER_NAME = 'Retry-Count'

const axiosClient = axios.create({
  baseURL: '/',
  timeout: 33000,
  headers: {[RETRY_HEADER_NAME]: 10}
});


//429
axiosClient.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// Add a response interceptor

const RETRY_CODES = [429]

interface Retriable {
  func: Promise<any>
  count: number
  delay: number
  successCallback: (data: any) => boolean
}

axiosClient.interceptors.response.use( function (response) {
  return response;
}, function (error) {
  const requestConfig = error.config

  if (!error.response) {
    return Promise.reject(error);
  }

  if (!RETRY_CODES.includes(error.response.status)) {
    return Promise.reject(error);
  }

  const currentRetryCount = error.config.headers.get(RETRY_HEADER_NAME)
  if (currentRetryCount == undefined) {
    return Promise.reject(error);
  }

  try {
    let currentRetryCountInt = parseInt(currentRetryCount)
    if (currentRetryCountInt < 1) {
      return Promise.reject(error);
    }

    currentRetryCountInt = currentRetryCount - 1
    requestConfig.headers.set(RETRY_HEADER_NAME, currentRetryCountInt)

    return new Promise(resolve => setTimeout(() => {
      resolve(axiosClient.request(requestConfig))
    }, 1000));

  } catch (e) {
    console.log(e)
  }
});

export default axiosClient;
