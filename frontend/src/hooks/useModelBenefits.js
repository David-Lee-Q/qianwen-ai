import { useEffect, useState } from 'react'
import { mockApi, isRealMode, getDefaultModels } from '../services/mockApi.js'

export function useModelBenefits() {
  const [benefits, setBenefits] = useState(null)
  useEffect(() => {
    let alive = true
    if (!isRealMode()) {
      setBenefits(null)
      return () => {
        alive = false
      }
    }
    mockApi
      .getModelBenefits()
      .then((d) => {
        if (alive) setBenefits(d)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return benefits
}

export function catModels(benefits, category) {
  return benefits?.categories?.[category]?.models || []
}

export function daysUntil(resetDate) {
  if (!resetDate) return null
  const ms = new Date(resetDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86400000))
}

export function isFreeValid(m) {
  return m && m.canTry && m.status === 'valid' && m.resetDate && m.resetDate > new Date().toISOString()
}

// 同类模型中快过期的优先（resetDate 升序第一个）
export function pickRecommended(benefits, category) {
  const list = catModels(benefits, category)
    .filter((m) => isFreeValid(m))
    .sort((a, b) => new Date(a.resetDate) - new Date(b.resetDate))
  return list[0] || null
}

export function modelInfo(benefits, id) {
  const cats = benefits?.categories || {}
  for (const key of Object.keys(cats)) {
    const hit = cats[key].models.find((m) => m.id === id)
    if (hit) return hit
  }
  return null
}

export function freeSuffix(benefits, id) {
  const m = modelInfo(benefits, id)
  if (!isFreeValid(m)) return ''
  const d = daysUntil(m.resetDate)
  return d != null && d > 0 ? ` · 免费额度 ${d} 天后到期` : ''
}

// 功能页默认模型：手动配置（自定义模式）→ 系统自动推荐 → fallback
export function resolveDefaultModel(benefits, category, fallback) {
  const manual = getDefaultModels()[category]
  if (!benefits) return manual || fallback
  const auto = pickRecommended(benefits, category)?.id
  if (manual) {
    const m = modelInfo(benefits, manual)
    if (m && isFreeValid(m)) return manual
  }
  return auto || fallback
}

export function formatFreeTier(m) {
  if (!m) return null
  if (isFreeValid(m)) {
    const d = daysUntil(m.resetDate)
    const pct = m.usedPct != null ? m.usedPct : 0
    return {
      label: '免费额度',
      status: 'valid',
      remaining: m.remaining,
      total: m.total,
      usedPct: pct,
      daysLeft: d,
      resetDate: m.resetDate,
    }
  }
  if (m.status === 'expire') {
    return { label: '免费额度', status: 'expired', usedPct: 100, resetDate: m.resetDate }
  }
  return null
}
