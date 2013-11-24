var mongoose = require('mongoose'),
	config = require('../../config/config'),
	Schema = mongoose.Schema;

var PlaylistSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
	},
	videos: [{id: String, title: String, thumbnail: String}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}

});

PlaylistSchema.path('name').validate(function(name){
	return name.length;
}, 'Name cannot be blank');

PlaylistSchema.path('videos').validate(function(videos){
	return videos.length;
}, 'Playlist cannot be empty');

PlaylistSchema.statics.load = function(id, cb){
	this.findOne({_id: id}).populate('user', 'name username')
		.exec(cb);
};

mongoose.model('Playlist', PlaylistSchema);
