import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const Tasks = new Mongo.Collection('tasks');

Tasks.schema = new SimpleSchema({
  _id: {type: String},
  checklistId: {type: String, regEx: SimpleSchema.RegEx.Id},
  text: {type: String},
  checked: {type: Boolean, defaultValue: false},
  private: {type: Boolean, defaultValue: false},
  ownerId: {type: String, regEx: SimpleSchema.RegEx.Id},
  username: {type: String},
  createdAt: {type: Date},
});
Tasks.attachSchema(Tasks.schema);

if (Meteor.isServer)  {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { ownerId: this.userId },
      ],
    });
  });
}
Meteor.methods({
  'tasks.insert'(text, checklistId) {
    check(text, String);
    check(checklistId, String);
    
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Tasks.insert({
      text,
      checklistId,
      createdAt: new Date(),
      ownerId: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);

    if (task.ownerId !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked){
    check(taskId, String);
    check(setChecked, Boolean);
    
    const task = Tasks.findOne(taskId);
    if (task.private && task.ownerId !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    
    Tasks.update(taskId, {$set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate){
    check(taskId, String);
    check(setToPrivate, Boolean);
    
    const task = Tasks.findOne(taskId);
    
    // Make sure only the task owner can make a task private
    if (task.ownerId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Tasks.update(taskId, {$set: { private: setToPrivate}});
  },
});
