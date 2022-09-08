const path = require('path');
require('dotenv').config({
  path: path.join(process.cwd(), `../../../../../.env`),
});
import { Meteor } from 'meteor/meteor';
import imagesCollection from '/imports/db/imagesCollection';
import uploadFileToS3 from '/imports/lib/uploadFileToS3';
import { textractFile, getFileAnalysis } from '/imports/lib/textractFile';

Meteor.startup(() => {
  Meteor.setInterval(function () {
    /**
     * Upload Pending Files to S3
     */
    const pendingFiles = imagesCollection.find({ s3_uploaded: { $eq: null } });
    pendingFiles.forEach((file) => {
      try {
        uploadFileToS3(file);
      } catch (error) {
        console.log(error);
      }
    });

    /**
     * Apply Textract Job to Pending files at S3
     */
    const textractFiles = imagesCollection.find({
      textracted: { $eq: null },
      analysed: { $eq: null },
    });
    textractFiles.forEach((file) => {
      try {
        textractFile(file);
      } catch (error) {
        console.log(error);
      }
    });

    /**
     * Fetch Textract File Analusis
     */
    const textractFileAnalysis = imagesCollection.find({
      analysis: { $eq: null },
    });
    textractFileAnalysis.forEach((file) => {
      try {
        getFileAnalysis(file);
      } catch (error) {
        console.log(error);
      }
    });
  }, 3000);
});
