import express from "express";
import UserController from "../controllers/user.controller";
import ProfileController from "../controllers/profile.controller";
import PreferenceController from "../controllers/preferences.controller";
// import MealController from './controllers/meal.controller';

const router = express.Router();

router.post("/users", UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/users/:userId", UserController.getUserById);
router.delete("/users/:userId", UserController.deleteUserById);

router.post("/profile/:userId", ProfileController.createProfile);
router.get("/profile/:userId", ProfileController.getProfileByUserId);
router.put("/profile/:userId", ProfileController.updateProfile);
router.delete("/profile/:userId", ProfileController.deleteProfile);

router.post("/preferences", PreferenceController.createPreference);
router.get("/preferences", PreferenceController.getAllPreferences);
router.get("/preferences/:userId", PreferenceController.getPreferencesByUserId);
router.put("/preferences/:preferenceId", PreferenceController.updatePreference);
router.delete(
    "/preferences/:preferenceId",
    PreferenceController.deletePreference
);

// router.post('/meals', MealController.createMeal);

export default router;
