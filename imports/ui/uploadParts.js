const uploadParts = (filename, blob, upload_id, index) => {
  return new Promise((resolve, reject) =>
    Meteor.call(
      'aws.uploadPart',
      filename,
      blob,
      upload_id,
      index,
      (err, res) => {
        resolve(res);
      }
    )
  );
};
// Very generic utility function so you can save it for later.
const doInSeries = async (tasks, func) => {
  const results = [];
  for (const task of tasks) {
    const result = await func(task);
    results.push(result);
  }
  return results;
};
// Store the slices instead of promises
const slicesToUpload = [];
for (let index = 1; index < NUM_CHUNKS; index++) {
  start = (index - 1) * FILE_CHUNK_SIZE;
  end = index * FILE_CHUNK_SIZE;
  blob =
    index < NUM_CHUNKS ? media_file.slice(start, end) : media_file.slice(start);

  const b = new Blob([blob], { type: filetype });
  const c = { size: blob.size, type: filetype };
  console.log('Media ', media_file.size, media_file);
  console.log('Blob: ', blob.size, blob);
  console.log('B: ', b.size, b);
  // Store each slice as an array of arguments for uploadParts
  slicesToUpload.push([filename, c, upload_id, index]);
}

// use an anonymous function to spread the task array into the arguments of uploadParts
// alternatively, uploadParts could be written to take an object of arguments and the task could be stored
// as a matching object so no intermediate function would be needed.
doInSeries(slicesToUpload, (task) => uploadParts(...task)).then((results) => {
  // like Promise.all, we return the array of results;
  const upload_parts = results.map((result, index) => {
    return { ETag: result.ETag, PartNumber: index + 1 };
  });
  console.log('upload_parts: ', upload_parts);
  Meteor.call(
    'aws.completeUpload',
    filename,
    upload_id,
    upload_parts,
    (err, res) => {
      if (err) console.log('Complete upload err: ', err);
      if (res) console.log('Complete upload res: ', res);
    }
  );
});
