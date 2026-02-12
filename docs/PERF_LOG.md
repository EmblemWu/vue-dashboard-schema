# Performance Log

## Baseline (Week4)

- 刷新策略：每个 datasource 有独立 interval，但全部由统一 scheduler tick 驱动。
- 默认 tick: `1000ms`。
- 失败策略：保留 `last-success` 数据并标记 `stale/error`，避免白屏。

## Scheduler Merge (Week5)

- 改进点：多个 widget 使用同一 datasource，仅发起一次请求。
- 机制：以 datasource key 聚合任务；同 key 的 inflight promise 复用。
- 观察：在 demo 模板中从“每组件独立轮询”转为“按数据源轮询”，请求数显著下降。

## Throttle + Visibility (Week6)

- 降频：支持 `normal/x5/x10`，通过 `throttleFactor` 统一放大刷新间隔。
- 页面不可见：`document.hidden` 时暂停轮询。
- 页面恢复：触发一次全量补偿刷新，保证展示数据及时恢复。

## Trade-offs

- 统一 scheduler 牺牲了“组件私有定时器”的简单性，但换来更好的资源控制和一致性。
- 当前合并策略按 datasource key 粒度，若未来需要更细粒度可加参数哈希分组。
