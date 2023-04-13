<template>
	<div class="trap-protocols-container">
		<el-card shadow="hover">
			<div class="trap-protocols-search mb15">
		<el-form :inline="true">
          <el-form-item label="协议名称">
            		<el-input size="default" v-model="tableData.param.protocolType" placeholder="请输入协议名称" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="文件名称">
            		<el-input size="default" v-model="tableData.param.fileName" placeholder="请输入文件名称" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="本地路径">
            		<el-input size="default" v-model="tableData.param.localPath" placeholder="请输入本地路径" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="状态">
            		<el-select size="default" placeholder="请选择状态" class="w-50 m-2" v-model="tableData.param.status" clearable>
						<el-option label="成功"  value="3" />
              			<el-option label="异常"  value="2" />
						  <el-option label="下发中"  value="1" />
            		</el-select>
          		</el-form-item>
				  <el-form-item label="透明协议端口">
            		<el-input size="default" v-model="tableData.param.port" placeholder="请输入透明协议端口" class="w-50 m-2" clearable/>
					</el-form-item>
					<el-form-item label="创建时间" prop="dateRange">
					<el-date-picker
                	v-model="tableData.param.dateRange"
                	size="default"
                	style="width: 240px"
                	value-format="YYYY-MM-DD"
                	type="daterange"
                	range-separator="-"
                	start-placeholder="开始日期"
                	end-placeholder="结束日期"
            ></el-date-picker>
          		</el-form-item>
				<el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="protocolsList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新建
            </el-button>
          </el-form-item>
        </el-form>
    </div>
	  		<el-table 
				:data="tableData.data"
				style="width: 100%"
				row-key="id"
			>
			<el-table-column prop="protocolType" label="协议名称" show-overflow-tooltip/> 
				  <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip/> 
				  <el-table-column prop="localPath" label="本地路径" show-overflow-tooltip/> 
				  <el-table-column prop="status" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status===3">成功</el-tag>
						<el-tag type="fail" v-if="scope.row.status===2">异常</el-tag>
						<el-tag type="info" v-if="scope.row.status===1">下发中</el-tag>
					</template>
				</el-table-column>
				  <el-table-column label="透明协议端口范围" show-overflow-tooltip>
                    <template v-slot="{row}">{{row.minPort}} - {{row.maxPort}}</template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
					<template #default="scope">
      					{{new Date(scope.row.createTime*1000).toLocaleString()}}
  					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click=""></el-button>
						<el-button size="small" text type="primary" @click=""></el-button>
						<el-button size="small" text type="primary" @click=""></el-button>
					</template>
				</el-table-column>
	 		 </el-table>
			  <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="protocolsList"
      />
		</el-card>
		<!-- <EditProtocolProxies ref="editProtocolProxiesRef" @protocolProxiesList="protocolProxiesList"/> -->
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent,getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
//import EditProtocolProxies from '/@/views/proxies/component/editProtocolProxies.vue';
import {delProtocols, listProtocols} from "/@/api/system/trap/protocols";

// 定义接口来定义对象的类型
interface TableDataRow {
  id:number;
  protocolId:string;
  protocolType:string;
  localPath:string;
  fileName:string;
  minPort:number;
  maxPort:number;
  createTime:number;
  defaultFlag:number;
  status:number;
	children?:TableDataRow[];
}
interface TableDataState {
	tableData: {
		data: Array<TableDataRow>;
			total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			protocolType:string;
			fileName:string;
			localPath:string;
			status:string;
			port:number|null;
		    dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'trapProtocols',
	components: {
		//EditProtocolProxies
	  },
	setup() {
    	const {proxy} = getCurrentInstance() as any;
		const loading = ref(false)
    	const editProtocolProxiesRef = ref();
    	// 字典选项数据
    	const {
    	} = proxy.useDict(
    	)
		const state = reactive<TableDataState>({
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
				pageNum: 1,
				pageSize: 10,
				protocolType:'',
				fileName:'',
				localPath:'',
				status:'',
				port:null,
				dateRange: [],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			protocolsList();
		};
		 // 获取列表数据
		 const protocolsList = ()=>{
      		loading.value = true
      		listProtocols(state.tableData.param).then((res:any)=>{
        		let list = res.data.list??[];
        		state.tableData.data = list;
				state.tableData.total = res.data.total;
      })
    };
			// 删除当前行
			const onTabelRowDel = (row: TableDataRow) => {
			ElMessageBox.confirm(`此操作将永久删除透明转发：${row.protocolType}, 是否继续?`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					delProtocols(row.id).then(()=>{
					  ElMessage.success('删除成功');
					  protocolsList();
          })
				})
				.catch(() => {});
		};
		// 页面加载时
		onMounted(() => {
      		initTableData();
    	});
		return {
			onTabelRowDel,
            protocolsList,
      		// onOpenAddDept,
			// onOpenEditDept,
			// onTabelRowDel,
      		...toRefs(state),
		};
	},
});
</script>
