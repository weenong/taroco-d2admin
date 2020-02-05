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
        <!-- <el-form-item style="float: right">
          <el-button v-if="workOrder_add" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
        </el-form-item> -->
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
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <span>{{scope.row.jobId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" >
        <template slot-scope="scope">
          <span>{{scope.row.jobName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="区域">
        <template slot-scope="scope">
          <span>{{scope.row.placeId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" >
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" >
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)" icon="el-icon-view"></el-button>
          <!-- <el-button v-if="workOrder_upd" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          <el-button v-if="workOrder_del" size="mini" type="danger" @click="deletes(scope.row)" icon="el-icon-delete"></el-button> -->
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: -10px;">
      </el-pagination>
    </template>
    <!-- 新增弹框 -->
    <el-dialog title="工单详情" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" ref="form" label-width="40px" size="mini">
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号" prop="jobId">
              <el-input v-model="form.jobId" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <div class="el-dialog-div">
        <SplitPane :min-percent='40' :default-percent='40' split="vertical">
          <template slot="paneL">
            <el-divider content-position="left">钥匙柜列表</el-divider>
            <el-row v-for="(value, key) in cabinetList" :key="key">
              <el-col :span="12">{{value.code}}</el-col>
              <el-col :span="12">{{value.name}}</el-col>
            </el-row>
          </template>
          <template slot="paneR">
            <el-divider content-position="left">工单人员</el-divider>
              <el-table
                :data="jobUserList"
                ref="jobUserTable"
                size="mini">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="编号" >
                  <template slot-scope="scope">
                    <span>{{scope.row.userId}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" >
                  <template slot-scope="scope">
                    <span>{{userMap[scope.row.userId]}}</span>
                  </template>
                </el-table-column>                
              </el-table>
          </template>
        </SplitPane>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button type="primary" @click="shouquan()" icon="el-icon-check" size="mini">授 权</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj,jobUser ,shouquanByJob } from '@/api/keycabinet/workOrder'
import { cabinetbyplace } from '@/api/keycabinet/keyCabinet'
import { userList } from '@/api/user'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'
export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_workOrder',
  data () {
    return {
      userMap: null,
      jobUserList: null,
      cabinetList: null,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        id: undefined,
        jobId: undefined,
        jobName: undefined,
        name: undefined,
        placeId: undefined,
        status: undefined,
        createTime: undefined,
        updateTime: undefined,
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
  },
  created () {
    this.userList()
    this.getList()
    this.workOrder_add = this.hasFunctions(['workOrder_add'])
    this.workOrder_upd = this.hasFunctions(['workOrder_upd'])
    this.workOrder_del = this.hasFunctions(['workOrder_del'])
  },
  methods: {
    userList(){
      userList('0').then(response => {
        this.userMap = {}
        response.result.forEach((user)=>{
          this.userMap[user.userCode] = user.realName
        })
      })
    },
    getList () {
      this.listLoading = true
      this.listQuery.isAsc = false
      fetchList(this.listQuery).then(response => {
        this.list = response.records
        this.total = response.total
        this.listLoading = false
      })
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDetail (row) {
      getObj(row.id).then(response => {
        this.form = response
        jobUser(row.jobId).then(response => {
          this.jobUserList = response.result
          cabinetbyplace(row.placeId).then(response => {
            this.cabinetList = response.result
            this.dialogFormVisible = true
          })
        })
        
      })
    },
    shouquan () {
      let jobCode = this.form.jobId
      let userCodes = this.$refs.jobUserTable.selection
      console.log(userCodes)
      console.log(jobCode)
      
      shouquanByJob(jobCode).then(response =>{
        this.dialogFormVisible = false
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
        jobId: undefined,
        jobName: undefined,
        name: undefined,
        placeId: undefined,
        status: undefined,
        createTime: undefined,
        updateTime: undefined,
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 .el-dialog-div{
    height: 40vh;
    overflow: auto;
  }
</style>