const express = require('express');
const routes = require('./routes/index');

const app = express();

const port = process.env.PORT || 5000;

// eslint-disable-next-line jest/require-hook
app.use(express.json());
// eslint-disable-next-line jest/require-hook
app.use('/', routes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}

export default app;
