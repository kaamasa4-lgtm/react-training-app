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
    description: "バーベルを胸で下ろして押し上げる" ,
    youtube: "https://www.youtube.com/watch?v=W36C1YcI1MM"
  },
  { slug: "squat",
    part: "脚", 
    name: "スクワット", 
    description: "下半身全体を鍛える" ,
    youtube: "https://www.youtube.com/watch?v=AZ34UPH5reg"
  },
];
