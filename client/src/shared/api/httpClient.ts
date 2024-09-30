import axios, { AxiosError, AxiosInstance } from 'axios';

class HTTPClient {
  #token = '';

  constructor(private readonly instance: AxiosInstance) {
    this.instance = instance;
    this.applyInterceptors();
  }

  private applyInterceptors() {
    this.instance.interceptors.request.use((config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${this.#token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError & { config: { sent: boolean } }) => {
        const { config, response } = error;
        const status = response?.status;
        if (status === 403 && !config.sent) {
          config.sent = true;
          return this.instance(config);
        }
        return Promise.reject(error);
      },
    );
  }
}

const httpClient = new HTTPClient(
  axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
);

export default httpClient;
