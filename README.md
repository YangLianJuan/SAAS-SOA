# SaaS 系统前端框架（前端宪法）

本项目以「样式分层 + 组件分级 + 页面组合」为核心，目标是让多人并行开发不互相踩、样式统一可维护、组件可复用但不过度抽象，并为后续多主题/多租户扩展保留空间。

## 一、整体设计目标

解决 5 件事：

- 多人并行开发不互相踩
- 样式统一、可维护、不污染
- 组件可复用，但不过度抽象
- 页面差异可控
- 后期扩展（多主题 / 多租户）不推翻重来

核心思想：

- 样式分层：Token → Base → Component → Page
- 组件分级：Base（基础封装）→ Pro（通用业务能力封装）→ Page（仅服务页面）
- 页面组织：Page 组合 Pro/Base，并把差异收敛在 Page 层

## 二、技术栈

- Vue 3 + TypeScript
- Vite
- vue-router
- pinia
- Less（样式体系与 Token）
- Ant Design Vue（复杂 UI 组件）
- ECharts（图表）
- 自研轻量 i18n（`src/i18n`）

## 三、快速开始

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 四、项目目录结构（src）

```
src
├── api/                        # 接口层（按业务域拆分）
│   ├── dashboard.ts
│   ├── device.ts
│   └── index.ts
│
├── assets/                     # 静态资源（按需维护）
│   ├── images/                 # 图片资源
│   └── icons/                  # 图标资源
│
├── styles/                     # ⭐ 样式体系核心
│   ├── global.less             # Design System + reset + global（用注释分区）
│   └── tokens.ts               # breakpoints/layoutGutter（JS/TS 侧 token）
│
├── components/                 # ⭐ 通用组件（只放“全局可复用”）
│   ├── BaseCard/
│   ├── ProTable/
│   ├── StatusTag/
│   ├── ConfirmModal/
│   ├── EChart/
│   └── index.ts
│
├── composables/                # 组合式逻辑（跨页面复用）
│   ├── useTable.ts             # 表格数据加载/状态管理（轻量封装）
│   ├── useForm.ts              # 表单 model/reset（轻量封装）
│   ├── useBreakpoint.ts        # 统一窗口尺寸监听 + isMobile（Layout/Page 使用）
│   └── usePermission.ts        # 权限判断 can/roles（配合 store 使用）
│
├── i18n/                       # ⭐ 多语言（基础能力，不属于任何页面）
│   ├── index.ts                # i18n 实例创建与 useI18n
│   ├── locale.ts               # 当前语言 & 切换逻辑（localStorage 持久化）
│   └── lang/
│       ├── zh-CN/
│       │   ├── common.ts        # 通用文案（按钮/状态/导航等）
│       │   ├── dashboard.ts     # dashboard 模块文案
│       │   ├── device.ts        # device 模块文案
│       │   └── login.ts         # login 模块文案
│       └── en-US/
│           ├── common.ts
│           ├── dashboard.ts
│           ├── device.ts
│           └── login.ts
│
├── layouts/                    # 布局（承载菜单/头部/主体等）
│   ├── BasicLayout.vue         # 主布局：header + nav + content
│   └── BlankLayout.vue         # 空白布局：登录页等
│
├── router/                     # 路由（静态+动态预留）
│   ├── index.ts                # router 实例 + 守卫（登录拦截示例）
│   ├── routes.static.ts        # 静态路由（基础页面）
│   └── routes.async.ts         # 异步路由预留（权限/租户动态注入）
│
├── stores/                     # 状态管理（Pinia）
│   ├── user.ts                 # token/profile/roles + login/logout
│   ├── app.ts                  # 全局 UI 状态（主题/侧边栏等预留）
│   └── permission.ts           # 路由/权限数据（目前返回静态路由）
│
├── views/                      # ⭐ 业务模块（页面即模块）
│   ├── dashboard/
│   │   ├── index.vue
│   │   ├── index.less          # ✅ dashboard 模块样式
│   │   ├── device.api.ts       # ✅ 模块接口
│   │   └── components/
│   │       ├── DashboardStat.vue
│   │       └── DashboardChart.vue
│   │
│   ├── device/
│   │   ├── index.vue
│   │   ├── index.less          # ✅ 模块样式
│   │   └── device.api.ts       # ✅ 模块接口
│   │
│   └── login/
│       ├── index.vue
│       ├── index.less          # ✅ 模块样式
│       └── device.api.ts       # ✅ 模块接口
│
├── utils/                      # 工具函数（纯函数/无 UI）
│   ├── request.ts              # fetch 封装：baseUrl/token/错误处理
│   ├── auth.ts                 # token 读写：localStorage
│   └── permission.ts           # 角色判断工具：hasAnyRole
│
├── App.vue                     # 应用根组件：承载 router-view
└── main.ts                     # 应用入口：注册 pinia/router/Antd + 引入样式
```

