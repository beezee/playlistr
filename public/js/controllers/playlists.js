window.angular.module('mean.ytpl').controller('PlaylistsController', ['$scope', 'storage', 'Global', 'Playlists', 'Player',
	function($scope, storage, Global, Playlists, Player){
		$scope.player = Player;

		if (storage.get('currentPlaylist'))
			$scope.player.currentPlaylist = storage.get('currentPlaylist');
		if (storage.get('currentPlaylist') && Global.user)
			$scope.player.playlistEdited = true;
		$scope.playlists = [$scope.player.currentPlaylist];
		$scope.playlistNeedsName = false;

        if (Global.user)
            Playlists.query(function(playlists){
                $scope.playlists = _.union([$scope.player.currentPlaylist], playlists);
            });

		var stashPlaylist = function(){
			$scope.player.playlistEdited = false;
			return storage.set('currentPlaylist', $scope.player.currentPlaylist);
		};

		var updatePlaylist = function(){
			$scope.player.currentPlaylist.$update(function(r){
				$scope.player.playlistEdited = false;
			});
		};

		$scope.savePlaylist = function(){
			if (!Global.user)
				return stashPlaylist();
			if ($scope.player.currentPlaylist.name == 'New Playlist')
				return $scope.playlistNeedsName = true;
			$scope.playlistNeedsName = false;
			if ($scope.player.currentPlaylist._id)
				return updatePlaylist();
			new Playlists($scope.player.currentPlaylist)
				.$save(function(r){
					$scope.player.playlistEdited = false;
					storage.set('currentPlaylist', false);
					if (!_.find($scope.playlists, function(p){ return p.name == 'New Playlist'; }))
						$scope.playlists.push({name: 'New Playlist', videos: []});
				});
		};

	}]);
