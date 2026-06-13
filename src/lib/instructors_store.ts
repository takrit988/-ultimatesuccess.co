import fs from "fs";
import path from "path";
import { db } from "./db";

export interface InstructorData {
  id: string;
  nameEn: string;
  nameTh: string;
  titleEn: string;
  titleTh: string;
  bioEn: string;
  bioTh: string;
  avatar: string;
  website: string | null;
  linkedin: string | null;
  roleType?: "EXECUTIVE" | "COACH" | "SPEAKER";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const MOCK_INSTRUCTORS: InstructorData[] = [
  {
    id: "inst-1",
    nameEn: "Dr. Walter Peterson",
    nameTh: "ดร. วอลเตอร์ พีเตอร์สัน",
    titleEn: "Executive Leadership Coach & Strategist",
    titleTh: "โค้ชและนักยุทธศาสตร์การนำทางผู้บริหาร",
    bioEn: "Over 20 years of experience coaching Fortune 500 CEOs and enterprise executives globally in scale-up strategy.",
    bioTh: "ประสบการณ์กว่า 20 ปีในการโค้ชซีอีโอ Fortune 500 และผู้บริหารองค์กรทั่วโลกในการวางกลยุทธ์การเติบโต",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    website: "https://ultimatesuccess.co",
    linkedin: "https://linkedin.com",
    roleType: "EXECUTIVE"
  },
  {
    id: "inst-2",
    nameEn: "Coach Pitchaya S.",
    nameTh: "โค้ชพิชญะ เอส.",
    titleEn: "SME Scaling Specialist & Marketing Architect",
    titleTh: "ผู้เชี่ยวชาญการขยายขนาด SME และสถาปนิกการตลาด",
    bioEn: "Helping retail and services businesses scale through digital transformation and automated customer acquisition pipelines.",
    bioTh: "ช่วยธุรกิจค้าปลีกและบริการเติบโตอย่างมั่นคงผ่านการเปลี่ยนผ่านดิจิทัลและการตลาดอัตโนมัติ",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    website: "https://ultimatesuccess.co",
    linkedin: "https://linkedin.com",
    roleType: "COACH"
  }
];

const filePath = path.join(process.cwd(), "prisma", "instructors.json");

function ensureJsonFile() {
  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(MOCK_INSTRUCTORS, null, 2), "utf-8");
  }
}

export async function getInstructors(): Promise<InstructorData[]> {
  // 1. Try DB
  try {
    const dbInstructors = await db.instructor.findMany({
      orderBy: { createdAt: "asc" }
    });
    if (dbInstructors.length > 0) {
      // Sync or append roleType
      ensureJsonFile();
      const local = JSON.parse(fs.readFileSync(filePath, "utf-8")) as InstructorData[];
      
      const mapped = dbInstructors.map(inst => {
        const matched = local.find(l => l.id === inst.id);
        return {
          id: inst.id,
          nameEn: inst.nameEn,
          nameTh: inst.nameTh,
          titleEn: inst.titleEn,
          titleTh: inst.titleTh,
          bioEn: inst.bioEn,
          bioTh: inst.bioTh,
          avatar: inst.avatar,
          website: inst.website,
          linkedin: inst.linkedin,
          roleType: (matched?.roleType || "COACH") as "EXECUTIVE" | "COACH" | "SPEAKER",
          createdAt: inst.createdAt,
          updatedAt: inst.updatedAt
        };
      });
      return mapped;
    }
  } catch (error) {
    console.warn("DB connection offline, reading instructors from local JSON storage");
  }

  // 2. Fallback to Local JSON
  try {
    ensureJsonFile();
    const localData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(localData);
  } catch (e) {
    return MOCK_INSTRUCTORS;
  }
}

export async function saveInstructor(data: Omit<InstructorData, "id"> & { id?: string }): Promise<InstructorData> {
  const isNew = !data.id;
  const id = data.id || `inst-${Date.now()}`;
  const record: InstructorData = {
    ...data,
    id,
    roleType: data.roleType || "COACH"
  };

  // 1. Write to DB if possible
  try {
    if (isNew) {
      await db.instructor.create({
        data: {
          id,
          nameEn: record.nameEn,
          nameTh: record.nameTh,
          titleEn: record.titleEn,
          titleTh: record.titleTh,
          bioEn: record.bioEn,
          bioTh: record.bioTh,
          avatar: record.avatar,
          website: record.website,
          linkedin: record.linkedin,
        }
      });
    } else {
      await db.instructor.update({
        where: { id },
        data: {
          nameEn: record.nameEn,
          nameTh: record.nameTh,
          titleEn: record.titleEn,
          titleTh: record.titleTh,
          bioEn: record.bioEn,
          bioTh: record.bioTh,
          avatar: record.avatar,
          website: record.website,
          linkedin: record.linkedin,
        }
      });
    }
  } catch (e) {
    console.warn("DB offline, saving instructor to local JSON storage only");
  }

  // 2. Write to Local JSON
  ensureJsonFile();
  const local = JSON.parse(fs.readFileSync(filePath, "utf-8")) as InstructorData[];
  const index = local.findIndex(l => l.id === id);
  if (index >= 0) {
    local[index] = record;
  } else {
    local.push(record);
  }
  fs.writeFileSync(filePath, JSON.stringify(local, null, 2), "utf-8");

  return record;
}

export async function deleteInstructor(id: string): Promise<boolean> {
  // 1. Delete from DB if possible
  try {
    await db.instructor.delete({
      where: { id }
    });
  } catch (e) {
    console.warn("DB offline, deleting from local JSON storage only");
  }

  // 2. Delete from Local JSON
  ensureJsonFile();
  const local = JSON.parse(fs.readFileSync(filePath, "utf-8")) as InstructorData[];
  const filtered = local.filter(l => l.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
