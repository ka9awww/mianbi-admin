<template>
  <div class="common-layout">
    <el-container>
      <div>
        <img class="pic" src="../assets/1.webp">
      </div>
      <div class="right">
        <el-form ref="form" :model="users" :rules="rules" label-width="auto" @keyup.enter="login"
          hide-required-asterisk>
          <el-form-item>
            <h1 class="title">面壁计划</h1>
          </el-form-item>
          <el-form-item label="面壁者代号" prop="name">
            <el-input v-model="users.name" autofocus></el-input>
          </el-form-item>
          <el-form-item label="接头暗号" prop="password">
            <el-input v-model="users.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" :disabled="disabled">进入</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-container>
  </div>
</template>

<script>
import { login } from '../api/user';
import { ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/css'

export default {

  data() {
    return {
      users: {
        name: '',
        password: '',
      },
      rules: {
        name: [
          { required: true, message: '请填入面壁者代号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请填入接头暗号', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    disabled() {
      const { users, rules } = this
      for (const key in users) {
        const value = users[key]
        for (const rule of rules[key]) {
          if (rule.required && value === '') {
            return true
          }
        }
      }
      return false
    },
  },
  methods: {
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          login(this.users)
            .then(async res => {
              const { token } = res.data
              localStorage.setItem('token', token)
              await this.$router.replace('/menu/list')
            })
            .catch(err => {
              ElMessage.error(err.response.data.message)
            })
        }
      })
    }
  },

}

</script>

<style scoped>
.common-layout {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  margin-left: 100px;
  margin-bottom: 10px;
  font-size: larger;
}

.pic {
  width: 800px;
  height: 500px;
}

.right {
  padding-top: 150px;
  padding-left: 50px;
}
</style>