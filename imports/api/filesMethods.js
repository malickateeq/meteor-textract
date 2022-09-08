import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'files.index'() {
    console.log('HERE');
    // if (!this.userId) {
    //   throw new Meteor.Error('Not authorized.');
    // }
    // UserFiles.insert({
    //   text,
    //   createdAt: new Date(),
    //   userId: this.userId,
    // });
  },
  'files.upload'(file) {
    console.log('HERE');
    // if (!this.userId) {
    //   throw new Meteor.Error('Not authorized.');
    // }
    // UserFiles.insert({
    //   text,
    //   createdAt: new Date(),
    //   userId: this.userId,
    // });
  },
});
