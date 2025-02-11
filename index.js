const express = require('express');
const compression = require('compression');
const axios = require('axios');
const zlib = require('zlib');

/**
 * Fetches test data from a list of URLs
 * @returns {Promise<string>} The fetched test data
 */
const fetchTestData = async () => {
  try {
    // Fetch complete works of Shakespeare (about 5.5MB)
    const urls = [
      'https://www.gutenberg.org/files/100/100-0.txt',  // Complete works
      'https://www.gutenberg.org/cache/epub/100/pg100.txt' // Backup URL
    ];

    // Try each URL until one works
    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'CompressionTest/1.0 (Educational Research)'
          },
          timeout: 10000 // 10 second timeout
        });
        return response.data;
      } catch (e) {
        console.log(`Failed to fetch from ${url}, trying next source...`);
        continue;
      }
    }
    throw new Error('All data sources failed');
  } catch (error) {
    console.error('Error fetching test data:', error.message);
    // Fallback to larger generated data (5MB)
    return generateCompressedTestData(5 * 1024 * 1024);
  }
};

/**
 * Generates compressed test data of a given size. Fallback test data generator with more realistic content
 * @param {number} size - The size of the test data in bytes (default: 5MB)
 * @returns {string} Compressed test data
 */
const generateCompressedTestData = (size = 5 * 1024 * 1024) => {
  // Create more compressible content by including patterns and repetition
  const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "Shakespeare", "Hamlet", "Macbeth", "Romeo", "Juliet", "Othello",
    "wherefore", "thou", "thy", "thee", "hast", "doth", "forsooth"
  ];
  
  let result = '';
  while (result.length < size) {
    const word = words[Math.floor(Math.random() * words.length)];
    result += word + ' ';
    // Add some line breaks for realism
    if (Math.random() < 0.1) result += '\n';
  }
  return result;
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Tests compression performance for a specific algorithm
 * @param {string} algorithm - The compression algorithm to test ('gzip', 'deflate', or 'br')
 * @param {string} testData - The data to compress
 * @returns {Promise<Object>} Result object containing compression metrics (algorithm, sizes, ratio, time)
 */
const testCompression = async (algorithm, testData) => {
  return new Promise((resolve, reject) => {
    const app = express();
    const port = 3000 + Math.floor(Math.random() * 1000);
    let server;

    // Force compression for all requests
    app.use(compression({
      level: 6,
      threshold: 0,
      memLevel: 8,
      strategy: zlib.constants.Z_DEFAULT_STRATEGY,
      flush: zlib.constants.Z_NO_FLUSH,
      chunkSize: 16 * 1024,
      filter: () => true,
      algorithm
    }));
    
    app.get('/test', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('X-No-Compression', 'false');
      res.send(testData);
    });

    server = app.listen(port, async () => {
      try {
        const startTime = process.hrtime();

        const headers = {
          'Accept-Encoding': algorithm,
          'Cache-Control': 'no-cache',
          'Accept': 'text/plain'
        };

        console.log(`\nTesting ${algorithm} compression:`);
        console.log('Original content size:', formatBytes(testData.length));

        // Disable decompression
        const response = await axios.get(`http://localhost:${port}/test`, {
          headers,
          responseType: 'arraybuffer',
          decompress: false
        });

        const endTime = process.hrtime(startTime);
        const duration = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
        
        const result = {
          algorithm: response.headers['content-encoding'] || 'none',
          originalSize: formatBytes(testData.length),
          compressedSize: formatBytes(response.data.length),
          compressionRatio: ((testData.length - response.data.length) / testData.length * 100).toFixed(2) + '%',
          timeTaken: duration + 'ms',
          savingsInMB: ((testData.length - response.data.length) / (1024 * 1024)).toFixed(2) + ' MB'
        };

        resolve(result);
      } catch (error) {
        console.error('Error:', error.message);
        reject(error);
      } finally {
        server.close();
      }
    });
  });
};

/**
 * Tests compression performance for a specific algorithm
 * @param {string} algorithm - The compression algorithm to test ('gzip', 'deflate', or 'br')
 * @param {string} testData - The data to compress
 * @returns {Promise<Object>} Result object containing compression metrics (algorithm, sizes, ratio, time)
 */
const compareCompressions = async () => {
  console.log('Fetching large test data...');
  const testData = await fetchTestData();
  console.log(`Fetched ${formatBytes(testData.length)} of test data`);

  console.log('\nTesting different compression algorithms...');

  try {
    const results = [];
    results.push(await testCompression('gzip', testData));
    results.push(await testCompression('deflate', testData));
    results.push(await testCompression('br', testData));
    
    console.log('\nFinal Results:');
    console.table(results);
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

// Usage
compareCompressions();