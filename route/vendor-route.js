const config = require('../common/config-util');
const express = require('express');
const router = express.Router();

const WebhookController = require('../controllers/vendor-controller');
const webhookController = new WebhookController(config);



router.get('/mongo',webhookController.execute)



module.exports = router;