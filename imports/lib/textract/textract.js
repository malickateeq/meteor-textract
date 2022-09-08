const {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} = require('@aws-sdk/client-textract');
const { isNull } = require('lodash');

// 1. Send document to analyze
export async function readFileWithTextract(fileName) {
  const textract = new TextractClient({ region: process.env.AWS_REGION });
  const params = {
    DocumentLocation: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Name: fileName,
      },
    },
    FeatureTypes: ['TABLES'],
  };
  const command = new StartDocumentAnalysisCommand(params);
  try {
    //   this will return a JobId
    return await textract.send(command);
  } catch (err) {
    console.log('ERROR', err);
    return err;
  }
}

// 2. Get results of analysis
export async function getJobsFromTextract(JobId, NextToken) {
  const textract = new TextractClient({ region: process.env.AWS_REGION });

  const params = { JobId };
  if (NextToken) params.NextToken = NextToken;
  const command = new GetDocumentAnalysisCommand(params);

  try {
    return await textract.send(command);
  } catch (err) {
    // Handle error
    console.log('ERR', err);
    return err;
  }
}

// 3. Get all jobs
export async function getAllJobs(jobId) {
  let response = await getOneJob(jobId, null); // Get the first call
  if (response.JobStatus === 'IN_PROGRESS') {
    return { message: 'Job not finished yet.' };
  }
  if (response.JobStatus === 'FAILED') {
    return { message: 'Job failed.' };
  }

  saveResponse(response); // Handle the way to save the response

  while (!isNull(response.NextToken)) {
    response = await getOneJob(jobId, response.NextToken);
    saveResponse(response);
  }

  return getAllSavedResponses(jobId); // Get all responses saved and return it.
}
