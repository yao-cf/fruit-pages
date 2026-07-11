/*!
 * 切水果识字乐园 - 游戏主逻辑
 * ============================================
 * 模块划分：
 *   1. 数据管理     - 存储、默认关卡、进度
 *   2. Canvas 背景   - 画布适配、星空背景
 *   3. 音频 & 语音  - 音效、TTS 朗读
 *   4. 游戏状态     - 全局变量
 *   5. 水果 & 粒子  - FruitObj、Particle 类
 *   6. UI 辅助      - updateUI、弹窗、浮动文字
 *   7. 核心逻辑     - 游戏初始化、生成、切割、闯关
 *   8. 游戏循环     - gameLoop
 *   9. 输入处理     - 触摸/鼠标事件
 *  10. 场景切换     - 屏幕间跳转
 *  11. 界面渲染     - 等级/关卡选择卡片
 *  12. 管理平台     - 增删改查关卡/等级
 *  13. 按钮事件     - 事件绑定、初始化
 * ============================================
 */

// ==================== 1. 数据管理 ====================
const STORAGE_KEY = 'fruit_slice_grades';
const PROGRESS_KEY = 'fruit_slice_progress';
const DATA_VERSION_KEY = 'fruit_slice_data_version';
const CURRENT_DATA_VERSION = 8;

// 所有课程识字数据（统一管理）
const LESSON_WORDS = {
    1: '人 rén 口 kǒu 大 dà 中 zhōng 小 xiǎo 哭 kū 笑 xiào 一 yī 上 shàng 下 xià 爸 bà 妈 mā 天 tiān 太 tài 月 yuè 二 èr',
    2: '地 dì 阳 yáng 亮 liàng 星 xīng 云 yún 火 huǒ 水 shuǐ 三 sān',
    3: '土 tǔ 山 shān 石 shí 木 mù 我 wǒ 好 hǎo 有 yǒu 田 tián',
    4: '牛 niú 羊 yáng 聪 cōng 耳 ěr 目 mù 心 xīn 和 hé 四 sì',
    5: '明 míng 头 tóu 眉 méi 鼻 bí 手 shǒu 花 huā 树 shù 五 wǔ',
    6: '草 cǎo 叶 yè 日 rì 风 fēng 雨 yǔ 的 de 孩 hái 六 liù',
    7: '白 bái 红 hóng 是 shì 家 jiā 多 duō 唱 chàng 子 zǐ 七 qī',
    8: '爱 ài 爷 yé 奶 nǎi 少 shǎo 歌 gē 不 bù 朋 péng 八 bā',
    9: '宝 bǎo 在 zài 学 xué 书 shū 游 yóu 友 yǒu 儿 ér 九 jiǔ',
    10: '贝 bèi 生 shēng 习 xí 看 kàn 戏 xì 字 zì 气 qì 十 shí',
    11: '会 huì 见 jiàn 早 zǎo 雪 xuě 鸡 jī 绿 lǜ 黄 huáng 青 qīng 鱼 yú 做 zuò 飞 fēi 跑 pǎo 要 yào 吃 chī 鸟 niǎo 他 tā',
    12: '们 men 春 chūn 夏 xià 秋 qiū 冬 dōng 季 jì 都 dōu 个 gè',
    13: '狗 gǒu 猫 māo 蓝 lán 落 luò 真 zhēn 开 kāi 说 shuō 也 yě',
    14: '马 mǎ 米 mǐ 哥 gē 姐 jiě 来 lái 黑 hēi 去 qù 出 chū',
    15: '跳 tiào 着 zhe 了 le 你 nǐ 又 yòu 弟 dì 妹 mèi 东 dōng',
    16: '就 jiù 还 hái 快 kuài 得 de 西 xī 乐 lè 到 dào 起 qǐ',
    17: '玩 wán 捉 zhuō 迷 mí 球 qiú 很 hěn 高 gāo 鸭 yā 哈 hā',
    18: '方 fāng 爬 pá 藏 cáng 兴 xìng 向 xiàng 对 duì 能 néng 叫 jiào',
    19: '变 biàn 问 wèn 成 chéng 再 zài 急 jí 教 jiào 门 mén 只 zhǐ',
    20: '回 huí 公 gōng 打 dǎ 兔 tù 请 qǐng 过 guò 吗 ma 泳 yǒng',
    21: '虫 chóng 把 bǎ 驮 tuó 鹅 é 河 hé 礼 lǐ 背 bēi 拿 ná 里 lǐ 后 hòu 谢 xiè 边 biān 貌 mào 班 bān 幼 yòu 园 yuán',
    22: '照 zhào 婆 pó 甜 tián 梦 mèng 老 lǎo 盒 hé 尺 chǐ 刀 dāo',
    23: '时 shí 正 zhèng 文 wén 具 jù 笔 bǐ 画 huà 长 cháng 放 fàng',
    24: '用 yòng 总 zǒng 尾 wěi 巴 bā 玉 yù 尖 jiān 竹 zhú 苗 miáo',
    25: '听 tīng 话 huà 猴 hóu 猩 xīng 给 gěi 进 jìn 告 gào 电 diàn',
    26: '诉 sù 念 niàn 饭 fàn 乖 guāi 想 xiǎng 面 miàn 住 zhù 前 qián',
    27: '从 cóng 同 tóng 没 méi 送 sòng 果 guǒ 工 gōng 厂 chǎng 产 chǎn',
    28: '动 dòng 按 àn 桃 táo 关 guān 年 nián 荷 hé 找 zhǎo 节 jié',
    29: '菊 jú 它 tā 勇 yǒng 梅 méi 怕 pà 敢 gǎn 冷 lěng 躲 duǒ',
    30: '堆 duī 仗 zhàng 柳 liǔ 农 nóng 民 mín 伯 bó 种 zhòng 最 zuì',
    31: '片 piàn 吹 chuī 浇 jiāo 燕 yàn 睡 shuì 醒 xǐng 蛙 wā 呱 guā 南 nán 椅 yǐ 坐 zuò 身 shēn 吧 ba 桌 zhuō 布 bù 抱 bào',
    32: '摔 shuāi 声 shēng 谁 shuí 呢 ne 认 rèn 原 yuán 痛 tòng 喊 hǎn',
    33: '狼 láng 啦 la 赶 gǎn 救 jiù 假 jiǎ 掉 diào 路 lù 碰 pèng',
    34: '哪 nǎ 呀 ya 两 liǎng 逃 táo 走 zǒu 她 tā 点 diǎn 音 yīn',
    35: '可 kě 伸 shēn 缝 fèng 夹 jiá 根 gēn 棍 gùn 丢 diū 灰 huī',
    36: '萝 luó 卜 bo 熟 shú 拔 bá 拉 lā 鼠 shǔ 咕 gū 咚 dōng',
    37: '倒 dǎo 抬 tái 晚 wǎn 左 zuǒ 右 yòu 怎 zěn 么 me 办 bàn',
    38: '知 zhī 道 dào 午 wǔ 这 zhè 座 zuò 洞 dòng 什 shén 害 hài',
    39: '付 fù 顶 dǐng 角 jiǎo 死 sǐ 扑 pū 期 qī 带 dài 分 fēn',
    40: '清 qīng 今 jīn 昨 zuó 光 guāng 阴 yīn 错 cuò 指 zhǐ 拇 mǔ',
    41: '食 shí 无 wú 名 míng 加 jiā 共 gòng 事 shì 帮 bāng 饿 è 肚 dù 狮 shī 觉 jué 毛 máo 求 qiú 等 děng 香 xiāng 肉 ròu',
    42: '张 zhāng 网 wǎng 咬 yǎo 力 lì 啊 a 牙 yá 嘴 zuǐ 漂 piāo',
    43: '胡 hú 虎 hǔ 贴 tiē 才 cái 数 shǔ 更 gèng 朵 duǒ 纸 zhǐ',
    44: '圆 yuán 圈 quān 亲 qīn 脸 liǎn 眼 yǎn 睛 jīng 接 jiē 外 wài',
    45: '笨 bèn 以 yǐ 自 zì 己 jǐ 慢 màn 难 nán 练 liàn 每 měi',
    46: '颗 kē 样 yàng 因 yīn 为 wèi 离 lí 近 jìn 象 xiàng 船 chuán',
    47: '闪 shǎn 金 jīn 美 měi 丽 lì 当 dāng 扇 shàn 满 mǎn 干 gān',
    48: '朝 zhāo 熊 xióng 娃 wá 汽 qì 车 chē 北 běi 京 jīng 往 wǎng 呜 wū',
    49: '鹿 lù 森 sēn 林 lín 采 cǎi 蘑 mó 菇 gū 篮 lán 直 zhí',
    50: '摸 mō 苔 tái 所 suǒ 科 kē 灯 dēng 应 yīng 该 gāi 题 tí',
    51: '停 tíng 而 ér 窗 chuāng 刚 gāng 撞 zhuàng 比 bǐ 记 jì 串 chuàn 被 bèi 够 gòu 命 mìng 颈 jǐng 定 dìng 吓 xià 啄 zhuó 破 pò',
    52: '湖 hú 棵 kē 瓜 guā 透 tòu 腿 tuǐ 狐 hú 粗 cū 竿 gān 狸 lí 跟 gēn',
    53: '钓 diào 甩 shuǎi 钩 gōu 忘 wàng 装 zhuāng 饵 ěr 算 suàn 桶 tǒng 坏 huài 忙 máng',
    54: '洗 xǐ 忽 hū 然 rán 全 quán 条 tiáo 怪 guài 物 wù 猪 zhū 影 yǐng 信 xìn',
    55: '呼 hū 结 jié 冰 bīng 枝 zhī 发 fā 抖 dǒu 暖 nuǎn 屋 wū 法 fǎ 件 jiàn 于 yú',
    56: '戴 dài 松 sōng 帽 mào 热 rè 流 liú 汗 hàn 候 hòu 劳 láo 凉 liáng 别 bié',
    57: '整 zhěng 觉 jué 盖 gài 窝 wō 着 zhe 病 bìng 受 shòu 羽 yǔ 望 wàng',
    58: '骑 qí 经 jīng 呵 hē 行 xíng 旁 páng 稀 xī 远 yuǎn 婶 shěn 奇 qí',
    59: '祝 zhù 脑 nǎo 闹 nào 准 zhǔn 贺 hè 呆 dāi 钟 zhōng 备 bèi 哟 yō 床 chuáng 拔 bá',
    60: '其 qí 响 xiǎng 叠 dié 写 xiě 实 shí 迟 chí 包 bāo 冒 mào 轻 qīng 己 jǐ 碗 wǎn 您 nín 了 le'
};

