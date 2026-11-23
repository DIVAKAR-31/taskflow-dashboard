const mongoose = require('mongoose');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

let isConnected = false;

// Helper to check if port is open
const isPortOpen = (port, host = '127.0.0.1') => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
};

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  // 1. If MongoDB Atlas or custom URI is provided
  if (mongoUri && mongoUri.trim() !== '') {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log(` MongoDB Connected (Atlas/Custom): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(` Could not connect to MONGODB_URI: ${error.message}`);
      console.warn(' Falling back to local persistent MongoDB...');
    }
  }

  // 2. Local persistent MongoDB on port 27017
  const port = 27017;
  const isRunning = await isPortOpen(port);

  if (!isRunning) {
    console.log(' Starting local persistent MongoDB instance on port 27017...');
    const binaryPath = path.join(
      process.env.USERPROFILE || 'C:\\Users\\sdiva',
      '.cache',
      'mongodb-binaries',
      'mongod-x64-win32-7.0.24.exe'
    );
    const dbPath = path.resolve(__dirname, '..', 'data', 'db');

    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    if (fs.existsSync(binaryPath)) {
      // Spawn detached mongod process so it never dies on request end
      const child = spawn(
        binaryPath,
        ['--dbpath', dbPath, '--port', String(port), '--bind_ip', '127.0.0.1'],
        {
          detached: true,
          stdio: 'ignore',
        }
      );
      child.unref();

      // Wait up to 10 seconds for port to open
      let retries = 20;
      while (retries > 0) {
        await new Promise((r) => setTimeout(r, 500));
        if (await isPortOpen(port)) {
          break;
        }
        retries--;
      }
    }
  }

  try {
    const localUri = 'mongodb://127.0.0.1:27017/taskflow';
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(` MongoDB Connected (Persistent Local Storage at 127.0.0.1:27017): ${conn.connection.host}`);
  } catch (error) {
    console.error(` Failed to connect to local MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
