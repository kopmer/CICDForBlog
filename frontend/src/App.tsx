import { useEffect, useState } from 'react'

type Health = { status: string }

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    fetch('/api/health').then((response) => {
      if (!response.ok) throw new Error('Health check failed')
      return response.json() as Promise<Health>
    }).then(setHealth).catch(() => setError(true))
  }, [])
  const status = health ? `Backend ${health.status}` : error ? 'Backend unavailable' : 'Checking backend…'
  return <main><section className="hero"><p className="eyebrow">JENKINS · DOCKER · NGROK</p><h1>Push once,<br />deploy automatically.</h1><p className="description">GitHub Webhook으로 시작해 Jenkins Pipeline과 Docker Compose를 거쳐 로컬 환경에 배포되는 CI/CD 데모입니다.</p><div className={`health ${error ? 'error' : ''}`}><span className="dot" />{status}</div></section></main>
}
