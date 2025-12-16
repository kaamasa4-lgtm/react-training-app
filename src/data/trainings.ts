// trainings.ts
export type Training = {
  slug: string;
  part: string;
  name: string;
  description: string;
  youtube?: string;
};

export const trainings: Training[] = [
  { slug: "bench-press", 
    part: "胸", 
    name: "ベンチプレス", 
    description: "バーベルを胸で下ろして押し上げる" 
  },
  { slug: "squat",
    part: "脚", 
    name: "スクワット", 
    description: "下半身全体を鍛える" 
  },
];
