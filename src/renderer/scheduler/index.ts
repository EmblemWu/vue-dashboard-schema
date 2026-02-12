import { fetchDueDatasources, forceRefreshAllDatasources } from '@/renderer/datasources'

export class DashboardScheduler {
  private timer: number | null = null
  private tickMs: number
  private hidden = false
  private throttleFactor = 1

  constructor(tickMs = 1000) {
    this.tickMs = tickMs
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  start() {
    if (this.timer !== null) {
      return
    }

    this.timer = window.setInterval(() => {
      if (this.hidden) {
        return
      }
      void fetchDueDatasources(Date.now(), this.throttleFactor)
    }, this.tickMs)

    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    void forceRefreshAllDatasources()
  }

  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  setThrottleFactor(factor: number) {
    this.throttleFactor = Math.max(1, Math.floor(factor))
  }

  private handleVisibilityChange() {
    this.hidden = document.hidden
    if (!this.hidden) {
      void forceRefreshAllDatasources()
    }
  }
}

export const dashboardScheduler = new DashboardScheduler()
