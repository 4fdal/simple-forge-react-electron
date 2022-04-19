import { MeRequest } from "..";
import {
  getApiV1BasePath,
  getConnectionDatabase,
  hasUseSuperAdminAccount,
  objectToQueryString,
} from "../../helpers/call-helper";
import { rendererInvoke } from "../../ipc-renderer";

export default class RequestProductShift {
  static getProductShifts(objectQueryString, isSync = false) {
    return MeRequest({
      method: "get",
      url: getApiV1BasePath(
        "/product_shift?" + objectToQueryString(objectQueryString)
      ),
    })
      .then(async (response) => {
        const { data } = response;

        try {
          let isFreshDataTable = false;
          let arraySyncData = data.data;

          if (isSync) {
            try {
              const { data: newArraySyncData } = await MeRequest({
                method: "get",
                url: getApiV1BasePath(
                  "/product_shift?" + objectToQueryString({ all: true })
                ),
              });

              arraySyncData = newArraySyncData;
              isFreshDataTable = true;
            } catch (error) {}
          }

          await rendererInvoke(
            "sync.product_shifts",
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
              "get.product_shifts",
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
