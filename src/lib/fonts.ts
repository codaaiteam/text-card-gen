export interface FontConfig {
  id: string;
  name: string;
  nameZh: string;
  fontFamily: string;
  sampleText: string;
}

export const fonts: FontConfig[] = [
  {
    id: "songti",
    name: "Songti",
    nameZh: "宋体",
    fontFamily: "'Songti SC', 'STSong', 'SimSun', 'Noto Serif SC', serif",
    sampleText: "清晨的阳光透过窗帘",
  },
  {
    id: "kaiti",
    name: "Kaiti",
    nameZh: "楷体",
    fontFamily: "'Kaiti SC', 'STKaiti', 'KaiTi', serif",
    sampleText: "清晨的阳光透过窗帘",
  },
  {
    id: "fangsong",
    name: "FangSong",
    nameZh: "仿宋",
    fontFamily: "'STFangsong', 'FangSong', 'FangSong_GB2312', serif",
    sampleText: "清晨的阳光透过窗帘",
  },
  {
    id: "pingfang",
    name: "PingFang",
    nameZh: "苹方",
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    sampleText: "清晨的阳光透过窗帘",
  },
  {
    id: "georgia",
    name: "Georgia",
    nameZh: "Georgia",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    sampleText: "The morning light filtered",
  },
  {
    id: "palatino",
    name: "Palatino",
    nameZh: "Palatino",
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    sampleText: "The morning light filtered",
  },
];
