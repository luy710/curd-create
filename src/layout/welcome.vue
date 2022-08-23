<!-- <template>
  <div class="custom-wrapper">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts" setup name="HomePage">
const canvasRef = ref<HTMLCanvasElement>()

const t = Math.PI
const n = Math.PI / 2
const r = Math.PI / 12
const o = '#88888825'
const { random: i } = Math
const u = ref(4)
const c = ref(6)
const d = ref(1)

const create = (canvas: HTMLCanvasElement, width: number = 400, height: number = 400, radio: number = 1) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const deviceRadio = window.devicePixelRatio || 1 // 获取设备的缩放比：用几个像素点渲染一个像素，通常是2
  const canvasRadio = 1 // canvas缩放比，webkitBackingStorePixelRatio已废弃
  const _radio = radio ?? deviceRadio / canvasRadio

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.width = _radio * width
  canvas.height = _radio * height
  ctx.scale(_radio, _radio)

  return {
    ctx,
    dpi: _radio
  }
}

// 随机获取分支长度
const growLine = (w = 0, b = 0, m = 0, v = 0) => {
  const O = m * Math.cos(v),
    C = m * Math.sin(v)
  return [w + O, b + C]
}
// 绘制
const draw = () => {
  if (!canvasRef.value) return
  const { width, height } = canvasRef.value
}

onMounted(() => {
  draw()
})
</script>

<style lang="scss" scoped>
.custom-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}
</style> -->
<script setup lang="ts">
import { ref, unref, onMounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
interface Point {
  x: number
  y: number
}
interface Branch {
  start: Point
  length: number
  theta: number
}
function init() {
  const ctx = canvasRef.value?.getContext('2d')
  ctx.strokeStyle = '#F2F3F5'
  step({
    start: { x: 0, y: 0 },
    length: 10,
    theta: Math.PI / 4
  })
}
let pendingTasks: Function[] = []
function step(b: Branch, depth = 0) {
  const end = getEndPoint(b)
  drawBranch(b)
  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() =>
      step(
        {
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta - 0.2 * Math.random()
        },
        depth + 1
      )
    )
  }
  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() =>
      step(
        {
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta + 0.2 * Math.random()
        },
        depth + 1
      )
    )
  }
}
function frame() {
  const tasks: Function[] = []
  pendingTasks = pendingTasks.filter((i) => {
    if (Math.random() > 0.4) {
      tasks.push(i)
      return false
    }
    return true
  })
  tasks.forEach((fn) => fn())
}
let framesCount = 0
function startFrame() {
  requestAnimationFrame(() => {
    framesCount += 1
    if (framesCount % 3 === 0) frame()
    startFrame()
  })
}
startFrame()
function lineTo(p1: Point, p2: Point) {
  const ctx = canvasRef.value?.getContext('2d')
  const _ctx = unref(ctx)
  if (!_ctx) return
  _ctx.beginPath()
  _ctx.moveTo(p1.x, p1.y)
  _ctx.lineTo(p2.x, p2.y)
  _ctx.stroke()
}
function getEndPoint(b: Branch): Point {
  return {
    x: b.start.x + b.length * Math.cos(b.theta),
    y: b.start.y + b.length * Math.sin(b.theta)
  }
}
function drawBranch(b: Branch) {
  lineTo(b.start, getEndPoint(b))
}
onMounted(() => {
  init()
})
</script>

<template>
  <canvas ref="canvasRef" width="800" height="800" scale-50 origin-top-left />
</template>
>
