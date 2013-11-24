window.angular.module('mean.ytpl').factory('Playlists', ['$resource',
	function($resource){
		return $resource('playlists/:playlistId',
			{ playlistId: '@_id'},
			{ update: { method: 'PUT' }});
	}]);
