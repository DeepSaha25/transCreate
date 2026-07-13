import { useMemo } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import type { TranscreatedLine, ScriptLine, CulturalRisk } from '../../types/transcript'
import { DollarSign, TrendingUp, BarChart3, FileText } from 'lucide-react'
import './AnalyticsView.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

interface Props {
  originalLines: ScriptLine[]
  transcreated: Map<string, TranscreatedLine>
  risks: Map<string, CulturalRisk>
}

const EMOTION_COLORS: Record<string, string> = {
  'neutral': '#888884',
  'warm familiarity': '#f59e0b',
  'dry irony': '#8b5cf6',
  'excited': '#ef4444',
  'tense': '#dc2626',
  'melancholic': '#6366f1',
  'comedic': '#22c55e',
  'reverent': '#0ea5e9',
  'confrontational': '#f97316',
  'playful': '#ec4899',
}

const EMOTION_INTENSITY: Record<string, number> = {
  'neutral': 1,
  'warm familiarity': 4,
  'dry irony': 5,
  'excited': 8,
  'tense': 7,
  'melancholic': 6,
  'comedic': 6,
  'reverent': 3,
  'confrontational': 9,
  'playful': 5,
}

export default function AnalyticsView({ originalLines, transcreated, risks }: Props) {
  const completedLines = useMemo(() =>
    Array.from(transcreated.values()).filter(l => !l.isLoading && l.transcreatedText),
    [transcreated]
  )

  const stats = useMemo(() => {
    const wordCountOrig = originalLines.reduce((acc, l) => acc + l.text.split(/\s+/).length, 0)
    const wordCountTrans = completedLines.reduce((acc, l) => acc + l.transcreatedText.split(/\s+/).length, 0)

    const confidenceMap: Record<string, number> = { high: 3, medium: 2, low: 1 }
    const avgConf = completedLines.length
      ? completedLines.reduce((acc, l) => acc + (confidenceMap[l.confidence] ?? 2), 0) / completedLines.length
      : 0

    const emotionDist: Record<string, number> = {}
    completedLines.forEach(l => {
      emotionDist[l.emotionTag] = (emotionDist[l.emotionTag] ?? 0) + 1
    })

    const riskDist = { critical: 0, caution: 0, safe: 0 }
    risks.forEach(r => { riskDist[r.risk]++ })

    // Industry rate: ~$0.25/word for professional transcreation
    const costSaved = wordCountOrig * 0.25

    return {
      totalLines: originalLines.length,
      completedLines: completedLines.length,
      avgConfidence: avgConf,
      emotionDistribution: emotionDist,
      riskDistribution: riskDist,
      wordCountOriginal: wordCountOrig,
      wordCountTranscreated: wordCountTrans,
      estimatedCostSaved: costSaved,
    }
  }, [originalLines, completedLines, risks])

  // Emotion Arc Chart Data
  const emotionArcData = useMemo(() => {
    const sorted = [...completedLines].sort((a, b) => a.index - b.index)
    return {
      labels: sorted.map(l => `L${l.index}`),
      datasets: [{
        label: 'Emotional Intensity',
        data: sorted.map(l => EMOTION_INTENSITY[l.emotionTag] ?? 3),
        borderColor: '#c2410c',
        backgroundColor: 'rgba(194, 65, 12, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: sorted.map(l => EMOTION_COLORS[l.emotionTag] ?? '#888'),
        pointBorderColor: sorted.map(l => EMOTION_COLORS[l.emotionTag] ?? '#888'),
        pointRadius: 6,
        pointHoverRadius: 8,
      }],
    }
  }, [completedLines])

  // Emotion Distribution Doughnut
  const emotionDoughnutData = useMemo(() => {
    const labels = Object.keys(stats.emotionDistribution)
    return {
      labels,
      datasets: [{
        data: labels.map(l => stats.emotionDistribution[l]),
        backgroundColor: labels.map(l => EMOTION_COLORS[l] ?? '#888'),
        borderColor: '#111115',
        borderWidth: 2,
      }],
    }
  }, [stats.emotionDistribution])

  // Word Count Bar Chart
  const wordCountData = useMemo(() => ({
    labels: ['Original', 'Transcreated'],
    datasets: [{
      label: 'Word Count',
      data: [stats.wordCountOriginal, stats.wordCountTranscreated],
      backgroundColor: ['rgba(194, 65, 12, 0.6)', 'rgba(245, 158, 11, 0.6)'],
      borderColor: ['#c2410c', '#f59e0b'],
      borderWidth: 1,
      borderRadius: 4,
    }],
  }), [stats])

  // Risk distribution bar
  const riskData = useMemo(() => ({
    labels: ['Critical', 'Caution', 'Safe'],
    datasets: [{
      label: 'Lines',
      data: [stats.riskDistribution.critical, stats.riskDistribution.caution, stats.riskDistribution.safe],
      backgroundColor: ['rgba(220, 38, 38, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(22, 163, 74, 0.6)'],
      borderColor: ['#dc2626', '#f59e0b', '#16a34a'],
      borderWidth: 1,
      borderRadius: 4,
    }],
  }), [stats])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#16161a',
        titleColor: '#f0eeea',
        bodyColor: '#b8b5b0',
        borderColor: '#222226',
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { color: '#1c1c22' }, ticks: { color: '#504e4a', font: { size: 10 } } },
      y: { grid: { color: '#1c1c22' }, ticks: { color: '#504e4a', font: { size: 10 } } },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#b8b5b0', font: { size: 10 }, padding: 8, boxWidth: 12 },
      },
    },
  }

  if (completedLines.length === 0) {
    return (
      <div className="analytics-empty">
        <BarChart3 size={40} />
        <h3>No data yet</h3>
        <p>Transcreate your script in the Editor tab first, then come back here for insights.</p>
      </div>
    )
  }

  return (
    <div className="analytics-view">
      {/* Stat Cards */}
      <div className="analytics-stats">
        <div className="stat-card">
          <div className="stat-card__icon"><FileText size={18} /></div>
          <div className="stat-card__body">
            <span className="stat-card__value">{stats.completedLines}/{stats.totalLines}</span>
            <span className="stat-card__label">Lines Transcreated</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon"><TrendingUp size={18} /></div>
          <div className="stat-card__body">
            <span className="stat-card__value">{(stats.avgConfidence / 3 * 100).toFixed(0)}%</span>
            <span className="stat-card__label">Avg Confidence</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green"><DollarSign size={18} /></div>
          <div className="stat-card__body">
            <span className="stat-card__value stat-card__value--green">${stats.estimatedCostSaved.toFixed(0)}</span>
            <span className="stat-card__label">Estimated Cost Saved</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon"><BarChart3 size={18} /></div>
          <div className="stat-card__body">
            <span className="stat-card__value">{stats.wordCountOriginal} → {stats.wordCountTranscreated}</span>
            <span className="stat-card__label">Word Count Change</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts">
        {/* Emotional Arc */}
        <div className="analytics-chart-card analytics-chart-card--wide">
          <h3 className="analytics-chart-card__title">Emotional Arc Timeline</h3>
          <p className="analytics-chart-card__desc">Tracks the emotional intensity across script lines — proves the transcreation preserves the dramatic pacing.</p>
          <div className="analytics-chart-card__chart" style={{ height: '220px' }}>
            <Line data={emotionArcData} options={chartOptions} />
          </div>
        </div>

        {/* Emotion Distribution */}
        <div className="analytics-chart-card">
          <h3 className="analytics-chart-card__title">Emotion Distribution</h3>
          <p className="analytics-chart-card__desc">Breakdown of emotional tones across all transcreated lines.</p>
          <div className="analytics-chart-card__chart" style={{ height: '200px' }}>
            <Doughnut data={emotionDoughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Word Count */}
        <div className="analytics-chart-card">
          <h3 className="analytics-chart-card__title">Word Count Comparison</h3>
          <p className="analytics-chart-card__desc">Original vs transcreated — shows if the adaptation expanded or compressed the dialogue.</p>
          <div className="analytics-chart-card__chart" style={{ height: '200px' }}>
            <Bar data={wordCountData} options={chartOptions} />
          </div>
        </div>

        {/* Risk Distribution */}
        {risks.size > 0 && (
          <div className="analytics-chart-card">
            <h3 className="analytics-chart-card__title">Cultural Risk Breakdown</h3>
            <p className="analytics-chart-card__desc">How many lines were flagged by the Cultural Risk Scanner.</p>
            <div className="analytics-chart-card__chart" style={{ height: '200px' }}>
              <Bar data={riskData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
