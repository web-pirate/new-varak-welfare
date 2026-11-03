// Mock data for LOCAL development only: 24 cancer types, one approved campaign per cancer, menu, states.
// Usage:  node prisma/seed-dev.mjs            (adds data, safe to re-run)
//         node prisma/seed-dev.mjs --reset    (removes the mock campaigns and the mock user)
// Every person, hospital and story below is fictional.
import pg from "pg";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "postgresql://manishsingh@localhost:5432/varak_dev";
const host = new URL(url).hostname;
if (!["localhost", "127.0.0.1"].includes(host)) {
  console.error(`Refusing to seed "${host}": this script only runs against a local database.`);
  process.exit(1);
}

// Same rule as slugify() in src/lib/utils.ts, so slugs match the /campaigns?cancerType= links
const slugify = (t) => t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");

const STATES = {
  MP: ["Madhya Pradesh", ["Indore", "Bhopal"]],
  MH: ["Maharashtra", ["Mumbai"]],
  DL: ["Delhi", ["New Delhi"]],
  UP: ["Uttar Pradesh", ["Lucknow"]],
  KA: ["Karnataka", ["Bengaluru Urban"]],
  TN: ["Tamil Nadu", ["Chennai"]],
  WB: ["West Bengal", ["Kolkata"]],
  GJ: ["Gujarat", ["Ahmedabad"]],
  RJ: ["Rajasthan", ["Jaipur"]],
  BR: ["Bihar", ["Patna"]],
};

// [cancer, patient, age, fundraiser's relation, hospital, state, district, goal INR, % raised, donors, flags, treatment needed]
const ROWS = [
  ["Breast Cancer", "Sunita Verma", 41, "Husband", "Narmada Cancer Care Hospital", "MP", "Indore", 800000, 0.62, 118, "F", "surgery and chemotherapy"],
  ["Blood Cancer (Leukemia)", "Aarav Sharma", 6, "Father", "Sanjivani Children's Hospital", "MH", "Mumbai", 1800000, 0.35, 204, "FU", "chemotherapy and a possible bone marrow transplant"],
  ["Lung Cancer", "Ramesh Yadav", 58, "Son", "Gomti Medical Institute", "UP", "Lucknow", 1200000, 0.41, 87, "", "targeted therapy and radiation"],
  ["Brain Cancer", "Meera Iyer", 17, "Mother", "Chennai Neuro & Cancer Centre", "TN", "Chennai", 2200000, 0.28, 143, "U", "surgery and radiation therapy"],
  ["Cervical Cancer", "Lakshmi Devi", 44, "Husband", "Ganga Women's Cancer Hospital", "BR", "Patna", 650000, 0.74, 96, "F", "radiation therapy and chemotherapy"],
  ["Oral Cancer", "Mohan Lal", 52, "Daughter", "Pink City Cancer Centre", "RJ", "Jaipur", 900000, 0.55, 74, "", "surgery and radiation therapy"],
  ["Ovarian Cancer", "Priya Nair", 36, "Husband", "Garden City Oncology Centre", "KA", "Bengaluru Urban", 1500000, 0.47, 109, "", "surgery and chemotherapy"],
  ["Pancreatic Cancer", "Dinesh Patel", 63, "Son", "Sabarmati Cancer Institute", "GJ", "Ahmedabad", 2000000, 0.19, 52, "", "surgery and chemotherapy"],
  ["Stomach Cancer", "Farida Khan", 49, "Daughter", "Hooghly Cancer Hospital", "WB", "Kolkata", 1100000, 0.58, 91, "", "surgery and chemotherapy"],
  ["Kidney Cancer", "Vikram Singh", 45, "Brother", "Capital Oncology Hospital", "DL", "New Delhi", 1400000, 0.66, 125, "", "surgery to remove the tumour"],
  ["Liver Cancer", "Gopal Prasad", 56, "Son", "Patliputra Liver & Cancer Centre", "BR", "Patna", 1700000, 0.31, 63, "", "a liver procedure and follow-up treatment"],
  ["Bone Cancer", "Rohan Mehta", 15, "Father", "Sanjivani Children's Hospital", "MH", "Mumbai", 1600000, 0.44, 132, "U", "limb-saving surgery and chemotherapy"],
  ["Prostate Cancer", "Harish Gupta", 67, "Son", "Narmada Cancer Care Hospital", "MP", "Indore", 750000, 0.71, 80, "", "surgery and hormone therapy"],
  ["Colorectal Cancer", "Anita Joshi", 38, "Self", "Pink City Cancer Centre", "RJ", "Jaipur", 950000, 0.52, 69, "", "surgery and chemotherapy"],
  ["Lymphoma", "Kabir Ahmed", 12, "Mother", "Garden City Oncology Centre", "KA", "Bengaluru Urban", 1300000, 0.6, 158, "F", "a course of chemotherapy"],
  ["Thyroid Cancer", "Neha Kulkarni", 27, "Self", "Konkan Surgical & Cancer Hospital", "MH", "Mumbai", 450000, 0.83, 71, "", "thyroid surgery and follow-up care"],
  ["Skin Cancer", "Suresh Pillai", 61, "Daughter", "Chennai Neuro & Cancer Centre", "TN", "Chennai", 500000, 0.49, 44, "", "surgery to remove the cancer"],
  ["Multiple Myeloma", "Bhaskar Rao", 64, "Son", "Capital Oncology Hospital", "DL", "New Delhi", 1900000, 0.37, 58, "", "medicines and regular treatment"],
  ["Gallbladder Cancer", "Shanti Devi", 53, "Son", "Gomti Medical Institute", "UP", "Lucknow", 850000, 0.46, 66, "", "surgery and chemotherapy"],
  ["Uterine Cancer", "Radha Menon", 55, "Daughter", "Hooghly Cancer Hospital", "WB", "Kolkata", 700000, 0.68, 83, "", "surgery"],
  ["Esophageal Cancer", "Prakash Das", 59, "Son", "Hooghly Cancer Hospital", "WB", "Kolkata", 1000000, 0.33, 49, "", "surgery and radiation therapy"],
  ["Bladder Cancer", "Imran Sheikh", 48, "Brother", "Sabarmati Cancer Institute", "GJ", "Ahmedabad", 800000, 0.57, 77, "", "surgery and follow-up treatment"],
  ["Head & Neck Cancer", "Jagdish Chandra", 57, "Son", "Narmada Cancer Care Hospital", "MP", "Bhopal", 1250000, 0.42, 92, "F", "surgery and radiation therapy"],
  ["Testicular Cancer", "Arjun Reddy", 24, "Self", "Capital Oncology Hospital", "DL", "New Delhi", 600000, 0.78, 101, "F", "surgery and chemotherapy"],
];

