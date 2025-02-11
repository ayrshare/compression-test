# HTTP Compression Test

A Node.js tool to compare different HTTP compression algorithms (gzip, deflate, and Brotli) in terms of compression ratio, processing time, and data savings.

## Features

- Tests three compression algorithms: gzip, deflate, and Brotli (br)
- Measures compression ratio, processing time, and data savings
- Uses Express server for realistic testing environment
- Generates human-readable results
- Includes configurable test data size
- Provides detailed performance metrics

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   
```bash
git clone https://github.com/yourusername/compression-test.git
cd compression-test
```

1. Install dependencies:
   
```bash
npm install
```

This will install the required packages:

- express
- compression
- axios

## Usage

Run the test suite:

```bash
node index.js
```

The script will:

1. Generate test data (default 5.3 MB)
2. Test each compression algorithm
3. Display results in a formatted table

## Sample Results

Here are the results from a test run with 5.3 MB of text data:

```
Testing different compression algorithms...

Testing gzip compression:
Original content size: 5.3 MB

Testing deflate compression:
Original content size: 5.3 MB

Testing br compression:
Original content size: 5.3 MB

Final Results:
┌─────────┬───────────┬──────────────┬────────────────┬──────────────────┬────────────┬─────────────┐
│ (index) │ algorithm │ originalSize │ compressedSize │ compressionRatio │ timeTaken  │ savingsInMB │
├─────────┼───────────┼──────────────┼────────────────┼──────────────────┼────────────┼─────────────┤
│    0    │  'gzip'   │   '5.3 MB'   │   '2.03 MB'    │     '61.66%'     │ '252.01ms' │  '3.27 MB'  │
│    1    │ 'deflate' │   '5.3 MB'   │   '2.03 MB'    │     '61.66%'     │ '241.10ms' │  '3.27 MB'  │
│    2    │   'br'    │   '5.3 MB'   │   '1.89 MB'    │     '64.26%'     │ '95.31ms'  │  '3.40 MB'  │
```

## Configuration

You can modify the test parameters in `index.js`:

```javascript
// Change test data size (in bytes)
const generateTestData = (size = 5 * 1024 * 1024) => {
  // ...
};

// Modify compression settings
app.use(compression({
  level: 6,              // Compression level (0-9)
  threshold: 0,          // Minimum size for compression
  memLevel: 8,          // Memory usage level
  filter: () => true    // Compression filter
}));
```

## API Reference

### Main Functions

#### `testCompression(algorithm, testData)`
Tests a specific compression algorithm with the provided test data.

Parameters:
- `algorithm`: String - 'gzip', 'deflate', or 'br'
- `testData`: String - The data to compress

Returns: Promise with test results object:
```javascript
{
  algorithm: string,        // Compression algorithm used
  originalSize: string,     // Original size with units
  compressedSize: string,  // Compressed size with units
  compressionRatio: string, // Compression percentage
  timeTaken: string,       // Processing time in ms
  savingsInMB: string      // Data saved in MB
}
```

#### `generateTestData(size)`
Generates test data of specified size.

Parameters:
- `size`: Number - Size in bytes (default: 5MB)

Returns: String - Generated test data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Express.js team for the compression middleware
- Node.js community for zlib implementation
- Google for the Brotli compression algorithm

## Support

If you have any questions or need help with the code, please open an issue in the GitHub repository.
