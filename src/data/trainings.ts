// trainings.ts
export type Training = {
  slug: string;
  part: string;
  name: string;
  description: string;
  youtube?: string;
};

export const trainings: Training[] = [
  { slug: "ベンチプレス", 
    part: "胸", 
    name: "ベンチプレス", 
    description: "主に 大胸筋 を鍛えるバーベルを使った押す動作の筋トレで、補助的に 肩の前部（三角筋前部） や 腕の裏側（上腕三頭筋） も使い、胸の厚みや押す力を強化する代表的な種目。" ,
    youtube: "https://www.youtube.com/watch?v=W36C1YcI1MM"
  },
  { slug: "スクワット",
    part: "脚", 
    name: "スクワット", 
    description: "下半身を中心に全身を鍛えられる王道トレーニング。 「立つ・座る」という日常動作に近く、筋力アップだけでなく姿勢改善にも効果的。" ,
    youtube: "https://www.youtube.com/watch?v=AZ34UPH5reg"
  },
    { slug: "シーテッドローイング",
    part: "背中", 
    name: "シーテッドローイング", 
    description: "座った姿勢でグリップを体に引き寄せる動作。 主に背中の「引く力」を鍛える種目。" ,
    youtube: "https://www.youtube.com/watch?v=NT3_h9glNfU"
  },
    { slug: "インクラインダンベルカール",
    part: "腕", 
    name: "インクラインダンベルカール", 
    description: "インクラインベンチにもたれかかった状態で行う上腕二頭筋の種目。腕が体の後ろに来るため、上腕二頭筋を強くストレッチした状態から鍛えられる。" ,
    youtube: "https://www.youtube.com/watch?v=NXYgFP7XUJE"
  },
    { slug: "インクラインダンベルフライ",
    part: "胸", 
    name: "インクラインダンベルフライ", 
    description: "インクラインベンチで行うフライ種目。大胸筋上部（鎖骨付近）を集中的に鍛えるのが目的で、 「押す」よりも広げて閉じる動作がメイン。" ,
    youtube: "https://www.youtube.com/watch?v=TVC28pjtlJU"
  },
];
