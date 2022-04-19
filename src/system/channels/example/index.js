const { ipcMain } = require("electron");

ipcMain.handle("example.channel", (event, args) => {
  return "hello.world.example.channel : " + JSON.stringify(args);
});

/**
 *
 * Simple use from web page
 *
 * ipcRenderer().invoke("example.channel", {message : "ping"})
 *  .then(response => { ... })
 *  .catch(err => { ... })
 */

ipcMain.on("example.channel.on", (event, args) => {
  // console.log("[event][example.channel.on]", event);
  // console.log("[args][example.channel.on]", args);

  let indexMessage = 0;
  setInterval(() => {
    event.reply("example.channel.event.reply", { indexMessage });

    indexMessage++;
  }, 10000);
});

/**
 * Simple use from web page
 *
 * ipcRenderer().send("example.channel.on", { message: "ping" });
 * ipcRenderer().on("example.channel.event.reply", (event, args) => {
 *    console.log("[example.channel.event.repl]", event, args);
 * });
 *
 */