const EMOJI_POOL = ['🍎','🍊','🍉','🍇','🍓','🍑','🍌','🥝','🍍','🥭','🍒','🍋','🍐','🫐','🥥','🍈','🫒','🍅','🥑','🌽','🥕','🌶️','🧅','🥦','🍄','🌰','🥜','🫘','🍞','🥐'];
const COLOR_POOL = ['#FF4444','#FF8C00','#FF6B81','#9B59B6','#FF2D55','#FFB6C1','#FFE135','#7BBA42','#FFD700','#FFB347','#DC143C','#FFF44F','#C8E65C','#6B3FA0','#8B6914','#90EE90','#A0A000','#FF6347','#556B2F','#DAA520','#4A90D9','#FF5722','#00BCD4','#E91E63','#795548','#607D8B','#FF9800','#CDDC39','#009688','#673AB7'];

function parsePrimaryWords(text) {
    const words = [];
    const parts = text.trim().split(/\s+/);
    for (let i = 0; i < parts.length; i += 2) {
        const hanzi = parts[i], pinyin = parts[i + 1];
        if (hanzi && pinyin) {
            const idx = words.length;
            words.push({ hanzi, pinyin, emoji: EMOJI_POOL[idx % EMOJI_POOL.length], color: COLOR_POOL[idx % COLOR_POOL.length] });
        }
    }
    return words;
}

function buildLessonLevel(lessonNum, levelId) {
    const words = parsePrimaryWords(LESSON_WORDS[lessonNum]);
    return { id: levelId, name: `第${lessonNum}课`, desc: `学习第${lessonNum}课常用汉字`, words, target: words.length * 4, passWords: words.length };
}

// 等级配置：统一驱动 DEFAULT_GRADES 生成
const GRADE_CONFIG = [
    { id: 1, name: '🌟 一级',        lessons: [1,2,3,4,5,6,7,8,9,10],   idOffset: 0 },
    { id: 2, name: '🌟🌟 二级',       lessons: [11,12,13,14,15,16,17,18,19,20], idOffset: 10 },
    { id: 3, name: '🌟🌟🌟 三级',      lessons: [21,22,23,24,25,26,27,28,29,30], idOffset: 20 },
    { id: 4, name: '🌟🌟🌟🌟 四级',    lessons: [31,32,33,34,35,36,37,38,39,40], idOffset: 30 },
    { id: 5, name: '🌟🌟🌟🌟🌟 五级',  lessons: [41,42,43,44,45,46,47,48,49,50], idOffset: 40 },
    { id: 6, name: '🌟🌟🌟🌟🌟🌟 六级', lessons: [51,52,53,54,55,56,57,58,59,60], idOffset: 50 },
];

const DEFAULT_GRADES = GRADE_CONFIG.map(cfg => ({
    id: cfg.id,
    name: cfg.name,
    levels: cfg.lessons.map((ln, i) => buildLessonLevel(ln, cfg.idOffset + i + 1)),
    bossLevel: null
}));

function loadGrades() {
    try {
        const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
        // 版本号不匹配或不存在，直接返回默认数据
        if (!storedVersion || parseInt(storedVersion) < CURRENT_DATA_VERSION) {
            localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(PROGRESS_KEY);
            const defaults = JSON.parse(JSON.stringify(DEFAULT_GRADES));
            saveGrades(defaults);
            return defaults;
        }
        // 版本号匹配，尝试加载存储数据
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            // 验证数据结构完整性
            if (data && Array.isArray(data) && data.length > 0 &&
                data[0].id !== undefined && Array.isArray(data[0].levels)) {
                return data;
            }
        }
        // 数据无效，重置关卡数据（保留进度）
        localStorage.removeItem(STORAGE_KEY);
        const defaults = JSON.parse(JSON.stringify(DEFAULT_GRADES));
        saveGrades(defaults);
        return defaults;
    } catch(e) {
        console.error('[loadGrades] error:', e);
        return JSON.parse(JSON.stringify(DEFAULT_GRADES));
    }
}

