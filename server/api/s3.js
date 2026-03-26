const express = require('express');
const { S3Client, ListBucketsCommand, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Test S3 Connection - List Buckets
router.get('/test-s3', async (req, res) => {
  console.log(`[DEBUG] Incoming request to /test-s3 at ${new Date().toISOString()}`);
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log(`[DEBUG] Buckets retrieved:`, response.Buckets);
    res.status(200).json({ message: 'Connected to S3', buckets: response.Buckets });
  } catch (error) {
    console.error(`[ERROR] Error connecting to S3:`, error);
    res.status(500).json({ message: 'Failed to connect to S3', error: error.message });
  }
});

// Upload Test File to S3
router.post('/test-s3-upload', async (req, res) => {
  console.log(`[DEBUG] Incoming request to /test-s3-upload at ${new Date().toISOString()}`);
  const testFilePath = path.join(__dirname, 'test.txt');

  // Create a sample file to upload
  fs.writeFileSync(testFilePath, 'This is a test file for S3 upload.');
  console.log(`[DEBUG] Test file created at ${testFilePath}`);

  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileName = `test-${Date.now()}.txt`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fs.createReadStream(testFilePath),
      ContentType: 'text/plain',
    });

    await s3Client.send(command);
    console.log(`[DEBUG] File uploaded to S3: ${fileName}`);

    res.status(200).json({
      message: 'Test file uploaded successfully',
      fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    });

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log(`[DEBUG] Test file deleted from local storage`);
  } catch (error) {
    console.error(`[ERROR] Error uploading to S3:`, error);
    res.status(500).json({ message: 'Failed to upload test file to S3', error: error.message });
  }
});

// Get All Files from S3 Bucket
router.get('/get-all-files', async (req, res) => {
  console.log(`[DEBUG] Incoming request to /get-all-files at ${new Date().toISOString()}`);
  const bucketName = process.env.AWS_BUCKET_NAME;

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });

    const response = await s3Client.send(command);
    console.log(`[DEBUG] Raw S3 response:`, response);

    const files = response.Contents.map((file) => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));
    console.log(`[DEBUG] Files retrieved from S3:`, files);

    res.status(200).json({
      message: 'Files retrieved successfully',
      files,
    });
  } catch (error) {
    console.error(`[ERROR] Error listing files in S3:`, error);
    res.status(500).json({ message: 'Failed to list files from S3', error: error.message });
  }
});

// Get One File by Filename
router.get('/get-file', async (req, res) => {
  console.log(`[DEBUG] Incoming request to /get-file at ${new Date().toISOString()}`);
  const bucketName = process.env.AWS_BUCKET_NAME;
  const { fileName } = req.query;

  if (!fileName) {
    console.error(`[ERROR] Missing fileName query parameter`);
    return res.status(400).json({ message: 'Missing fileName query parameter' });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    // Generate a signed URL for the file (valid for 1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log(`[DEBUG] Signed URL generated for file: ${fileName}`);

    res.status(200).json({
      message: 'File retrieved successfully',
      fileUrl: signedUrl,
    });
  } catch (error) {
    console.error(`[ERROR] Error retrieving file from S3:`, error);
    res.status(500).json({ message: 'Failed to retrieve file from S3', error: error.message });
  }
});

module.exports = router;
