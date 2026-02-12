const random = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) * 100) / 100 + min

const buildSeries = (len = 7, min = 100, max = 500) =>
  Array.from({ length: len }, (_, index) => ({
    name: `D${index + 1}`,
    value: Math.round(random(min, max))
  }))

const tableRows = Array.from({ length: 6 }, (_, index) => ({
  region: ['华东', '华北', '华南', '西南', '华中', '西北'][index],
  sales: Math.round(random(250, 900)),
  conversion: `${Math.round(random(2, 7) * 100) / 100}%`
}))

export const mockGenerators: Record<string, () => unknown> = {
  'kpi-overview': () => ({
    totalUsers: Math.round(random(30000, 38000)),
    activeUsers: Math.round(random(4000, 6000)),
    rate: Math.round(random(5, 12) * 100) / 100,
    updatedAt: new Date().toISOString()
  }),
  'trend-sales': () => ({
    unit: '万元',
    series: buildSeries(12, 220, 680)
  }),
  'traffic-channel': () => ({
    series: [
      { name: '自然流量', value: Math.round(random(1000, 1800)) },
      { name: '广告投放', value: Math.round(random(800, 1400)) },
      { name: '社媒推广', value: Math.round(random(400, 900)) },
      { name: '联盟导流', value: Math.round(random(300, 600)) }
    ]
  }),
  'region-rank': () => ({
    rows: tableRows.map((row) => ({
      ...row,
      sales: row.sales + Math.round(random(-50, 80))
    }))
  }),
  'ops-summary': () => ({
    headline: `运行稳定 ${Math.round(random(97, 100) * 100) / 100}%`,
    note: '自动化任务按计划执行，重点区域库存健康'
  }),
  'bar-categories': () => ({
    categories: ['新品', '复购', '会员', '促销', '渠道'],
    values: Array.from({ length: 5 }, () => Math.round(random(40, 140)))
  })
}