function saveGrades(grades) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
    localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
}

function loadProgress() {
    try { const raw = localStorage.getItem(PROGRESS_KEY); return raw ? JSON.parse(raw) : {}; }
    catch(e) { return {}; }
}

function saveProgress(progress) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }

function getProgressKey(gradeId, levelId, isBoss) {
    return isBoss ? `g${gradeId}-boss` : `g${gradeId}-l${levelId}`;
}

function isLevelCompleted(gradeId, levelId, isBoss) {
    return !!progress[getProgressKey(gradeId, levelId, isBoss)];
}

function markLevelCompleted(gradeId, levelId, isBoss) {
    progress[getProgressKey(gradeId, levelId, isBoss)] = true;
    saveProgress(progress);
}

function isGradeCompleted(grade) {
    for (const lv of grade.levels) { if (!isLevelCompleted(grade.id, lv.id, false)) return false; }
    if (!isLevelCompleted(grade.id, 0, true)) return false;
    return true;
}

function getGradeProgress(grade) {
    let completed = 0;
    const total = grade.levels.length + 1;
    for (const lv of grade.levels) { if (isLevelCompleted(grade.id, lv.id, false)) completed++; }
    if (isLevelCompleted(grade.id, 0, true)) completed++;
    return { completed, total };
}

function isGradeUnlocked(grade) {
    // 所有等级全部解锁
    return true;
}

function isLevelUnlocked(grade, levelIndex, isBoss) {
    // 所有关卡全部解锁
    return true;
}

function getBossLevel(grade) {
    const allWords = [], seen = new Set();
    for (const lv of grade.levels) {
        for (const w of lv.words) {
            if (!seen.has(w.hanzi)) { seen.add(w.hanzi); allWords.push({ ...w }); }
        }
    }
    return { id: -1, name: '💀 终极挑战', desc: `本等级全部${allWords.length}个汉字大挑战！`, words: allWords, target: allWords.length * 4, passWords: allWords.length, isBoss: true, gradeId: grade.id };
}

function resetAllData() {
    if (confirm('确定要恢复默认关卡设置吗？这会清除所有自定义关卡和游戏进度。')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PROGRESS_KEY);
        localStorage.removeItem(DATA_VERSION_KEY);
        alert('已恢复默认设置！');
        grades = loadGrades();
        progress = loadProgress();
        renderAdminLevels();
        renderAdminGrades();
    }
}

let grades = loadGrades();
let progress = loadProgress();

// ==================== 2. Canvas 初始化 ====================
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');
const DPR = window.devicePixelRatio || 1;
const W = () => window.innerWidth;
const H = () => window.innerHeight;

function resizeCanvas() {
    CANVAS.width = W() * DPR;
    CANVAS.height = H() * DPR;
    CTX.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initBgStars(); });

// ==================== 3. 背景 ====================
let bgStars = [];
function initBgStars() {
    bgStars = [];
    for (let i = 0; i < 30; i++) {
        bgStars.push({ x: Math.random()*W(), y: Math.random()*H(), r: Math.random()*2+0.5, twinkle: Math.random()*Math.PI*2 });
    }
}
initBgStars();

function drawBackground(w, h) {
    const sky = CTX.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#87CEEB'); sky.addColorStop(0.4, '#B0E0FF');
    sky.addColorStop(0.7, '#E8F8E8'); sky.addColorStop(1, '#FFF8DC');
    CTX.fillStyle = sky; CTX.fillRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    for (const s of bgStars) {
        CTX.fillStyle = `rgba(255,255,255,${0.3+Math.sin(t*3+s.twinkle)*0.3})`;
        CTX.beginPath(); CTX.arc(s.x, s.y, s.r, 0, Math.PI*2); CTX.fill();
    }
}

// ==================== 4. 音频 ====================
const AudioSys = {
    ctx: null,
    init() { if (!this.ctx) try { this.ctx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e) {} },
    beep(freq, dur, type='sine', vol=0.15) {
        if (!this.ctx) return;
        try {
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            o.type = type; o.connect(g); g.connect(this.ctx.destination);
            o.frequency.setValueAtTime(freq, this.ctx.currentTime);
            g.gain.setValueAtTime(vol, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime+dur);
            o.start(this.ctx.currentTime); o.stop(this.ctx.currentTime+dur);
        } catch(e) {}
    },
    slice() { this.beep(800, 0.1); },
    bomb() { this.beep(150, 0.35, 'sawtooth', 0.3); },
    combo() { [523,659,784,1047].forEach((f,i) => setTimeout(() => this.beep(f,0.15,'sine',0.12), i*80)); },
    word() { [600,800,1000].forEach((f,i) => setTimeout(() => this.beep(f,0.1,'sine',0.12), i*80)); }
};

// ==================== 5. 语音朗读 ====================
function speakWord(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN'; utterance.rate = 0.8; utterance.pitch = 1.1; utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
}

// ==================== 6. 游戏状态 ====================
let playing = false, paused = false;
let score = 0, lives = 5, combo = 0, comboTimer = null;
let wordsLearned = new Set();
let fruits = [], particles = [], trail = [];
let lastSpawn = 0, spawnDelay = 2000, mouseDown = false, animId = null;
let currentLevel = null, currentGradeId = null;
let totalSliced = 0;
let nextLevelInfo = null;
let gameMode = 'learn';

// 闯关模式状态
let challengeWords = [], challengeIndex = 0;
let challengeFruits = [], challengeRoundActive = false, challengeSpawned = false;
let challengeRetry = false; // 当前字是否已经错过一次
let challengeTotalWords = 0; // 原始总字数（不含重试插入）

