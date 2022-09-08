import React from 'react';
import { Meteor } from 'meteor/meteor';
import imagesCollection from "/imports/db/imagesCollection";

export const FileUpload = () => {

  const uploadIt = e => {
    e.preventDefault();
    
    if (e.currentTarget.files && e.currentTarget.files[0]) {
        var file = e.currentTarget.files[0];

      if (file) {
        //   Delete all existing records
        Meteor.call('files.crud.delete');
        
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
          Meteor.call('files.uploaded', fileObj);
            e.target.value = null;
          // Remove the filename from the upload box
            // self.refs['fileinput'].value = '';

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
    <form className="p-4 p-md-5 border rounded-3 bg-light">
        <div>
            <label htmlFor="formFileLg" className="form-label"> Select your PDF file </label>
            <input className="form-control form-control-lg" id="fileinput" onChange={uploadIt} type="file" />
        </div>
        <hr className="my-4" />
        <small className="text-muted"> Powered by Textract. </small>
    </form>
  );
};