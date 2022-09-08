import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import {ShowFile} from './ShowFile';
import { filesCollection } from "../db/filesCollection";

export const Files = () => {
    const { files } = useTracker(() => {
        const noDataAvailable = { images: [], pendingTasksCount: 0 };
        const handler = Meteor.subscribe('files.images.all');
        if (!handler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }
        const images = filesCollection.find(
            {}
          ).fetch();
        return { files: images};
    });
    
  return (
    <form className="task-form">
        <h1>Files</h1>
    <br></br>
    <br></br>
      {/* <ul> */}
        { files.toArray() ?? [].map(file => {
            file._id
        })}
      {/* </ul> */}
    </form>
  );
};