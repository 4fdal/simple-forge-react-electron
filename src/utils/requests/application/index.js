import { MeRequest } from "..";
import {
  getApiV1BasePath,
  getConnectionDatabase,
  hasUseSuperAdminAccount,
  objectToQueryString,
} from "../../helpers/call-helper";
import { rendererInvoke } from "../../ipc-renderer";

export default class RequestApplication {
  static getApplications(objectQueryString = {}, isSync = false) {
    return MeRequest({
      url: getApiV1BasePath(
        "/application?" +
          objectToQueryString({ ...objectQueryString, all: true })
      ),
      method: "get",
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
                  "/application?" + objectToQueryString({ all: true })
                ),
              });

              arraySyncData = newArraySyncData;
              isFreshDataTable = true;
            } catch (error) {}
          }

          await rendererInvoke(
            "sync.applications",
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
              "get.applications",
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
