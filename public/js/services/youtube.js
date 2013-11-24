window.angular.module('mean.ytpl').factory('YouTube', ['$http',
    function($http){
		var pageSize = 25;
		var page=0;
		var query;

		var getPage = function(){
			return page;
		};
		
		var baseSearchUrl = function(){
			return 'https://gdata.youtube.com/feeds/api/videos?q={{KEYWORDS}}&alt=json-in-script&callback=JSON_CALLBACK'
			+ '&max-results='+pageSize+'&start-index='+((getPage()*pageSize)+1);
		};

        var fetch = function(){
            url = baseSearchUrl().replace(/{{KEYWORDS}}/, query);
            return $http.jsonp(url).then(function(response){
				if (response.status !== 200)
					return [];
				return _.map(response.data.feed.entry, function(result){
					return {
						thumbnail: result.media$group.media$thumbnail[0].url,
						title: result.title.$t,
						id: _.last(result.id.$t.split('/'))
					}
				});
			});
        };

		var nextPage = function(){
			page++;
			return fetch();
		};

		var prevPage = function(){
			if (page > 0)
				page--;
			return fetch();
		};

		var search = function(searchQuery){
			query = searchQuery;
			page = 0;
			return fetch();
		};

		return {
			search: search,
			getPage: getPage,
			nextPage: nextPage,
			prevPage: prevPage
		};
				
    }]);
