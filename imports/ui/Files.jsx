import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import imagesCollection from "../db/imagesCollection";
import { TableRow } from './components/TableRow';

export const Files = () => {
    const { files } = useTracker(() => {
        const noDataAvailable = { files: [], pendingTasksCount: 0 };
        const handler = Meteor.subscribe('files.images.all');
        if (!handler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }
        const files = imagesCollection.find({}).fetch();
        return { files };
    });
    
  return (

    <div className="accordion" id="accordionExample">
        { files.map(file => <TableRow record={file} />) }
    </div>
  );
};