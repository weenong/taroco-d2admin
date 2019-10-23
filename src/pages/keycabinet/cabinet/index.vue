<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form :inline="true" :model="listQuery" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="查询条件">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="" v-model="listQuery.name" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-if="keyCabinet_add" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
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
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="90">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="区域" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.placeName}}</span>
        </template>
      </el-table-column>
    
      <el-table-column align="center" label="备注" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.memo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime|parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleShouquan(scope.row)" icon="el-icon-link"></el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)" icon="el-icon-view"></el-button>
          <el-button size="mini" type="primary" @click="handleSync(scope.row)" icon="el-icon-check"></el-button>
          <el-button v-if="keyCabinet_upd" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          <el-button v-if="keyCabinet_del" size="mini" type="danger" @click="deletes(scope.row)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: -10px;">
      </el-pagination>
    </template>
    <el-dialog title="详细信息" :visible.sync="dialogDetailVisible" width="800px">
      <div class="el-dialog-div">
        <SplitPane :min-percent='40' :default-percent='45' split="vertical">
          <template slot="paneL">
            <el-divider content-position="left">钥匙列表</el-divider>
            <el-row v-for="(row, index) of keyList" :key="index">
              <el-col :span="3" v-for="(key, innerindex) of row" :key="key.id">
                <el-tag v-if="key.status == 1" @click="show(key)" style="cursor:pointer" size="small" type="success">{{key.locRow}}-{{key.locCol}}</el-tag>
                <el-tag v-if="key.status == 0" @click="show(key)" style="cursor:pointer" size="small" type="info">{{key.locRow}}-{{key.locCol}}</el-tag>
              </el-col>
            </el-row>
            
          </template>
          <template slot="paneR">
            <el-divider content-position="left">已授权人员</el-divider>
            <div>
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags">
                {{tag}}
              </el-tag>
            </div>
            <el-divider content-position="left">领用记录</el-divider>
              <div>
                <el-table
                  size="mini"
                  :data="recordList"
                  v-loading="listLoading"
                  highlight-current-row
                  stripe
                  style="width: 100%">
                  <el-table-column align="center" label="人员" width="120">
                    <template slot-scope="scope">
                      <span>{{scope.row.userCode}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="80">
                    <template slot-scope="scope">
                      <span>{{scope.row.oper}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="时间" >
                    <template slot-scope="scope">
                      <span>{{scope.row.operTime}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </template>
        </SplitPane>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelDetail()" icon="el-icon-check" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" size="mini">
        <el-row>
          <el-col :span=12>
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=24>
            <el-form-item label="区域" prop="placeCode">
                <el-select v-model="form.placeCode" value-key="code" placeholder="请选择" collapse-tags style="width:100%;">
                  <el-option v-for="item in placeList" :key="item.code" :label="item.name" :value="item.code" >
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            <!-- <el-form-item label="位置" prop="address">
              <el-input v-model="form.address" placeholder=""></el-input>
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=24>
            <el-form-item label="地址" prop="wsAddr">
              <el-input v-model="form.wsAddr" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=24>
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
          :page-sizes="[10,20,30,50]"
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
import { Loading } from 'element-ui'
import { fetchList, getObj, addObj, putObj, delObj,shouquanByCabinet } from '@/api/keycabinet/keyCabinet'
import * as keyDetailApi from '@/api/keycabinet/keyDetail'
import * as userApi from '@/api/user'
import {newRecord} from '@/api/keycabinet/keyRecord'
import { getplaceList } from '@/api/keycabinet/place'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'
export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_keyCabinet',
  data () {
    return {
      userList: null,
      userTotal: null,
      shouquanFormVisible: null,
      placeList: null,
      keyList: null,
      recordList: null,
      list: null,
      total: null,
      listLoading: true,
      dynamicTags: [],
      userList: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      userlistQuery: {
        page: 1,
        limit: 10
      },
      form: {
        id: undefined,
        code: undefined,
        name: undefined,
        placeCode: undefined,
        address: undefined,
        wsAddr: undefined,
        ip: undefined,
        port: undefined,
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
        name: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        ip: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        port: [
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
      dialogDetailVisible: false,
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
    this.dynamicTags = this.userList
    this.keyCabinet_add = this.hasFunctions(['keyCabinet_add'])
    this.keyCabinet_upd = this.hasFunctions(['keyCabinet_upd'])
    this.keyCabinet_del = this.hasFunctions(['keyCabinet_del'])
    
  },
  methods: {
    show (key) {
      newRecord(key).then(response => {
        this.recordList = response.result
      })
      this.dynamicTags = []
      keyDetailApi.queryuserbykey(key.code).then(response =>{
        let _this = this
        response.result.forEach(function(item){
          _this.dynamicTags.push(item.username)
        })
      })
      // let idx = Math.floor(Math.random()*36)%3
      // this.dynamicTags = this.userList.slice(idx, 6)

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
    handleuserSizeChange (val) {
      this.userlistQuery.limit = val
      userApi.fetchList(this.listQuery).then(response => {
        this.userList = response.records
        this.userTotal = response.total
      })
    },
    handleuserCurrentChange (val) {
      this.userlistQuery.page = val
      userApi.fetchList(this.listQuery).then(response => {
        this.userList = response.records
        this.userTotal = response.total
      })
    },
    handleCreate () {
      getplaceList().then(response =>{
        this.placeList = response.result
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      })

    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response
        getplaceList().then(response =>{
          this.placeList = response.result
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      })
    },
    handleDetail (row) {
      this.recordList = null
      keyDetailApi.listKey(row.code).then(response => {
        this.keyList = response.result
        this.dialogDetailVisible = true
      })
    },
    handleSync (row) {
      let loadingInstance = Loading.service({ fullscreen: true })
      keyDetailApi.syncByCabinet(row.code).then(response => {
        this.$notify({title: '成功', message: '同步成功', type: 'success', duration: 2000})
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
        
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
      let cabinetCode = this.form.code
      let users = this.$refs.userTable.selection
      console.log(cabinetCode)
      console.log(users)
      let param = {}
      param.cabinetCode = cabinetCode
      param.userList = users

      shouquanByCabinet(param).then(response =>{
        this.shouquanFormVisible = false
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
    cancelDetail () {
      this.dialogDetailVisible = false
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
        delObj(row.code)
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
        code: undefined,
        name: undefined,
        placeCode: undefined,
        address: undefined,
        wsAddr: undefined,
        ip: undefined,
        port: undefined,
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