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
          <el-button v-if="keyDetail_add" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
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
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
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
          <!-- <el-button v-if="keyDetail_upd" size="mini" type="primary" @click="handleShouquan(scope.row)" icon="el-icon-link"></el-button> -->
          <el-button v-if="keyDetail_upd" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
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
      <div class="el-dialog-div">
        
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelshouquan()" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button type="primary" @click="shouquan()" icon="el-icon-check" size="mini">授 权</el-button>
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
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/keycabinet/keyDetail'
import * as keyCabinetService from '@/api/keycabinet/keyCabinet'
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
        ],
        ability: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        locRow: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        locCol: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        memo: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        createTime: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        updateTime: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
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
    handleCreate () {
      this.resetTemp()
      let param = {}
      param.page = 1
      param.limit = 1000
      keyCabinetService.fetchList(param).then(response => {
        this.keyCabinetList = response.records
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
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
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
   
        })
      })
    },
    handleShouquan (row) {
      getObj(row.id).then(response => {
        this.form = response
        this.shouquanFormVisible = true
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
    }
  }
}
</script>
<style lang="scss" scoped>
 .el-dialog-div{
    height: 30vh;
    overflow: auto;
  }

</style>
