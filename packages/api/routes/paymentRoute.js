const { StartCheckout, CompleteCheckout, CancelCheckout } = require('../controllers/paymentController');
const authenticate = require('../middleware/authentication');
const isVerified = require('../middleware/verification');

const router = require('express').Router();

router.post('/payment/pay', authenticate, isVerified, StartCheckout);
router.get('/payment/complete-order', authenticate, CompleteCheckout);
router.get('/payment/cancel-order', authenticate, CancelCheckout);

module.exports = router;