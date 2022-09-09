const {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} = require('@aws-sdk/client-textract');
import imagesCollection from '/imports/db/imagesCollection';

// 1. Submit document to analyze
export const textractFile = (file) => {
  console.log('TR1', file.name);
  const textractCred = {
    key: 'AKIAW6CT5462KG4XIKUT',
    secret: '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',
    region: 'us-east-1',
    bucket: 's3-meteor-extract',
  };
  const textract = new TextractClient({
    secretAccessKey: textractCred.secret,
    accessKeyId: textractCred.key,
    region: 'us-east-1',
  });
  const params = {
    DocumentLocation: {
      S3Object: {
        key: 'AKIAW6CT5462KG4XIKUT',
        secret: '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',
        Bucket: 's3-meteor-extract',
        Name: file.name,
        region: 'us-east-1',
      },
    },
    FeatureTypes: ['TABLES'],
  };
  console.log('TR2', params);
  const command = new StartDocumentAnalysisCommand(params);
  try {
    textract.send(command, (err, data) => {
      console.log('TR3', data);
      console.log('TR4', err);
      imagesCollection.update(
        { _id: file._id },
        { $set: { textracted: true, jobId: data.JobId } }
      );
    });

    return true;
  } catch (err) {
    console.log('Textract Error', err);
    return false;
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
