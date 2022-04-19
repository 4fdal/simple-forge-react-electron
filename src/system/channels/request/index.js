const { default: axios } = require("axios");
const { ipcMain } = require("electron");

ipcMain.handle("request", async (event, [config]) => {
  try {
    const { data, status } = await axios(config);
    return {
      response: {
        status,
        data,
      },
    };
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      return {
        response: {
          status,
          data,
        },
      };
    }

    return {
      message: error.message,
      response: {
        status: undefined,
        data: {
          message: error.message,
          data: null,
          error: error.message,
        },
        config,
      },
    };
  }
});
