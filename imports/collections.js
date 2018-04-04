import { Mongo } from 'meteor/mongo';

Tasks = new Mongo.Collection("tasks");

// set up security on tasks collection
Tasks.allow({

	
	update:function(userId, doc){
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update the task.
			return false;
		}
	},

	insert:function(userId, doc){
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in, the image has the correct user id
				return true;
			}
		}
		else {// user not logged in
			return false;
		}
	},
	remove:function(userId, doc){
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in, the task has the correct user id
				return true;
			}
		}
		else {// user not logged in
			return false;
		}
	}
})
