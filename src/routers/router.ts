import express from "express";
import UserController from "../controllers/user.controller";
// import ProfileController from './controllers/profile.controller';
// import PreferenceController from './controllers/preference.controller';
// import MealController from './controllers/meal.controller';

const router = express.Router();

router.post("/users", UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/users/:userId", UserController.getUserById);
router.delete("/users/:userId", UserController.deleteUserById);

// router.post('/profiles', ProfileController.createProfile);

// router.post('/preferences', PreferenceController.createPreference);

// router.post('/meals', MealController.createMeal);

export default router;
