/* eslint-disable eqeqeq */
import { toast } from "react-toastify";
import appConfig from "../../app.config";
import { KEY_ACCESS_TOKEN, KEY_USER } from "../constants/call-key-storage";
import SettingsStorage from "../storages/settings-storage";

export function getApiBasePath(path = "") {
  let settingServer = SettingsStorage.getSettingServer();

  return `${settingServer.host_server}:${settingServer.port_server}${appConfig.apiBasePath}${path}`;
}

export function getApiV1BasePath(path = "", isFullPathUrl = false) {
  path = `/v1${path}`;

  return isFullPathUrl ? getApiBasePath(path) : path;
}

export function getWebBasePath(path = "") {
  return `${appConfig.webBasePath}${path}`;
}

export function meToast(type, message) {
  toast(message, {
    position: "bottom-right",
    autoClose: 5000,
    type,
  });
}

export function getAuthorizeBearerHeader() {
  let accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function objectToQueryString(object = {}) {
  let queryString = [];
  for (let key in object) {
    queryString.push(`${key}=${object[key]}`);
  }

  return queryString.join("&");
}

export function queryStringToObject(queryString = "?") {
  let object = {};
  if (queryString.length > 0) {
    queryString = queryString.substring(1);

    for (let query of queryString.split("&")) {
      let [key, value] = query.split("=");
      object[key] = value;
    }
  }
  return object;
}

export const requestErrorHandle =
  (callback = (response) => {}) =>
  (err) => {
    let response = null;
    let message = err.message;
    if (err.response) {
      response = callback(err.response);
      if (err.response.data) {
        message = err?.response?.data?.message;
      }
    }
    meToast("error", message);
    return response;
  };

export const axiosErrorHandle =
  (err) =>
  (
    callback = (response) => {},
    config = {
      isAllowToast: true,
    }
  ) => {
    let response = null;
    let message = err.message;

    if (err.response) {
      response = callback(err.response);
      if (err.response.data) {
        const tempMessage = err?.response?.data?.message;
        if (!["", null, undefined].includes(tempMessage)) {
          message = tempMessage;
        }
      }
    }

    if (config?.isAllowToast) {
      meToast("error", message);
    }
    return response;
  };

export function onChangeHandle(
  page,
  keyState,
  otherChangesCallback = () => ({})
) {
  return ({ target: { value } }) => {
    let newState = otherChangesCallback();
    if (typeof newState != "object") {
      newState = {};
    }

    page.setState({ [keyState]: value, ...newState });
  };
}

export function formValidateDefaultHandle(
  page,
  defaultKeyStateFormValidate = "formValidate"
) {
  let formValidate = page.state[defaultKeyStateFormValidate];

  // make reset form validate to empty array
  for (let key in formValidate) {
    formValidate[key] = [];
  }

  page.setState({
    [defaultKeyStateFormValidate]: formValidate,
  });
}

export function formValidateErrorHandle(
  page,
  errorResponse,
  defaultKeyStateFormValidate = "formValidate"
) {
  let defaultFormValidate = page.state[defaultKeyStateFormValidate];

  if (errorResponse.status == 422) {
    let errors = errorResponse.data.errors;
    page.setState({
      [defaultKeyStateFormValidate]: {
        ...defaultFormValidate,
        ...errors,
      },
    });
  }
}

export function arrayChunk(arr, chunkSize) {
  // eslint-disable-next-line no-throw-literal
  if (chunkSize <= 0) throw "Invalid chunk size";
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize));
  return R;
}

export function getConnectionDatabase() {
  let {
    ip_database: host,
    port_database: port,
    user_database: user,
    password_database: password,
    name_database: database,
  } = SettingsStorage.getSettingDatabase();

  return { host, port, user, password, database };
}

export function hasUseSuperAdminAccount() {
  const user = JSON.parse(localStorage.getItem(KEY_USER));

  return user.username == appConfig.accounts.superAdmin.username;
}
