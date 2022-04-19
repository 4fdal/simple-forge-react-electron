import { MeRequest } from "..";
import {
  getApiV1BasePath,
  getConnectionDatabase,
  hasUseSuperAdminAccount,
  objectToQueryString,
} from "../../helpers/call-helper";
import { rendererInvoke } from "../../ipc-renderer";

export default class RequestReport {
  static getReports(objectQueryString = {}, isSync = false) {
    // get data report not sync from database local
    // console.log("get data report not sync from database local");
    return rendererInvoke("get.reports", getConnectionDatabase(), {
      is_syncronized: 0,
      all: true,
    }).then(async ({ data: dataIsSyncronized }) => {
      try {
        if (dataIsSyncronized.length > 0) {
          // remap data is syncronized
          dataIsSyncronized = dataIsSyncronized.map((item) => {
            return {
              ...item,
              is_syncronized: true,
            };
          });
          // console.log("send data from database local to database server");
          // send data from database local to database server
          // create data from database not is syncronized to database server
          await RequestReport.createNewReportBulk(dataIsSyncronized);

          // update local database is_syncronized after success sync data report to database
          // console.log(
          //   "update local database is_syncronized after success sync data report to database"
          // );
          await rendererInvoke(
            "create_update.reports",
            getConnectionDatabase(),
            dataIsSyncronized
          );
        }
      } catch (error) {}

      // console.log("Success all sync");
      // console.log(dataIsSyncronized, "dataIsSyncronized");

      try {
        const { data } = await MeRequest({
          method: "get",
          url: getApiV1BasePath(
            "/report?" + objectToQueryString(objectQueryString)
          ),
        });

        try {
          let isFreshDataTable = false;
          let arraySyncData = data.data;

          // sync data report server to database local
          if (isSync) {
            try {
              const {
                data: { data: newArraySyncData },
              } = await MeRequest({
                method: "get",
                url: getApiV1BasePath(
                  "/report?" + objectToQueryString({ all: true })
                ),
              });

              arraySyncData = newArraySyncData;
              isFreshDataTable = true;
            } catch (error) {}
          }

          await rendererInvoke(
            "sync.reports",
            getConnectionDatabase(),
            arraySyncData,
            { isFreshDataTable }
          );
        } catch (error) {}

        return data;
      } catch (err) {
        // if failed to connect server, get data from local database
        if (
          [404, 500, undefined].includes(err?.response?.status) ||
          hasUseSuperAdminAccount()
        ) {
          try {
            let data = await rendererInvoke(
              "get.reports",
              getConnectionDatabase(),
              objectQueryString
            );

            return Promise.resolve(data);
          } catch (error) {}
        }

        throw err;
      }
    });
  }

  static getFragmentReportSearch() {
    return MeRequest({
      url: getApiV1BasePath("/fragment/report/search"),
      method: "get",
    })
      .then(({ data }) => {
        return data;
      })
      .catch(async (err) => {
        // if failed to connect server, get data from local database
        if (
          [404, 500, undefined].includes(err?.response?.status) ||
          hasUseSuperAdminAccount()
        ) {
          try {
            const products = (
              await rendererInvoke("get.products", getConnectionDatabase(), {
                all: true,
                order: ["name", "asc"],
              })
            ).data;
            const shifts = (
              await rendererInvoke("get.shifts", getConnectionDatabase(), {
                all: true,
                order: ["name", "asc"],
              })
            ).data;
            const operators = (
              await rendererInvoke("get.users", getConnectionDatabase(), {
                all: true,
                order: ["name", "asc"],
              })
            ).data;
            const result = { products, shifts, operators };

            return Promise.resolve(result);
          } catch (error) {}
        }

        throw err;
      });
  }

  static createNewReport(objectDataReport = {}) {
    return MeRequest({
      url: getApiV1BasePath("/report"),
      method: "post",
      data: objectDataReport,
    })
      .then((response) => {
        return response;
      })
      .catch(async (err) => {
        if (
          [404, 500, undefined].includes(err?.response?.status) ||
          hasUseSuperAdminAccount()
        ) {
          try {
            objectDataReport = {
              ...objectDataReport,
              is_syncronized: false,
            };
            await rendererInvoke(
              "create_update.reports",
              getConnectionDatabase(),
              [objectDataReport]
            );

            return Promise.resolve({
              message: "Success",
              data: objectDataReport,
              errors: null,
            });
          } catch (error) {}
        }

        throw err;
      });
  }

  static createNewReportBulk(arrayObjectDataReport = []) {
    return MeRequest({
      method: "post",
      url: getApiV1BasePath("/report/store/all"),
      data: {
        item: arrayObjectDataReport,
      },
    }).then(({ data }) => data);
  }
}
