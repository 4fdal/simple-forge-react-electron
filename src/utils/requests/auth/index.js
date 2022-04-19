import { MeRequest } from "..";
import appConfig from "../../../app.config";
import {
  KEY_ACCESS_TOKEN,
  KEY_SHIFT,
  KEY_USER,
} from "../../constants/call-key-storage";
import {
  axiosErrorHandle,
  getApiV1BasePath,
  getConnectionDatabase,
  hasUseSuperAdminAccount,
} from "../../helpers/call-helper";
import { rendererInvoke } from "../../ipc-renderer";

export default class RequestAuth {
  static login({ username, password, shift }) {
    return MeRequest({
      method: "post",
      url: getApiV1BasePath("/auth/login"),
      data: {
        username,
        password,
      },
    })
      .then(({ data }) => {
        const { access_token, user } = data;

        // save to local storage for data access token, user, and shift
        localStorage.setItem(KEY_ACCESS_TOKEN, access_token);
        localStorage.setItem(KEY_USER, JSON.stringify(user));
        localStorage.setItem(KEY_SHIFT, JSON.stringify(shift));

        return data;
      })
      .catch(async (err) => {
        // eslint-disable-next-line eqeqeq
        if (
          username == appConfig.accounts.superAdmin.username &&
          password == appConfig.accounts.superAdmin.password
        ) {
          const access_token = appConfig.accounts.superAdmin.password;
          const user = appConfig.accounts.superAdmin;

          const data = {
            access_token,
            user,
          };

          localStorage.setItem(KEY_ACCESS_TOKEN, access_token);
          localStorage.setItem(KEY_USER, JSON.stringify(user));
          localStorage.setItem(KEY_SHIFT, JSON.stringify(shift));

          return Promise.resolve(data);
        }

        if ([404, 500, undefined].includes(err?.response?.status)) {
          try {
            let data = await rendererInvoke(
              "auth.login",
              getConnectionDatabase(),
              { username, password }
            );

            const { user, access_token, has_authenticate } = data;

            if (has_authenticate) {
              localStorage.setItem(KEY_ACCESS_TOKEN, access_token);
              localStorage.setItem(KEY_USER, JSON.stringify(user));
              localStorage.setItem(KEY_SHIFT, JSON.stringify(shift));

              return Promise.resolve(data);
            }

            let newError = {
              message: "Failed login",
              response: {
                status: 402,
                data: {
                  message:
                    "Failed login, please check again username or password login!",
                  errors: null,
                  data: null,
                },
              },
            };

            newError.handle = axiosErrorHandle(newError);

            return Promise.reject(newError);
          } catch (error) {
            throw error;
          }
        }

        throw err;
      });
  }

  static check() {
    return MeRequest({
      url: getApiV1BasePath("/auth/user"),
    })
      .then(({ data: { user } }) => {
        // update data user from local storage
        localStorage.setItem(KEY_USER, JSON.stringify(user));

        return user;
      })
      .catch((err) => {
        const user = JSON.parse(localStorage.getItem(KEY_USER));
        const password = localStorage.getItem(KEY_ACCESS_TOKEN);
        const shift = JSON.parse(localStorage.getItem(KEY_SHIFT));
        if (
          [404, 500, undefined].includes(err?.response?.status) ||
          hasUseSuperAdminAccount()
        ) {
          if (user) {
            return user;
          }
        } else {
          if (password && user && shift) {
            const username = user.username;
            return RequestAuth.login({ username, password, shift });
          }
        }

        throw err;
      });
  }

  static logout(
    router = { navigate: (to, options) => {} },
    defaultRedirect = "/auth"
  ) {
    return MeRequest({
      method: "post",
      url: getApiV1BasePath("/auth/logout"),
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (
          [404, 500, undefined].includes(err?.response?.status) ||
          hasUseSuperAdminAccount()
        ) {
          return Promise.resolve({});
        }

        return err.handle();
      })
      .finally(() => {
        //  clean all data from local storage
        [KEY_ACCESS_TOKEN, KEY_USER, KEY_SHIFT].forEach((keyStorage) =>
          localStorage.removeItem(keyStorage)
        );

        // route to login
        router?.navigate(defaultRedirect);
      });
  }
}