// ==================== 7. 水果对象 ====================
class FruitObj {
    constructor(wordData, allowBomb = true, options = {}) {
        const { speedMult = 1, vyMin = 4, vyMax = 5, gravity = 0.015 } = options;
        this.emoji = wordData.emoji;
        this.hanzi = wordData.hanzi;
        this.pinyin = wordData.pinyin;
        this.color = wordData.color;
        this.isBomb = allowBomb && Math.random() < 0.1;
        if (this.isBomb) { this.emoji = '💣'; this.color = '#333'; this.hanzi = '炸'; this.pinyin = 'zhà'; }
        const margin = 60;
        this.x = Math.random() * (W() - margin*2) + margin;
        this.y = H() + 30;
        this.vx = (Math.random() - 0.5) * 2.5 * speedMult;
        this.vy = -(Math.random() * (vyMax - vyMin) + vyMin);
        this.r = 40 + Math.random()*12;
        this.rot = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.08;
        this.sliced = false;
        this.alpha = 1;
        this._gravity = gravity;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this._gravity; this.rot += this.rotSpeed; if (this.sliced) this.alpha -= 0.04; if (this.x < this.r) { this.x = this.r; this.vx = Math.abs(this.vx); } if (this.x > W() - this.r) { this.x = W() - this.r; this.vx = -Math.abs(this.vx); } }
    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save(); ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y); ctx.rotate(this.rot);
        ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
        const grad = ctx.createRadialGradient(-5, -5, this.r*0.1, 0, 0, this.r);
        if (this.isBomb) { grad.addColorStop(0,'#555'); grad.addColorStop(1,'#1a1a1a'); }
        else { grad.addColorStop(0,this.color+'AA'); grad.addColorStop(0.6,this.color+'66'); grad.addColorStop(1,this.color+'22'); }
        ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI*2); ctx.fillStyle = grad; ctx.fill();
        ctx.strokeStyle = this.isBomb?'#666':this.color; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        ctx.font = `${this.r*1.4}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, -4);
        ctx.font = `bold ${this.r*0.55}px "Microsoft YaHei","PingFang SC",sans-serif`;
        ctx.fillStyle = this.isBomb?'#FF4444':'#fff';
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2;
        ctx.strokeText(this.hanzi, 0, this.r*0.25); ctx.fillText(this.hanzi, 0, this.r*0.25);
        ctx.restore();
    }
    offScreen() { return this.y > H()+150 || this.alpha <= 0; }
    hitTest(x1,y1,x2,y2) {
        if (this.sliced) return false;
        const dx=x2-x1,dy=y2-y1,len2=dx*dx+dy*dy;
        if (len2===0) return Math.hypot(this.x-x1,this.y-y1) < this.r+5;
        let t=((this.x-x1)*dx+(this.y-y1)*dy)/len2; t=Math.max(0,Math.min(1,t));
        return Math.hypot(this.x-(x1+t*dx),this.y-(y1+t*dy)) < this.r+5;
    }
}

// ==================== 8. 粒子 ====================
class Particle {
    constructor(x,y,color) { this.x=x; this.y=y; this.vx=(Math.random()-0.5)*10; this.vy=(Math.random()-0.5)*10-3; this.r=Math.random()*5+2; this.color=color; this.life=1; }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=0.15; this.life-=0.025; }
    draw(ctx) { if (this.life<=0) return; ctx.save(); ctx.globalAlpha=this.life; ctx.fillStyle=this.color; ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
}

// ==================== 9. UI 辅助 ====================
function renderLearnedWords() {
    const wl = document.getElementById('wordList'); wl.innerHTML = '';
    wordsLearned.forEach(k => { const [h,p] = k.split('|'); const tag = document.createElement('span'); tag.className = 'wordTag'; tag.textContent = `${h}(${p})`; wl.appendChild(tag); });
}

function shakeScreen() {
    document.body.style.transform='translateX(5px)';
    setTimeout(()=>document.body.style.transform='translateX(-5px)',50);
    setTimeout(()=>document.body.style.transform='translateX(3px)',100);
    setTimeout(()=>document.body.style.transform='',150);
}

function showGameOverScreen(emoji, scoreText, hintText, showNext) {
    document.getElementById('challengeTarget').style.display = 'none';
    document.getElementById('challengeProgress').style.display = 'none';
    document.getElementById('gameOverEmoji').textContent = emoji;
    document.getElementById('finalScore').textContent = scoreText;
    renderLearnedWords();
    if (wordsLearned.size===0) document.getElementById('wordList').innerHTML = '<span style="color:#999;">加油！记住每个字再试试！</span>';
    const nextBtn = document.getElementById('nextLevelBtn'), hint = document.getElementById('nextLevelHint');
    hint.textContent = hintText;
    nextBtn.style.display = showNext ? 'inline-block' : 'none';
    if (showNext) nextBtn.textContent = '▶ 下一关';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('wordCount').textContent = wordsLearned.size;
    const grade = grades.find(g => g.id === currentGradeId);
    const label = grade ? grade.name + ' ' : '';
    const lvName = currentLevel ? (currentLevel.isBoss ? '终极挑战' : `第${currentLevel.id}关`) : '';
    const modeLabel = gameMode === 'challenge' ? ' [闯关]' : '';
    document.getElementById('levelBadge').textContent = label + lvName + modeLabel;
    const livesEl = document.getElementById('lives');
    if (gameMode !== 'challenge') { livesEl.innerHTML = ''; for (let i=0;i<5;i++) livesEl.innerHTML += i<lives?'❤️':'🖤'; }
    const cd = document.getElementById('comboDisplay');
    if (combo>=2) { cd.textContent=`🔥 ${combo}连击! x${Math.min(combo,5)}`; cd.classList.add('show'); }
    else cd.classList.remove('show');
}

function showWordPopup(x, y, fruit) {
    const popup = document.createElement('div');
    popup.className = 'wordPopup';
    popup.style.left = Math.min(Math.max(x-50,10),W()-120)+'px';
    popup.style.top = Math.min(Math.max(y-90,60),H()-140)+'px';
    popup.innerHTML = `<div class="hanzi">${fruit.hanzi}</div><div class="pinyin">${fruit.pinyin}</div>`;
    document.body.appendChild(popup);
    setTimeout(() => { popup.style.transition='all 0.4s'; popup.style.opacity='0'; popup.style.transform='translateY(-30px) scale(0.8)'; setTimeout(()=>popup.remove(),400); }, 5000);
}

function showFloatingText(x, y, text, color) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:28px;font-weight:bold;color:${color};pointer-events:none;z-index:50;text-shadow:2px 2px 0 rgba(0,0,0,0.2);animation:floatUp 1s ease-out forwards;`;
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),1000);
}

// ==================== 10. 核心逻辑 ====================
function initGame() {
    score = 0; lives = 5; combo = 0; totalSliced = 0;
    wordsLearned.clear(); fruits = []; particles = []; trail = [];
    lastSpawn = Date.now(); spawnDelay = 2000;
    nextLevelInfo = null;
    challengeWords = []; challengeIndex = 0; challengeFruits = []; challengeRoundActive = false; challengeSpawned = false; challengeRetry = false; challengeTotalWords = 0;
    updateUI();
}

function spawnFruit() {
    if (gameMode === 'challenge') { spawnChallengeFruits(); return; }
    const now = Date.now();
    if (now - lastSpawn > spawnDelay && currentLevel) {
        const wordList = currentLevel.words;
        const count = Math.random() < 0.25 ? 2 : 1;
        for (let i = 0; i < count; i++) {
            fruits.push(new FruitObj(wordList[Math.floor(Math.random() * wordList.length)]));
        }
        lastSpawn = now;
        spawnDelay = Math.max(900, 2000 - (totalSliced * 8));
    }
}

// ---- 闯关模式 ----
function initChallengeMode() { challengeWords = shuffleArray([...currentLevel.words]); challengeTotalWords = challengeWords.length; challengeIndex = 0; challengeRoundActive = false; challengeSpawned = false; challengeFruits = []; challengeRetry = false; startChallengeRound(); }

