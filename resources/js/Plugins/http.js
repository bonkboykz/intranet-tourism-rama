import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.response.use(
    (response) => response,
    async (err) => {
        const status = err?.response && err?.response.status;

        if (status === 419) {
            // Refresh our session token
            await axios.get("/csrf-token");

            // Return a new request using the original request's configuration
            return axios(err.response.config);
        }

        return Promise.reject(err);
    }
);
