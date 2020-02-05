<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form :inline="true" :model="listQuery" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="物品柜">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="" v-model="listQuery.cabinetName" clearable>
          </el-input>
          <!-- <el-select v-model="listQuery.cabinetCode" placeholder="">
            <el-option
              v-for="item in cabinetList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <!-- <el-button v-if="cabinetCell_add" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button> -->
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
      <el-table-column align="center" type="index" label="序号" width="60">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template> -->
      </el-table-column>
      <el-table-column align="center" label="物品柜" width="100" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.cabinetName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="柜门编号" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.cellCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="柜门名称" width="100" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.cellName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="物料名称" width="100" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.devtName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="物料数量">
        <template slot-scope="scope">
          <span>{{scope.row.devtNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="120" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.memo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip content="授权"> 
            <el-button size="mini" type="primary" @click="handleShouquan(scope.row)" icon="el-icon-link"></el-button>
          </el-tooltip>
          <el-tooltip content="修改"> 
            <el-button v-if="cabinetCell_upd" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <!-- <el-button v-if="cabinetCell_del" size="mini" type="danger" @click="deletes(scope.row)" icon="el-icon-delete"></el-button> -->
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: -10px;">
      </el-pagination>
    </template>
    <!-- 新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="柜门编号" prop="cellCode">
              <el-input v-model="form.cellCode" disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="柜门名称" prop="cellName">
              <el-input v-model="form.cellName" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物料编码" prop="devtCode">
              <el-input v-model="form.devtCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="devtNum">
              <el-input v-model="form.devtNum" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check" size="mini">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-check" size="mini">修 改</el-button>
      </div>
    </el-dialog>
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
              style="width: 100%">
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
          :page-sizes="[20,50,100]"
          :page-size="userlistQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelshouquan()" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button type="primary" @click="shouquan()" icon="el-icon-check" size="mini">授 权</el-button>
      </div>
    </el-dialog>    
  </d2-container>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj,shouquanByCell } from '@/api/storagecabinet/cabinetCell'
import { getCabinetList,syncFinger } from '@/api/storagecabinet/storageCabinet'
import * as userApi from '@/api/user'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'
export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_cabinetCell',
  data () {
    return {
      timeRange: null,
      isTemp: 0,
      userList: null,
      userTotal: null,
      cabinetList: [],
      shouquanFormVisible: null,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      userlistQuery: {
        subSystem:1,
        page: 1,
        limit: 20
      },      
      form: {
        id: undefined,
        cabinetCode: undefined,
        cabinetName: undefined,
        wsAddr: undefined,
        cellCode: undefined,
        cellName: undefined,
        devtCode: undefined,
        devtNum: undefined,
        memo: undefined,
        createTime: undefined,
        updateTime: undefined,
      },
      rules: {
        cellName: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ]
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
    this.getList()
    this.cabinetCell_add = this.hasFunctions(['cabinetCell_add'])
    this.cabinetCell_upd = this.hasFunctions(['cabinetCell_upd'])
    this.cabinetCell_del = this.hasFunctions(['cabinetCell_del'])
    getCabinetList().then(response => {
      this.cabinetList = response.result
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
    shouquan () {
      let cabinetCode = this.form.cabinetCode
      let cellCode = this.form.cellCode
      let users = this.$refs.userTable.selection
 
      let param = {}
      param.isTemp = this.isTemp
      if(param.isTemp == 1){
        param.startTime = this.timeRange[0]
        param.endTime = this.timeRange[1]
      }
      param.cabinetCode = cabinetCode
      param.cellCode = cellCode
      param.userList = users
      shouquanByCell(param).then(response =>{
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
            message: response.errorMessage,
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
        cabinetCode: undefined,
        cabinetName: undefined,
        wsAddr: undefined,
        cellCode: undefined,
        cellName: undefined,
        devtCode: undefined,
        devtNum: undefined,
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
    height: 40vh;
    overflow: auto;
  }
</style>