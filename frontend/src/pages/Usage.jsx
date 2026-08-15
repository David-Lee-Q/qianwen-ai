import { useEffect, useState } from 'react'
import { ChartColumn, Coins, Wallet, Percent } from 'lucide-react'
import { mockApi } from '../services/mockApi.js'
import { Card, CardHeader, Badge, Spinner } from '../components/ui.jsx'

function TrendChart({ data }) {
  const max = Math.max(...data)
  const labels = ['1日', '8日', '16日', '24日', '31日']
  return (
    <div className="mt-4">
      <div className="flex h-44 items-end justify-between gap-1.5">
        {data.map((v, i) => (
          <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
              {(v / 1000).toFixed(1)}k
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-primary/70 to-primary-light transition-all duration-300 group-hover:from-primary group-hover:to-cyan-400"
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  )
}

function Donut({ parts }) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  let acc = 0
  const segments = parts.map((p) => {
    const start = acc
    acc += p.value
    return { ...p, start }
  })
  const COLORS = ['#2563EB', '#3B82F6', '#06B6D4', '#8B5CF6', '#CBD5E1']
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 42 42" className="h-36 w-36 -rotate-90">
        <circle cx="21" cy="21" r="15.9" fill="none" strokeWidth="7" />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="21"
            cy="21"
            r="15.9"
            fill="none"
            stroke={COLORS[i % COLORS.length]}
            strokeWidth="7"
            strokeDasharray={`${(seg.value / total) * 100} ${100 - (seg.value / total) * 100}`}
            strokeDashoffset={`${-(seg.start / total) * 100}`}
          />
        ))}
      </svg>
      <ul className="flex-1 space-y-2">
        {parts.map((p, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 truncate text-slate-600">{p.name}</span>
            <span className="font-semibold text-slate-800">{p.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Usage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    mockApi.getUsage().then((res) => {
      if (alive) setData(res)
    })
    return () => {
      alive = false
    }
  }, [])

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <ChartColumn className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">本月总 Token</p>
            <p className="text-xl font-bold text-slate-900">{data.totalTokens}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">本月消费</p>
            <p className="text-xl font-bold text-slate-900">{data.spend}</p>
            <p className="text-xs text-slate-400">预算 {data.budget}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Percent className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">免费额度</p>
            <p className="text-xl font-bold text-slate-900">
              已用 {data.quota.used}%
            </p>
            <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                style={{ width: `${data.quota.used}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Token 消耗趋势"
            subtitle="最近 12 天的日均消耗（单位：万 Token）"
            action={<Badge color="bg-blue-50 text-blue-600">{data.month}</Badge>}
          />
          <div className="px-6 pb-6">
            <TrendChart data={data.tokenTrend} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="模型占比" subtitle="按消费量占比" />
          <div className="px-6 pb-6">
            <Donut parts={data.modelBreakdown} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="最近账单"
          subtitle="按日聚合的模型消费明细"
          action={
            <Badge color="bg-slate-100 text-slate-500">
              <Coins className="h-3 w-3" aria-hidden="true" />
              计费周期：自然月
            </Badge>
          }
        />
        <div className="overflow-x-auto px-2 pb-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">日期</th>
                <th className="px-4 py-3 font-medium">模型</th>
                <th className="px-4 py-3 font-medium">用量</th>
                <th className="px-4 py-3 text-right font-medium">费用</th>
              </tr>
            </thead>
            <tbody>
              {data.bills.map((b, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 text-slate-500">{b.date}</td>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-slate-800">
                    {b.model}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {b.tokens ?? b.images}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    {b.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