function shuffleArray(arr) { const a = [...arr]; for (let i = a.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function startChallengeRound() {
    if (challengeIndex >= challengeWords.length) { challengeWin(); return; }
    challengeRoundActive = true; challengeSpawned = false; challengeFruits = [];
    const target = challengeWords[challengeIndex];
    document.getElementById('targetHanzi').textContent = '';
    document.getElementById('targetPinyin').textContent = target.pinyin;
    speakWord(target.pinyin);
    document.getElementById('challengeProgress').textContent = `进度：${challengeIndex + 1}/${challengeTotalWords}`;
    const distractors = [];
    const otherWords = currentLevel.words.filter(w => w.hanzi !== target.hanzi);
    const shuffledOthers = shuffleArray(otherWords);
    for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) distractors.push(shuffledOthers[i]);
    while (distractors.length < 3) { const rw = currentLevel.words[Math.floor(Math.random()*currentLevel.words.length)]; if (rw.hanzi !== target.hanzi && !distractors.find(d=>d.hanzi===rw.hanzi)) distractors.push(rw); }
    challengeFruits = shuffleArray([target, ...distractors.slice(0,3)]).map(w => new FruitObj(w, false));
}

function spawnChallengeFruits() { if (!challengeRoundActive || challengeSpawned) return; for (const f of challengeFruits) fruits.push(f); challengeSpawned = true; }

function handleChallengeSlice(fruit) {
    if (!challengeRoundActive) return;
    const target = challengeWords[challengeIndex];
    if (fruit.hanzi === target.hanzi) {
        AudioSys.word(); speakWord(fruit.hanzi); score += 10; totalSliced++;
        wordsLearned.add(fruit.hanzi + '|' + fruit.pinyin);
        burstParticles(fruit.x, fruit.y, '#4CAF50', 20);
        showFloatingText(fruit.x, fruit.y-30, '✅ 正确！', '#4CAF50');
        showWordPopup(fruit.x, fruit.y-70, fruit);
        for (const f of fruits) { if (f !== fruit && !f.sliced) { f.sliced = true; f.alpha = 0.3; } }
        challengeRoundActive = false;
        challengeRetry = false; // 答对了重置重试标记
        setTimeout(() => { fruits = []; challengeIndex++; if (challengeIndex >= challengeWords.length) challengeWin(); else startChallengeRound(); }, 800);
    } else {
        // 切错了，检查是否已经错过一次
        if (challengeRetry) {
            // 第二次错误，闯关失败
            AudioSys.bomb(); burstParticles(fruit.x, fruit.y, '#FF4444', 25);
            showFloatingText(fruit.x, fruit.y-30, '❌ 再次切错！', '#FF0000');
            fruit.sliced = true; fruit.alpha = 0.3;
            shakeScreen();
            challengeRoundActive = false;
            setTimeout(()=>challengeFail(),600);
        } else {
            // 第一次错误，给一次重试机会
            challengeRetry = true;
            AudioSys.bomb(); burstParticles(fruit.x, fruit.y, '#FF4444', 20);
            showFloatingText(fruit.x, fruit.y-30, '⚠️ 再试一次！', '#FF9800');
            fruit.sliced = true; fruit.alpha = 0.3;
            for (const f of fruits) { if (f !== fruit && !f.sliced) { f.sliced = true; f.alpha = 0.3; } }
            challengeRoundActive = false;
            // 在当前字后面插入重试
            challengeWords.splice(challengeIndex + 1, 0, target);
            setTimeout(() => { fruits = []; challengeIndex++; if (challengeIndex >= challengeWords.length) challengeWin(); else startChallengeRound(); }, 1000);
        }
    }
    updateUI();
}

function _nextLevelHint() {
    if (!nextLevelInfo) return '🏆 恭喜！你已通关全部等级！';
    if (nextLevelInfo.isBoss) return '🔓 已解锁：💀 终极挑战';
    const ng = grades.find(g => g.id === nextLevelInfo.gradeId);
    return ng ? `🔓 已解锁：${ng.name} 第${nextLevelInfo.levelId}关` : '🔓 已解锁：下一关';
}

function challengeWin() {
    playing = false; cancelAnimationFrame(animId);
    const lvId = currentLevel.isBoss ? 0 : currentLevel.id;
    markLevelCompleted(currentGradeId, lvId, currentLevel.isBoss || false);
    nextLevelInfo = findNextLevel(currentGradeId, lvId, currentLevel.isBoss || false);
    showGameOverScreen('🎉 闯关成功！', score, _nextLevelHint(), !!nextLevelInfo);
}

function challengeFail() {
    playing = false; cancelAnimationFrame(animId);
    const failIdx = Math.min(challengeIndex, challengeWords.length - 1);
    const hintText = `💡 提示：要找的字是「${challengeWords[failIdx].hanzi}」(${challengeWords[failIdx].pinyin})，再练练吧！`;
    showGameOverScreen('😢 闯关失败', score, hintText, false);
}

function burstParticles(x, y, color, count) { for (let i=0;i<count;i++) particles.push(new Particle(x,y,color)); }

function findNextLevel(gradeId, levelId, isBoss) {
    const grade = grades.find(g => g.id === gradeId);
    if (!grade) return null;
    if (!isBoss) {
        const idx = grade.levels.findIndex(l => l.id === levelId);
        if (idx >= 0 && idx < grade.levels.length - 1) return { gradeId, levelId: grade.levels[idx+1].id, isBoss: false };
        if (idx === grade.levels.length - 1) return { gradeId, levelId: 0, isBoss: true };
    }
    const nextGrade = grades.find(g => g.id === gradeId + 1);
    if (nextGrade && nextGrade.levels.length > 0) return { gradeId: nextGrade.id, levelId: nextGrade.levels[0].id, isBoss: false };
    return null;
}

function sliceFruit(fruit) {
    if (gameMode === 'challenge') { if (!fruit.sliced && challengeRoundActive) { fruit.sliced = true; handleChallengeSlice(fruit); } return; }
    if (fruit.isBomb) {
        AudioSys.bomb(); burstParticles(fruit.x,fruit.y,'#333',25); burstParticles(fruit.x,fruit.y,'#FF4444',15);
        lives--; combo = 0; fruit.sliced = true; fruit.alpha = 0.3;
        showFloatingText(fruit.x, fruit.y-30, '💥-1', '#FF0000');
        shakeScreen();
        updateUI(); if (lives <= 0) endGame(); return;
    }
    fruit.sliced = true; speakWord(fruit.hanzi); combo++; totalSliced++;
    const mult = Math.min(combo, 5); score += 10 * mult;
    wordsLearned.add(fruit.hanzi + '|' + fruit.pinyin);
    showWordPopup(fruit.x, fruit.y-70, fruit);
    if (combo>=2) { showFloatingText(fruit.x,fruit.y-40,`+${10*mult}`,'#FFD700'); if (combo>=3) AudioSys.combo(); }
    clearTimeout(comboTimer); comboTimer = setTimeout(()=>{combo=0;updateUI();},2500);
    updateUI();
    if (currentLevel && totalSliced >= currentLevel.target && wordsLearned.size >= currentLevel.passWords) {
        const lvId = currentLevel.isBoss ? 0 : currentLevel.id;
        markLevelCompleted(currentGradeId, lvId, currentLevel.isBoss || false);
        nextLevelInfo = findNextLevel(currentGradeId, lvId, currentLevel.isBoss || false);
        setTimeout(() => endGame(true), 500);
    }
}

function endGame(cleared = false) {
    playing = false; cancelAnimationFrame(animId);
    const hintText = cleared ? _nextLevelHint() : '';
    showGameOverScreen(cleared ? '🎉 通关成功！' : '😢 游戏结束', score, hintText, cleared && !!nextLevelInfo);
    document.getElementById('topBar').style.display = 'none';
}

function goNextLevel() {
    if (!nextLevelInfo) return;
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('lives').style.display = 'flex';
    grades = loadGrades();
    const grade = grades.find(g => g.id === nextLevelInfo.gradeId);
    if (!grade) return;
    let lv = nextLevelInfo.isBoss ? getBossLevel(grade) : grade.levels.find(l => l.id === nextLevelInfo.levelId);
    if (!lv) return;
    currentGradeId = nextLevelInfo.gradeId;
    startLevelInternal(lv, gameMode);
}

// ==================== 11. 游戏循环 ====================
function gameLoop() {
    if (!playing || paused) { animId = requestAnimationFrame(gameLoop); return; }
    const w=W(), h=H();
    CTX.clearRect(0,0,w,h); drawBackground(w,h);
    spawnFruit();
    fruits = fruits.filter(f => {
        f.update(); f.draw(CTX);
        if (!f.sliced && f.y>h+40 && f.vy>0) {
            if (gameMode === 'challenge') {
                if (challengeRoundActive && challengeIndex < challengeWords.length) {
                    const target = challengeWords[challengeIndex];
                    if (f.hanzi === target.hanzi) {
                        challengeRoundActive = false;
                        if (challengeRetry) {
                            // 第二次错过，闯关失败
                            showFloatingText(W()/2, H()/2, '⏰ 目标字再次溜走！', '#FF0000');
                            setTimeout(()=>challengeFail(),600);
                        } else {
                            // 第一次错过，给重试机会
                            challengeRetry = true;
                            showFloatingText(W()/2, H()/2, '⏰ 目标字溜走了，再试一次！', '#FF9800');
                            challengeWords.splice(challengeIndex + 1, 0, target);
                            setTimeout(() => { fruits = []; challengeIndex++; if (challengeIndex >= challengeWords.length) challengeWin(); else startChallengeRound(); }, 1000);
                        }
                    }
                }
            } else if (!f.isBomb) { lives--; combo=0; updateUI(); if (lives<=0) { endGame(); return false; } }
            return false;
        }
        return !f.offScreen();
    });
    particles = particles.filter(p => { p.update(); p.draw(CTX); return p.life>0; });
    if (trail.length>1) {
        CTX.beginPath(); CTX.moveTo(trail[0].x,trail[0].y);
        for (let i=1;i<trail.length;i++) CTX.lineTo(trail[i].x,trail[i].y);
        CTX.strokeStyle='rgba(255,255,255,0.7)'; CTX.lineWidth=5; CTX.lineCap='round'; CTX.lineJoin='round';
        CTX.shadowColor='rgba(255,255,255,0.5)'; CTX.shadowBlur=10; CTX.stroke();
        CTX.shadowColor='transparent'; CTX.shadowBlur=0;
    }
    if (trail.length>=2) {
        const i2=trail.length-1,i1=trail.length-2;
        for (const f of fruits) { if (!f.sliced && f.hitTest(trail[i1].x,trail[i1].y,trail[i2].x,trail[i2].y)) sliceFruit(f); }
    }
    animId = requestAnimationFrame(gameLoop);
}

// ==================== 12. 输入处理 ====================
function getPos(e) { return e.touches ? {x:e.touches[0].clientX,y:e.touches[0].clientY} : {x:e.clientX,y:e.clientY}; }
function onDown(e) { if (!playing||paused) return; e.preventDefault(); AudioSys.init(); mouseDown=true; const p=getPos(e); trail=[{x:p.x,y:p.y}]; }
function onMove(e) { if (!playing||paused) return; e.preventDefault(); const p=getPos(e); if (mouseDown) { trail.push({x:p.x,y:p.y}); if (trail.length>25) trail.shift(); } }
function onUp(e) { e.preventDefault(); mouseDown=false; setTimeout(()=>{const ft=()=>{if(trail.length>0){trail.shift();requestAnimationFrame(ft);}};ft();},50); }

CANVAS.addEventListener('mousedown',onDown); CANVAS.addEventListener('mousemove',onMove);
CANVAS.addEventListener('mouseup',onUp); CANVAS.addEventListener('mouseleave',onUp);
CANVAS.addEventListener('touchstart',onDown,{passive:false});
CANVAS.addEventListener('touchmove',onMove,{passive:false});
CANVAS.addEventListener('touchend',onUp,{passive:false});
CANVAS.addEventListener('touchcancel',onUp,{passive:false});

// ==================== 13. 场景切换 ====================
function hideAllScreens() {
    ['mainMenu','gradeSelect','levelSelect','gameIntro','gameOverScreen','pauseScreen','adminPanel'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('topBar').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('challengeTarget').style.display = 'none';
    document.getElementById('challengeProgress').style.display = 'none';
}

function showMainMenu() { hideAllScreens(); document.getElementById('mainMenu').style.display = 'flex'; playing = false; paused = false; gameMode = 'learn'; cancelAnimationFrame(animId); }

function showGradeSelect() { hideAllScreens(); document.getElementById('gradeSelect').style.display = 'flex'; grades = loadGrades(); progress = loadProgress(); renderGradeGrid(); playing = false; paused = false; cancelAnimationFrame(animId); }

function _renderLevelSelectScreen(grade) {
    document.getElementById('levelSelect').style.display = 'flex';
    document.getElementById('levelSelectTitle').textContent = `${grade.name} - 选择关卡`;
    document.getElementById('gradeLabel').textContent = grade.name;
    try { renderLevelGrid(grade); } catch(e) { console.error(e); showGradeSelect(); return; }
    playing = false; paused = false; cancelAnimationFrame(animId);
}

function _showLevelSelect(gradeId) {
    hideAllScreens();
    grades = loadGrades(); progress = loadProgress();
    let grade = grades.find(g => g.id === gradeId);
    if (!grade) {
        // 等级不存在，重置关卡数据后重试一次（保留进度）
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
        grades = loadGrades();
        grade = grades.find(g => g.id === gradeId);
        if (!grade) { showGradeSelect(); return; }
    }
    _renderLevelSelectScreen(grade);
}

window.showLevelSelect = function(gradeId) {
    if (gradeId !== undefined) _showLevelSelect(gradeId);
    else if (currentGradeId) _showLevelSelect(currentGradeId);
    else showGradeSelect();
};

function showGameIntro(gradeId, levelId, isBoss) {
    hideAllScreens();
    grades = loadGrades();
    const grade = grades.find(g => g.id === gradeId);
    if (!grade) { showGradeSelect(); return; }
    let lv = isBoss ? getBossLevel(grade) : grade.levels.find(l => l.id === levelId);
    if (!lv) { _showLevelSelect(gradeId); return; }
    document.getElementById('introTitle').textContent = `${grade.name} ${isBoss ? '💀 终极挑战' : `第${lv.id}关：${lv.name}`}`;
    document.getElementById('introDesc').textContent = lv.desc || `目标：切${lv.target}个水果，学会${lv.passWords}个字`;
    const tw = document.getElementById('targetWords'); tw.innerHTML = '';
    lv.words.forEach(w => { const span = document.createElement('span'); span.className='target-word'; span.textContent=`${w.hanzi}(${w.pinyin})`; span.title=`点击朗读：${w.hanzi}`; span.onclick=(e)=>{e.stopPropagation();speakWord(w.hanzi);}; tw.appendChild(span); });
    document.getElementById('gameIntro').style.display = 'flex';
    document.getElementById('startLearnBtn').onclick = () => { currentGradeId = gradeId; startLevelInternal(lv, 'learn'); };
    document.getElementById('startChallengeBtn').onclick = () => { currentGradeId = gradeId; startLevelInternal(lv, 'challenge'); };
}

function startLevelInternal(lv, mode) {
    hideAllScreens();
    currentLevel = lv; gameMode = mode || 'learn';
    initGame();
    if (gameMode === 'challenge') { initChallengeMode(); document.getElementById('challengeTarget').style.display='flex'; document.getElementById('challengeProgress').style.display='block'; document.getElementById('topBar').style.display='none'; document.getElementById('lives').style.display='none'; }
    else { document.getElementById('challengeTarget').style.display='none'; document.getElementById('challengeProgress').style.display='none'; document.getElementById('topBar').style.display='flex'; document.getElementById('lives').style.display='flex'; }
    document.getElementById('pauseBtn').style.display = 'flex';
    updateUI(); playing = true; gameLoop();
}

// ==================== 14. 等级选择界面 ====================
function renderGradeGrid() {
    const grid = document.getElementById('gradeGrid'); grid.innerHTML = '';
    grades.forEach(grade => {
        const unlocked = isGradeUnlocked(grade), completed = isGradeCompleted(grade), pg = getGradeProgress(grade);
        const card = document.createElement('div'); card.className = 'grade-card';
        if (!unlocked) card.classList.add('locked'); if (completed) card.classList.add('completed');
        card.innerHTML = `<div class="grade-icon">${unlocked ? (completed ? '🏆' : '📚') : '🔒'}</div><div class="grade-info"><div class="grade-name">${grade.name}</div><div class="grade-progress">${unlocked ? `进度：${pg.completed}/${pg.total}` : '需完成上一等级'}</div></div><div class="grade-arrow">${completed ? '✅' : (unlocked ? '▶' : '🔒')}</div>`;
        if (unlocked) card.onclick = () => _showLevelSelect(grade.id);
        grid.appendChild(card);
    });
}

// ==================== 15. 关卡选择界面 ====================
function renderLevelGrid(grade) {
    const grid = document.getElementById('levelGrid'); grid.innerHTML = '';
    grade.levels.forEach((lv, idx) => {
        const unlocked = isLevelUnlocked(grade, idx, false), completed = isLevelCompleted(grade.id, lv.id, false);
        const card = document.createElement('div'); card.className = 'level-card';
        if (!unlocked) card.classList.add('locked'); if (completed) card.classList.add('completed'); if (unlocked && !completed) card.classList.add('current');
        card.innerHTML = `<div class="lv-num">${lv.id}</div><div class="lv-name">${lv.name}</div>`;
        if (unlocked) card.onclick = () => showGameIntro(grade.id, lv.id, false);
        grid.appendChild(card);
    });
    const bossSection = document.getElementById('bossSection');
    const bossUnlocked = isLevelUnlocked(grade, 0, true), bossCompleted = isLevelCompleted(grade.id, 0, true), boss = getBossLevel(grade);
    bossSection.innerHTML = `<div class="boss-divider">⭐ 终极挑战 ⭐</div><div class="boss-card ${!bossUnlocked?'locked':''} ${bossCompleted?'completed':''}"><div class="boss-icon">💀</div><div class="boss-info"><div class="boss-title">终极挑战</div><div class="boss-desc">本等级全部 ${boss.words.length} 个汉字大挑战！</div></div><div class="boss-status">${bossCompleted?'✅':(bossUnlocked?'▶':'🔒')}</div></div>`;
    if (bossUnlocked) bossSection.querySelector('.boss-card').onclick = () => showGameIntro(grade.id, 0, true);
}

// ==================== 16. 管理平台 ====================
let editingWords = [], editingLevelId = null, editingGradeId = null, editingIsBoss = false;

function showAdmin() { hideAllScreens(); document.getElementById('adminPanel').style.display = 'flex'; grades = loadGrades(); progress = loadProgress(); switchAdminTab('grade'); playing = false; paused = false; cancelAnimationFrame(animId); }
function closeAdmin() { document.getElementById('adminPanel').style.display = 'none'; showMainMenu(); }

let _skipResetForm = false;

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    const tabBtn = document.querySelector(`.admin-tab[onclick*="switchAdminTab('${tab}')"]`);
    if (tabBtn) tabBtn.classList.add('active');
    const section = document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (section) section.classList.add('active');
    if (tab === 'levels') renderAdminLevels();
    if (tab === 'grade') { populateGradeSelect(); renderAdminGrades(); }
    if (tab === 'add') { populateGradeSelect(); if (!_skipResetForm) resetEditForm(); }
    _skipResetForm = false;
}

function populateGradeSelect() { document.getElementById('editGradeId').innerHTML = grades.map(g => `<option value="${g.id}">${g.name}</option>`).join(''); }

function renderAdminLevels() {
    const container = document.getElementById('adminGradeLevels'); container.innerHTML = '';
    grades.forEach(grade => {
        const group = document.createElement('div'); group.className = 'grade-group';
        const pg = getGradeProgress(grade);
        let html = `<div class="grade-group-title">${grade.name}（${pg.completed}/${pg.total}）</div>`;
        grade.levels.forEach(lv => {
            const completed = isLevelCompleted(grade.id, lv.id, false);
            const wordStrs = lv.words.map(w => w.hanzi).join('、');
            html += `<div class="level-item"><div class="li-info"><div class="li-name">${completed?'✅ ':''}第${lv.id}关：${lv.name}</div><div class="li-words">汉字：${wordStrs} | 目标：切${lv.target}个，学会${lv.passWords}字</div></div><div class="li-actions"><button class="btn-sm blue" onclick="editLevel(${grade.id},${lv.id},false)">✏️</button><button class="btn-sm red" onclick="deleteLevel(${grade.id},${lv.id},false)">🗑</button></div></div>`;
        });
        const boss = getBossLevel(grade), bossCompleted = isLevelCompleted(grade.id, 0, true);
        html += `<div class="level-item boss"><div class="li-info"><div class="li-name">${bossCompleted?'✅ ':''}💀 终极挑战</div><div class="li-words">全部 ${boss.words.length} 个汉字（自动生成）</div></div><div class="li-actions"><span style="font-size:12px;color:#999;">系统生成</span></div></div>`;
        group.innerHTML = html; container.appendChild(group);
    });
}

function renderAdminGrades() {
    const list = document.getElementById('adminGradeList'); list.innerHTML = '';
    grades.forEach(grade => {
        const item = document.createElement('div'); item.className = 'level-item';
        item.innerHTML = `<div class="li-info"><div class="li-name">${grade.name}</div><div class="li-words">${grade.levels.length} 关 + 终极挑战</div></div><div class="li-actions"><button class="btn-sm red" onclick="deleteGrade(${grade.id})">🗑 删除</button></div>`;
        list.appendChild(item);
    });
}

function addGrade() {
    const name = document.getElementById('newGradeName').value.trim();
    if (!name) { alert('请输入等级名称'); return; }
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.id)) : 0;
    grades.push({ id: maxId + 1, name, levels: [], bossLevel: null });
    saveGrades(grades); document.getElementById('newGradeName').value = '';
    renderAdminGrades(); populateGradeSelect(); alert('等级添加成功！请在各等级中添加关卡。');
}

