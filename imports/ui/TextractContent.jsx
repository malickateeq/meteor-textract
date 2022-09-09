import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import imagesCollection from "../db/imagesCollection";

export const TextractContent = () => {
    
    let textractSubmissionInterval = null;
    let textractResultInterval = null;

    // Listener
    const { lastestFile } = useTracker(() => {
        let lastestFile = null;
        const noDataAvailable = { files: [], pendingTasksCount: 0 };
        const handler = Meteor.subscribe('files.images.all');
        if (!handler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }
        const files = imagesCollection.findOne({}).fetch();

        // Clear recent intervals
        Meteor.clearInterval(textractSubmissionInterval);
        Meteor.clearInterval(textractResultInterval);
        if(files) {
            lastestFile = files[0];

            // When the textract submission is incomplete
            if(!lastestFile.textracted && lastestFile.s3_uploaded) {
                textractSubmissionInterval = Meteor.setInterval(() => {
                    console.log("Re-submiting file to textract..");
                    Meteor.call('files.submit.textract', lastestFile);
                }, 9000);
            }

            // If analysis haven't received yet
            if(!lastestFile.analysis && lastestFile.textracted) {
                textractResultInterval = Meteor.setInterval(() => {
                    console.log("Requesting for results..");
                    Meteor.call('files.submit.analysis', lastestFile);
                }, 3000);
            }

            if(lastestFile?.textracted) {
                Meteor.clearInterval(textractSubmissionInterval);
            } 
            if(lastestFile?.analysis) {
                Meteor.clearInterval(textractSubmissionInterval);
                Meteor.clearInterval(textractResultInterval);
            } 

            return { lastestFile: files[0] };
        }
        return { ...noDataAvailable, isLoading: true };
    });

    // Render PDF Content
    const getPDFContent = (analysis) => {
        let content = '';
        analysis.forEach(finding => {
            if(finding.BlockType === 'LINE') {
                if(finding.BlockType === 'LINE' && finding.Relationships[0].Type === 'CHILD'){
                    content += "\n";
                }
                content += finding.Text;
            } 
        });
        return content;
    };

    const getFileProcessingStatus = (lastestFile) => {
        if(!lastestFile)
            return 'Please Upload a file!'
        else if (!lastestFile.s3_uploaded)
            return 'Uploading file to S3 Bucket...';
        else if (!lastestFile.textracted)
            return 'Submitting file to Textract...';
        else if (!lastestFile.analysis)
            return 'Waiting for file results...';
    };

    const pdfFileProcessingLifecycle = (lastestFile) => {
        return (
            <>
                { !lastestFile?.analysis ? (
                    <>
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <span className='d-flex justify-content-center mt-2'> 
                            { getFileProcessingStatus(lastestFile) }
                        </span>
                    </>
                ) : getPDFContent(lastestFile.analysis) }
                
            </>
        );
    };

  return (
        <>
            <h2 className="fw-bold lh-1 mb-3">Textract Content:</h2>

            { pdfFileProcessingLifecycle(lastestFile) }
            
            <hr className="my-4" />
            <small className="text-muted"> File: { lastestFile?.name } </small>
            <br />
            <br />
        </>
  );
};