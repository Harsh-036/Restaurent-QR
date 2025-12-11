# TODO: Connect Update Profile and Delete Account to Backend APIs

## Steps to Complete

- [ ] Add updateUser async thunk to authSlice.js for PUT /api/update-user/:id
- [ ] Add deleteUser async thunk to authSlice.js for DELETE /api/delete-user/:id
- [ ] Update updateProfile.jsx to dispatch updateUser thunk on Save Changes
- [ ] Update updateProfile.jsx to dispatch deleteUser thunk on Delete Account
- [ ] Handle update success: Update Redux state and localStorage, reflect in Navbar
- [ ] Handle delete success: Clear Redux state, clear localStorage, redirect to Login
- [ ] Import necessary Redux hooks in updateProfile.jsx (useDispatch, useSelector)
- [ ] Test the integration
