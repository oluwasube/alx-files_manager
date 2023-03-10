const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'Localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'filemanager';
    const uri = `mongodb://${host}: ${port}/${database}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
  }

  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (error) {
      return false;
    }
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const count = await this.client.db().collection('users').countDocuments();
      return count;
    } catch (error) {
      return -1;
    }
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const count = await this.client.db().collection('files').countDocuments();
      return count;
    } catch (error) {
      return -1;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
