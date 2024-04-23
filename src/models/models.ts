import type {
    User as PrismaUser,
    Profile as PrismaProfile,
    Preference as PrismaPreference,
    Meal as PrismaMeal,
} from "@prisma/client";

interface User extends PrismaUser {
    profile?: Profile;
    preferences: Preference[];
    meals: Meal[];
}

interface Profile extends PrismaProfile {}

interface Preference extends PrismaPreference {}

interface Meal extends PrismaMeal {}

export type { User, Profile, Preference, Meal };
