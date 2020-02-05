<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form :inline="true" :model="listQuery" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="钥匙柜">
          <el-select v-model="listQuery.keyCabinetCode" value-key="code" placeholder="请选择" collapse-tags style="width:100%;">
            <el-option v-for="item in keyCabinetList" :key="item.code" :label="item.name" :value="item.code" >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-if="keyDetail_add" @click="handleShouquanBatch" type="primary" icon="el-icon-link">授 权</el-button>
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
      @selection-change="handleKeySelectionChange" 
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" type="index" label="序号">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template> -->
      </el-table-column>
      <el-table-column align="center" label="钥匙柜" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.keyCabinetName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="钥匙编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用途" width="100" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{scope.row.ability}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="位置" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.locRow}}-{{scope.row.locCol}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.memo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.createTime|parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-tooltip content="授权">
            <el-button v-if="keyDetail_upd" size="mini" type="primary" @click="handleShouquan(scope.row)" icon="el-icon-link"></el-button>
          </el-tooltip> -->
          <el-tooltip content="修改">
            <el-button v-if="keyDetail_upd" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          </el-tooltip>
          
          <!-- <el-button v-if="keyDetail_del" size="mini" type="danger" @click="deletes(scope.row)" icon="el-icon-delete"></el-button> -->
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: -10px;">
      </el-pagination>
    </template>
    <el-dialog title="授权" :visible.sync="shouquanFormVisible" width="600px">
      <div>
        <el-form size="mini">
          <el-form-item label="类型" prop="isTemp">
            <el-radio-group v-model="isTemp">
              <el-radio :label="0">长期</el-radio>
              <el-radio :label="1">临时</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间" v-if="isTemp == 1">
                <el-date-picker
                  v-model="timeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
          </el-form-item>
        </el-form>
        
      </div>
      <div class="el-dialog-div">
        <el-table :key='tableKey'
              :data="userList"
              ref="userTable"
              size="mini">
              style="width:100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="用户名">
            <template slot-scope="scope">
              <span>
                <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.username}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="编号" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.userCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="卡号" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.cardNo}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleuserSizeChange"
          @current-change="handleuserCurrentChange"
          :current-page.sync="userlistQuery.page"
          :page-sizes="[10,20,30,50]"
          :page-size="userlistQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelshouquan()" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button type="primary" @click="shouquanbatch()" icon="el-icon-check" size="mini">授 权</el-button>
      </div>
    </el-dialog>
    <!-- 新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <div class="el-dialog-div">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="编码" prop="code">
                <el-input v-model="form.code" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="钥匙柜" prop="keyCabinetCode">
                <el-select v-model="form.keyCabinetCode" value-key="code" placeholder="请选择" collapse-tags style="width:100%;">
                  <el-option v-for="item in keyCabinetList" :key="item.code" :label="item.name" :value="item.code" >
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行:列" prop="locRow">
                <el-input-number style="width:90px;" v-model="form.locRow" :min="1" :max="10" disabled></el-input-number>
                :
                <el-input-number style="width:90px;" v-model="form.locCol" :min="1" :max="10" disabled></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用途" prop="ability">
                <el-input v-model="form.ability" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="memo">
                <el-input v-model="form.memo" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check" size="mini">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-check" size="mini">修 改</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj, shouquanByKeyDetail,shouquanByKeyDetails } from '@/api/keycabinet/keyDetail'
import * as keyCabinetService from '@/api/keycabinet/keyCabinet'
import * as userApi from '@/api/user'
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
      allKeySelectionRows: [],
      keySelectionRows: [],
      isTemp: 0,
      timeRange: null,
      userList: null,
      userTotal: null,
      keyCabinetList: null,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      userlistQuery: {
        subSystem:0,
        page: 1,
        limit: 20
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
        id: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        keyCabinetCode: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      shouquanFormVisible: false,
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

    let param = {}
    param.page = 1
    param.limit = 1000
    keyCabinetService.fetchList(param).then(response => {
      this.keyCabinetList = response.records

    })
  },
  methods: {
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
    handleuserSizeChange (val) {
      this.userlistQuery.limit = val
      userApi.fetchList(this.userlistQuery).then(response => {
        this.userList = response.records
        this.userTotal = response.total
      })
    },
    handleuserCurrentChange (val) {
      this.userlistQuery.page = val
      userApi.fetchList(this.userlistQuery).then(response => {
        this.userList = response.records
        this.userTotal = response.total
      })
    },
    handleCreate () {
      console.log(this.keySelectionRows)
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleShouquanBatch () {
      if(this.keySelectionRows.length == 0){
        this.$message({
          message: '没有选择钥匙',
          type: 'warning'
        });
        return;
      }
      this.userlistQuery.isAsc = false
      userApi.fetchList(this.userlistQuery).then(response => {
        this.userList = response.records
        this.userTotal = response.total
        this.shouquanFormVisible = true
      })
    },
    handleShouquan (row) {
      getObj(row.id).then(response => {
        this.form = response
        this.userlistQuery.isAsc = false
        userApi.fetchList(this.userlistQuery).then(response => {
          this.userList = response.records
          this.userTotal = response.total
          this.shouquanFormVisible = true
        })
        
      })
    },
    shouquanbatch () {
      // let keyDetailCode = this.form.code
      // let cabinetCode = this.form.keyCabinetCode
      let users = this.$refs.userTable.selection
      let param = {}
      param.isTemp = this.isTemp
      if(this.isTemp == 1){
        param.startTime = this.timeRange[0]
        param.endTime = this.timeRange[1]
      }
      // param.keyDetailCode = keyDetailCode
      // param.cabinetCode = cabinetCode
      param.userList = users
      param.keyDetails = this.keySelectionRows
      shouquanByKeyDetails(param).then(response =>{
        if(response.result){
          this.shouquanFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '授权成功',
            type: 'success',
            duration: 2000
          })
        }else{
          this.$notify({
            title: '失败',
            message: result.errorMessage,
            type: 'info',
            duration: 2000
          })
        }
      })
      
    },
    shouquan () {
      let keyDetailCode = this.form.code
      let cabinetCode = this.form.keyCabinetCode
      let users = this.$refs.userTable.selection
      let param = {}
      param.isTemp = this.isTemp
      if(this.isTemp == 1){
        param.startTime = this.timeRange[0]
        param.endTime = this.timeRange[1]
      }
      param.keyDetailCode = keyDetailCode
      param.cabinetCode = cabinetCode
      param.userList = users

      shouquanByKeyDetail(param).then(response =>{
        if(response.result){
          this.shouquanFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '授权成功',
            type: 'success',
            duration: 2000
          })
        }else{
          this.$notify({
            title: '失败',
            message: result.errorMessage,
            type: 'info',
            duration: 2000
          })
        }
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
    cancelshouquan () {
      this.shouquanFormVisible = false
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
          putObj(this.form).then(response => {
            if(response.result){
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }else{
              this.$notify({
                title: '失败',
                message: '修改失败',
                type: 'info',
                duration: 2000
              })
            }
            
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
    },
    handleKeySelectionChange(rows){
      this.keySelectionRows = rows;
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
