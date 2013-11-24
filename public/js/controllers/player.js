window.angular.module('mean.ytpl').controller('PlayerController', ['$scope', 'storage', 'YouTube', 'Player',
	function($scope, storage, YouTube, Player){

		$scope.player = Player;
		$scope.youtube = YouTube;
		$scope.query = 'sharknado';
		$scope.volume = $scope.player.getVolume();
		storage.bind($scope, 'query');

		$scope.$watch('volume', function(){
			$scope.player.setVolume($scope.volume);
		});

		$scope.player.addObserver(function(){
			$scope.$digest();
		});

		$scope.findVideos = function(){
			YouTube.search($scope.query).then(function(results){
				$scope.searchResults = results;
			});
		};

		$scope.nextPage = function(){
			YouTube.nextPage().then(function(results){
				$scope.searchResults = results;
				window.scrollTo(0, 0);
			});
		};

		$scope.prevPage = function(){
			YouTube.prevPage().then(function(results){
				$scope.searchResults = results;
				window.scrollTo(0, 0);
			});
		};

		$scope.searchResults = [];
}]);
