(function () {
  'use strict';

  angular.module('tf2stadium')
    .controller('LobbyCreateHeaderController', LobbyCreateHeaderController);

  /** @ngInject */
  function LobbyCreateHeaderController($scope, LobbyCreate) {
    var vm = this;

    vm.lobbyInformation = LobbyCreate.getLobbySettings();

    LobbyCreate.subscribe('lobby-create-settings-updated', $scope, function () {
      vm.lobbyInformation = LobbyCreate.getLobbySettings();
    });
  }

})();
