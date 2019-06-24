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
        <el-form-item style="float: right">
          <el-button v-if="vehicle_add" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
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
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="型号">
        <template slot-scope="scope">
          <span>{{scope.row.vinId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="车厢">
        <template slot-scope="scope">
          <span>{{scope.row.box}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前里程">
        <template slot-scope="scope">
          <span>{{scope.row.mileage}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="架修里程">
        <template slot-scope="scope">
          <span>{{scope.row.maintain}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="大修里程">
        <template slot-scope="scope">
          <span>{{scope.row.overtain}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出厂日期" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime|parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="vehicle_upd" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          <el-button v-if="vehicle_del" size="mini" type="danger" @click="deletes(scope.row)" icon="el-icon-delete"></el-button>
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
          
          <el-col :span="24">
            <el-form-item label="code" prop="code">
              <el-input v-model="form.code" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="name" prop="name">
              <el-input v-model="form.name" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="vinId" prop="vinId">
              <el-input v-model="form.vinId" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="box" prop="box">
              <el-input v-model="form.box" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="mileage" prop="mileage">
              <el-input v-model="form.mileage" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="maintain" prop="maintain">
              <el-input v-model="form.maintain" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="overtain" prop="overtain">
              <el-input v-model="form.overtain" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="beginTime" prop="beginTime">
              <el-input v-model="form.beginTime" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check" size="mini">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-check" size="mini">修 改</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/vehicle/vehicle'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'
export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_vehicle',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        id: undefined,
        code: undefined,
        name: undefined,
        vinId: undefined,
        box: undefined,
        mileage: undefined,
        maintain: undefined,
        overtain: undefined,
        beginTime: undefined,
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
        vinId: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        box: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        mileage: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        maintain: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        overtain: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        beginTime: [
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
    this.vehicle_add = this.hasFunctions(['vehicle_add'])
    this.vehicle_upd = this.hasFunctions(['vehicle_upd'])
    this.vehicle_del = this.hasFunctions(['vehicle_del'])
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
        code: undefined,
        name: undefined,
        vinId: undefined,
        box: undefined,
        mileage: undefined,
        maintain: undefined,
        overtain: undefined,
        beginTime: undefined,
        createTime: undefined,
        updateTime: undefined,
      }
    }
  }
}
</script>