const {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} = require('@aws-sdk/client-textract');
import imagesCollection from '/imports/db/imagesCollection';

// 1. Submit document to analyze
export const textractFile = (file) => {
  const textract = new TextractClient({ region: 'us-east-1' });
  const params = {
    DocumentLocation: {
      S3Object: {
        Bucket: 's3-meteor-extract',
        Name: file.name,
      },
    },
    FeatureTypes: ['TABLES'],
  };
  const command = new StartDocumentAnalysisCommand(params);
  try {
    textract.send(command, (err, data) => {
      imagesCollection.update(
        { _id: file._id },
        { $set: { textracted: true, jobId: data.JobId } }
      );
    });

    return true;
  } catch (err) {
    return false;
    console.log('ERRORs', err);
    return err;
  }
};

// 1. Submit document to analyze
export const getFileAnalysis = (file) => {
  const textract = new TextractClient({ region: 'us-east-1' });
  const params = { JobId: file.jobId };
  //   if (NextToken) params.NextToken = NextToken;
  const command = new GetDocumentAnalysisCommand(params);
  try {
    textract.send(command, (err, data) => {
      imagesCollection.update(
        { _id: file._id },
        { $set: { analysis: data.Blocks, analysed: true } }
      );
    });
  } catch (err) {
    // Handle error
    console.log('ERR', err);
    return err;
  }
};
