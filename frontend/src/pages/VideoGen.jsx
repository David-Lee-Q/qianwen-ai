import { useMemo, useState, useEffect, useRef } from 'react'
import { Clapperboard, Play, Download } from 'lucide-react'
import { mockApi, getApiMode } from '../services/mockApi.js'
import {
  Card,
  Button,
  Textarea,
  Select,
  EmptyState,
  Spinner,
  Badge,
  ModeRestrictedBanner,
} from '../components/ui.jsx'
import { useModelBenefits, pickRecommended, freeSuffix, resolveDefaultModel, catModels } from '../hooks/useModelBenefits.js'

const VIDEO_MODELS = [
  { id: 'wan2.6-t2v', label: 'Wan2.6 T2V（推荐 · 含音频）' },
  { id: 'wan2.7-t2v', label: 'Wan2.7 T2V（720P/1080P · 支持配音）' },
  { id: 'wan2.5-t2v-preview', label: 'Wan2.5 T2V Preview（含音频）' },
  { id: 'wan2.2-t2v-plus', label: 'Wan2.2 T2V Plus（静音 · 5秒）' },
  { id: 'happyhorse-1.1-t2v', label: 'HappyHorse 1.1 T2V（含音频）' },
]

const EXAMPLES = [
  '一只柯基犬在海边奔跑，阳光明媚，航拍视角',
  '清晨的城市街道，雨后的倒影，电影感运镜',
  '太空站视角下的地球旋转，缓慢推进',
  '山谷中的瀑布飞流直下，雾气弥漫',
]

export default function VideoGen() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState(() => resolveDefaultModel(null, 'video', 'wan2.6-t2v'))
  const [duration, setDuration] = useState(5)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [playing, setPlaying] = useState(false)
  const modelTouched = useRef(false)
  const benefits = useModelBenefits()

  useEffect(() => {
    if (!benefits) return
    if (modelTouched.current) return
    const next = resolveDefaultModel(benefits, 'video', 'wan2.6-t2v')
    if (next) setModel(next)
  }, [benefits])

  useEffect(() => {
    function onDefaultsChanged() {
      if (!benefits || modelTouched.current) return
      const next = resolveDefaultModel(benefits, 'video', 'wan2.6-t2v')
      if (next) setModel(next)
    }
    window.addEventListener('qwen-default-models-changed', onDefaultsChanged)
    return () => window.removeEventListener('qwen-default-models-changed', onDefaultsChanged)
  }, [benefits])

  const videoOptions = useMemo(() => {
    const rec = pickRecommended(benefits, 'video')
    const list = VIDEO_MODELS.map((m) => ({
      ...m,
      label: `${m.label}${freeSuffix(benefits, m.id)}${rec?.id === m.id ? '（推荐）' : ''}`,
    }))
    for (const m of catModels(benefits, 'video')) {
      if (m.status !== 'expire' && !list.some((x) => x.id === m.id)) {
        list.push({
          id: m.id,
          label: `${m.id}${freeSuffix(benefits, m.id)}${rec?.id === m.id ? '（推荐）' : ''}`,
        })
      }
    }
    return list
  }, [benefits])

  async function generate() {
    const p = prompt.trim()
    if (!p || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await mockApi.generateVideo(p, { model, duration })
      setResult(res)
      mockApi
        .recordHistory({
          type: 'video',
          model: res.model,
          prompt: p,
          output: res.url,
          meta: { duration: res.duration, poster: res.poster },
        })
        .catch(() => {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {getApiMode() === 'builtin' && <ModeRestrictedBanner />}
      <div className="flex flex-col gap-4 lg:h-[calc(100vh-10rem)] lg:flex-row lg:gap-6">
      <Card className="flex w-full shrink-0 flex-col lg:w-[320px] lg:overflow-y-auto">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-base font-semibold text-slate-900">视频配置</h3>
        </div>
        <div className="flex-1 space-y-4 p-5">
          <Textarea
            label="提示词 Prompt"
            id="video-prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述镜头、主体与画面氛围…"
            hint="建议包含主体、动作、场景与运镜"
          />
          <Select
            label="模型"
            id="video-model"
            value={model}
            onChange={(e) => {
              modelTouched.current = true
              setModel(e.target.value)
            }}
          >
            {videoOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
          <Select label="时长" id="video-duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            <option value={5}>5 秒</option>
            <option value={10}>10 秒</option>
          </Select>
          <Button onClick={generate} disabled={loading || !prompt.trim()} className="w-full">
            {loading ? (
              <>
                <Spinner /> 正在生成视频…
              </>
            ) : (
              <>
                <Clapperboard className="h-4 w-4" aria-hidden="true" />
                生成视频
              </>
            )}
          </Button>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">试试这些灵感</p>
            <div className="space-y-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-left text-xs text-slate-600 transition-colors hover:border-primary/40 hover:bg-blue-50/50"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="flex min-h-[320px] min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">生成结果</h3>
            {result && (
              <p className="mt-0.5 text-xs text-slate-400">
                {result.model} · {result.duration}s
              </p>
            )}
          </div>
          {result && <Badge color="bg-emerald-50 text-emerald-600">生成完成</Badge>}
        </div>

        {!result && !loading ? (
          <EmptyState
            icon={<Clapperboard className="h-6 w-6" aria-hidden="true" />}
            title="还没有生成视频"
            description="在左侧输入镜头描述并点击「生成视频」，结果会显示在这里。"
          />
        ) : loading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <div className="flex h-48 w-48 animate-pulse items-center justify-center rounded-2xl bg-slate-100">
              <Clapperboard className="h-10 w-10 text-slate-300" aria-hidden="true" />
            </div>
            <p className="text-sm text-slate-400">
              视频合成需要一点时间，请稍候…
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-900">
              <video
                src={result.url}
                poster={result.poster}
                controls
                className="aspect-video w-full"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            </div>
            <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => setPlaying(!playing)}>
                <Play className="h-4 w-4" aria-hidden="true" />
                {playing ? '暂停' : '播放'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open(result.url, '_blank')}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                下载
              </Button>
              <Badge color="bg-slate-100 text-slate-500">
                提示词：{prompt.slice(0, 40)}
                {prompt.length > 40 ? '…' : ''}
              </Badge>
            </div>
          </div>
        )}
      </Card>
      </div>
    </div>
  )
}
