(function() {
  'use strict';

  angular
  .module('tf2stadium')
  .provider('Settings', Settings)
  .config(SettingsConfigBlock)
  .run(SettingsRunBlock);

  //Executed at config phase
  /** @ngInject */
  function SettingsConfigBlock(SettingsProvider) {

    SettingsProvider.constants["settingsList"] = {
      regions: {
        eu:             {id: 'eu',         name: 'Europe'},
        na:             {id: 'na',         name: 'NorthAmerica'},
        as:             {id: 'as',         name: 'Asia'},
        aus:            {id: 'aus',        name: 'Australia'}
      },
      formats: {
        sixes:          {id: 'sixes',      name: '6v6'},
        highlander:     {id: 'highlander', name: 'Highlander'}
      },
      gamemodes: {
        cp:             {id: 'cp',         name: 'Control Points'},
        pl:             {id: 'pl',         name: 'Payload'}
      },
      mumble: {
        mumble:         {id: 'mumble',     name: 'Mumble'}
      }
    };

    SettingsProvider.constants.themesList = {
      light:  {name: "TF2Stadium", selector: "default-theme", id: "0"},
      dark:   {name: "TF2Stadium Dark", selector: "dark-theme", id: "1"}
    }
  }

  //Executed at run phase
  /** @ngInject */
  function SettingsRunBlock(Websocket, Settings) {
  }

  //Provider configuration
  /** @ngInject */
  function Settings() {
    console.log('Starting Settings');

    var settingsProvider = {}

    settingsProvider.settings = {};

    settingsProvider.constants = {};  

    /*
      Creates the service with all the functions accessible
      during and after the run phase.
    */
    var settingsService = function(Websocket) {
      var settings = settingsProvider.settings;

      /*
        Saves a setting into the service and into the backend and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.set = function(key, value, callback) {


        callback = callback || angular.noop;
        settingsProvider.settings[key] = value;

        Websocket.emit('playerSettingsSet',
          JSON.stringify({key: key, value: value}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              console.log('Setting "' + key + '" saved correctly on the backend!');
            }
            callback(response);
          }
        );
      }

      settingsService.get = function(key, callback) {

        callback = callback || angular.noop;
        callback(settingsProvider.settings[key]);

        return settingsProvider.settings[key];
      }

      settingsService.getConstants = function(key) {
        return settingsProvider.constants[key];
      }

      /*
        Loads all settings, saves them into the service in case of success and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.loadSettings = function(callback) {

        callback = callback || angular.noop;

        Websocket.emit('playerSettingsGet',
          JSON.stringify({key: ''}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              settingsProvider.settings = response.data;
              console.log('Settings loaded correctly! ---> ' + JSON.stringify(response.data));
            }
            callback(response);
          }
        );
      }

      return settingsService;
    };


    /*
      Creates the service with all the objects and functions
      accessible ONLY DURING config phase.

      $get returns the service object.
    */
    settingsProvider.$get = settingsService;
    return settingsProvider;
  }

})();