## 五、样式体系（多人开发的关键）

### 1）Token 层：设计唯一真源

Token 位于 `src/styles/global.less`：

```less
@color-bg-page: #f5f7fa;
@color-bg-card: #ffffff;

@color-text-primary: #1f1f1f;
@color-text-secondary: #8c8c8c;

@color-border: #f0f0f0;
@color-primary: #1677ff;

@spacing-sm: 8px;
@spacing-md: 12px;
@spacing-xl: 24px;

@breakpoint-sm: 768px;
@breakpoint-md: 1024px;

@layout-gutter-md: 16px;

@radius-sm: 6px;
@radius-card: 10px;
```

规则：

- 业务 UI 的颜色（背景/文字/边框等）不要直接写色值，必须从 Token 取
- Token 会被全局注入 Less（见 `vite.config.ts` 的 `css.preprocessorOptions.less.additionalData`），SFC 的 `<style lang="less">` 可直接使用 `@color-*` 等变量（通过 `@import (reference)` 避免重复输出全局样式）

### 2）Global 层：全局基础样式（已合并）

- reset / global / tokens 均在 `src/styles/global.less`，用注释分区维护

### 3）组件样式：跟随组件就近维护

- 组件样式写在组件自身的 `<style scoped lang="less">` 内
- 组件样式优先使用 Token 变量，避免散落魔法值

### 4）Pages 层：页面级样式（只服务页面）

- 页面样式位于 `src/views/*/index.less`
- 页面样式永远不能影响组件层（不要写会外溢到组件库的选择器）

样式入口统一使用 `src/styles/global.less`，在 `src/main.ts` 引入。

### 5）防耦合红线（必须遵守）

🔴 红线 1：页面样式禁止依赖组件 DOM 结构

- 页面样式禁止以通用组件的 class / DOM 结构作为选择器

```less
/* ❌ 禁止 */
.dashboard {
  .saas-card__footer {
    padding: 0;
  }
}
```

🔴 红线 2：Design System 变量只允许“语义”，禁止“实现细节”

✅ 推荐（语义）

- `@color-bg-card`
- `@spacing-md`
- `@radius-card`

❌ 不推荐（实现细节）

- `@card-padding-12`
- `@table-header-bg-gray`

## 六、组件体系设计（核心）

组件分级原则：

- Base：基础封装（样式统一、交互一致），不含业务语义
- Pro：通用业务能力封装（例如 `ProTable` 的请求/分页/插槽约定）
- Page：只服务当前页面的组件，不导出、不跨页面复用

### BaseCard 规范实现

`src/components/BaseCard/index.vue`：

```vue
<template>
  <a-card class="saas-card" :class="variantClass" v-bind="cardAttrs" :bordered="bordered">
    <template v-if="$slots.header" #title>
      <slot name="header" />
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
    <slot />
    <div v-if="$slots.footer" class="saas-card__footer">
      <slot name="footer" />
    </div>
  </a-card>
</template>
```

页面不要复制卡片实现。

### 首页卡片 vs 设备卡片：正确解法

不要做：

- `DashboardCard.vue`
- `DeviceCard.vue`（完全重复）

正确做法：

- 通用能力沉淀到 `src/components/`（例如 `BaseCard`）
- 页面差异交给 Page 层（`src/views/*`），避免把页面差异抽进组件库

## 七、第三方组件集成（Ant Design Vue / ECharts）

### Ant Design Vue 使用规范

- Ant Design Vue 用于「复杂、通用且成熟」的 UI 能力（如表单控件、弹窗、分段器等）
- 业务一致性优先：外观由 Token 控制，必要时在 `src/styles/global.less` 的对应分区做集中覆盖
- 页面层可直接使用 `a-*` 组件；通用组件只在“通用能力”场景才引入

全局接入位置：

- `src/main.ts`：注册插件并引入 `ant-design-vue/dist/reset.css`

