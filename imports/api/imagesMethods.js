import { Meteor } from 'meteor/meteor';
import uploadFileToS3 from '/imports/lib/uploadFileToS3';
import { textractFile, getFileAnalysis } from '/imports/lib/textractFile';
import imagesCollection from '/imports/db/imagesCollection';

Meteor.methods({
  'files.index'() {
    console.log('HERE');
  },
  'files.crud.delete'() {
    imagesCollection.remove({});
  },
  'files.submit.textract'(file) {
    const textractedFile = imagesCollection.findOne({ _id: file._id })?.fetch();
    if (!textractedFile) return;
    if (
      textractedFile[0] &&
      textractedFile[0].s3_uploaded &&
      !textractedFile[0].textracted
    ) {
      textractFile(file);
    }
  },
  'files.submit.analysis'(file) {
    const textractedFile = imagesCollection.findOne({ _id: file._id })?.fetch();
    if (!textractedFile) return;
    if (textractedFile[0] && textractedFile[0].textracted) {
      getFileAnalysis(file);
    }
  },
  'files.uploaded'(file) {
    try {
      console.log('Uploading on S3...');

      const fileName = uploadFileToS3(file);
      if (fileName) {
        const s3UploadedFile = imagesCollection
          .findOne({ _id: file._id })
          .fetch();
        if (s3UploadedFile[0] && s3UploadedFile[0].s3_uploaded) {
          console.log('Submitting for Textract analysis...');
          textractFile(s3UploadedFile[0]);
          const textractedFile = imagesCollection
            .findOne({ _id: file._id })
            .fetch();
          if (textractedFile[0] && textractedFile[0].textracted) {
            console.log('Fetching for results...');
            getFileAnalysis(textractedFile[0]);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
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
