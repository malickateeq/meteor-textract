import React from 'react';
import { Meteor } from 'meteor/meteor';
import imagesCollection from "/imports/db/imagesCollection";

export const FileUpload = () => {

  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.currentTarget.files);
  };

  const uploadIt = e => {
    e.preventDefault();
    console.log("HERE");
    
    if (e.currentTarget.files && e.currentTarget.files[0]) {
        var file = e.currentTarget.files[0];

      if (file) {
        let uploadInstance = imagesCollection.insert(
          {
            file: file,
            meta: {
            //   locator: this.props.fileLocator,
              userId: Math.random(), //Meteor.userId(), // Optional, used to check on server for file tampering
            },
            chunkSize: 'dynamic',
            allowWebWorkers: true, // If you see issues with uploads, change this to false
          },
          false
        );
        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
          console.log('Starting');
        });

        uploadInstance.on('end', function (error, fileObj) {
          console.log('On end File Object: ', fileObj);
        });

        uploadInstance.on('uploaded', function (error, fileObj) {
          console.log('uploaded: ', fileObj);

          // Remove the filename from the upload box
        //   self.refs['fileinput'].value = '';

        });

        uploadInstance.on('error', function (error, fileObj) {
          console.log('Error during upload: ' + error);
        });

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress);
          // Update our progress bar
          
        });

        uploadInstance.start(); // Must manually start the upload
      }
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
        <h1>Upload a file</h1>
      <input
        id="fileinput"
        // ref="fileinput"
        onChange={uploadIt}
        type="file"
        name="cnic"
        // onChange={(e) => setCnic(e.target.value)}
      />
    <br></br>
    <br></br>
      <button type="submit">Add Task</button>
    </form>
  );
};