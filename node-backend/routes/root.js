const express = require('express');
const router = express.Router();
const path = require('path');

const routes = '^/$|/index(.html)?|/instruction(s)?(.html)?|/note(s)?(.html)?'

router.get(`${routes}`, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;