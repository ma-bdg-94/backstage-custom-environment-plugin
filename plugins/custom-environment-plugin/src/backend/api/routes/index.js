const express = require('express');
const router = express.Router();

const scenarioRoutes = require('./scenario.route')
const imageRoutes = require('./containerImage.route')
const environmentRoutes = require('./environment.route')

router.use('/api/scenarios', scenarioRoutes)
router.use('/api/images', imageRoutes)
router.use('/api/environments', environmentRoutes)

module.exports = router;
