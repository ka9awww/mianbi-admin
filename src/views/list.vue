<template>
    <div class="mian-head">
        <div class="type">
            <span>类型</span>
            <el-select v-model="query.type" class="m-2" placeholder="类型" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <div class="time-select">
            <span class="demonstration">开始日期</span>
            <el-date-picker v-model="query.start" type="date" placeholder="Pick a day" size='small' />
            <el-button type="primary" @click="search">查询</el-button>
        </div>
    </div>
    <div class="main-body">
        <div class="btn-group">
            <el-button text @click="addFormVisible = true">添加</el-button>
            <el-button text @click='batchDelete()' :disabled="disabled">批量删除</el-button>
        </div>

        <div class="body">
            <el-table :data="users" border style="width: 100%" @selection-change="handleSelect" table-layout="auto">
                <el-table-column type="selection" />
                <el-table-column prop="num" label="序号" />
                <el-table-column prop="name" label="面壁者">
                    <template #default="{ row }">
                        <div class="name-all">
                            <el-image style="width: 25px; height: 25px" :src="row.avatar" fit="cover"
                                :preview-src-list="[row.avatar]" preview-teleported />
                            <div class="name-group">
                                <span>{{ row.name }}</span>
                                <span>({{ row.trueName }})</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型">
                    <template #default="{ row }">
                        {{ row.type === 1 ? '线上' : '线下' }}
                    </template>
                </el-table-column>
                <el-table-column prop="start" label="开始日期" />
                <el-table-column prop="lv" label="等级" />
                <el-table-column prop="exp" label="成长值" />
                <el-table-column prop="medal" label="成就勋章" />
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button text @click="handleEdit(row)">编辑</el-button>
                        <el-button text @click="handleDeleteBtn(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-select">
                <el-pagination v-model:current-page="query.page" v-model:page-size="query.perPage"
                    @current-change="getUsers" small background layout="prev, pager, next" :total="total"
                    class="mt-4" />
            </div>
        </div>
    </div>

    <el-dialog v-model="addFormVisible" title="添加">
        <el-form ref="addForm" :model="newUser" label-width="100px" :rules="rules">
            <el-form-item prop="num" label="序号" :label-width="formLabelWidth">
                <el-input v-model="newUser.num" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
                <el-input v-model="newUser.name" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="type" label="类型" :label-width="formLabelWidth">
                <el-select v-model="newUser.type" placeholder="类型">
                    <el-option :value="1" label="线上" />
                    <el-option :value="2" label="线下" />
                </el-select>
                <el-form-item prop="start" label="开始日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="newUser.start" type="date" label="Pick a date" placeholder="Pick a date"
                        style="width: 100%" />
                </el-form-item>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleAddBtn">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="editFormVisible" title="编辑">
        <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
            <el-form-item prop="num" label="序号" :label-width="formLabelWidth">
                <el-input v-model="editForm.num" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
                <el-input v-model="editForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="type" label="类型" :label-width="formLabelWidth">
                <el-select v-model="editForm.type" placeholder="类型">
                    <el-option label="线上" />
                    <el-option label="线下" />
                </el-select>
                <el-form-item prop="start" label="开始日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="editForm.start" type="date" label="Pick a date" placeholder="Pick a date"
                        style="width: 100%" />
                </el-form-item>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleUpdate">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'

import { getUsers, deleteUser, createUser, getUser, updateUser } from '../api/user'

export default {
    data() {
        return {
            formLabelWidth: '100px',
            addFormVisible: false,
            editFormVisible: false,
            query: {
                page: 1,
                perPage: 2,
                q: '',
                sex: '',
                type: '',
                start: '',
            },
            total: 0,
            options: [
                { value: '', label: '全部', },
                { value: 1, label: '线上', },
                { value: 2, label: '线下', },
            ],
            users: [],
            newUser: {
                num: '',
                name: '',
                trueName: '',
                type: '',
                start: '',
                lv: '3',
                exp: '3000',
                medal: '',
            },
            editForm: {
                num: '',
                name: '',
                type: '',
                start: '',
                lv: '',
                exp: '',
                medal: '',
            },
            de: [],
            rules: {
                num: [
                    { required: true, message: '请输入序号', trigger: 'blur' },
                    { min: 1, max: 3, message: 'Length should be 1 to 10', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入暗号', trigger: 'blur' },
                    { min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur' },
                ],
                type: [
                    {
                        required: true,
                        message: '请选择类型',
                        trigger: 'change',
                    },
                ],
                start: [
                    {
                        type: 'date',
                        required: true,
                        message: 'Please pick a date',
                        trigger: 'change',
                    },
                ],
            }
        }
    },
    methods: {
        handleAddBtn() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    await createUser(this.newUser)
                    await this.getUsers()
                    this.addFormVisible = false
                }
            })
        },
        handleEdit(row) {
            this.editForm = row
            this.editFormVisible = true
        },
        handleUpdate() {
            this.$refs.editForm.validate(async (valid) => {
                if (valid) {
                    // ...
                    await updateUser(this.editForm.id, this.editForm)
                    await this.getUsers()
                    this.editFormVisible = false
                }
            })
        },
        async handleDeleteBtn(id) {
            try {
                await ElMessageBox.confirm('确定要删除吗？', '请确认', { type: 'warning' })
                const idx = this.users.findIndex(u => u.id === id)
                this.users.splice(idx, 1)
                await deleteUser(id)
                await this.getUsers()
            } catch (error) {

            }
        },
        async batchDelete() {
            try {
                await ElMessageBox.confirm('确定要删除吗？', '请确认', { type: 'warning' })
                for (let item of this.de) {
                    const idx = this.users.findIndex(u => u.id === item.id)
                    this.users.splice(idx, 1)
                }
                await deleteUser(id)
                await this.getUsers()
            } catch (error) {

            }
        },
        handleSelect(selection) {
            this.de = selection
        },
        async getUsers() {
            const res = await getUsers(this.query)
            this.users = res.data.data
            this.total = res.data.total
        },
        search() {
            this.query.page = 1
            this.getUsers()
        },
    },
    computed: {
        disabled() {
            return !(this.de.length)
        }
    },
    created() {
        this.getUsers()
    }


}
</script>

