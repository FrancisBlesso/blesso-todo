import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

import {Tasks} from './tasks.js';

export const Checklists = new Mongo.Collection('checklists', {
  transform: function(checklist) {
    checklist.tasks = Tasks.find({
      checklistId: { $eq: checklist._id }
    });
    return checklist;
  }
});
Checklists.schema = new SimpleSchema({
  _id: {type: String},
  name: {type: String},
  ownerId: {type: String, regEx: SimpleSchema.RegEx.Id},
  username: {type: String},
  createdAt: {type: Date},
});
Checklists.attachSchema(Checklists.schema);


if (Meteor.isServer)  {
  // TODO Only publish checklist that the user can see.  
  Meteor.publish('checklists', function tasksPublication() {
    return Checklists.find();
  });
}
Meteor.methods({
  'checklists.insert'(text) {
    check(text, String);
    
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Checklists.insert({
      name: text,
      createdAt: new Date(),
      ownerId: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'checklists.remove'(taskId) {
    check(taskId, String);

    const task = Checklists.findOne(taskId);

    if (task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    
    Checklists.remove(taskId);
    //TODO remove the tasks also
  },
  'checklists.setPrivate'(taskId, setToPrivate){
    check(taskId, String);
    check(setToPrivate, Boolean);
    
    const task = Checklists.findOne(taskId);
    
    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Checklists.update(taskId, {$set: { private: setToPrivate}});
  },
});
