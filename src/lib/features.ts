import { db } from "./db";

export interface FeatureDefinition {
  key: string;
  nameEn: string;
  nameTh: string;
  isEnabled: boolean;
}

export const DEFAULT_FEATURES: Omit<FeatureDefinition, "isEnabled">[] = [
  { key: "bi", nameEn: "BI Analytics", nameTh: "ระบบวิเคราะห์ข้อมูลธุรกิจ (BI)" },
  { key: "crm", nameEn: "CRM Pipelines", nameTh: "ระบบบริหารงานขาย (CRM)" },
  { key: "courses", nameEn: "Courses & LMS", nameTh: "ระบบหลักสูตรออนไลน์ (LMS)" },
  { key: "blog", nameEn: "Blog & Media", nameTh: "ระบบบล็อกและสื่อ" },
  { key: "instructors", nameEn: "Team & Speakers", nameTh: "ทีมงานและวิทยากร" },
  { key: "users", nameEn: "User Directory", nameTh: "ระบบจัดการผู้ใช้งาน" },
  { key: "tickets", nameEn: "Ticket Scanner", nameTh: "ระบบบัตรและตั๋วผ่านประตู" },
  { key: "affiliate", nameEn: "Affiliate Portal", nameTh: "ระบบลิงก์พันธมิตร (Affiliate)" },
];

/**
 * Initializes default feature toggles in the database if they do not exist.
 * Resilient to database errors.
 */
export async function initializeFeaturesIfNeeded(): Promise<void> {
  try {
    const count = await db.featureToggle.count();
    if (count < DEFAULT_FEATURES.length) {
      for (const item of DEFAULT_FEATURES) {
        await db.featureToggle.upsert({
          where: { key: item.key },
          update: {},
          create: {
            key: item.key,
            nameEn: item.nameEn,
            nameTh: item.nameTh,
            isEnabled: true,
          },
        });
      }
      console.log("Feature toggles initialized successfully.");
    }
  } catch (error) {
    console.warn("Failed to initialize feature toggles in database, using memory fallbacks.", error);
  }
}

/**
 * Retrieves the state of a single feature toggle.
 * Returns true as fallback if not found or DB query fails.
 */
export async function getFeatureToggle(key: string): Promise<boolean> {
  try {
    const toggle = await db.featureToggle.findUnique({
      where: { key },
    });
    return toggle ? toggle.isEnabled : true;
  } catch (error) {
    console.warn(`Database query failed for feature toggle: ${key}, defaulting to enabled.`, error);
    return true;
  }
}

/**
 * Retrieves the states of all feature toggles as a map.
 * Returns all enabled as fallback if DB query fails.
 */
export async function getAllFeatureToggles(): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {};
  
  // Seed initial defaults
  for (const item of DEFAULT_FEATURES) {
    result[item.key] = true;
  }

  try {
    // Ensure table has settings
    await initializeFeaturesIfNeeded();
    
    const toggles = await db.featureToggle.findMany();
    for (const toggle of toggles) {
      result[toggle.key] = toggle.isEnabled;
    }
  } catch (error) {
    console.warn("Database failed to retrieve feature toggles, returning all enabled.", error);
  }

  return result;
}

/**
 * Updates a feature toggle's state.
 */
export async function updateFeatureToggle(key: string, isEnabled: boolean) {
  try {
    return await db.featureToggle.upsert({
      where: { key },
      update: { isEnabled },
      create: {
        key,
        nameEn: DEFAULT_FEATURES.find(f => f.key === key)?.nameEn || key,
        nameTh: DEFAULT_FEATURES.find(f => f.key === key)?.nameTh || key,
        isEnabled,
      },
    });
  } catch (error) {
    console.error(`Failed to update feature toggle: ${key}`, error);
    throw error;
  }
}
