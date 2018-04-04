import { Accounts } from "meteor/accounts-base";
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import '/imports/collections.js';
import { Session } from 'meteor/session'


// Routing

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

//Router.route('/', function () {
//  this.render('welcome', {
//    to:"main"
//  });
//});


Router.route('/', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('tasksview', {
    to:"main"
  });
  this.render('search', {
    to:"search"
  });    
});

Router.route('/task/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('task', {
    to:"main", 
    data:function(){
      return Tasks.findOne({_id:this.params._id});
    }
  });
});

///////// End of Routing //////////////////////////


// accounts config

/*Accounts.config({
  sendVerificationEmail: true,
});
*/

Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});

//////// End of account config ////////////////////


var Id = 0;   
setIdvar = function setId(id){
     Id = id; 
}   

getIdvar = function getId(){
    return Id;
}

Template.tasksview.helpers({username:function(){
  if (Meteor.user()){
    return Meteor.user().username;
  }
  else {
    return "Visitor";
    }
  }
});

Template.tasksview.helpers({
  tasks:function(){
     if (Meteor.user()){
      var id = Meteor.user()._id;
      return Tasks.find({createdBy: id }, {sort: {task_priority: -1  , task_duedate: 1} });         
     }
    }
});

Template.taskEditform.helpers({
 task:function(){
  if (Meteor.user()){
      return Tasks.find ({"_id": getIdvar()});         
   } 
 }
});

Template.tasksview.events({
    'click .js-del-task':function(event){
       var task_id = this._id;
      //$("#"+task_id).hide('slow', function(){
        Tasks.remove({"_id":task_id});
      // })  
    }, 
   
   'click .js-show-task-form':function(event){
      //$("#task-add-form").modal('show');
      Modal.show('task_add_form')
    },  

   'click .js-Edit-task':function(event){
       setIdvar(this._id);
       Modal.show('taskEditform')
    },

   'click .js_complete_task':function(event){
        var id = this._id;
        if (Meteor.user()){
            var task = Tasks.findOne({"_id": id});
            if (task.task_complete == false){
             Tasks.update( {"_id": id} , {
              $set:{
               task_complete :true    
              }
             });
            }
            else
            {
             Tasks.update( {"_id": id} , {
              $set:{
               task_complete :false   
              }
             });     
            }
        }
   }
});


Template.task_add_form.events({    
    'submit .js-add-task':function(event){
      task_name = event.target.task_title.value;
      task_description = event.target.task_description.value;
      task_deadline = event.target.deadline.value;
      task_duedate = event.target.duedate.value;
      task_priority = event.target.priority.value;
      if (Meteor.user()){
      Tasks.insert({
        task_name:task_name, 
        task_description:task_description,
        task_deadline:task_deadline,
        task_duedate:task_duedate,
        task_priority :task_priority,
        task_complete: false, 
        createdOn:new Date(),
        createdBy:Meteor.user()._id
        });   
      }
      Modal.hide('task_add_form')
      //return false; 
     }
});


Template.taskEditform.events({    
    'submit .js-Edit-task':function(event){
      task_name = event.target.task_title.value;
      task_description = event.target.task_description.value;
      task_deadline = event.target.deadline.value;
      task_duedate = event.target.duedate.value;
      task_priority = event.target.priority.value;
      console.log(task_name);
      if (Meteor.user()){
      Tasks.update( {"_id": getIdvar()} , {
        $set:{
        task_name:task_name, 
        task_description:task_description,
        task_deadline:task_deadline,
        task_duedate:task_duedate,
        task_priority :task_priority,    
        createdOn:new Date()
        }
        });   
      }
      Modal.hide('taskEditform')
      //return false; 
     }
});






