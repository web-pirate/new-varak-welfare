// Awareness-poster content for the cancer pop-up. General information only, not medical advice.
// shortcut: written for awareness, not clinically reviewed. Have an oncologist review before launch.

export type Poster = {
  lede: string;
  facts: [title: string, text: string][];
  signs: string[];
  act: [big: string, small: string];
  sources?: { label: string; href: string }[];
};

export const defaultSources = [
  { label: "WHO: cancer", href: "https://www.who.int/health-topics/cancer" },
  { label: "US National Cancer Institute: cancer types", href: "https://www.cancer.gov/types" },
];

export const posters: Record<string, Poster> = {
  "Lung Cancer": {
    lede: "The deadliest cancer, and it isn’t only smokers who get it.",
    facts: [
      ["Deadliest cancer", "The top cause of cancer deaths worldwide."],
      ["Smoking causes about 85%", "Cigarettes, bidis and hookah all count."],
      ["Non-smokers are at risk too", "Air pollution, cooking smoke and workplace chemicals."],
      ["Often mistaken for TB", "If TB medicine isn’t helping, ask about lung cancer."],
      ["Usually found late", "Early checks can save lives."],
      ["Treatable when found early", "Surgery or radiation can aim for a cure."],
    ],
    signs: ["Cough over 3 weeks", "Chest pain", "Breathlessness", "Coughing up blood", "Tiredness and weight loss"],
    act: ["A cough that lasts more than 3 weeks needs checking", "See a doctor and ask about both TB and lung cancer."],
    sources: [
      { label: "WHO lung cancer fact sheet", href: "https://www.who.int/news-room/fact-sheets/detail/lung-cancer" },
      { label: "Nivarana", href: "https://nivarana.org/article/fighting-lung-cancer-in-india-overcoming-barriers-to-equitable-care" },
    ],
  },

  "Breast Cancer": {
    lede: "The most common cancer in women, and very treatable when found early.",
    facts: [
      ["Most common in women", "In India and across the world."],
      ["Early detection works", "Found early, most breast cancers can be treated successfully."],
      ["Often found late in India", "Many women reach a doctor only when the lump is large."],
      ["Check yourself monthly", "Know how your breasts normally look and feel."],
      ["Screening saves lives", "Ask a doctor about clinical breast exams and mammograms."],
      ["Men can get it too", "It is rare, but any lump in a man’s breast needs checking."],
    ],
    signs: ["New lump in breast or underarm", "Change in size or shape", "Skin dimpling", "Nipple discharge or pulling in", "Redness or scaling"],
    act: ["Found a lump? Don’t wait for it to hurt", "Most lumps are not cancer, but only a doctor can tell."],
  },

  "Blood Cancer (Leukemia)": {
    lede: "A cancer of the blood and bone marrow, and the most common childhood cancer.",
    facts: [
      ["Starts in the bone marrow", "Where the body makes blood cells."],
      ["Common in children", "Leukaemia is the most common cancer in children."],
      ["Childhood leukaemia is often curable", "Good treatment gives many children a long life."],
      ["Easily mistaken", "Tiredness, fever and aches look like common illnesses."],
      ["A simple blood test is the first clue", "A complete blood count can flag a problem."],
      ["Some need a bone marrow transplant", "Matching donors and treatment can be costly."],
    ],
    signs: ["Constant tiredness and paleness", "Fevers or frequent infections", "Easy bruising or bleeding", "Bone or joint pain", "Swollen glands"],
    act: ["Fever that keeps coming back needs a blood test", "Ask for a complete blood count if a child is often unwell."],
  },

  "Brain Cancer": {
    lede: "A tumour in the brain can change how a person moves, sees, thinks and feels.",
    facts: [
      ["Not every brain tumour is cancer", "But even non-cancerous ones can be serious."],
      ["Symptoms depend on the place", "Sight, speech, balance or memory can be affected."],
      ["Can affect children and adults", "Some types are more common in children."],
      ["Headaches are common, brain tumours are not", "But one that keeps getting worse is worth a scan."],
      ["An MRI scan finds it", "Early diagnosis gives more treatment choices."],
      ["Treatment is specialised", "Surgery, radiation and medicines are often combined."],
    ],
    signs: ["Headaches that keep getting worse", "Seizures or fits", "Vomiting, especially in the morning", "Vision or speech changes", "Weakness or personality change"],
    act: ["A new, worsening headache is worth a scan", "See a doctor, especially if there are fits or vision changes."],
  },

  "Cervical Cancer": {
    lede: "One of the few cancers we can prevent with a vaccine and a simple test.",
    facts: [
      ["Caused by HPV", "Almost all cases follow a long-lasting HPV infection."],
      ["Vaccine prevents it", "HPV vaccination works best for girls aged 9 to 14."],
      ["Screening finds changes early", "A Pap or HPV test can spot problems before cancer."],
      ["Very common in India", "A leading cancer among Indian women."],
      ["Often silent at first", "Symptoms usually appear only in later stages."],
      ["Curable when found early", "Early treatment is simple and effective."],
    ],
    signs: ["Bleeding between periods", "Bleeding after sex", "Bleeding after menopause", "Unusual vaginal discharge", "Pelvic pain"],
    act: ["Women over 30 should be screened", "Ask about a Pap smear, HPV test or visual screening."],
  },

  "Oral Cancer": {
    lede: "Cancer of the mouth is very common in India, and tobacco is the main cause.",
    facts: [
      ["Tobacco is the main cause", "Chewed, smoked, gutka, khaini and tobacco paan all count."],
      ["Supari and alcohol add risk", "Areca nut and alcohol raise the danger further."],
      ["Often starts as a small patch", "White or red patches can turn into cancer."],
      ["Easy to spot early", "Your mouth can be checked with a light and a mirror."],
      ["Often found late", "Many people ignore a mouth ulcer for months."],
      ["Early treatment saves the jaw and the face", "Late treatment can mean major surgery."],
    ],
    signs: ["Mouth ulcer that doesn’t heal in 3 weeks", "White or red patch", "Lump or thickening in the mouth", "Pain or trouble chewing or swallowing", "Numbness in the mouth or tongue"],
    act: ["A mouth ulcer that lasts 3 weeks needs a doctor", "Don’t treat it yourself. Get it looked at."],
  },

  "Ovarian Cancer": {
    lede: "Often called a silent cancer, because its signs are easy to brush aside.",
    facts: [
      ["Signs are vague", "Bloating and belly discomfort are easily blamed on digestion."],
      ["Often found late", "Many women are diagnosed after it has spread."],
      ["No simple screening test", "So noticing symptoms matters even more."],
      ["Family history matters", "Some cases run in families through gene changes."],
      ["It affects women of all ages", "Most often after menopause."],
      ["Surgery and chemotherapy", "Treatment can control it, especially if found earlier."],
    ],
    signs: ["Persistent bloating", "Pelvic or belly pain", "Feeling full quickly", "Needing to pass urine often", "Changes in bowel habits"],
    act: ["Symptoms that last more than 2 weeks need checking", "Tell your doctor if the same signs keep coming back."],
  },

  "Pancreatic Cancer": {
    lede: "One of the hardest cancers to treat, because it is usually found late.",
    facts: [
      ["Usually found late", "Early signs are few and easy to miss."],
      ["Smoking raises the risk", "So do long-term pancreatitis and obesity."],
      ["Jaundice can be a clue", "Yellow eyes and skin need urgent attention."],
      ["New diabetes can be a sign", "Especially with weight loss in older adults."],
      ["Surgery is the main chance of cure", "Only possible when it is caught early."],
      ["Family history matters", "A few cases run in families."],
    ],
    signs: ["Yellow skin or eyes", "Upper belly or back pain", "Unexplained weight loss", "Loss of appetite", "Pale stools or dark urine"],
    act: ["Yellow eyes or skin need a doctor straight away", "Don’t wait for the colour to fade."],
  },

  "Stomach Cancer": {
    lede: "Often mistaken for acidity or gas, until it has grown.",
    facts: [
      ["Looks like indigestion", "That is why it is so often missed."],
      ["H. pylori infection raises the risk", "A common stomach infection that can be treated."],
      ["Diet plays a part", "Very salty, smoked or pickled foods raise the risk."],
      ["Tobacco adds risk", "Smoking and chewing tobacco both count."],
      ["Higher in some regions of India", "Rates vary widely across the country."],
      ["Treatable when early", "Surgery can cure early-stage cancer."],
    ],
    signs: ["Indigestion that doesn’t go away", "Feeling full after a few bites", "Nausea or vomiting", "Black stools or vomiting blood", "Unexplained weight loss"],
    act: ["Acidity that lasts for weeks needs checking", "Ask about an endoscopy if medicines don’t help."],
  },

  "Kidney Cancer": {
    lede: "Often found by chance on a scan, before it causes any symptoms.",
    facts: [
      ["Often silent early on", "Many are found during scans for something else."],
      ["Blood in the urine is the key warning", "Even if it comes and goes."],
      ["Smoking raises the risk", "So do obesity and high blood pressure."],
      ["Usually affects adults", "Most often over the age of 50."],
      ["Surgery is the main treatment", "Often removing the tumour or the kidney."],
      ["You can live with one kidney", "A healthy kidney can do the work of two."],
    ],
    signs: ["Blood in the urine", "Pain in the side or lower back", "A lump in the side", "Unexplained weight loss", "Tiredness or fever"],
    act: ["Blood in your urine always needs a check", "Even if there is no pain."],
  },

  "Liver Cancer": {
    lede: "Often grows on a liver that is already damaged, and can be prevented.",
    facts: [
      ["Hepatitis B and C are major causes", "Long-term infection can lead to liver cancer."],
      ["Hepatitis B vaccine prevents it", "Safe, simple, and given in childhood."],
      ["Cirrhosis raises the risk", "From alcohol, hepatitis or fatty liver."],
      ["Fatty liver is rising", "Weight, diabetes and diet all play a part."],
      ["Regular scans help", "People with cirrhosis need an ultrasound every 6 months."],
      ["Often found late", "Symptoms usually come when it is advanced."],
    ],
    signs: ["Yellow eyes or skin", "Pain in the upper right belly", "Swelling of the belly", "Loss of appetite and weight", "Nausea and tiredness"],
    act: ["Get tested for hepatitis B and C", "Ask for the hepatitis B vaccine if you haven’t had it."],
  },

  "Bone Cancer": {
    lede: "Rare, and most common in children and young people, so pain is often brushed aside.",
    facts: [
      ["Mostly affects young people", "Osteosarcoma and Ewing sarcoma are the main types."],
      ["Often mistaken for growing pains", "Or for a sports injury."],
      ["Pain that wakes you at night", "Is a warning sign."],
      ["Often near the knee or shoulder", "Where bones grow fastest."],
      ["An X-ray is the first step", "Then a scan and a biopsy."],
      ["Limbs can often be saved", "Modern surgery and chemotherapy make this possible."],
    ],
    signs: ["Bone pain that keeps coming back", "Pain at night or at rest", "Swelling or a lump on a bone", "A bone that breaks easily", "Limping or stiff joint"],
    act: ["Bone pain that lasts 2 weeks needs an X-ray", "Especially if there is swelling."],
  },

  "Prostate Cancer": {
    lede: "Common in older men, and many cases grow slowly.",
    facts: [
      ["Mostly affects men over 50", "The risk rises with age."],
      ["Early cancer often has no signs", "So checks matter for older men."],
      ["Urine problems are not always cancer", "An enlarged prostate is much more common."],
      ["A PSA blood test is one check", "Talk to a doctor before testing."],
      ["Family history raises the risk", "If a father or brother had it."],
      ["Many treatment choices", "Surgery, radiation, hormones, or careful watching."],
    ],
    signs: ["Weak or slow urine stream", "Needing to pass urine often at night", "Blood in urine or semen", "Pain in the hips, back or pelvis", "Feeling the bladder isn’t empty"],
    act: ["Men over 50 should talk to a doctor about checks", "Earlier if a close relative had prostate cancer."],
  },

  "Colorectal Cancer": {
    lede: "Cancer of the colon and rectum, often wrongly put down to piles.",
    facts: [
      ["Often mistaken for piles", "Blood in the stool should never be assumed to be piles."],
      ["Starts as small growths", "Polyps can be found and removed before they turn to cancer."],
      ["Screening can prevent it", "Stool tests and colonoscopy find problems early."],
      ["Lifestyle matters", "Low fibre, processed meat, alcohol, smoking and inactivity raise the risk."],
      ["Rising in younger adults", "It is no longer only a disease of the old."],
      ["Highly curable when early", "Surgery works best at an early stage."],
    ],
    signs: ["Blood in the stool", "A change in bowel habits for weeks", "Belly pain or cramps", "Unexplained weight loss", "Tiredness or low blood count"],
    act: ["Blood in the stool needs a doctor", "Don’t assume it is piles."],
  },

  "Lymphoma": {
    lede: "Cancer of the body’s germ-fighting system, often first noticed as a painless lump.",
    facts: [
      ["Starts in the lymph nodes", "Glands in the neck, armpit and groin."],
      ["A painless swelling is the main sign", "That doesn’t go away."],
      ["Often mistaken for TB or infection", "Swollen glands are often blamed on these first."],
      ["Hodgkin lymphoma is highly curable", "Most patients do well with treatment."],
      ["A biopsy gives the answer", "A sample of the gland is tested."],
      ["Affects all ages", "Including young adults and children."],
    ],
    signs: ["Painless swollen glands", "Fever that keeps returning", "Drenching night sweats", "Unexplained weight loss", "Itching all over"],
    act: ["A swollen gland that lasts over 2 weeks needs checking", "Ask for a biopsy if the cause isn’t clear."],
  },

  "Thyroid Cancer": {
    lede: "A lump in the neck is usually not cancer, but it always deserves a check.",
    facts: [
      ["Most neck lumps are not cancer", "But only tests can tell."],
      ["More common in women", "And often found in younger adults."],
      ["Most types are very treatable", "Surgery often cures it."],
      ["Ultrasound and a needle test", "Check a lump quickly and safely."],
      ["Radiation exposure raises the risk", "Especially in childhood."],
      ["Usually grows slowly", "But some types are fast."],
    ],
    signs: ["A lump or swelling in the neck", "Hoarse voice that doesn’t improve", "Trouble swallowing", "Neck or throat pain", "A cough that isn’t from a cold"],
    act: ["A neck lump that stays more than 2 weeks needs a check", "Ask for a neck ultrasound."],
  },

  "Skin Cancer": {
    lede: "The most visible cancer, so it can often be caught early by simply looking.",
    facts: [
      ["Sun is the main cause", "Ultraviolet rays damage skin over the years."],
      ["Look for new or changing moles", "Size, colour, shape or itching."],
      ["Dark skin is not safe", "Melanoma can appear on palms, soles and under nails."],
      ["A sore that won’t heal is a warning", "Especially on sun-exposed skin."],
      ["Early removal usually cures it", "A small procedure is often enough."],
      ["Protect your skin", "Shade, clothes and sunscreen cut the risk."],
    ],
    signs: ["A new or changing mole", "A sore that doesn’t heal", "A dark streak under a nail", "A scaly or crusty patch", "A mole that bleeds or itches"],
    act: ["Any spot that changes shape or colour needs a doctor", "Take a photo to see if it changes."],
  },

  "Multiple Myeloma": {
    lede: "A cancer of the bone marrow that often hides behind “back pain”.",
    facts: [
      ["Starts in plasma cells", "Cells in the bone marrow that make antibodies."],
      ["Mostly affects older adults", "Usually over the age of 60."],
      ["Often mistaken for arthritis", "Bone pain is blamed on age."],
      ["It can weaken bones and kidneys", "And cause low blood counts."],
      ["Blood and urine tests find it", "Along with scans and a marrow test."],
      ["Treatable, though rarely cured", "Many people live well for years."],
    ],
    signs: ["Bone pain, especially in the back or ribs", "Tiredness and paleness", "Frequent infections", "Bones that break easily", "Excessive thirst or confusion"],
    act: ["Back pain with tiredness needs a blood test", "Especially if it doesn’t ease with rest."],
  },

  "Gallbladder Cancer": {
    lede: "Quietly common in parts of India, and often found only after gallstone surgery.",
    facts: [
      ["Gallstones raise the risk", "Long-lasting stones can irritate the gallbladder."],
      ["Common in the Gangetic plain", "Rates are high in north India."],
      ["More common in women", "Especially after middle age."],
      ["Often found late", "Early signs look like simple gallstone pain."],
      ["Surgery gives the best chance", "When found early."],
      ["Stones with symptoms need review", "Don’t ignore repeated pain."],
    ],
    signs: ["Pain in the upper right belly", "Yellow eyes or skin", "Nausea and vomiting", "A lump in the upper belly", "Unexplained weight loss"],
    act: ["Gallstone pain that keeps returning needs a surgeon’s opinion", "Ask for the removed gallbladder to be tested."],
  },

  "Uterine Cancer": {
    lede: "Usually gives an early warning: unusual bleeding. Don’t ignore it.",
    facts: [
      ["Bleeding is the main sign", "Especially after menopause."],
      ["Often found early", "Because the bleeding is hard to miss."],
      ["Irregular periods matter", "Long gaps or very heavy bleeding."],
      ["Weight and diabetes raise the risk", "As do some hormone medicines."],
      ["Surgery usually cures early cases", "Removal of the womb."],
      ["Not a normal part of ageing", "Bleeding after menopause always needs checking."],
    ],
    signs: ["Bleeding after menopause", "Bleeding between periods", "Very heavy or long periods", "Pelvic pain", "Watery or bloody discharge"],
    act: ["Any bleeding after menopause needs a doctor", "Go even if it was only once."],
  },

  "Esophageal Cancer": {
    lede: "Food that sticks when you swallow is a sign to never ignore.",
    facts: [
      ["Trouble swallowing is the key sign", "It slowly gets worse."],
      ["Tobacco and alcohol raise the risk", "Chewed or smoked."],
      ["Very hot drinks may raise the risk", "Let tea cool before drinking."],
      ["Acid reflux that never goes", "Can damage the food pipe over time."],
      ["Often found late", "Because people adjust to softer food."],
      ["Early cases can be treated", "Surgery or other procedures."],
    ],
    signs: ["Difficulty swallowing", "Food sticking in the chest", "Pain when swallowing", "Unexplained weight loss", "Hoarse voice or cough"],
    act: ["Swallowing that gets harder needs a check", "Ask about an endoscopy."],
  },

  "Bladder Cancer": {
    lede: "Blood in the urine is often the first sign, and often wrongly blamed on infection.",
    facts: [
      ["Painless blood in the urine", "Is the most common first sign."],
      ["Often mistaken for a UTI", "If it keeps returning, it needs more tests."],
      ["Smoking is the biggest cause", "Smokers are several times more likely to get it."],
      ["Some jobs raise the risk", "Dye, rubber, leather and chemical work."],
      ["A camera test finds it", "A cystoscopy looks inside the bladder."],
      ["Needs regular follow-up", "It can come back after treatment."],
    ],
    signs: ["Blood in the urine", "Needing to pass urine often", "Pain when passing urine", "Feeling you can’t empty the bladder", "Back or pelvic pain"],
    act: ["Blood in the urine always needs a check", "Even if it stops on its own."],
  },

  "Head & Neck Cancer": {
    lede: "Cancers of the mouth, throat and voice box, closely linked to tobacco and alcohol.",
    facts: [
      ["Tobacco and alcohol cause most", "Smoked or chewed, both count."],
      ["Very common in Indian men", "A large share of all cancers."],
      ["HPV causes some throat cancers", "Especially at the back of the throat."],
      ["A hoarse voice can be an early sign", "If it lasts over 3 weeks."],
      ["One-sided ear pain can be a clue", "Pain in the ear with a sore throat."],
      ["Early treatment keeps speech and swallowing", "Late treatment may not."],
    ],
    signs: ["Sore throat that doesn’t go away", "Hoarse voice for over 3 weeks", "Lump in the neck", "Trouble swallowing", "Mouth ulcer that doesn’t heal"],
    act: ["A hoarse voice lasting 3 weeks needs a doctor", "Especially if you use tobacco."],
  },

  "Testicular Cancer": {
    lede: "Mostly affects young men, and is one of the most curable cancers.",
    facts: [
      ["Mostly affects men aged 15 to 40", "Often in the prime of life."],
      ["Highly curable", "Most men are cured, even if it has spread."],
      ["A painless lump is the main sign", "Usually found by the man himself."],
      ["Check once a month", "After a warm bath, when the skin is relaxed."],
      ["Undescended testicle raises the risk", "Even after surgery."],
      ["Treatment is surgery, often with chemotherapy", "Sperm can be stored before treatment starts."],
    ],
    signs: ["A lump in the testicle", "Swelling or heaviness", "A dull ache in the groin", "A change in size or firmness", "Pain or discomfort in the scrotum"],
    act: ["Any new lump needs a doctor within days", "Don’t wait for pain or feel shy about it."],
  },
};
