/* eslint-disable import/no-anonymous-default-export */

export default {
  webBasePath: "",
  apiBasePath: "/api",
  accounts: {
    superAdmin: {
      name: "super admin",
      role_id: null,
      role: {
        id: null,
        level: "super_admin",
        name: "super_admin",
      },
      username: "super_admin",
      password: "super_admin",
      // default password is : super_admin
    },
  },
  vendorInformation: {
    name: "Developed by Intitek Presisi Integrasi R&D Team",
    email: "salessupport@intitek.co.id",
    telp: "021 5091 4753",
    website: "https://intitek.co.id",
  },
  applicationInformation: {
    version: require("../package.json").version,
    name: "Mayora Desktop App",
    hardwareId: "",
    macAddress: "",
    ipAddress: "",
  },
  defaultSettings: {
    application: {
      id_application: "VH746JS90",
      is_accept_all_condition: false,
    },
    database: {
      ip_database: "127.0.0.1",
      port_database: 3306,
      user_database: "root",
      password_database: "",
      name_database: "sample",
    },
    server: {
      host_server: "http://127.0.0.1",
      port_server: 8000,
    },
    scale: {
      baudrate: 9600,
      // 110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000 and 256000
      databits: 7,
      // 7, 8
      parity: "none",
      // none, odd, even
      port: "COM2",
      delimiter: "+",
      start_value_substring: 0,
      length_value_substring: 9,
      start_unit_substring: 9,
      length_unit_substring: 1,
    },
  },
  msIntervalCheckConnection: 15000, // 15 sec
};
