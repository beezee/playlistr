window.angular.module('mean.ytpl').factory('Player', ['$document',
	function($document){
		var self = this;
		this.instance = { getVolume: function(){ return 100; }, setVolume: function(volume){} };
        this.currentPlaylist = {name: 'New Playlist', videos: []};
		this.playlistEdited = false;
		this.nowPlaying = 0;

		var observers = [];
			
        window.onYouTubeIframeAPIReady = function(){
            self.instance = new YT.Player('player', 
                    { events: { 
                        onReady: function(event) { self.instance = event.target; },
                        onStateChange: function(event) {
							self.nowPlaying = self.instance.getPlaylistIndex(); 
							self.notifyObservers();
                        }}});
        };

		this.addObserver = function(cb){
			if (typeof cb !== 'function')
				return;
			observers.push(cb);
		};

		this.notifyObservers = function(){
			_.each(observers, function(o){
				o();
			});
		};

		this.getVolume = function(){
			return Math.floor((this.instance.getVolume() / 10));
		};

		this.setVolume = function(volume){
			this.instance.setVolume(Math.floor(volume * 10));
		};

		this.addToPlaylist = function(video){
			this.playlistEdited = true;
			this.currentPlaylist.videos.push(video);
		};

		this.removeFromPlaylist = function(index){
			this.playlistEdited = true;
            this.currentPlaylist.videos.splice(index, 1);
			if (index > 0 && index < this.nowPlaying)
				this.nowPlaying--;
		};

		this.loadPlaylist = function(videos){
			this.currentPlaylist = playlist;
			this.playlistEdited = false;
		};

		this.playVideo = function(id){
			this.instance.loadVideoById(id);	
		};

		this.startPlaylist = function(startFrom){
			var firstTrack = (this.currentPlaylist.videos[startFrom]) ? startFrom 
					: _.min([_.max([0, this.nowPlaying]), (this.currentPlaylist.videos.length-1)]);
			this.instance
				.loadPlaylist(_.pluck(this.currentPlaylist.videos, 'id'), firstTrack);
			this.nowPlaying = firstTrack;
		};

		//next and prev methods here allow adding and removing from playlist on the fly
		// since youtube api only lets you redo the player playlist as a whole
		this.nextVideo = function(){
			this.nowPlaying++;
			this.startPlaylist();
		};

		this.previousVideo = function(){
			this.nowPlaying--;
			this.startPlaylist();
		};

		this.playlistSorterSettings = {
			update: function(){
				self.playlistEdited = true;
			}
		};

		var document = $document[0];
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		return this;	
	}]);

