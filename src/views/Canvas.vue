<template>
    <div class="btns">
        <el-button size="small" @click="add">
            新增白板
        </el-button>
    </div>
    <el-tabs ref="tabs" v-model="active" type="card" class="demo-tabs" editable @tab-remove="remove" @tab-add="add">
        <el-tab-pane v-for="(item, index) in whiteboards" :key="item.name" :label="item.title" :name="item.name">
            <canvas ref="canvas" :width="canvasWidth" height="500" @mousedown="down($event, index)"
                :style="{ cursor: `url('${cursors[item.mode]}') 12 22, auto` }" class="canvas">
            </canvas>
            <div class="mode-group">
                <div class="pen-group">
                    <el-button @click="changeMode(index, 'pen')">笔触</el-button>
                    <el-color-picker v-model="item.color" :predefine="colors" class="pen-color-select" />
                    <el-select v-model="item.width">
                        <el-option v-for="item in widths" :key="item.value" :value="item.value" :label="item.label">
                        </el-option>
                    </el-select>
                </div>
                <el-button @click="changeMode(index, 'eraser')">橡皮</el-button>
                <el-button @click="clear(index)">清空</el-button>
                <el-button @click="rename(index)">重命名</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import pen from '@/assets/pen.png'
import eraser from '@/assets/eraser.png'
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'
import { fabric } from 'fabric'


export default {
    data() {
        return {
            cursors: {
                pen,
                eraser,
            },
            canvasWidth: 0,
            active: 1,
            whiteboards: [
                {
                    name: 1,
                    title: '白板 1',
                    color: '#ff0000',
                    width: 3,
                    mode: 'pen', // pen, eraser
                },
            ],
            colors: ['#ff0000', '#ffff00'],
            widths: [
                { value: 1, label: '极细' },
                { value: 3, label: '常规' },
                { value: 5, label: '粗' },
                { value: 20, label: '极粗' },
            ],
        }
    },
    methods: {
        init() {
            this.canvasWidth = this.$refs.tabs.$el.getBoundingClientRect().width - 2
        },
        async add() {
            try {
                const newName = Math.max(...this.whiteboards.map(item => item.name)) + 1
                const { value } = await ElMessageBox.prompt('请输入名称', '', {
                    inputValue: `白板 ${newName}`,
                })
                this.whiteboards.push({
                    name: newName,
                    title: value,
                    color: '#ff0000',
                    width: 3,
                    mode: 'pen',
                })
                this.active = newName
                this.whiteboards[index].title = value
            } catch (e) { }
        },
        async remove(name) {
            try {
                await ElMessageBox.confirm('确定要删除吗？', '请确认', { type: 'warning' })
                const idx = this.whiteboards.findIndex(item => item.name === name)
                this.whiteboards.splice(idx, 1)
                if (name !== this.active) return
                if (idx) {
                    this.active = this.whiteboards[idx - 1].name
                } else {
                    this.active = this.whiteboards[0].name
                }
            } catch (error) {

            }
        },

        changeMode(index, mode) {
            this.whiteboards[index].mode = mode
        },
        down(e, idx) {
            const canvas = e.target
            const ctx = canvas.getContext('2d')

            const whiteboard = this.whiteboards[idx]
            if (whiteboard.mode === 'eraser') {
                ctx.lineWidth = 20
                ctx.strokeStyle = '#ffffff'
            } else {
                ctx.lineWidth = whiteboard.width
                ctx.strokeStyle = whiteboard.color
            }
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            ctx.beginPath()
            ctx.moveTo(e.offsetX, e.offsetY)

            document.onmousemove = (e) => {
                ctx.lineTo(e.offsetX, e.offsetY)
                ctx.stroke()
            }

            document.onmouseup = () => {
                ctx.closePath()
                document.onmousemove = null
                document.onmouseup = null
            }
        },
        async clear(idx) {
            try {
                await ElMessageBox.confirm('确认清空画板吗？', '请确认', {
                    confirmButtonText: '是',
                    cancelButtonText: '否', type: 'warning'
                })
                const canvas = this.$refs.canvas[idx]
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            } catch (e) { }
        },
        async rename(index) {
            try {
                const { value } = await ElMessageBox.prompt('请输入名称', '重命名', {})
                this.whiteboards[index].title = value
            } catch (e) { }
        },
        
    },
    mounted() {
        this.init()
        window.addEventListener('resize', () => this.init())
        const canvas = new fabric.Canvas('c')
    }
}
</script>

<style  scoped>
.btns {
    margin-bottom: 20px;
}

.mode-group {
    display: flex;
    justify-content: space-between;
}

.canvas {
    border: 1px solid black;
}

.pen-group {
    display: flex;
    justify-content: center;
}

.pen-group :deep(.el-color-picker) {
    margin: 0 10px;
}
</style>