function deleteGrade(id) {
    if (!confirm('确定要删除该等级及其所有关卡吗？')) return;
    grades = loadGrades(); progress = loadProgress();
    grades = grades.filter(g => g.id !== id);
    Object.keys(progress).forEach(k => { if (k.startsWith(`g${id}-`)) delete progress[k]; });
    saveGrades(grades); saveProgress(progress);
    renderAdminLevels(); renderAdminGrades(); populateGradeSelect();
}

function resetEditForm() {
    editingLevelId = null; editingGradeId = null; editingIsBoss = false; editingWords = [];
    document.getElementById('editLevelId').value = ''; document.getElementById('editIsBoss').value = '';
    document.getElementById('levelName').value = ''; document.getElementById('levelDesc').value = '';
    document.getElementById('wordInputArea').value = ''; document.getElementById('levelTarget').value = '15';
    document.getElementById('levelPassWords').value = '3'; document.getElementById('saveLevelBtn').textContent = '💾 保存关卡';
    populateGradeSelect(); renderWordEditList();
}

function parseWordLine(line) {
    const trimmed = line.trim(); if (!trimmed) return null;
    const parts = trimmed.split(/\s+/); if (parts.length < 2) return null;
    const hanzi = parts[0], pinyin = parts[1];
    if (hanzi.length === 0 || pinyin.length === 0) return null;
    return { hanzi, pinyin };
}

