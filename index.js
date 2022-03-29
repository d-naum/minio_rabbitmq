const Express = require('express');
const Minio = require('minio');
const BodyParser = require('body-parser');

const app = Express();
app.use(BodyParser.json({ limit: '4mb' }));
const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
});
const outgoing = `${__dirname}/outgoing/example.pdf`;

minioClient.fPutObject(
  'test',
  'example.pdf',
  outgoing,
  function (err, objInfo) {
    if (err) {
      return console.log(err);
    }
    console.log({
      message: 'File Successfull Uploaded to Minio with info',
      etag: objInfo.etag,
      versionId: objInfo.versionId,
    });
  },
);
// minioClient.removeObject('test', 'example.pdf', function (err) {
//   if (err) {
//     return console.log('Unable to remove object', err);
//   }
//   console.log('Removed the object');
// });

minioClient.bucketExists('test', function (error) {
  if (error) {
    return console.log(error);
  }
  var server = app.listen(3000, function () {
    console.log('Listening on port %s...', server.address().port);
  });
});
