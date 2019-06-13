const express = require('express');
const router = express.Router();
const { Client } = require('../db/client');
const { get, omit, pick } = require('lodash');

router.get('/clients', async function(req, res, next) {
  try {
    const { userId } = get(req, 'user', {});
    const clients = await Client.find(
      { userId },
      { __v: false, _id: false, userId: false }
    );
    res.json({ clients });
  } catch (err) {
    next(err);
  }
});

router.post('/clients', async function(req, res, next) {
  try {
    const clientBody = pick(req.body, ['name', 'description', 'redirect_uri']);
    clientBody.userId = get(req, 'user.userId', '');

    const client = new Client(clientBody);
    await client.save();
    res.json({ client: omit(client.toObject(), ['__v', '_id']) });
  } catch (err) {
    next(err);
  }
});

router.patch('/clients/:clientId', async function(req, res, next) {
  try {
    const { clientId } = req.params;
    const { userId = '' } = get(req, 'user', {});

    const clientBody = pick(req.body, ['name', 'description', 'redirect_uri']);
    if (clientBody.redirect_uri) {
      clientBody.redirectUri = clientBody.redirect_uri;
    }
    const client = await Client.findOne(
      { clientId, userId },
      { __v: false, clientSecret: false }
    );
    if (!client) {
      res.status(404);
      res.json({ message: `client '${clientId}' not found` });
    }
    client.set(clientBody);
    await client.save();
    res.json({ client: omit(client.toObject(), ['__v', '_id']) });
  } catch (err) {
    next(err);
  }
});

router.delete('/clients/:clientId', async function(req, res, next) {
  try {
    const { clientId } = req.params;
    const { userId = '' } = get(req, 'user', {});

    const { deletedCount = 0 } = await Client.deleteMany({
      clientId,
      userId,
    });

    res.json({ success: deletedCount > 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
