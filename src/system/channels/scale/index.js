const { ipcMain } = require("electron");
const { handleReadScaleFromSerial } = require("../../scale");

ipcMain.on("sync.scale", (event, scaleDefaultSetting) => {
  handleReadScaleFromSerial(
    scaleDefaultSetting,
    (wight, unit) => {
      event.reply("sync.scale.reply", { data: { wight, unit }, error: null });
    },
    (error) => {
      if (error) {
        event.reply("sync.scale.reply", { data: null, error });
        console.log("[sync.scale][error]", error);
      }
    }
  );
});
