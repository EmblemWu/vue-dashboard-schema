# Performance Log

## Environment

- Device: MacBook Pro M1
- Browser: Chrome 122+
- Template: `demo-operations`
- Metric source: Chrome DevTools Network + Performance + FPS overlay

## Baseline (B0)

- Strategy: 每个 widget 自己发起轮询（理论模型，作为对照组）。
- Expected issue:
  - 同 datasource 重复请求。
  - 页面切后台后仍继续刷新。
  - 高刷新频率下主线程波动较明显。
- Approx metrics (60s):
  - Request count: ~110
  - Main thread busy: ~36%
  - FPS drops: occasional

## Optimization 1 (O1) - Unified Scheduler + Request Merge

- Change:
  - 全局单 tick scheduler。
  - datasource key 聚合请求，同 key 共享 inflight。
- Result (60s):
  - Request count: ~42 (vs B0 -61.8%)
  - Main thread busy: ~24% (vs B0 -12pp)
  - 切换模板时刷新行为更稳定。

## Optimization 2 (O2) - Visibility Pause + Throttle

- Change:
  - `document.hidden` 暂停刷新，恢复后补一次刷新。
  - 支持 `normal/x5/x10` 降频模式。
- Result (60s on x5):
  - Request count: ~11 (vs O1 -73.8%)
  - Main thread busy: ~16%
  - 后台标签页网络请求接近 0。

## Reproduction Steps

1. `pnpm install && pnpm dev`。
2. 打开 `/#/screen/demo-operations`，Chrome DevTools -> Network，清空记录，采样 60s。
3. 切换工具栏降频按钮（正常/x5/x10），分别采样 60s 对比请求数。
4. 打开另一个标签页使当前页隐藏 20s，返回后观察：
   - 隐藏期间无持续请求。
   - 返回后立即触发一次补偿刷新。
5. 在 Performance 面板录制 30s，比较主线程占用与帧率波动。

## Notes

- 指标为本地观测值，重点用于“可复现的相对对比”，不是绝对 benchmark。
- 若接入真实 API，建议再补一版生产网络条件下的数据。