function batchImportWords() {
    const text = document.getElementById('wordInputArea').value.trim();
    if (!text) { alert('请输入汉字列表'); return; }
    const lines = text.split('\n');
    let added = 0;
    for (const line of lines) { const word = parseWordLine(line); if (!word) continue; const idx = editingWords.length; editingWords.push({ ...word, emoji: EMOJI_POOL[idx % EMOJI_POOL.length], color: COLOR_POOL[idx % COLOR_POOL.length] }); added++; }
    if (added === 0) { alert('没有识别到有效的汉字，请检查格式'); return; }
    document.getElementById('wordInputArea').value = '';
    const passWords = editingWords.length, target = passWords * 4;
    document.getElementById('levelPassWords').value = passWords; document.getElementById('levelTarget').value = target;
    renderWordEditList(); alert(`成功导入 ${added} 个汉字！通关需学 ${passWords} 字，目标切 ${target} 个水果。`);
}

function removeWordFromEdit(index) { editingWords.splice(index, 1); renderWordEditList(); }

function renderWordEditList() {
    const list = document.getElementById('wordEditList'); list.innerHTML = '';
    editingWords.forEach((w, i) => { const tag = document.createElement('span'); tag.className = 'word-edit-tag'; tag.innerHTML = `${w.emoji} ${w.hanzi}(${w.pinyin}) <span class="remove-word" onclick="removeWordFromEdit(${i})">✕</span>`; list.appendChild(tag); });
}

