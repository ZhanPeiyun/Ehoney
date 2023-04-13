<template>
	<div class="system-edit-images-container">
		<el-dialog :title="'新增自定义镜像'" v-model="isShowDialog" width="769px">
			<el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="镜像名称" prop="deptName">
							<el-input v-model="ruleForm.deptName" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="镜像地址">
							<el-input v-model="ruleForm.leader"  clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="镜像端口">
							<el-input v-model="ruleForm.phone" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-alert title="请根据镜像正确设置服务端口、才能保证协议转发的正确性" type="warning" show-icon :closable="false" ></el-alert>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="协议类型" prop="protocolType">
							<el-select v-model="ruleForm.protocolType" placeholder="请选择协议类型" clearable class="w100" @change="handleProtocolTypeChange">
								<el-option
                    				v-for="item in  protocolProxiesData "
                    				:key="item.id"
                    				:value="item.protocolType">
                				</el-option>
    						</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="标签">
							<el-input v-model="ruleForm.email" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			 <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{'保存'}}</el-button>
				</span>
			</template> 
		</el-dialog>
	</div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, getCurrentInstance,ref,unref} from 'vue';
import {listProtocols} from "/@/api/system/trap/protocols";
import {addProtocolProxies,listHoneypots}from "/@/api/system/proxies/protocolProxies";
import {ElMessage} from "element-plus";

// 定义接口来定义对象的类型
interface TableDataRow {
  id:number;
  imageId:string;
  imageAddress:string;
  imageName:string;
  imagePort:number;
  protocolType:string;
  label:string;
	children?:TableDataRow[];
}
interface RuleFormState {
	protocolType:string;
	honeypotName:string;
	proxyPort:number|null;
}
interface ProtocolProxiesSate {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	protocolProxiesData: Array<TableDataRow>;
    rules: object;
	honeypotsData: Array<TableDataRow>;
}


export default defineComponent({
	name: 'proxiesEditProtocolProxies',
	setup(prop,{emit}) {
    const {proxy} = getCurrentInstance() as any;
    const formRef = ref<HTMLElement | null>(null);
		const {
    	} = proxy.useDict(
    	)
		const state = reactive<ProtocolProxiesSate>({
			isShowDialog: false,
			ruleForm: {
				protocolType:'',
				honeypotName:'',
				proxyPort:null,
			},
			protocolProxiesData: [], 
			honeypotsData:[],
      rules: {
        honeypotName:[{ required: true, message: '请选择蜜罐', trigger: 'blur' },],
		proxyPort:[{ required: true, message: '请输入转发端口', trigger: 'blur' }],
      }
		});
		const handleProtocolTypeChange = (value: string) => {
  		listHoneypots({ protocolType: value }).then((res:any)=>{
    		let list = res.data.list??[];
    		state.honeypotsData = list;
  		});
};
		// 打开弹窗
		const openDialog = () => {
      	resetForm()
	  	listProtocols().then((res:any)=>{
        		let list = res.data.list??[];
        		state.protocolProxiesData = list;
      })
			state.isShowDialog = true;
		};
		
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 新增
		const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
            //添加
            addProtocolProxies(state.ruleForm).then(()=>{
              ElMessage.success('协议转发新建成功');
              closeDialog(); // 关闭弹窗
              emit('protocolProxiesList')
            });
        }
      });
		};
		const changePort = (value: string) => {
  // 正则表达式，匹配非数字字符
  const reg = /[^\d]/g; 
  // 将非数字字符替换为空字符串
  const newVal = value.replace(reg, '');
  // 更新ruleForm中的proxyPort值
  state.ruleForm.proxyPort = newVal ? parseInt(newVal) : null;
};
		//重置表格
    const resetForm = ()=>{
      state.ruleForm = {
        protocolType:'',
        honeypotName: '', 
        proxyPort:null, 
      }
    };
		return {
			changePort,
			handleProtocolTypeChange,
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
      		formRef,
			...toRefs(state),
		};
	},
});
</script>
