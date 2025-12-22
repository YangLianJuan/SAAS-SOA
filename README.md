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

- 样式分层：Token → Base → Components → Pages
- 组件分级：Base（无业务）→ Business（可复用业务）→ Page（仅服务页面）
- 页面组织：Page 组合 Business/Base，并把差异收敛在 Page 层

## 二、技术栈

- Vue 3 + TypeScript
- Vite
- vue-router
- pinia
- Less（样式体系与 Token）
- Ant Design Vue（复杂 UI 组件）
- ECharts（图表）

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
├── api/                        # 接口层（通用接口）
│   └── index.ts 
│
├── assets/                     # 静态资源（按需维护）
│   ├── images/                 # 图片资源
│   └── icons/                  # 图标资源
│
├── styles/                     # ⭐ 样式体系核心
│   ├── tokens/                 # 设计 Token（唯一真源）
│   │   └── index.less          #  颜色 Token（禁止手写色值）、间距、 圆角、字体
│   │
│   ├── base/                   # 全局基础样式
│   │   ├── reset.less          # reset + 统一 box-sizing + Ant Design Vue 覆盖入口（集中维护）
│   │   ├── global.less         # body 基线：背景、字体、默认文本色等
│   └── index.less              # 样式入口（main.ts 引入）
│
├── components/                 # ⭐ 通用组件（只放“全局可复用”）
│   └── BaseCard/
│   ├── ProTable/
│   ├── StatusTag/
│   ├── ConfirmModal/
│   ├── EChart/
│   └── index.ts
│
├── composables/                # 组合式逻辑（跨页面复用）
│   ├── useTable.ts             # 表格数据加载/状态管理（轻量封装）
│   ├── useForm.ts              # 表单 model/reset（轻量封装）
│   └── usePermission.ts        # 权限判断 can/roles（配合 store 使用）
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
│   │   └── device.api.ts       # ✅ 模块接口
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
│       └── index.less          # ✅ 模块样式
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

Token 位于 `src/styles/tokens/index.less`：

```less
@color-bg-page: #f5f7fa;
@color-bg-card: #ffffff;

@color-text-primary: #1f1f1f;
@color-text-secondary: #8c8c8c;

@color-border: #f0f0f0;
@color-primary: #1677ff;
```

规则：

- 任何人不允许直接写颜色值，必须从 Token 取
- Token 会被全局注入 Less（见 `vite.config.ts` 的 `css.preprocessorOptions.less.additionalData`），SFC 的 `<style lang="less">` 可直接使用 `@color-*` 等变量

### 2）Base 层：全局基础样式

- `src/styles/base/reset.less`：重置与基础 box-sizing
- `src/styles/base/global.less`：`body` 背景、字体、默认文本色等全局基线

### 3）组件样式：跟随组件就近维护

- 组件样式写在组件自身的 `<style scoped lang="less">` 内
- 组件样式只使用 Token 变量，避免散落魔法值

### 4）Pages 层：页面级样式（只服务页面）

- 页面样式位于 `src/views/*/index.less`
- 页面样式永远不能影响组件层（不要写会外溢到组件库的选择器）

样式入口统一从 `src/styles/index.less` 汇总，在 `src/main.ts` 引入。

## 六、组件体系设计（核心）

组件分级原则：

- Base：纯展示/基础交互，不含业务语义
- Business：可复用的业务组件，允许包含轻量业务语义，但仍保持可迁移
- Page：只服务当前页面的组件，不导出、不跨页面复用

### BaseCard 规范实现

`src/components/BaseCard/index.vue`：

```vue
<template>
  <div class="saas-card" :class="variantClass">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
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
- 业务一致性优先：外观由 Token 控制，必要时在 `src/styles/base/reset.less` 做集中覆盖
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