function editLevel(gradeId, levelId, isBoss) {
    grades = loadGrades(); const grade = grades.find(g => g.id === gradeId); if (!grade) return;
    let lv = isBoss ? getBossLevel(grade) : grade.levels.find(l => l.id === levelId); if (!lv) return;
    editingLevelId = levelId; editingGradeId = gradeId; editingIsBoss = isBoss; editingWords = JSON.parse(JSON.stringify(lv.words));
    document.getElementById('editLevelId').value = levelId; document.getElementById('editIsBoss').value = isBoss?'1':'';
    document.getElementById('editGradeId').value = gradeId; document.getElementById('levelName').value = lv.name||'';
    document.getElementById('levelDesc').value = lv.desc||''; document.getElementById('levelTarget').value = lv.target;
    document.getElementById('levelPassWords').value = lv.passWords; document.getElementById('saveLevelBtn').textContent = '💾 更新关卡';
    renderWordEditList(); _skipResetForm = true; switchAdminTab('add');
}

function deleteLevel(gradeId, levelId, isBoss) {
    if (!confirm('确定要删除该关卡吗？')) return;
    grades = loadGrades(); const grade = grades.find(g => g.id === gradeId); if (!grade) return;
    grade.levels = grade.levels.filter(l => l.id !== levelId); saveGrades(grades);
    progress = loadProgress(); delete progress[getProgressKey(gradeId, levelId, isBoss)]; saveProgress(progress);
    renderAdminLevels();
}

function saveLevel() {
    const name = document.getElementById('levelName').value.trim();
    const desc = document.getElementById('levelDesc').value.trim();
    const target = parseInt(document.getElementById('levelTarget').value) || 15;
    const passWords = parseInt(document.getElementById('levelPassWords').value) || 3;
    const gradeId = parseInt(document.getElementById('editGradeId').value);
    if (!name) { alert('请输入关卡名称'); return; }
    if (!gradeId) { alert('请选择所属等级'); return; }
    if (editingWords.length === 0) { alert('请至少添加一个汉字'); return; }
    if (passWords > editingWords.length) { alert('通关学字数不能超过汉字总数'); return; }
    grades = loadGrades(); const grade = grades.find(g => g.id === gradeId); if (!grade) { alert('未找到所属等级'); return; }
    if (editingLevelId) {
        const idx = grade.levels.findIndex(l => l.id === editingLevelId);
        if (idx >= 0) grade.levels[idx] = { ...grade.levels[idx], name, desc, words: editingWords, target, passWords };
    } else {
        const maxId = grade.levels.length > 0 ? Math.max(...grade.levels.map(l => l.id)) : gradeId * 100;
        grade.levels.push({ id: maxId + 1, name, desc, words: editingWords, target, passWords });
    }
    saveGrades(grades); alert('关卡保存成功！'); resetEditForm(); switchAdminTab('levels'); renderAdminLevels();
}

// ==================== 17. 按钮事件 ====================
document.getElementById('retryBtn').addEventListener('click', () => { if (currentLevel) { document.getElementById('gameOverScreen').style.display = 'none'; document.getElementById('lives').style.display = 'flex'; startLevelInternal(currentLevel, gameMode); } });
document.getElementById('pauseBtn').addEventListener('click', () => { paused = true; document.getElementById('pauseScreen').style.display = 'flex'; });
document.getElementById('resumeBtn').addEventListener('click', () => { paused = false; document.getElementById('pauseScreen').style.display = 'none'; });

// 浮动动画
const floatStyle = document.createElement('style');
floatStyle.textContent = `@keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-80px) scale(1.3);opacity:0}}`;
document.head.appendChild(floatStyle);

// 初始绘制
drawBackground(W(), H());

// 暴露全局函数（供 HTML onclick 调用）
window.showMainMenu = showMainMenu;
window.showGradeSelect = showGradeSelect;
window.showAdmin = showAdmin;
window.closeAdmin = closeAdmin;
window.switchAdminTab = switchAdminTab;
window.batchImportWords = batchImportWords;
window.removeWordFromEdit = removeWordFromEdit;
window.editLevel = editLevel;
window.deleteLevel = deleteLevel;
window.deleteGrade = deleteGrade;
window.addGrade = addGrade;
window.saveLevel = saveLevel;
window.resetAllData = resetAllData;
window.goNextLevel = goNextLevel;
