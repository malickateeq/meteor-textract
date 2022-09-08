import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
// import { Meteor } from 'meteor/meteor';
// import { useTracker } from 'meteor/react-meteor-data';
// import {Files} from './Files';
// import { imagesCollection } from '../db/FilesCollection';

export const App = () => {

    // const files = useTracker(() => {
    //     const noDataAvailable = { files: [], pendingTasksCount: 0 };
    //     const handler = Meteor.subscribe('files.images.all');
    //     if (!handler.ready()) {
    //       return { ...noDataAvailable, isLoading: true };
    //     }
    //     const files = imagesCollection.find({}).fetch();
    //     // Meteor.call("files.upload", files);
    //     return files;
    //   });

    return (
        <div className="container">
            <FileUpload />
            {/* <Files /> */}
        </div>
    );
}