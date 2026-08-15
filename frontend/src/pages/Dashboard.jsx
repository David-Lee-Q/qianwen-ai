import {
  MessagesSquare,
  Image,
  Clapperboard,
  AudioLines,
  ScanEye,
  Cpu,
  ChartColumn,
  Settings,
  ArrowRight,
  Flame,
  FileText,
  Activity,
  Wallet,
} from 'lucide-react'
import { Card, Badge } from '../components/ui.jsx'
import { SKILLS } from '../data/skills.js'

const ICONS = {
  text: MessagesSquare,
  image: Image,
  video: Clapperboard,
  audio: AudioLines,
  vision: ScanEye,
  models: Cpu,
  usage: ChartColumn,
  settings: Settings,
}

const STATS = [
  { icon: Activity, label: '今日调用', value: '1,284', delta: '+12.4%', up: true },
  { icon: FileText, label: '本月 Token', value: '128.6M', delta: '+8.1%', up: true },
  { icon: Flame, label: '活跃模型', value: '7 个', delta: '+2', up: true },
  { icon: Wallet, label: '本月支出', value: '¥ 86.42', delta: '-4.3%', up: false },
]

const RECENT = [
  { time: '14:32', type: '文本', detail: 'qwen3.7-plus · 代码审查建议', status: '成功' },
  { time: '13:58', type: '图像', detail: 'wan2.6-t2i · 生成 4 张海报', status: '成功' },
  { time: '11:20', type: '语音', detail: 'qwen-tts · 播报稿合成', status: '成功' },
  { time: '09:47', type: '视觉', detail: 'qwen3.6-plus · 截图 OCR 提取', status: '成功' },
  { time: '昨天 18:05', type: '视频', detail: 'wan2.1-t2i · 产品展示短片', status: '排队中' },
]

export default function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-primary p-8 text-white shadow-xl shadow-blue-900/20">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <Badge color="bg-white/15 text-white">QianWen AI Skills</Badge>
          <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
            欢迎回来，开始创造吧
          </h2>
          <p className="mt-2 max-w-lg text-sm text-blue-100">
            文本、图像、视频、语音、视觉——全套 AI 能力已就绪。选择一项能力，或直接输入需求让模型为你工作。
          </p>
          <button
            onClick={() => onNavigate('text')}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            开始对话
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, label, value, delta, up }) => (
          <Card key={label} className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p
                className={`text-xs font-medium ${up ? 'text-emerald-600' : 'text-orange-600'}`}
              >
                {delta}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">AI 能力</h3>
              <p className="mt-1 text-sm text-slate-500">
                点击进入对应能力操作台
              </p>
            </div>
          </div>
          <div className="grid gap-4 px-4 pb-6 sm:grid-cols-2 sm:px-6">
            {SKILLS.map((skill) => {
              const Icon = ICONS[skill.key]
              return (
                <button
                  key={skill.key}
                  onClick={() => onNavigate(skill.key)}
                  className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 p-4 text-left transition-all duration-200 hover:border-primary/40 hover:bg-blue-50/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${skill.accent}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {skill.name}
                      </p>
                      <ArrowRight
                        className="h-3.5 w-3.5 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {skill.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h3 className="text-base font-semibold text-slate-900">最近活动</h3>
            <button
              onClick={() => onNavigate('usage')}
              className="cursor-pointer text-sm font-medium text-primary hover:text-primary-strong"
            >
              用量详情
            </button>
          </div>
          <ul className="divide-y divide-slate-100 px-4 sm:px-6">
            {RECENT.map((item, i) => (
              <li key={i} className="flex items-center gap-3 py-3.5">
                <span className="w-12 shrink-0 text-xs text-slate-400">
                  {item.time}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600">
                  {item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-700">{item.detail}</p>
                </div>
                <span
                  className={`hidden shrink-0 text-xs font-medium sm:block ${
                    item.status === '成功' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