// Only 5 portrait photos exist in public/patients; the others use the card's no-photo fallback
const PHOTOS = { 0: "/patients/priya.jpg", 2: "/patients/rajesh.jpg", 4: "/patients/lakshmi.jpg", 5: "/patients/mohammed.jpg", 15: "/patients/ananya.jpg" };
const VERIFY = ["FULLY_VERIFIED", "HOSPITAL_VERIFIED", "TEAM_VERIFIED", "ADMIN_VERIFIED"];
const MOCK_EMAIL = "mock.fundraiser@example.com";
const MENU = [["Home", "/"], ["Campaigns", "/campaigns"], ["Cancer Types", "/cancer-types"], ["Monthly Giving", "/monthly-giving"], ["How It Works", "/how-it-works"], ["About", "/about"]];

const db = new pg.Client({ connectionString: url });
await db.connect();
try {
  await db.query("BEGIN");

  if (process.argv.includes("--reset")) {
    const r = await db.query(`DELETE FROM "Campaign" WHERE "createdById" IN (SELECT id FROM "User" WHERE email = $1)`, [MOCK_EMAIL]);
    await db.query(`DELETE FROM "User" WHERE email = $1`, [MOCK_EMAIL]);
    await db.query("COMMIT");
    console.log(`Removed ${r.rowCount} mock campaigns and the mock user.`);
    process.exit(0);
  }

  const stateId = {}, districtId = {};
  for (const [code, [name, districts]] of Object.entries(STATES)) {
    await db.query(`INSERT INTO "State"(id,name,code) VALUES ($1,$2,$3) ON CONFLICT (code) DO NOTHING`, [randomUUID(), name, code]);
    stateId[code] = (await db.query(`SELECT id FROM "State" WHERE code=$1`, [code])).rows[0].id;
    for (const d of districts) {
      await db.query(`INSERT INTO "District"(id,name,"stateId") VALUES ($1,$2,$3) ON CONFLICT (name,"stateId") DO NOTHING`, [randomUUID(), d, stateId[code]]);
      districtId[`${code}/${d}`] = (await db.query(`SELECT id FROM "District" WHERE name=$1 AND "stateId"=$2`, [d, stateId[code]])).rows[0].id;
    }
  }

  const cancerId = {};
  for (const [cancer] of ROWS) {
    await db.query(
      `INSERT INTO "CancerType"(id,name,slug,description,"updatedAt") VALUES ($1,$2,$3,$4,now()) ON CONFLICT (slug) DO NOTHING`,
      [randomUUID(), cancer, slugify(cancer), `Fundraisers for patients fighting ${cancer.toLowerCase()}.`]
    );
    cancerId[cancer] = (await db.query(`SELECT id FROM "CancerType" WHERE slug=$1`, [slugify(cancer)])).rows[0].id;
  }

  await db.query(
    `INSERT INTO "User"(id,"clerkId",email,"firstName","lastName",role,"updatedAt") VALUES ($1,'mock_clerk_local',$2,'Demo','Fundraiser','FUNDRAISER',now()) ON CONFLICT ("clerkId") DO NOTHING`,
    [randomUUID(), MOCK_EMAIL]
  );
  const creator = (await db.query(`SELECT id FROM "User" WHERE "clerkId"='mock_clerk_local'`)).rows[0].id;

  let added = 0;
  for (const [i, r] of ROWS.entries()) {
    const [cancer, name, age, relation, hospital, st, district, goal, pct, donors, flags, need] = r;
    const first = name.split(" ")[0];
    const title = `Help ${first} fight ${cancer.replace(/ \(.*\)/, "").toLowerCase()}`;
    const raised = Math.round((goal * pct) / 1000) * 1000;
    const who = relation === "Self" ? `${first} is raising this fundraiser for their own treatment.` : `This fundraiser is raised by ${first}'s ${relation.toLowerCase()}.`;
    const story =
      `${name}, ${age}, from ${district}, was recently diagnosed with ${cancer.replace(/ \(.*\)/, "").toLowerCase()} and now needs ${need} at ${hospital}.\n\n` +
      `${who} The family has already spent their savings on tests and early treatment, and the remaining cost is beyond what they can manage. Every contribution brings ${first} closer to the care needed.`;
    const res = await db.query(
      `INSERT INTO "Campaign"(id,slug,title,story,"goalAmount","amountRaised","donorCount","viewCount","beneficiaryName","beneficiaryRelation","beneficiaryAge","beneficiaryImage",
         "cancerTypeId","hospitalName","hospitalCity","stateId","districtId",status,"verificationStatus","isFeatured","isUrgent","endDate","createdById","createdAt","updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'APPROVED',$18,$19,$20, now() + ($21 || ' days')::interval,$22, now() - ($23 || ' days')::interval, now())
       ON CONFLICT (slug) DO NOTHING`,
      [randomUUID(), slugify(title), title, story, goal, raised, donors, 200 + i * 37, name, relation, age, PHOTOS[i] ?? null,
       cancerId[cancer], hospital, district, stateId[st], districtId[`${st}/${district}`], VERIFY[i % 4], flags.includes("F"), flags.includes("U"),
       30 + (i % 5) * 15, creator, i]
    );
    added += res.rowCount;
  }

  for (const [order, [name, path]] of MENU.entries()) {
    await db.query(`INSERT INTO "MenuItem"(id,name,url,"order","updatedAt") SELECT $1,$2,$3,$4,now() WHERE NOT EXISTS (SELECT 1 FROM "MenuItem" WHERE url=$3)`, [randomUUID(), name, path, order]);
  }

  await db.query("COMMIT");
  console.log(`Seeded local database: ${added} new campaigns (${ROWS.length} total in script), ${ROWS.length} cancer types, ${Object.keys(STATES).length} states, menu.`);
} catch (e) {
  await db.query("ROLLBACK");
  console.error("Seed failed, nothing was written:", e.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
