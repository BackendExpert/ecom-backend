const express = require('express');
const auth = require('../node_modules/secure-mern/middlewares/authMiddleware');
const checkPermission = require('../node_modules/secure-mern/middlewares/checkPermission');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

router.get('/get-roles', auth, checkPermission(['role:manage']), AdminController.getallroles)
router.get('/system-users', auth, checkPermission(['systemusers:manage']), AdminController.get_system_users)
router.post('/create-system-user', auth, checkPermission(['systemusers:create']), AdminController.create_system_user)
router.post('/create-permissions', auth, checkPermission(['permission:create']), AdminController.createPermission)
router.get('/get-role-data/:id', auth, checkPermission(['role:getone']), AdminController.get_role_data)
router.delete('/delete-permission/:id', auth, checkPermission(['permission:delete']), AdminController.delete_premission)
router.post('/create-newrole', auth, checkPermission(['role:create']), AdminController.create_new_role)
router.delete('/delete-role/:id', auth, checkPermission(['role:delete']), AdminController.delete_role)
router.post('/update-user-status/:id', auth, checkPermission(['user:updatestatus']), AdminController.update_user_status)
router.get('/get-user-activities', auth, checkPermission(['useractivity:manage']), AdminController.get_user_activities)
router.get('/get-one-activity/:id', auth, checkPermission(['useractivity:oneget']), AdminController.get_one_activity)

module.exports = router;