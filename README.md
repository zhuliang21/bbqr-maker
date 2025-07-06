# BBQr Helper

Complete PSBT to ColdCard to Broadcast workflow with BBQr codes.

## Features

- **Import PSBT**: Load your Partially Signed Bitcoin Transaction
- **Generate BBQr**: Create animated QR codes for ColdCard import
- **Import Signed**: Scan signed transaction from ColdCard
- **Finalize**: Complete the transaction finalization
- **Broadcast**: Send to Bitcoin network

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Modern web browser with camera support

### Installation

```bash
npm install
```

### Development

```bash
npm run build
npm run serve
```

For HTTPS (required for camera access):
```bash
npm run serve-https
```

### Build

```bash
npm run build
```

## Usage

1. Open the application in your browser
2. Follow the 5-step workflow:
   - Step 1: Import your PSBT
   - Step 2: Generate BBQr codes for ColdCard
   - Step 3: Import the signed transaction
   - Step 4: Finalize the transaction
   - Step 5: Broadcast to the network

## Security Notes

- This is a pure frontend application - no data is sent to servers
- All cryptographic operations happen locally in your browser
- Use at your own risk - this is educational/experimental software

## License

ISC