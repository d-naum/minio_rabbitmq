var amqp = require('amqplib/callback_api');
const Minio = require('minio');
const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
});
const incoming = `${__dirname}/incoming/example.pdf`;
amqp.connect('amqp://localhost:5672', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'hello';

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

    channel.consume(
      queue,
      function (msg) {
        console.log(' [x] Received %s', msg.content.toString());
        const fileInfo = JSON.parse(msg.content.toString());
        minioClient.bucketExists(fileInfo?.bucket, function (error) {
          if (error) {
            return console.log(error);
          }
          minioClient.fGetObject(
            fileInfo?.bucket,
            fileInfo.file,
            incoming,
            function (err) {
              if (err) {
                return console.log(err);
              }
              console.log('Received file in the incoming folder');
            },
          );
        });
      },
      {
        noAck: true,
      },
    );
  });
});
