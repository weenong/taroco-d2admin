<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form
        :inline="true"
        :model="listQuery"
        size="mini"
        style="margin-bottom: -18px;">
          <el-form-item label="表名" prop="tableName">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="table名称" v-model="listQuery.tableName" clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
      </el-form>
    </template>
    <!-- table表格 -->
    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="拼命加载中..."
              highlight-current-row
              stripe
              height="100%"
              style="width: 100%">

      <el-table-column align="center" label="表名">
        <template slot-scope="scope">
          <span>{{scope.row.tableName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="引擎">
        <template slot-scope="scope">
          <span>{{scope.row.engine}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注释" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.tableComment}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleCodeConfig(scope.row)" icon="el-icon-edit"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="form" ref="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="base包名" prop="basePackageName">
              <el-input v-model="form.basePackageName" placeholder="请输base包名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="authorName">
              <el-input v-model="form.authorName" placeholder="请输入author"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="model包名" prop="modelPackageName">
              <el-input v-model="form.modelPackageName" placeholder="请输入model包名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="controller包名" prop="controllerPackageName">
              <el-input v-model="form.controllerPackageName" placeholder="请输入controller包名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="service包名" prop="servicePackageName">
              <el-input v-model="form.servicePackageName" placeholder="请输入service包名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="dao包名" prop="daoPackageName">
              <el-input v-model="form.daoPackageName" placeholder="请输入dao包名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <el-table
        :data="columnList"
        max-height="230"
        border
        style="width: 100%">

        <el-table-column align="center" label="列名">
          <template slot-scope="scope">
            <i class="el-icon-info" v-if="scope.row.columnKey == 'PRI'"></i>
            <span style="margin-left: 10px">{{scope.row.columnName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="列类型">
          <template slot-scope="scope">
            <span>{{scope.row.dataType}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="字段名">
          <template slot-scope="scope">
            <span>{{scope.row.columnName}}</span>
          </template>
        </el-table-column>        
        <el-table-column align="center" label="字段类型">
          <template slot-scope="scope">
            <span>{{scope.row.dataType}}</span>
          </template>
        </el-table-column>   
        <el-table-column label="关联表">
          <template slot-scope="scope">
            <el-cascader v-model="scope.row.casTable"
              :options="list"
              @active-item-change="handleItemChange"
              :props="props"
            ></el-cascader>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" icon="el-icon-close" size="mini">取 消</el-button>
        <el-button type="primary" @click="exportCodeZipHandle()" icon="el-icon-check" size="mini">生 成</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList,columns, getConfig, exportCodeZip } from '@/api/gencode'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'

// import { Divider } from 'iview'
export default {
  components: {
    ElOption,
    ElRadioGroup,
    // Divider
  },
  data () {
    return {
      list: null,
      total: null,
      columnList: null,
      listLoading: true,
      formTitle: '配置项',
      listQuery: {
      },
      tableKey: 0,
      dialogFormVisible: false,
      form: {
        table: undefined,
        basePackageName: undefined,
        modelPackageName: undefined,
        controllerPackageName: undefined,
        servicePackageName: undefined,
        daoPackageName: undefined,
        authorName: undefined
      },
      props: {
        label: 'tableName',
        value: 'tableName',
        children: 'columnInfoList'
      }
    }
  },
  computed: {
  },
  filters: {

  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.isAsc = false
      fetchList(this.listQuery).then(response => {
        this.list = response.result
        this.listLoading = false
      })
    },
    handleFilter () {
      this.getList()
    },
    handleCodeConfig (row) {
      this.formTitle = row.tableName + '配置项'
      getConfig().then(response => {
        this.form = response.result
        this.form.table = {'tableName':row.tableName}
        columns({'tableName': row.tableName}).then(response =>{
          this.columnList = response.result
          this.dialogFormVisible = true
        })
      })
    },
    cancel () {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
    },
    exportCodeZipHandle () {
      this.form.table.columnInfoList = this.columnList
      exportCodeZip(this.form).then(res => {
        this.dialogShow = false
        const content = res
        const blob = new Blob([content])
        const fileName = 'code.zip'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    handleItemChange(val) {
      let value = val[0]
      console.log(value)
      columns({'tableName': value}).then(response =>{
        let columnList = response.result || []
        let columns = []
        for(let i=0;i<columnList.length;i++){
          let item = {}
          item.tableName = columnList[i].columnName
          columns.push(item)
        }
        for(let i=0;i<this.list.length;i++){
          if(this.list[i].tableName == value){
            this.$set(this.list[i], 'columnInfoList', columns) // right
          }
        }
      })
    }
  }
}
</script>
