import { useState } from 'react'
import { KeyRound, ShieldCheck, Info, CircuitBoard } from 'lucide-react'
import {
  Card,
  CardHeader,
  Button,
  Badge,
  Input,
  Toggle,
} from '../components/ui.jsx'
import { API_MODE } from '../services/mockApi.js'

function StateRow({ label, desc, value, color }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
      </div>
      <Badge color={color}>{value}</Badge>
    </div>
  )
}

export default function Settings() {
  const [keyInput, setKeyInput] = useState('')
  const [configured, setConfigured] = useState(true)
  const [autoDetect, setAutoDetect] = useState(true)
  const [saving, setSaving] = useState(false)

  function save() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setConfigured(true)
      setKeyInput('')
    }, 700)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader
          title="API Key 配置"
          subtitle="认证状态与密钥管理（qianwen-ops-auth）"
          action={
            configured ? (
              <Badge color="bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                已配置
              </Badge>
            ) : (
              <Badge color="bg-amber-50 text-amber-600">未配置</Badge>
            )
          }
        />
        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <StateRow
              label="认证方式"
              desc="支持 DASHSCOPE_API_KEY / QIANWEN_API_KEY 环境变量"
              value="环境变量"
              color="bg-blue-50 text-blue-600"
            />
            <StateRow
              label="密钥类型"
              desc="演示数据，实际接口仅支持标准 sk- 开头密钥"
              value="标准密钥"
              color="bg-slate-100 text-slate-600"
            />
            <StateRow
              label="接口模式"
              desc="当前界面返回模拟数据，接入真实服务即可切换"
              value={API_MODE === 'mock' ? 'Mock 演示' : '真实调用'}
              color="bg-slate-100 text-slate-600"
            />
          </div>

          <div>
            <Input
              label="更新 API Key"
              id="api-key"
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder={configured ? 'sk-••••••••••••（已配置）' : '输入新的 API Key'}
              hint="密钥仅保存在本地环境变量，不会明文展示"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">自动检测环境变量</p>
              <p className="mt-0.5 text-xs text-slate-400">
                启动时自动读取 DASHSCOPE_API_KEY
              </p>
            </div>
            <Toggle checked={autoDetect} onChange={setAutoDetect} label="自动检测环境变量" />
          </div>

          <Button onClick={save} disabled={saving}>
            {saving ? '保存中…' : '保存配置'}
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="接入说明"
          subtitle="如何将界面切换到真实 AI 调用"
          action={
            <Badge color="bg-slate-100 text-slate-500">
              <CircuitBoard className="h-3 w-3" aria-hidden="true" />
              API Ready
            </Badge>
          }
        />
        <div className="space-y-4 p-6">
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              1
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              将 <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">src/services/mockApi.js</code>{' '}
              中每个方法替换为对真实接口的 fetch 请求，保持相同的入参与返回结构。
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              2
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              在开发环境配置
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">/api</code>{' '}
              反向代理（vite.config.js 已预留），将请求转发至后端网关。
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              3
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              将 API_MODE 切换为 <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">'real'</code>，
              各页面即自动使用真实数据。
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="关于" />
        <div className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-500 text-white">
            <Info className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="text-sm leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-800">
              QianWen AI Console v0.1.0
            </p>
            <p className="mt-1">
              面向 QianWen AI Skills 的可视化演示操作台。文本、图像、视频、语音、
              视觉与用量管理能力均来自开源项目
              <span className="font-medium text-slate-800"> QianWen-AI/qianwen-ai</span>
              。
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
