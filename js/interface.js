$(document).on('ready page:load', function () {

  var SerialPort = require('serialport');

  Handlebars.registerPartial(
    'analog-input-partial', $("#analog-input-partial").html()
  );

  Handlebars.registerPartial(
    'options-partial', $("#options-partial").html()
  );

  Handlebars.registerPartial(
    'reporter-partial', $("#reporter-partial").html()
  );

  var analog_reporters = [
    { key: 'adc',  title: 'Analog to Digital Converter (ADC)',  symbol: '' },
    { key: 'volt', title: 'Voltage', symbol: 'v' }
  ]

  var check_devices = function() {
    SerialPort.list(function(err, ports) {

      var options = '';

      $(ports).each(function(i, port) {
        if(port != undefined && port.manufacturer != undefined) {
          options += '<option value=' + port.comName + '>' + port.comName + ' (' + port.manufacturer + ')';
        }
      });

      $('#serial-ports').html(options);

      setTimeout(check_devices, 2000);
    });
  }

  check_devices();

  function data_receiver(serial_port, data) {
    // Analog Input Data
    if(data.match(/A[0-5]:./)) {
      data = data.split(':');

      var analog_input = parseInt(data[0][1]);
      var value = parseFloat(data[1]);

      if(current_monitors[serial_port][analog_input] != undefined)
        update_analog_reporters(current_monitors[serial_port][analog_input], value);
    }
  }

  var connected_devices = {};

  function connect_to_serial_port(serial_port) {
    connected_devices[serial_port] = new SerialPort.SerialPort(
      serial_port, {
        baudrate: 9600, parser: SerialPort.parsers.readline('\n')
      }
    );

    connected_devices[serial_port].on('data', function(data) {
      data_receiver(serial_port, data);
    });
  }

  var current_monitors = {};

  var max_analog_input_value = {};

  function add_monitor(serial_port, analog_input) {
    var id = ('analog-input-' + serial_port.replace(/\/|\\/g, '-') + '-A' + analog_input).replace(/-{1,}/g, '-');

    var monitor_selector = '#' + id;

    if(current_monitors[serial_port] == undefined)
      current_monitors[serial_port] = {};

    current_monitors[serial_port][analog_input] = {
      id: id,
      serial_port: serial_port,
      analog_input: analog_input
    }

    if(max_analog_input_value[serial_port] == undefined)
      max_analog_input_value[serial_port] = {};

    max_analog_input_value[serial_port][analog_input] = {};

    $(analog_reporters).each(function(i, analog_reporter) {
      max_analog_input_value[serial_port][analog_input][analog_reporter['key']] = 0;
    });

    if($(monitor_selector).size() > 0) {
      connect_to_serial_port(serial_port);
    } else {
      connect_to_serial_port(serial_port);

      $('#container').append(
        Handlebars.compile('{{> analog-input-partial }}')(
          { analog_input: analog_input, serial_port: serial_port, id: id }
        )
      );

      $(monitor_selector).append(
        Handlebars.compile('{{> options-partial }}')({})
      );

      $(analog_reporters).each(function(i, analog_reporter) {
        $(monitor_selector).append(
          Handlebars.compile('{{> reporter-partial }}')(
            analog_reporter
          )
        );
      });

      $(monitor_selector + ' .reconnect').click(function() {
        connect_to_serial_port($(this).closest('.analog-input').data('serial-port'));
      });

      $(monitor_selector + ' .remove').click(function() {
        $(this).closest('.analog-input').parent().parent().remove();
      });
    }
  }

  $('#monitor-form').submit(function() {
    if($('#serial-ports').val() != undefined)
      add_monitor($('#serial-ports').val(), $('#analog-inputs').val());

    return false;
  });

  function update_analog_reporters(monitor, value) {
    $(analog_reporters).each(function(i, analog_reporter) {
      var pct = 50;

      var analog_input_selector = '#' + monitor.id;

      var reporter_selector = '.reporter-' + analog_reporter['key'];

      var reporter_el = $(analog_input_selector + ' ' + reporter_selector);

      if(value > 1023) value = 1023;

      var corrected_value = value;

      // S Calculations...
      if(analog_reporter['key'] == 'volt') {
        // https://www.arduino.cc/en/Reference/AnalogRead
        corrected_value = corrected_value * 0.0049;
      }
      // E Calculations...

      if(corrected_value > max_analog_input_value[monitor.serial_port][monitor.analog_input][analog_reporter['key']]) {
        max_analog_input_value[monitor.serial_port][monitor.analog_input][analog_reporter['key']] = corrected_value;
      }

      var maximum_value_observed = max_analog_input_value[monitor.serial_port][monitor.analog_input][analog_reporter['key']];

      var pct = (corrected_value*100)/maximum_value_observed;

      var decimal_places = 0;

      if(analog_reporter['key'] != 'adc') {
        decimal_places = parseInt(
          $(analog_input_selector + ' .options .decimal-places').val()
        );
      }

      $(reporter_el).find('.value').html(corrected_value.toFixed(decimal_places));
      $(reporter_el).find('.max').html(maximum_value_observed);
      $(reporter_el).find('.progress-bar').css('width', pct + '%');
    });
  }

});
