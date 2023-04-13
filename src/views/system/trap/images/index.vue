<template>
	<div class="trap-images-container">
		<el-card shadow="hover">
			<div class="trap-images-search mb15">
		<el-form :inline="true">
          <el-form-item label="镜像名称">
            		<el-input size="default" v-model="tableData.param.imageName" placeholder="请输入镜像名称" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="镜像地址">
            		<el-input size="default" v-model="tableData.param.imageAddress" placeholder="请输入镜像地址" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="协议端口">
            		<el-input size="default" v-model="tableData.param.imagePort" placeholder="请输入协议端口" class="w-50 m-2" clearable/>
          		</el-form-item>
				  <el-form-item label="协议类型" prop="protocolType">
							<el-select v-model="tableData.param.protocolType" placeholder="请选择协议类型" clearable class="w100" @change="handleProtocolTypeChange">
								<el-option
                    				v-for="item in  tableData.protocolProxiesData "
                    				:key="item.id"
                    				:value="item.protocolType">
                				</el-option>
    						</el-select>
						</el-form-item>
				  <el-form-item label="标签">
            		<el-input size="default" v-model="tableData.param.label" placeholder="请输入标签" class="w-50 m-2" clearable/>
          		</el-form-item>
				<el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="imagesList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddImages">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              自定义
            </el-button>
          </el-form-item>
        </el-form>
    </div>
	  		<el-table 
				:data="tableData.data"
				style="width: 100%"
				row-key="id"
			>
			<el-table-column prop="imageName" label="镜像名称" show-overflow-tooltip/> 
				  <el-table-column prop="imageAddress" label="镜像地址" show-overflow-tooltip/> 
				  <el-table-column prop="imagePort" label="协议端口" show-overflow-tooltip/> 
				  <el-table-column prop="protocolType" label="协议类型" show-overflow-tooltip/> 
				  <el-table-column prop="label" label="标签" show-overflow-tooltip/>
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
          @pagination="imagesList"
      />
		</el-card>
		<EditImages ref="editImagesRef" @imagesList="imagesList"/> 
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent,getCurrentInstance } from 'vue';
import {listProtocols} from "/@/api/system/trap/protocols";
import EditImages from './component/editImages.vue';
import {listImages} from "/@/api/system/trap/images";

// 定义接口来定义对象的类型
interface TableDataRow {
  id:number;
  imageId:string;
  imageAddress:string;
  imagePort:number;
  protocolType:string;
  imageName:string;
  label:string;
  repositoryId:string;
  createTime:number;
  defaultFlag:number;
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
			imageName:string;
			imageAddress:string;
			imagePort:number|null;
			protocolType:string;
			label:string;
		};
		protocolProxiesData: Array<TableDataRow>;
	};
}

export default defineComponent({
	name: 'trapImages',
	components: {
		EditImages
	  },
	setup() {
    	const {proxy} = getCurrentInstance() as any;
		const loading = ref(false)
    	const editImagesRef = ref();
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
				imageName:'',
				imageAddress:'',
				imagePort:null,
				protocolType:'',
				label:'',
				},
				protocolProxiesData: [], 
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			imagesList();
			listProtocols().then((res:any)=>{
        		let list = res.data.list??[];
        		state.tableData.protocolProxiesData = list;
      })
		};
		 // 获取列表数据
		 const imagesList = ()=>{
      		loading.value = true
      		listImages(state.tableData.param).then((res:any)=>{
        		let list = res.data.list??[];
        		state.tableData.data = list;
				state.tableData.total = res.data.total;
      })
    };
		// 打开新增菜单弹窗
		const onOpenAddImages = (row?: TableDataRow) => {
			editImagesRef.value.openDialog(row);
		};
		onMounted(() => {
      		initTableData();
    	});
		return {
			editImagesRef,
            imagesList,
			onOpenAddImages,
      		...toRefs(state),
		};
	},
});
</script>
