const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const API_MODE = 'mock'

const TEXT_REPLIES = [
  '好的，我来帮你处理。基于当前需求，最合适的方案是从目标拆解开始：先明确可量化的结果，再倒推关键动作，最后设定检查点。这样每一步都有依据，迭代时也能快速定位偏差。',
  '这个问题可以从两个维度看。短期先解决最影响体验的环节，长期则要建立自动化的兜底机制。我的建议是先做一轮小范围验证，用真实数据确认方向，再决定是否全面铺开。',
  '收到。我整理了三个要点：第一，数据口径要统一，否则对比没有意义；第二，结果需要可复现，建议保留完整的参数与随机种子；第三，输出格式直接决定下游消费成本，尽量结构化。',
  '理解你的目标。我建议采用这样的执行路径：先确认边界条件，再设计最小可行方案，随后用样例数据跑通全链路，最后逐步放宽约束做压力测试。过程中保持日志完整，便于回溯。',
  '这是一个值得展开的话题。核心矛盾在于资源的有限性与期望的复杂度，所以优先级排序比执行本身更重要。我建议按「影响面 × 紧急度」二维矩阵来决策，并预留 20% 的缓冲时间应对不确定性。',
]

const IMAGE_PROMPTS = [
  {
    prompt: '一只安静的橘猫坐在窗台边，午后阳光洒落，水彩插画风格',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  },
  {
    prompt: '未来城市天际线，霓虹灯光，赛博朋克风格',
    url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
  },
  {
    prompt: '山间清晨的云雾与湖泊，水彩渐变，极简风格',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
  },
  {
    prompt: '一杯拉花拿铁与木桌上的笔记本，摄影风格',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  },
]

export const mockApi = {
  chat(userMessage, { model = 'qwen3.7-plus' } = {}) {
    return delay(900 + Math.random() * 600).then(() => ({
      model,
      text: pick(TEXT_REPLIES),
      usage: {
        prompt_tokens: Math.round(userMessage.length * 1.3),
        completion_tokens: 180 + Math.round(Math.random() * 120),
      },
    }))
  },

  generateImage(prompt, { model = 'wan2.6-t2i', count = 1, size = '1K' } = {}) {
    return delay(1400 + Math.random() * 800).then(() => ({
      model,
      size,
      images: Array.from({ length: count }, () => ({
        url: pick(IMAGE_PROMPTS).url,
        seed: Math.floor(Math.random() * 1e9),
        prompt,
      })),
    }))
  },

  generateVideo(prompt, { model = 'wan2.1-video-t2i-pro', duration = 5 } = {}) {
    return delay(1800 + Math.random() * 900).then(() => ({
      model,
      duration,
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster:
        'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80',
    }))
  },

  synthesizeSpeech(text, { voice = '晴光', speed = 1.0 } = {}) {
    return delay(1000 + Math.random() * 500).then(() => ({
      voice,
      speed,
      duration: Math.round((text.length * 0.28) / speed) + ' 秒',
      sampleRate: '24000 Hz',
    }))
  },

  analyzeImage(fileName, { model = 'qwen3.7-plus' } = {}) {
    return delay(1200 + Math.random() * 600).then(() => ({
      model,
      summary:
        '这是一张清晰的生活场景照片。画面主体突出，构图符合三分法则，光线柔和自然。图中的主要元素包括前景主体、背景层次与高光细节，整体氛围温暖。',
      tags: ['场景识别', '光线分析', '主体检测', '构图评估'],
      ocr: [
        { text: 'QIANWEN AI CONSOLE', confidence: 0.98 },
        { text: 'Create · Generate · Analyze', confidence: 0.95 },
      ],
    }))
  },

  getUsage() {
    return delay(600).then(() => ({
      month: '本月',
      totalTokens: '128.6M',
      tokenTrend: [32, 41, 38, 55, 47, 62, 58, 71, 66, 82, 78, 92],
      modelBreakdown: [
        { name: 'qwen3.7-plus', value: 46 },
        { name: 'qwen3.8-max', value: 22 },
        { name: 'qwen3.7-flash', value: 18 },
        { name: 'wan2.6-t2i', value: 9 },
        { name: '其他', value: 5 },
      ],
      quota: { used: 78, free: 22 },
      spend: '¥ 86.42',
      budget: '¥ 200.00',
      bills: [
        { date: '08-12', model: 'qwen3.7-plus', tokens: '4.2M', cost: '¥ 6.30' },
        { date: '08-11', model: 'qwen3.8-max', tokens: '1.8M', cost: '¥ 5.76' },
        { date: '08-10', model: 'wan2.6-t2i', images: '32 张', cost: '¥ 3.20' },
        { date: '08-09', model: 'qwen3.7-flash', tokens: '12.6M', cost: '¥ 2.52' },
        { date: '08-08', model: 'qwen-image-2.0-pro', images: '8 张', cost: '¥ 4.80' },
      ],
    }))
  },
}
