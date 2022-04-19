import { MeRequest } from "..";
import {
  getApiV1BasePath,
  getConnectionDatabase,
  hasUseSuperAdminAccount,
  objectToQueryString,
} from "../../helpers/call-helper";
import { rendererInvoke } from "../../ipc-renderer";

export default class RequestUser {
  static getPublicUsers() {
    return MeRequest({
      url: getApiV1BasePath("/public/user"),
    })
      .then(({ data }) => data)
      .catch(async (err) => {
        if ([404, 500, undefined].includes(err?.response?.status)) {
          try {
            let data = await rendererInvoke(
              "get.users",
              getConnectionDatabase(),
              { all: true, order: ["id", "asc"] }
            );

            return Promise.resolve(data.data);
          } catch (error) {}
        }

        throw err;
      });
  }

  static getUsers(objectQueryString, isSync = false) {
    return MeRequest({
      method: "get",
      url: getApiV1BasePath("/user?" + objectToQueryString(objectQueryString)),
    })
      .then(async (response) => {
        const { data } = response;
        try {
          let isFreshDataTable = false;
          let arraySyncData = data.data;

          if (isSync) {
            try {
              const {
                data: { data: newArraySyncData },
              } = await MeRequest({
                method: "get",
                url: getApiV1BasePath(
                  "/user?" + objectToQueryString({ all: true })
                ),
              });

              arraySyncData = newArraySyncData;
              isFreshDataTable = true;
            } catch (error) {}
          }

          await rendererInvoke(
            "sync.users",
            getConnectionDatabase(),
            arraySyncData,
            { isFreshDataTable }
          );
        } catch (error) {}

        return data;
      })
      .catch(async (err) => {
        // if failed to connect server, get data from local database
        if (
          [404, 500, undefined].includes(err?.response?.status) ||
          hasUseSuperAdminAccount()
        ) {
          try {
            let data = await rendererInvoke(
              "get.users",
              getConnectionDatabase(),
              objectQueryString
            );

            return Promise.resolve(data);
          } catch (error) {}
        }

        throw err;
      });
  }
}
