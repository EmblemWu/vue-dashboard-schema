# Schema Spec

## Version Policy

- `v1.0`: 基础布局 + widgets + datasources。
- `v1.1`: 在 `v1.0` 上约定更多可选字段（`layout.baseWidth/baseHeight`、`widget.refreshIntervalMs`），保持向后兼容。

兼容策略：

- 渲染器允许 `version` 为 `1.0` 或 `1.1`。
- `1.0` 缺失字段使用默认值填充。
- 不合法 schema 会提示错误并保持页面可用。

## Root Fields

| 字段        | 类型   | 必填   | 说明                      |
| ----------- | ------ | ------ | ------------------------- | ----------- |
| version     | `"1.0" | "1.1"` | 是                        | schema 版本 |
| id          | string | 是     | 模板唯一标识              |
| title       | string | 是     | 页面标题                  |
| description | string | 否     | 页面说明                  |
| layout      | object | 是     | 布局配置（grid/absolute） |
| datasources | record | 是     | 数据源字典                |
| widgets     | array  | 是     | 组件列表                  |

## layout

| 字段       | 类型   | 必填      | 说明                       |
| ---------- | ------ | --------- | -------------------------- | -------- |
| mode       | `grid  | absolute` | 是                         | 布局模式 |
| columns    | number | 否        | grid 列数，默认 24         |
| rowHeight  | number | 否        | grid 每行高度，默认 72     |
| gap        | number | 否        | 栅格间隙，默认 12          |
| baseWidth  | number | 否        | absolute 基准宽，默认 1920 |
| baseHeight | number | 否        | absolute 基准高，默认 1080 |

## datasource

### mock

```json
{
  "type": "mock",
  "generator": "kpi-overview",
  "intervalMs": 3000
}
```

### http

```json
{
  "type": "http",
  "url": "https://example.com/api/metrics",
  "method": "GET",
  "intervalMs": 5000
}
```

## widget

| 字段              | 类型   | 必填        | 说明                                   |
| ----------------- | ------ | ----------- | -------------------------------------- | --- | --- | ------ | --- | -------- |
| id                | string | 是          | widget id                              |
| type              | `text  | number-card | line                                   | bar | pie | table` | 是  | 组件类型 |
| title             | string | 否          | 卡片标题                               |
| datasource        | string | 否          | 绑定的数据源 key                       |
| refreshIntervalMs | number | 否          | 对应 datasource 刷新建议（聚合取最小） |
| position          | object | 是          | 坐标和尺寸                             |
| props             | object | 否          | 组件扩展配置                           |

position: `{ x, y, w, h }`

- `grid` 模式下按栅格单元解释。
- `absolute` 模式下按基准画布像素解释。

## Example

可参考：

- `schemas/demo-operations.json`
- `schemas/executive-absolute.json`

## Migration Notes

- 从 `v1.0` 升级到 `v1.1`：可选增加 `widget.refreshIntervalMs` 与 `layout.baseWidth/baseHeight`，旧字段不需要修改。
- 若未来 `v2` 引入 breaking changes，建议提供迁移脚本（将旧字段映射到新结构）。
