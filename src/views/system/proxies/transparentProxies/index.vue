<template>
	<div class="proxies-transparentproxies-container">
		<el-card shadow="hover">
			<div class="proxies-transparentproxies-search mb15">
		<el-form :inline="true">
          <el-form-item label="探针Host">
            		<el-input size="default" v-model="tableData.param.agentHost" placeholder="请输入探针Host" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="探针IP">
            		<el-input size="default" v-model="tableData.param.agentIp" placeholder="请输入探针IP" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="代理端口">
            		<el-input size="default" v-model="tableData.param.proxyPort" placeholder="请输入代理端口" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="协议类型" prop="protocolType">
							<el-select v-model="tableData.param.protocolType" placeholder="请选择协议类型" clearable class="w100">
								<el-option
                    				v-for="item in  tableData.protocolProxiesData "
                    				:key="item.id"
                    				:value="item.protocolType">
                				</el-option>
    						</el-select>
						</el-form-item>
				  <el-form-item label="协议端口">
            		<el-input size="default" v-model="tableData.param.destPort" placeholder="请输入协议端口" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="状态">
					<el-select size="default" placeholder="请选择状态" class="w-50 m-2" v-model="tableData.param.status" clearable>
						<el-option label="在线"  value="3" />
              			<el-option label="离线"  value="2" />
			  			<el-option label="下发中"  value="1" />
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
            <el-button size="default" type="primary" class="ml10" @click="transparentProxiesList">
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
			<el-table-column prop="agentHost" label="探针Host" show-overflow-tooltip/> 
			<el-table-column prop="agentIp" label="探针Ip" :width="140" show-overflow-tooltip/> 
				  <el-table-column prop="proxyPort" label="代理端口" show-overflow-tooltip/> 
				  <el-table-column prop="protocolType" label="协议类型" show-overflow-tooltip/> 
				  <el-table-column prop="destPort" label="协议端口" show-overflow-tooltip/>
				  <el-table-column prop="status" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status===3">在线</el-tag>
						<el-tag type="fail" v-if="scope.row.status===2">离线</el-tag>
						<el-tag type="info" v-if="scope.row.status===1">下发中</el-tag>
					</template>
				</el-table-column>
				  <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
					<template #default="scope">
      					{{new Date(scope.row.createTime*1000).toLocaleString()}}
  					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="showAgentIp(scope.row.agentIp)">探针IP列表</el-button>
						<el-button size="small" text type="primary" @click="">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
	 		 </el-table>
			  <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="transparentProxiesList"
      />
		</el-card>
		<!-- <EditProtocolProxies ref="editProtocolProxiesRef" @protocolProxiesList="protocolProxiesList"/> -->
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent,getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {listProtocols} from "/@/api/system/trap/protocols";
import {delTransparentProxies, listTransparentProxies} from "/@/api/system/proxies/transparentProxies";

// 定义接口来定义对象的类型
interface TableDataRow {
  id:number;
  transparentProxyId:string;
  protocolProxyId:string;
  proxyPort:number;
  protocolType:string;
  destIp:string;
  destPort:number;
  agentId:string;
  agentToken:string;
  agentIp:string;
  agentHost:string;
  status:number;
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
			agentHost:string;
			agentIp:string;
			proxyPort:number|null;
			protocolType:string;
			destPort:number|null;
			status:string;
			createTime:number|null;
			dateRange: string[];
		};
		protocolProxiesData: Array<TableDataRow>;
	};
}

export default defineComponent({
	name: 'proxiesTransparentProxies',
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
				agentHost:'',
				agentIp:'',
				proxyPort:null,
				protocolType:'',
				destPort:null,
				status:'',
				createTime:null,
				dateRange:[],
				},
				protocolProxiesData: [], 
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			transparentProxiesList();
			listProtocols().then((res:any)=>{
        		let list = res.data.list??[];
        		state.tableData.protocolProxiesData = list;
      })
		};
		 // 获取列表数据
		 const transparentProxiesList = ()=>{
      		loading.value = true
      		listTransparentProxies(state.tableData.param).then((res:any)=>{
        		let list = res.data.list??[];
        		state.tableData.data = list;
				state.tableData.total = res.data.total;
      })
    };
			// 删除当前行
			const onTabelRowDel = (row: TableDataRow) => {
			ElMessageBox.confirm(`此操作将永久删除透明转发：${row.agentHost}, 是否继续?`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					delTransparentProxies(row.id).then(()=>{
					  ElMessage.success('删除成功');
					  transparentProxiesList();
          })
				})
				.catch(() => {});
		};
		const showAgentIp = (agentIp: string) => {
  const ips = agentIp.replace(/,/g, '<br>'); // 将逗号替换为换行标签
  ElMessageBox.alert(`该行的探针IP详细信息为：<br>${ips}`, '提示', {
    confirmButtonText: '确定',
    type: 'info',
    dangerouslyUseHTMLString: true // 开启HTML模式
  });
}
		// 页面加载时
		onMounted(() => {
      		initTableData();
    	});
		return {
			showAgentIp,
			onTabelRowDel,
            transparentProxiesList,
      		// onOpenAddDept,
			// onOpenEditDept,
			// onTabelRowDel,
      		...toRefs(state),
		};
	},
});
</script>
