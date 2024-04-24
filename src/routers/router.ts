import express from "express";
import ImageUpload from "../services/image-uploader";
import UserController from "../controllers/user.controller";
import ProfileController from "../controllers/profile.controller";
import PreferenceController from "../controllers/preferences.controller";
import MealController from "../controllers/meal.controller";

const router = express.Router();
const imageUpload = new ImageUpload();

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

router.post(
    "/meals",
    imageUpload.getUploadMiddleware(),
    MealController.createMeal
);
router.get("/meals", MealController.getAllMeals);
router.get("/meals/:mealId", MealController.getMealById);
router.put(
    "/meals/:mealId",
    imageUpload.getUploadMiddleware(),
    MealController.updateMeal
);
router.delete("/meals/:mealId", MealController.deleteMeal);

export default router;
