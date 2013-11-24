var mongoose = require('mongoose'),
	Playlist = mongoose.model('Playlist'),
	_ = require('underscore');

exports.playlist = function(req, res, next, id){
	Playlist.load(id, function(err, playlist){
		if (err) return next(err);
		if (!playlist) return next(new Error('Couldn\'t find that playlist'));
		req.playlist = playlist;
		next();
	});
};

exports.create = function(req, res){
	var playlist = new Playlist(req.body);
	delete(playlist._id);
	playlist.user = req.user;
	
	playlist.save(function(err){
		if (err)
			 res.send('users/signup', {
				errors: err.errors,
				playlist: playlist
			});
		else
			res.jsonp(playlist);
	});
};
		
exports.update = function(req, res){
	var playlist = req.playlist;
	playlist = _.extend(playlist, req.body);
	playlist.user = req.user;

	playlist.save(function(err){
		res.jsonp(playlist);
	});
};

exports.destroy = function(req, res){
	var playlist = req.playlist;

	playlist.remove(function(err){
		if (err)
			return res.render('error', {
				status: 500
			});
		res.jsonp(playlist);
	});
};

exports.show = function(req, res){
	res.jsonp(req.playlist);
};

exports.all = function(req, res){
	Playlist.find({user: req.user._id}).sort('-created').populate('user', 'name username')
		.exec(function(err, playlists){
			if (err)
				return res.render('error', {
					status: 500
				});
			res.jsonp(playlists);
		});
};
