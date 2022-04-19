import appConfig from "../../app.config";
import {
  KEY_SETTING_APPLICATION,
  KEY_SETTING_DATABASE,
  KEY_SETTING_SCALE,
  KEY_SETTING_SERVER,
} from "../constants/call-key-storage";

export default class SettingsStorage {
  static getSetting = (keySetting, keySettingStorage) => {
    let setting = appConfig.defaultSettings[keySetting];
    let fetchStorageSetting = localStorage.getItem(keySettingStorage);

    if (fetchStorageSetting) {
      try {
        let objFetchStorageSettingApplication = JSON.parse(fetchStorageSetting);
        for (let key in objFetchStorageSettingApplication) {
          setting[key] = objFetchStorageSettingApplication[key];
        }
      } catch (error) {}
    }

    return setting;
  };

  static setSetting = (keySetting, keySettingStorage, newObjSetting = {}) => {
    let setting = SettingsStorage.getSetting(keySetting, keySettingStorage);

    setting = JSON.stringify({
      ...setting,
      ...newObjSetting,
    });

    localStorage.setItem(keySettingStorage, setting);
  };

  static getSettingApplication() {
    return SettingsStorage.getSetting("application", KEY_SETTING_APPLICATION);
  }

  static setSettingApplication(newObjSetting = {}) {
    return SettingsStorage.setSetting(
      "application",
      KEY_SETTING_APPLICATION,
      newObjSetting
    );
  }

  static getSettingDatabase() {
    return SettingsStorage.getSetting("database", KEY_SETTING_DATABASE);
  }

  static setSettingDatabase(newObjSetting = {}) {
    return SettingsStorage.setSetting(
      "database",
      KEY_SETTING_DATABASE,
      newObjSetting
    );
  }

  static getSettingServer() {
    return SettingsStorage.getSetting("server", KEY_SETTING_SERVER);
  }

  static setSettingServer(newObjSetting = {}) {
    return SettingsStorage.setSetting(
      "server",
      KEY_SETTING_SERVER,
      newObjSetting
    );
  }

  static getSettingScale() {
    return SettingsStorage.getSetting("scale", KEY_SETTING_SCALE);
  }

  static setSettingScale(newObjSetting = {}) {
    return SettingsStorage.setSetting(
      "scale",
      KEY_SETTING_SCALE,
      newObjSetting
    );
  }
}
