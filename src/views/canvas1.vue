<template>
    <el-tabs ref="tabs" v-model="active" editable @tab-remove="remove" @tab-add="add">
        <el-tab-pane v-for="(item, index) in whiteboards" :key="item.name" :label="item.title" :name="item.name">
            <div class="canvas-container" @keyup.delete="hanldeObjectDelete">
                <canvas ref="canvas" :width="canvasWidth" height="450"
                    class="canvas"> -->
                </canvas>
            </div>

            <div class="toolbar">
                <el-radio-group v-model="item.mode" class="tools" @change="syncCanvas(index)">
                    <el-radio-button label="pen">画笔</el-radio-button>
                    <el-radio-button label="eraser">橡皮擦</el-radio-button>
                    <el-radio-button label="select">选择</el-radio-button>
                    <el-radio-button label="rect">矩形</el-radio-button>
                    <el-radio-button label ="text">文本</el-radio-button>
                </el-radio-group>

                <div class="pengroup">
                        <el-color-picker v-if="['pen','rect','text'].includes(item.mode)" v-model="item.color" :predefine="colors" @change="syncCanvas(index)" />
                        <el-select v-if="item.mode === 'pen'"  v-model="item.width" @change="syncCanvas(index)">
                            <el-option v-for="item in widths" :key="item.value" :value="item.value" :label="item.label">
                            </el-option>
                        </el-select>
                </div>
                <el-button @click="removeObject(index)">删除</el-button>
                <el-button @click="clear(index)">清空</el-button>
                <el-button @click="rename(index)">重命名</el-button>
                <el-button @click="undo(index)">撤销</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { fabric } from 'fabric'
import 'fabric/src/mixins/eraser_brush.mixin.js'

import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'
import { markRaw } from 'vue'
import 'fabric-history'
// import pen from '@/assets/pen.png'
// import eraser from '@/assets/eraser.png'

export default {
    data() {
        return {
            // cursors: {
            //     pen,
            //     eraser,
            // },
            active: 1,
            whiteboards: [
                {
                    name: 1,
                    title: '白板 1',
                    color: '#ff0000',
                    width: 3,
                    mode: 'pen'
                }
            ],
            canvasWidth: 0,
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
            this.$nextTick(() => {
                this.whiteboards.forEach((_,index) => {
                    const canvas = this.getCanvas(index)
                    canvas.setWidth(this.canvasWidth)
                })
            })
        },
        async remove(name) {
            try {
                await ElMessageBox.confirm('确定要删除吗？', '请确认', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                })
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
        async add() {
            try {
                const newName = Math.max(...this.whiteboards.map(item => item.name)) + 1
                const { value } = await ElMessageBox.prompt('请输入名称', '', {
                    confirmButtonText: '添加',
                    cancelButtonText: '取消', type: 'warning',
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
        // handleDraw(event, index) {
        //     const canvas = event.target
        //     const ctx = canvas.getContext('2d')
        //     const whiteboard = this.whiteboards[index]
        //     if (whiteboard.mode === 'eraser') {
        //         ctx.lineWidth = 30
        //         ctx.strokeStyle = '#ffffff'
        //     } else {
        //         ctx.lineWidth = whiteboard.width
        //         ctx.strokeStyle = whiteboard.color
        //     }
        //     ctx.lineCap = 'round'
        //     ctx.lineJoin = 'round'
        //     ctx.beginPath()
        //     ctx.moveTo(event.offsetX, event.offsetY)
        //     document.onmousemove = (e) => {
        //         ctx.lineTo(e.offsetX, e.offsetY)
        //         ctx.stroke()
        //     }
        //     document.onmouseup = () => {
        //         ctx.closePath()
        //         document.onmousemove = null
        //         document.onmouseup = null
        //     }
        // },
        async clear(index) {
            try {
                await ElMessageBox.confirm('确认清空画板吗？', '请确认', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                })
                const canvas = this.getCanvas(index)
                canvas.clear()
            } catch (e) { }
        },
        async rename(index) {
            try {
                const { value } = await ElMessageBox.prompt('请输入白板名称', '重命名白板', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                this.whiteboards[index].title = value
            } catch (e) { }
        },
        getCanvas(index) {
            const whiteboard = this.whiteboards[index]
            let { canvas } = whiteboard
            if (!canvas) {
                const el = this.$refs.canvas[index]
                canvas = new fabric.Canvas(el, { selectionLineWidth: 3 })
                whiteboard.canvas = markRaw(canvas)
                let startX, startY
                canvas.on('mouse:down', e => {
                    startX = e.pointer.x
                    startY = e.pointer.y
                    if (whiteboard.mode === 'rect') {
                        canvas.selectionColor = 'transparent'
                        canvas.selectionBorderColor = whiteboard.color
                    }
                    if (whiteboard.mode === 'text') {
                        if(!e.target || !e.target.text) {
                            const text = new fabric.Textbox('',{
                                stroke:'rgba(0,0,0,0.25)',
                                fill:whiteboard.color,
                                width:50,
                                top:startY-8,
                                left:startX,
                                fontSize:16,
                                lineHeight:1,
                                fontFamily:'Menlo, Monaco, "Courier New", monospace',
                            })
                            canvas.add(text)
                            text.enterEditing()
                        }
                    }
                })
                canvas.on('mouse:up', e => {
                    if (whiteboard.mode === 'rect') {
                        const { x: endX, y: endY } = e.pointer
                        const tempW = Math.abs(endX - startX)
                        const tempH = Math.abs(endY - startY)
                        if (tempW > 3 && tempH > 3) {
                            const rect = new fabric.Rect({
                                left: Math.min(startX, endX),
                                top: Math.min(startY, endY),
                                width: tempW - 3,
                                height: tempH - 3,
                                strokeWidth: 3,
                                stroke: whiteboard.color,
                                fill: 'transparent',
                                borderScaleFactor: 1,
                            })
                            canvas.add(rect)
                        }
                    }
                })
            }
            return canvas
        },
        hanldeObjectDelete(event) {
            console.dir(event.target)
        },
        syncCanvas(index) {
            const canvas = this.getCanvas(index)
            const whiteboard = this.whiteboards[index]
            const { mode } = whiteboard

            if (mode === 'eraser') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.EraserBrush(canvas)
                canvas.freeDrawingBrush.width = 30
                canvas.skipTargetFind = true
            }
            if (mode === 'pen') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
                canvas.freeDrawingBrush.color = whiteboard.color
                canvas.freeDrawingBrush.width = whiteboard.width
                canvas.skipTargetFind = true
            }
            if (mode === 'select') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = false
                fabric.Object.prototype.selectable = true
            }
            if (mode === 'rect') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = true
                fabric.Object.prototype.selectable = false
            }
            if (mode === 'text') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = false
                fabric.Object.prototype.selectable = true
            } else {
                const textboxes = canvas.getObjects('textbox')
                textboxes.forEach(box => box.exitEditing())
            }
        },
        undo(index) {
            const canvas = this.getCanvas(index)
            canvas.undo()
        },
        removeObject(index) {
            const canvas = this.getCanvas(index)
            const selected = canvas.getActiveObjects()
            canvas.remove(...selected)
        },
    },
    mounted() {
        this.init() // this.canvasWidth = 1000  => <canvas width="1000">
        window.addEventListener('resize', () => this.init())

        this.$nextTick(() => this.syncCanvas(0))
    },
}
</script>

<style scoped>
.toolbar {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
}

.tools {
    margin-right: 24px;
}

.pengroup {
    display: flex;
}

.canvas {
    border: 1px solid black;
}
</style>