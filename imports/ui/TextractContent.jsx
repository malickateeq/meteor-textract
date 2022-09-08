import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import imagesCollection from "../db/imagesCollection";

let getAnalysisInterval = null;

export const TextractContent = () => {
    
    const forceSubmitForTextract = (lastestFile) => {
        setTimeout(() => {
            console.log("Textracting...");
            console.log(lastestFile.name);
            Meteor.call('files.submit.textract', lastestFile);
        }, 4000);
    };

    const { lastestFile } = useTracker(() => {

        let lastestFile = null;
        const noDataAvailable = { files: [], pendingTasksCount: 0 };
        const handler = Meteor.subscribe('files.images.all');
        if (!handler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }
        const files = imagesCollection.findOne({}).fetch();
        if(files) {
            lastestFile = files[0]; 
            if(!lastestFile.analysis) {
                getAnalysisInterval = setInterval(() => {
                    console.log("Analysing...", lastestFile.name);
                    Meteor.call('files.submit.analysis', lastestFile);
                }, 3000);
            }
            if(lastestFile.analysis) clearInterval(getAnalysisInterval);

            return { lastestFile: files[0] };
        }
        return { ...noDataAvailable, isLoading: true };
    });

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

  return (
        <>
            <h2 className="fw-bold lh-1 mb-3">Textract Content:</h2>
            <p className="col-lg-10">
                { !lastestFile ? 'Please Upload a file!' : (
                    !lastestFile.s3_uploaded ? 'Uploading file to S3 Bucket...' : (
                        !lastestFile.textracted ? 'Submitting file to Textract...' : (
                            !lastestFile.analysis ? 'Waiting for file results...' : (
                                getPDFContent(lastestFile.analysis)
                            )
                        )
                    )
                )}
            </p>
            <hr className="my-4" />
            <small className="text-muted"> File: { lastestFile?.name } </small>
            <br />
            <br />
            { !lastestFile?.textracted ? <small className="text-muted"> <button onClick={ (e) => forceSubmitForTextract(lastestFile)} className="btn btn-sm btn-primary">Submit Again</button>  </small> : "" }
        </>
  );
};