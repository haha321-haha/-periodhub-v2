export type MedicalEntity = {
  id: string;
  name: string;
  icd10?: string;
  snomed?: string;
  description?: string;
};

export const medicalEntities: Record<string, MedicalEntity> = {
  dysmenorrhea: {
    id: "266599000",
    name: "Dysmenorrhea",
    icd10: "N94.4",
    snomed: "266599000",
    description:
      "痛经 / period pain is cramping menstrual pain that affects the lower abdomen and pelvis.",
  },
  pms: {
    id: "123456789", // placeholder if no SNOMED, keep consistent
    name: "Premenstrual Syndrome",
    icd10: "N94.3",
    snomed: "420981008",
    description:
      "Premenstrual Syndrome encompasses emotional and physical symptoms experienced in the luteal phase.",
  },
  endometriosis: {
    id: "2001000175101",
    name: "Endometriosis",
    icd10: "N80",
    snomed: "2001000175101",
    description: "Endometriosis occurs when endometrial tissue grows outside the uterus.",
  },
  irregularPeriods: {
    id: "445438005",
    name: "Irregular Periods",
    icd10: "N92",
    snomed: "445438005",
    description: "Irregular menstrual bleeding pattern that deviates from the typical cycle length.",
  },
  chronicPelvicPain: {
    id: "165737004",
    name: "Chronic Pelvic Pain",
    icd10: "R10.2",
    snomed: "165737004",
    description: "Pain in the pelvic region that persists for more than three months.",
  },
};

