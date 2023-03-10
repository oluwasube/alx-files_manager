import { MongoClient } from 'mongodb';

const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 27017;
const DEFAULT_DATABASE = 'files_manager';

class DBClient {
  constructor({
    host = DEFAULT_HOST, port = DEFAULT_PORT, database = DEFAULT_DATABASE,
  } = {}) {
    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    this.databaseName = database;
    this.db = null;
    this.isConnecting = false;
    this.connect();
  }

  async connect() {
    if (this.db) {
      return this.db;
    }

    if (this.isConnecting) {
      await new Promise((resolve) => {
        this.client.once('connected', () => {
          resolve();
        });
      });
      return this.db;
    }

    try {
      this.isConnecting = true;
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
      return this.db;
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  async isAlive() {
    try {
      await this.connect();
      return this.client.isConnected();
    } catch (error) {
      return false;
    }
  }

  async nbUsers() {
    const db = await this.connect();
    const users = db.collection('users');
    const usersNum = await users.estimatedDocumentCount();
    return usersNum;
  }

  async nbFiles() {
    const db = await this.connect();
    const files = db.collection('files');
    const filesNum = await files.estimatedDocumentCount();
    return filesNum;
  }

  async close() {
    await this.client.close();
  }
}

const dbClient = new DBClient();
export default dbClient;
