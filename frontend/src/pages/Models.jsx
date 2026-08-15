import { useState } from 'react'
import { Cpu, Brain, Zap, Gauge, Trophy, Search } from 'lucide-react'
import { Card, Badge } from '../components/ui.jsx'
import { MODELS } from '../data/models.js'

const COST_LABEL = {
  low: { text: '低成本', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { text: '中等', cls: 'bg-blue-50 text-blue-600' },
  high: { text: '高阶', cls: 'bg-violet-50 text-violet-600' },
}

const CATEGORY_ORDER = ['旗舰', '推荐默认', '轻量', '代码', '推理', '翻译', '图像']

function bar(value, max = 5) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${value}/${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-3 rounded-full ${
            i < value ? 'bg-primary' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function Models() {
  const [filter, setFilter] = useState('')
  const keyword = filter.trim().toLowerCase()

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: MODELS.filter(
      (m) =>
        m.category === cat &&
        (!keyword ||
          m.id.toLowerCase().includes(keyword) ||
          m.useCase.toLowerCase().includes(keyword)),
    ),
  })).filter((g) => g.items.length > 0)

  const others = MODELS.filter((m) => !CATEGORY_ORDER.includes(m.category))
  if (others.length) grouped.push({ cat: '其他', items: others })

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              模型目录
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              按场景与成本推荐合适的 Qwen 与 Wan 系列模型
            </p>
          </div>
          <div className="relative w-full lg:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="搜索模型 ID 或用例…"
              aria-label="搜索模型"
            />
          </div>
        </div>
      </Card>

      {grouped.length === 0 && (
        <Card className="p-10 text-center text-sm text-slate-500">
          没有匹配的模型，换个关键词试试。
        </Card>
      )}

      {grouped.map(({ cat, items }) => (
        <section key={cat}>
          <h3 className="mb-3 text-sm font-semibold text-slate-500">{cat}</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((model) => {
              const cost = COST_LABEL[model.cost]
              return (
                <Card
                  key={model.id}
                  className="cursor-pointer p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" aria-hidden="true" />
                        <p className="font-mono text-sm font-semibold text-slate-900">
                          {model.id}
                        </p>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-500">
                        {model.useCase}
                      </p>
                    </div>
                    <Badge color={cost.cls}>{cost.text}</Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      <span className="text-xs text-slate-500">上下文</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {model.context}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      <span className="text-xs text-slate-500">速度</span>
                      {bar(model.speed)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      <span className="text-xs text-slate-500">质量</span>
                      {bar(model.quality)}
                    </div>
                    {model.thinking && (
                      <Badge color="bg-amber-50 text-amber-600">
                        <Brain className="h-3 w-3" aria-hidden="true" />
                        思考模式
                      </Badge>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      ))}

      <p className="pb-2 text-center text-xs text-slate-400">
        模型清单为演示数据，最新模型目录请参阅官方文档
        https://www.qianwenai.com/models
      </p>
    </div>
  )
}
