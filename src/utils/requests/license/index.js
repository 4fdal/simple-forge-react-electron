/* eslint-disable eqeqeq */
import { KEY_LICENSE } from "../../constants/call-key-storage";

async function requestLicenseExample(currentLicense) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if ([undefined, null, ""].includes(currentLicense)) {
        return reject({
          response: {
            status: 402,
            data: {
              error: null,
              message:
                "License key not found for your app, please input again license key!",
              data: null,
            },
          },
        });
      }

      if (currentLicense != "AAAAA-AAAAA-AAAAA-AAAAA-AAAAA") {
        return reject({
          response: {
            status: 402,
            data: {
              error: null,
              message:
                "Kunci lisensi pada aplikasi anda tidak dapat digunakan, harap masukkan lagi kunci lisensi yang benar!",
              data: null,
            },
          },
        });
      }

      return resolve({
        status: 200,
        data: {
          error: null,
          message: null,
          data: {
            license: currentLicense,
            organization: "Mayora",
            application: "Mayora Desktop App",
            duration: "5 Tahun",
          },
        },
      });
    }, 100);
  });
}

export default class RequestLicense {
  static check() {
    let currentLicense = "";

    /**
     * format from licenseData is :
     * {license : string, organization : string, application : string, duration : string}
     * */
    let licenseData = JSON.parse(localStorage.getItem(KEY_LICENSE));
    if (licenseData) {
      if (licenseData.license) {
        currentLicense = licenseData.license;
      }
    }

    return requestLicenseExample(currentLicense)
      .then(response => {
        let data = response.data.data;
        // todo replace data ...

        localStorage.setItem(
          KEY_LICENSE,
          JSON.stringify({
            license: data.license,
            organization: data.organization,
            application: data.application,
            duration: data.duration,
          })
        );
        return Promise.resolve(data);
      })
      .catch(err => {
        if (err.response) {
          switch (err.response.status) {
            case 500:
              return Promise.resolve({
                status: 200,
                data: {
                  error: null,
                  message: null,
                  data: licenseData,
                },
              });

            default:
              return Promise.reject(err);
          }
        }
      });
  }

  static insertLicense(license) {
    return requestLicenseExample(license).then(response => {
      let data = response.data.data;
      // todo replace data ...

      localStorage.setItem(
        KEY_LICENSE,
        JSON.stringify({
          license: data.license,
          organization: data.organization,
          application: data.application,
          duration: data.duration,
        })
      );

      return data;
    });
  }
}
