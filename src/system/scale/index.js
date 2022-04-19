const { SerialPort, DelimiterParser } = require("serialport");

const handleReadScaleFromSerial = (
  scale = {
    baudrate: 9600,
    // 110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000 and 256000
    databits: 8,
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
  callbackResultsScale = (weight, unit) => {},
  callbackErrorHandle = (error) => {}
) => {
  const path = scale.port;
  const baudrate = parseInt(scale.baudrate);
  const databit = parseInt(scale.databits);
  const parity = scale.parity;
  const delimiter = scale.delimiter;
  const startValueSubstring = parseInt(scale.start_value_substring);
  const lengthValueSubstring = parseInt(scale.length_value_substring);
  const startUnitSubstring = parseInt(scale.start_unit_substring);
  const lengthUnitSubstring = parseInt(scale.length_unit_substring);

  var weight = 0;
  var unit = "kg";

  const scaleDelimiter = new DelimiterParser({
    delimiter,
  });

  scaleDelimiter.on("data", function (d) {
    let concated = d.toString().replace("/", "");

    let startValue = concated.substring(
      startValueSubstring,
      startValueSubstring + lengthValueSubstring
    );

    weight = parseFloat(startValue);
    unit = concated.substring(
      startUnitSubstring,
      startUnitSubstring + lengthUnitSubstring
    );

    callbackResultsScale(weight, unit);
  });

  const port = new SerialPort({
    path,
    baudRate: baudrate,
    autoOpen: false,
    dataBits: databit,
    parity,
  });

  port.pipe(scaleDelimiter);
  port.open(callbackErrorHandle);
  port.on("error", callbackErrorHandle);
};

module.exports = { handleReadScaleFromSerial };
