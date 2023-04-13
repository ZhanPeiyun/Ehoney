<template>
	<div class="trap-images-container">
		<el-card shadow="hover">
			<div class="trap-images-search mb15">
		<el-form :inline="true">
          <el-form-item label="诱饵名称">
            		<el-input size="default" v-model="tableData.param.baitName" placeholder="请输入诱饵名称" class="w-50 m-2" clearable/>
          		</el-form-item>
		  <el-form-item label="文件名称">
            		<el-input size="default" v-model="tableData.param.fileName" placeholder="请输入文件名称" class="w-50 m-2" clearable/>
          		</el-form-item>
		  <el-form-item label="诱饵类型">
            		<el-input size="default" v-model="tableData.param.baitType" placeholder="请输入诱饵类型" class="w-50 m-2" clearable/>
          		</el-form-item>
		  <el-form-item label="可否加签">
			<el-select size="default" placeholder="请选择可否加签" class="w-50 m-2" v-model="tableData.param.tokenAble" clearable>
						<el-option label="是"  value=true />
              			<el-option label="否"  value=false />
            </el-select>
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
            <el-button size="default" type="primary" class="ml10" @click="baitsList" >
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
			<el-table-column prop="baitName" label="诱饵名称" show-overflow-tooltip/> 
				  <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip/> 
				  <el-table-column prop="baitType" label="诱饵类型" show-overflow-tooltip/> 
				  <el-table-column prop="tokenAble" label="可加签" show-overflow-tooltip>
				  <template #default="scope">
						<el-tag type="success" v-if="scope.row.tokenAble==true">是</el-tag>
						<el-tag type="fail" v-if="scope.row.tokenAble===false">否</el-tag>
					</template>
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
						<el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)"></el-button>
					</template>
				</el-table-column>
	 		 </el-table>
			  <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="baitsList"
      />
		</el-card>
		<!-- <EditProtocolProxies ref="editProtocolProxiesRef" @protocolProxiesList="protocolProxiesList"/> -->
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent,getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
//import EditProtocolProxies from '/@/views/proxies/component/editProtocolProxies.vue';
import {delBaits, listBaits} from "/@/api/system/trap/baits";

// 定义接口来定义对象的类型
interface TableDataRow {
  id:number;
  baitId:string;
  baitType:string;
  baitName:string;
  baitData:string;
  uploadPath:string;
  fileName:string;
  tokenAble:string;
  tokenTraceUrl:string;
  createTime:number;
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
			baitName:string;
			fileName:string;
			baitType:string;
			tokenAble:string;
			createTime:number|null;
			dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'trapBaits',
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
				baitName:'',
				fileName:'',
				baitType:'',
				tokenAble:'',
				createTime:null,
				dateRange: [],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			baitsList();
		};
		 // 获取列表数据
		 const baitsList = ()=>{
      		loading.value = true
      		listBaits(state.tableData.param).then((res:any)=>{
        		let list = res.data.list??[];
        		state.tableData.data = list;
				state.tableData.total = res.data.total;
      })
    };
			// 删除当前行
			const onTabelRowDel = (row: TableDataRow) => {
			ElMessageBox.confirm(`此操作将永久删除透明转发：${row.imageName}, 是否继续?`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					delBaits(row.id).then(()=>{
					  ElMessage.success('删除成功');
					  baitsList();
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
            baitsList,
      		// onOpenAddDept,
			// onOpenEditDept,
			// onTabelRowDel,
      		...toRefs(state),
		};
	},
});
</script>
