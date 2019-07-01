<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form :inline="true" :model="listQuery" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="查询条件">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="" v-model="listQuery.id" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- table表格 -->
    <el-table
      :key='tableKey'
      :data="list"
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      highlight-current-row
      stripe
      style="width: 100%">
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="钥匙柜" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.keyCabinetCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="钥匙名称" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column> 
      <el-table-column align="center" label="领用人" width="100" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="领用时间" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.useTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="归还时间" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.backTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详情" width="100">
        <template slot-scope="scope">
          <el-button v-if="keyDetail_upd" size="mini" type="primary" icon="el-icon-more"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: -10px;">
      </el-pagination>
    </template>
   
  </d2-container>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/keycabinet/keyDetail'
import * as keyCabinetService from '@/api/keycabinet/keyCabinet'
import * as userService from '@/api/user'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'
export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_keyDetail',
  data () {
    return {
      activeTab: 'first',
      keyCabinetList: null,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        id: undefined,
        keyCabinetCode: undefined,
        code: undefined,
        name: undefined,
        ability: undefined,
        locRow: undefined,
        locCol: undefined,
        memo: undefined,
        createTime: undefined,
        updateTime: undefined,
      },
      rules: {
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      tableKey: 0
    }
  },
  computed: {
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '有效',
        1: '无效',
        9: '锁定'
      }
      return statusMap[status]
    }
  },
  created () {
    this.getList()
    this.keyDetail_add = this.hasFunctions(['keyDetail_add'])
    this.keyDetail_upd = this.hasFunctions(['keyDetail_upd'])
    this.keyDetail_del = this.hasFunctions(['keyDetail_del'])
  },
  methods: {
    getList () {
      this.list = []
      let item1 = {}
      item1.id = 1
      item1.keyCabinetCode = '1'
      item1.name = '钥匙1'
      item1.username = '巡检员1'
      item1.useTime = '2019-06-24 13:21:00'
      item1.backTime = '2019-06-24 16:03:21'
      this.list[0] = item1
      this.total = 1
      this.listLoading = false
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate () {
      this.resetTemp()
      let param = {}
      param.page = 1
      param.limit = 1000
      keyCabinetService.fetchList(param).then(response => {
        this.keyCabinetList = response.records
        userService.fetchList(param).then(response => {
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
        })
      })
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response
        let param = {}
        param.page = 1
        param.limit = 1000
        keyCabinetService.fetchList(param).then(response => {
          this.keyCabinetList = response.records
          userService.fetchList(param).then(response => {

            this.dialogFormVisible = true
            this.dialogStatus = 'update'
          })
   
        })
      })
    },
    create (formName) {
      const set = this.$refs
      this.form.role = this.role
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      const set = this.$refs
      this.dialogFormVisible = false
      set[formName].resetFields()
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    deletes (row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
      .then(() => {
        delObj(row.id)
        .then(() => {
          this.getList()
          this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000})
        })
        .cache(() => {
          this.$notify({title: '失败', message: '删除失败', type: 'error', duration: 2000})
        })
      })
    },
    resetTemp () {
      this.form = {
        id: undefined,
        keyCabinetCode: undefined,
        code: undefined,
        name: undefined,
        ability: undefined,
        locRow: undefined,
        locCol: undefined,
        memo: undefined,
        createTime: undefined,
        updateTime: undefined,
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 .el-dialog-div{
    height: 50vh;
    overflow: auto;
  }

</style>