示例（Dashboard 范围切换）：

- `src/views/dashboard/components/DashboardChart.vue` 使用 `a-segmented`

### ECharts 使用规范

- ECharts 一律通过通用组件封装使用，避免页面内直接操作实例导致维护与复用成本上升
- 图表组件只接受 `option` 等纯数据输入，不把页面差异抽进组件内部

封装组件：

- `src/components/EChart/index.vue`：`option` + `autoresize` + `height`

页面示例：

- `src/views/dashboard/components/DashboardChart.vue`：Page 层组合 `BaseCard` + `EChart`

## 八、页面组织与拆分规则

页面目录示例：

```
views/dashboard/
├── index.vue
└── components/
    └── DashboardStat.vue
```

页面内组件规则：

- 不导出
- 不跨页面复用
- 只服务当前页面，差异永远放在 Page 层

## 九、路由与权限骨架

- 静态路由：`src/router/routes.static.ts`
- 路由标题推荐使用 `meta.titleKey`（而不是硬编码 `meta.title`），由 i18n 决定显示文案
- 路由守卫（示例）：`src/router/index.ts`，非公开页无 token 时跳转登录页
- 权限辅助：`src/composables/usePermission.ts` + `src/utils/permission.ts`

## 十、接口与请求封装

- 请求封装：`src/utils/request.ts`
- token 管理：`src/utils/auth.ts`（localStorage）
- 接口层：`src/api/index.ts`

开发阶段无后端也可跑通：

- `src/api/index.ts` 在请求失败时会降级返回 mock 数据，保证页面能联调 UI 流程

## 十一、协作规则（落地版）

- 新增页面：只在 `src/views/<page>/` 内增量开发，页面内组件放 `components/`
- 新增通用能力：优先放 `src/components/`，不要把页面差异抽进组件库
- 新增样式：先补 Token，再落组件自身或 `src/views/*/index.less`，禁止在页面里散落魔法值
- 新增文案：先补 `src/i18n/lang/<locale>/common.ts` 或对应模块语言文件，再在页面引用 key

## 十二、多语言（i18n）体系规范

多语言是基础能力之一，与样式体系、状态管理同级，不属于任何具体页面或组件。

### 1）目录与拆分

- 语言文件按页面模块拆分：`src/i18n/lang/<locale>/<module>.ts`
- 页面 owns 文案，就像 owns API 一样（`views/<module>` 对应 `i18n/lang/*/<module>.ts`）
- 禁止按组件拆语言文件

### 2）文案归属（强约束）

- 通用 UI 文案：`common.ts`
- 页面业务文案：对应页面模块语言文件
- 组件内部文案：禁止（通过 props / slot 传入）

### 3）使用规范

- Page 层允许：`t('dashboard.chart.title')`
- Pro/Base 组件允许：`t('common.confirm')`
- Pro/Base 组件禁止：引用 `dashboard.* / device.* / login.*` 等页面 key

### 4）接入位置

- 全局安装：`src/main.ts` 中 `app.use(i18n)`
- 切换语言：`useI18n().setLocale('zh-CN' | 'en-US')`（自动写入 localStorage）

## 十三、栅格系统（Grid / Layout）规范

为避免页面布局“各写各的”，响应式布局统一走 Ant Design Vue Grid（`a-row/a-col`），间距与断点统一由 Design System 提供。

- 页面禁止自行定义响应式断点
- 页面禁止手写 media query（除非极端场景，且必须使用 `@breakpoint-*` token）
- 页面禁止自定义 grid 实现

示例（gutter 从 token 读取）：

```vue
<template>
  <a-row :gutter="[layoutGutterMd, layoutGutterMd]">
    <a-col :xs="24" :md="12">
      <BaseCard />
    </a-col>
    <a-col :xs="24" :md="12">
      <BaseCard />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { layoutGutter } from '@/styles/tokens'

const layoutGutterMd = layoutGutter.md
</script>
```

## 十四、Web / Mobile Web 适配规范

本项目采用 Desktop First + Responsive Shrink。

- Layout 层（核心）：控制侧边栏折叠、header/content padding、统一判断移动端（`useBreakpoint().isMobile`）
- Page 层（允许）：只调整页面布局；断点必须来自 Design System（`@breakpoint-*`）
- Component 层（最小化）：保证自身自适应；不判断端类型；不写媒体查询