<style scoped>
.mian-head {
    display: flex;
    justify-content: flex-start;
}

.time-select {
    margin-left: 20px;
}

.btn-group {
    display: flex;
}

.page-select {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.name-all {
    display: flex;
    align-items: center;
}

.name-group {
    margin-left: 5px;
}
</style>
<!-- <template>
    <el-form inline>
        <el-form-item label="类型">
            <el-select v-model="query.type">
                <el-option value="" label="全部" />
                <el-option v-for="type in types" :key="type.id" :value="type.id" :label="type.name" />
            </el-select>
        </el-form-item>
        <el-form-item label="开课日期">
            <el-date-picker v-model="query.start" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary">搜索</el-button>
        </el-form-item>
    </el-form>

    <div>
        <div class="table-btns">
            <el-button type="primary" @click="showAdd">添加</el-button>
            <el-button type="danger" v-if="batchDeleteVisible" @click="handleBatchDelete">批量删除</el-button>
        </div>
        <el-table empty-text="没有数据" :data="users" table-layout="auto" @selection-change="handleChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :width="60"></el-table-column>
            <el-table-column label="面壁者">
                <template #default="{ row }">
                    <div class="user-cell">
                        <el-image class="avatar" :src="row.avatar" :preview-src-list="[row.avatar]" fit="cover"
                            preview-teleported hide-on-click-modal>
                        </el-image>
                        <span class="user-username">{{ row.username }}</span>
                        <span>({{ row.name }})</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template #default="{ row }">
                    {{ getTypeText(row.type) }}
                </template>
            </el-table-column>
            <el-table-column prop="start" label="开课日期"></el-table-column>
            <el-table-column prop="level" label="级别"></el-table-column>
            <el-table-column prop="score" label="成长值"></el-table-column>
            <el-table-column label="徽章"></el-table-column>
            <el-table-column label="操作" :width="140">
                <template #default="{ row }">
                    <el-button size="small" @click="showEdit(row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pager-container">
            <el-pagination layout="->, prev, pager, next" :total="50" background></el-pagination>
        </div>
    </div>

    <el-dialog v-model="visible" :title="`${dialogText}面壁者`" :width="350" @closed="handleClosed">
        <el-form ref="form" :model="form" :rules="rules" label-width="auto">
            <el-form-item label="代号" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="开课日期" prop="start">
                <el-input v-model="form.start"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
            <el-button @click="hide">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'

import { getUsers } from '../api/user'

export default {
    data() {
        return {
            types: [
                { id: 1, name: '线上' },
                { id: 2, name: '线下' },
            ],
            query: {
                page: 1,
                perPage: 10,
                q: '',
                sex: '',
                type: '',
                start: '',
            },
            users: [],
            visible: false,
            form: this.getFreshForm(),
            rules: {
                username: [
                    { required: true, message: '请填写代号', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请填写姓名', trigger: 'blur' },
                ],
            },
            isAdd: true,
            selection: [],
        }
    },
    computed: {
        dialogText() {
            return this.isAdd ? '添加' : '编辑'
        },
        batchDeleteVisible() {
            return !!this.selection.length
        },
    },
    created() {
        this.getUsers()
    },
    methods: {
        async getUsers() {
            const res = await getUsers(this.query)
            this.users = res.data
        },
        getTypeText(typeId) {
            const type = this.types.find(item => item.id === typeId)
            return type ? type.name : '未知'
        },
        showAdd() {
            this.isAdd = true
            this.visible = true
        },
        hide() {
            this.visible = false
        },
        showEdit(id) {
            this.isAdd = false
            this.visible = true
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return
                this.visible = false
            })
        },
        handleClosed() {
            this.form = this.getFreshForm()
            this.$refs.form.clearValidate()
        },
        getFreshForm() {
            return {
                username: '',
                name: '',
                avatar: '',
                start: '',
                level: 0,
                score: 0,
                badges: [],
            }
        },
        async handleDelete(id) {
            try {
                await ElMessageBox.confirm('确认删除吗？', '请确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                await deleteUser(id)
                await this.getUsers()
            } catch (error) { }
        },
        handleChange(selection) {
            this.selection = selection
        },
        async handleBatchDelete() {
            try {
                await ElMessageBox.confirm('确认删除吗？', '请确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                // 执行删除
            } catch (error) { }
        },
    },
}
</script>

<style scoped>
.user-cell {
    display: flex;
    align-items: center;
}

.user-username {
    margin-right: 4px;
}

.avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
}

.table-btns {
    margin-bottom: 8px;
}

.pager-container {
    margin-top: 8px;
}
</style> -->