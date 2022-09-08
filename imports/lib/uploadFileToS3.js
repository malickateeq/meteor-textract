const path = require('path');
require('dotenv').config({
  path: path.join(process.cwd(), `../../../../../.env`),
});
import { Meteor } from 'meteor/meteor';
import fs from 'fs-extra';
import S3 from 'aws-sdk/clients/s3';
import { Random } from 'meteor/random';
import imagesCollection from '/imports/db/imagesCollection';

const uploadFileToS3 = (file) => {
  const newFileName =
    Random.id().substring(1, 22) + '.' + file.name.split('.').pop();
  const bound = Meteor.bindEnvironment((callback) => {
    return callback();
  });

  const s3Conf = {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
  };

  try {
    const s3ConnectionTimeout = 6000000;
    const s3Retries = 4;
    client = new S3({
      secretAccessKey: s3Conf.secret,
      accessKeyId: s3Conf.key,
      region: s3Conf.region,
      maxRetries: s3Retries,
      sslEnabled: false,
      correctClockSkew: true,
      httpOptions: {
        connectTimeout: s3ConnectionTimeout,
        timeout: s3ConnectionTimeout * s3Retries,
      },
    });

    // TEST WRITE/READ/REMOVAL ACCESS TO AWS:S3 ENDPOINT
    client.putObject(
      {
        StorageClass: 'STANDARD',
        Bucket: s3Conf.bucket,
        Key: newFileName,
        Body: fs.createReadStream(file.path),
        //   Body: Buffer.from('tesxt text file', 'utf8'),
      },
      (awsWriteError) => {
        bound(() => {
          if (awsWriteError) {
            throw new Meteor.Error(
              500,
              'Achtung! No WRITE  (`putObject`) access to AWS:S3 storage',
              awsWriteError
            );
          } else {
            client.getObject(
              {
                Bucket: s3Conf.bucket,
                Key: newFileName,
              },
              (awsReadError) => {
                bound(() => {
                  if (awsReadError) {
                    throw new Meteor.Error(
                      500,
                      'Achtung! No READ (`getObject`) access to AWS:S3 storage',
                      awsReadError
                    );
                  } else {
                    // Delete AW Files
                    //   client.deleteObject(
                    //     {
                    //       Bucket: s3Conf.bucket,
                    //       Key: rndmName+file.name,
                    //     },
                    //     (awsRemoveError) => {
                    //       bound(() => {
                    //         if (awsRemoveError) {
                    //           throw new Meteor.Error(
                    //             500,
                    //             'Achtung! No REMOVAL (`deleteObject`) access to AWS:S3 storage',
                    //             awsRemoveError
                    //           );
                    //         } else {
                    //           Meteor._debug(
                    //             'Meteor Files App: AWS integration SUCCESSFULLY tested'
                    //           );
                    //         }
                    //       });
                    //     }
                    //   );
                  }
                });
              }
            );
          }
        });
      }
    );

    imagesCollection.update(
      { _id: file._id },
      { $set: { s3_uploaded: true, name: newFileName } }
    );
  } catch (error) {
    console.log(error);
  }
};

export default uploadFileToS3;
