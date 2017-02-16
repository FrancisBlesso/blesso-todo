import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Checklists = new Mongo.Collection('checklists');
sdf
asdfsd
adsf



if (Meteor.isServer)  {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('checklists', function tasksPublication() {
    return Checklists.find({
//      $or: [
//        { private: { $ne: true } },
//        { owner: this.userId },
//      ],
    });
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
      text,
      createdAt: new Date(),
      owner: this.userId,
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
