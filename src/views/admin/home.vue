<template>
  <div class="fa">
    <!-- 添加顶部导航栏 -->
    <div class="top-navbar">
      <div class="navbar-logo">
        <el-icon class="logo-icon"><Avatar /></el-icon>
        <span class="logo-text">员工管理系统</span>
      </div>
      <div class="navbar-right">
        <span class="time-display">{{ thisTime }}</span>
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
            <span>name</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="main-content">
      
      <div id="form" class="obform">
        <div class="search-form-title">
          <el-icon><Search /></el-icon>
          <span>员工查询</span>
        </div>
        <div class="search-form-content">
          <div class="form-item">
            <span>姓名</span>
            <el-autocomplete v-model="obForm.name" :fetch-suggestions="querySearch" :trigger-on-focus="false" clearable placeholder="请输入姓名" />
          </div>
          <div class="form-item">
            <span>职位</span>
            <el-input type="text" v-model="obForm.job" placeholder="请输入职位"/>
          </div>
          <div class="form-item-date">
            <span>入职时间</span>
            <div class="date-range">
              <el-date-picker v-model="obForm.beginData" type="datetime" placeholder="开始时间"/>
              <span class="date-separator">至</span>
              <el-date-picker v-model="obForm.endData" type="datetime" placeholder="结束时间"/>
            </div>
          </div>
          <div class="form-item">
            <span>部门</span>
            <el-select v-model="obForm.dep" placeholder="请选择">
              <el-option label="请选择" :value="0"/>
              <el-option v-for="dep in depS" :key="dep.deptno" :value="dep.deptno" :label="dep.dname"/>
            </el-select>
          </div>
          <el-button type="primary" @click="getEmpCriteriasPage" class="search-button">
            <el-icon><Search /></el-icon>查询
          </el-button>
        </div>
      </div>
      
      <div class="table-emp">
        <div class="table-header">
          <div class="table-title">
            <el-icon><Avatar /></el-icon>
            <span>员工管理</span>
          </div>
          <div class="table-actions">
            <el-button type="danger" plain @click="delIds.length>0 ? deleteEmpSUp=true : ElMessage.warning('未选择任何数据')">
              <el-icon><Minus /></el-icon>批量删除
            </el-button>
            <el-button type="primary" plain @click="AddClick">
              <el-icon><Plus /></el-icon>添加
            </el-button>
          </div>
        </div>

        <!--添加员工弹框-->
        <el-dialog v-model="addEmpUp" title="添加员工" width="500" center>
          <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 20px 0;">
          <el-form :model="form" style="margin-top: 20px" label-width="80px">
            <el-form-item label="员工姓名"><el-input type="text" style="width: 100%;" v-model="form.ename" auto-complete="off" placeholder="员工姓名"/></el-form-item>
            <el-form-item label="工作职位"><el-input type="text" style="width: 100%;" v-model="form.job" auto-complete="off" placeholder="职位"/></el-form-item>
            <el-form-item label="入职时间"><el-date-picker v-model="form.hiredate" type="datetime" placeholder="入职时间" style="width: 100%"/></el-form-item>
            <el-form-item label="工资"><el-input-number  style="width: 100%;" :controls="false" v-model="form.sal" auto-complete="off" placeholder="工资"  :min="0"/></el-form-item>
            <el-form-item label="奖金"><el-input-number  style="width: 100%;" :controls="false" v-model="form.comm" auto-complete="off" placeholder="奖金" :min="0"/></el-form-item>
            <el-form-item label="部门"><el-select style="width: 100%" auto-complete="off" v-model="form.department.deptno" placeholder="请选择"><el-option label="请选择" :value="0"/><el-option v-for="dep in depS" :key="dep.deptno" :value="dep.deptno" :label="dep.dname"/></el-select></el-form-item>
            <el-form-item label="员工头像">
              <el-upload
                  class="avatar-uploader"
                  style="border: 1px dashed #d9d9d9;"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleFileChange">
                <img v-if="previewUrl" :src="previewUrl" class="avatar" />
                <img v-else-if="form.avatarURL" :src="form.avatarURL" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

          </el-form>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="addEmpUp = false">取消</el-button>
              <el-button type="primary" @click="addEmp">
                确认添加
              </el-button>
            </div>
          </template>
        </el-dialog>

        <!-- 员工信息弹窗 -->
        <el-dialog
            v-model="seeMessageUp"
            title="员工详细信息"
            width="680px"
            class="employee-detail-modal"
            :close-on-click-modal="false"
        >
          <div class="employee-card" v-if="currentEmployee">
            <div class="employee-header">
              <el-avatar :size="80" :src="currentEmployee.avatarURL"/>
              <div class="employee-title">
                <h3>{{ currentEmployee.ename || '未知姓名' }}</h3>
                <el-tag :type="currentEmployee.job=='董事长' ? 'danger':currentEmployee.job=='经理' ? 'warning':'success'" effect="dark" round>
                  <el-icon><User /></el-icon>{{ currentEmployee.job || '未知职位' }}
                </el-tag>
              </div>
            </div>
            <el-divider border-style="dashed" />

            <div class="employee-details">
              <div class="detail-section">
                <h4><i class="el-icon-user"></i> 基本信息</h4>
                <el-descriptions :column="2">
                  <el-descriptions-item label="员工ID">{{ currentEmployee.empno || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="部门">{{ currentEmployee.department?.dname || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="入职日期">{{ currentEmployee.hiredate }}</el-descriptions-item>
                  <el-descriptions-item label="工龄">{{Seniority }}</el-descriptions-item>
                </el-descriptions>
              </div>

              <div class="detail-section">
                <h4><i class="el-icon-money"></i> 薪资信息</h4>
                <el-descriptions :column="2">
                  <el-descriptions-item label="基本工资">{{ currentEmployee.sal ? `¥${currentEmployee.sal.toLocaleString()}` : '-' }}</el-descriptions-item>
                  <el-descriptions-item label="奖金">{{ currentEmployee.comm ? `¥${currentEmployee.comm.toLocaleString()}` : '-' }}</el-descriptions-item>
                  <el-descriptions-item label="部门位置">{{ currentEmployee.department?.loc || '-' }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="seeMessageUp = false" round>关闭</el-button>
            </div>
          </template>
        </el-dialog>


        <!--修改员工发弹窗-->
        <el-dialog v-model="updateEmpUp" title="修改员工信息" width="600" center>
          <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 20px 0;">
          <el-form :model="form" style="margin-top: 20px" label-width="80px">
            <el-form-item label="员工姓名"><el-input type="text" style="width: 100%;" v-model="form.ename" auto-complete="off" placeholder="员工姓名"/></el-form-item>
            <el-form-item label="工作职位"><el-input type="text" style="width: 100%;" v-model="form.job" auto-complete="off" placeholder="职位"/></el-form-item>
            <el-form-item label="入职时间"><el-date-picker v-model="form.hiredate" type="datetime" placeholder="入职时间" style="width: 100%"/></el-form-item>
            <el-form-item label="工资"><el-input-number  style="width: 100%;" :controls="false" v-model="form.sal" auto-complete="off" placeholder="工资"  :min="0"/></el-form-item>
            <el-form-item label="奖金"><el-input-number  style="width: 100%;" :controls="false" v-model="form.comm" auto-complete="off" placeholder="奖金" :min="0"/></el-form-item>
            <el-form-item label="部门"><el-select style="width: 100%" auto-complete="off" v-model="form.department.deptno" placeholder="请选择"><el-option label="请选择" :value="0"/><el-option v-for="dep in depS" :key="dep.deptno" :value="dep.deptno" :label="dep.dname"/></el-select></el-form-item>
            <el-form-item label="员工头像">
              <el-upload
                  class="avatar-uploader"
                  style="border: 1px dashed #d9d9d9;"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleFileChange">
                <img v-if="previewUrl" :src="previewUrl" class="avatar" />
                <img v-else-if="form.avatarURL" :src="form.avatarURL" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-form>

          <template #footer >
            <div class="dialog-footer">
              <el-button @click="updateEmpUp = false">取消</el-button>
              <el-button type="primary" @click="updateEmp">修改</el-button>
            </div>
          </template>
        </el-dialog>


        <!--单个删除弹框-->
        <el-dialog v-model="deleteEmpUp" :modal="true" width="300" title='确定删除么????'>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="deleteEmpUp = false">取消</el-button>
              <el-button type="primary" @click="deleteEmpS">
                确认
              </el-button>
            </div>
          </template>
        </el-dialog>


        <!--批量删除弹框-->
        <el-dialog v-model="deleteEmpSUp" :modal="true" width="300">
          <span>确认全部删除么？</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="deleteEmpSUp = false">取消</el-button>
              <el-button type="primary" @click="deleteEmpS">
                确认
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>

      <!--表格数据-->
      <div class="table_message">
        <el-table :data="emp" border style="" empty-text="空空如也⭐"  @selection-change="selectionchange" >
          <el-table-column type="selection" align="center" width="55" v-model="delIds"/>
          <el-table-column prop="empno" align="center"  label="ID" width="180" />
          <el-table-column prop="ename" align="center"  label="姓名" width="180" />
          <el-table-column prop="avatarURL" label="image" width="90px" align="center">
            <template #default="scope">
            <el-image :src="scope.row.avatarURL" style="width: 65px;"/>
            </template>
          </el-table-column>
          <el-table-column prop="job" align="center" label="职位" width="180" />
          <el-table-column prop="hiredate" align="center" label="入职日期" width="180" />
          <el-table-column prop="sal" align="center" label="工资" width="180">
            <template #default="scope">
              {{ scope.row.sal ? '¥' + scope.row.sal : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="comm" align="center" label="奖金" width="180" >
            <template #default="scope">
            {{ scope.row.comm ? '¥' + scope.row.comm : '-' }}
          </template></el-table-column>
          <el-table-column prop="department.dname" align="center" label="部门" width="180" />
          <el-table-column  label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" plain @click="seeMessage(scope.row.empno)"><el-icon><ElementPlus /></el-icon>查看</el-button>
              <el-button type="warning" plain @click="UpdateClick(scope.row.empno)"><Edit style="width: 1em; height: 1em; margin-right: 8px" />编辑</el-button>
              <el-button type="danger" plain @click="delEmpUp(scope.row.empno)"><Delete style="width: 1em; height: 1em; margin-right: 8px" />删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <template v-if="emp.length > 0">
            <!--分页-->
            <el-pagination background layout="prev, pager, next" :total="perCount" :page-size="PerPageMax" v-model:current-page="thisPage" @current-change="upPage()"/>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import axios from "axios";
import type {UploadFile} from "element-plus";
import {ElMessage} from "element-plus";
import moment from "moment";
import {Plus, Avatar, Search, Loading, ElementPlus, Edit, Delete, Minus, User} from "@element-plus/icons-vue";
import request from "../../utils/request";
//部门接口
interface depIn{
  deptno:number;
  dname:string;
  loc:string;
}
//多条件查询表单接口
interface obForm{
  name:string,
  job:string,
  beginData:string,
  endData:string;
  dep:number
}
//添加修改表单
interface formIn{
  empno:number;
  ename:string;
  job:string;
  hiredate:string;
  sal:number;
  comm:number;
  department:depIn;
  avatarURL:string;
}


//初始化数据
const obForm=reactive<obForm>({name:"",job:"",beginData:"",endData:"",dep:0});//多条件查询表单
const form=ref<formIn>({empno:0,ename:"",job:"",hiredate:"",sal: 0,comm:0,department:{deptno:0,dname:"",loc:""},avatarURL:""});
const emp=ref<formIn[]>([]); //员工数组
const PerPageMax=ref(5) //每页最多显示几条
const thisPage=ref(1) //当前页
const addEmpUp = ref(false) //添加弹窗
const updateEmpUp=ref(false)//修改弹窗
const deleteEmpUp = ref(false)//单个删除弹窗
const deleteEmpSUp=ref(false)//批量删除弹窗
const delIds=reactive<number[]>([]);
const perCount=ref();//总员工数
const seeMessageUp=ref(false);
const currentEmployee = ref();
const Seniority=ref<string>();


const aaa=ref();

const previewUrl = ref('') //图片地址
const selectedFile = ref<File | null>(null) //文件
// 文件选择处理
const handleFileChange = (file: UploadFile) => {
  selectedFile.value = file.raw as File
  previewUrl.value = URL.createObjectURL(file.raw as Blob)
}





//批量选中
const selectionchange=(vas:formIn[])=>{
  delIds.splice(0,delIds.length);
  vas.forEach(item=>{ delIds.push(item.empno) })
}

//获取所有部门信息
const depS=ref<depIn[]>([]);
request.get("/dep").then((res) => {
  depS.value=res.data
})

//多条件查询查询符合个数
const getEmpCriteriasCount=()=>{
  request.post("/emp/CriCou",obForm).then((res) => {
    perCount.value=res.data;
  })
}
//多条件分页查询员工
const CriteriasPage = async () => {
  try {
    const res = await request.post("/emp/Cri", obForm, {params:{page:thisPage.value,perPage:PerPageMax.value}});
    getEmpCriteriasCount();
    if (res.code==200) {
      emp.value=res.data
    } else {
      ElMessage.error(res.msg);
    }
  } catch (err) {
    ElMessage.error("获取数据失败");
    console.error(err);
  }
}

// 初始化数据
getEmpCriteriasCount()
CriteriasPage()

//查询按钮点击事件
const getEmpCriteriasPage = () => {
  thisPage.value = 1;
  CriteriasPage();
}

//查询员工个数(弃用)
function getEmpCount(){
  request.get("/emp/c").then((res) => {
    perCount.value=res;
  })
}
//分页查询(弃用)
function getPageEmp(pages:number){
  axios.get("http://localhost/emp/page?page="+pages+"&perPage="+PerPageMax.value).then((res) => {
    emp.value=res.data
  })
}


//页数的改变
const upPage=()=>{
  CriteriasPage()
}



//添加弹框按钮点击事件
const AddClick=()=>{
  previewUrl.value=""
  selectedFile.value=null
  const re=reactive<formIn>({empno:0,ename:"",job:"",hiredate:"",sal:0,comm:0,department:{deptno:0,dname:"",loc:""},avatarURL:''});
  Object.assign(form.value,re) //初始化数组
  addEmpUp.value=true
}
//添加员工
const addEmp = async () => {
  //判断表单名称是否为空
  if (form.value.ename==null||form.value.ename===''){
    ElMessage.warning("员工姓名不能为空")
    return
  }
  //判断部门编号是否为空
  if (form.value.department.deptno===0){
    ElMessage.warning("部门不能为空")
    return
  }
  try {
    const formData=new FormData()
    formData.append("employee",JSON.stringify(form.value)) //创建请求体
    formData.append("file",selectedFile.value || '')
    const res = await request.post("/emp",formData);
    if (res.code==200) {
      ElMessage.success(res.msg)
      //查询总人数
      request.post("/emp/CriCou",obForm).then((res) => {
        perCount.value=res.data; //将结果赋值给总人数
        if (thisPage.value==Math.ceil(perCount.value/PerPageMax.value)){ //如果相同页则自动查询该信最新数据 不相同会执行upPage函数
          CriteriasPage()
        }else {
          thisPage.value = Math.ceil(perCount.value/PerPageMax.value)//向上取正计算页
          CriteriasPage()
        }
        addEmpUp.value = false
      })
    }else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    ElMessage.error("添加员工失败");
    console.error(error);
  }
}
//查看员工信息(根据员工编号查询员工)
const seeMessage = (id: number) => {
  request.get(`/emp/${id}`).then((res) => {
    currentEmployee.value = res.data;
    //判断日期是否为空
    const hireDateStr = currentEmployee.value.hiredate;
    if (!hireDateStr) {
      Seniority.value = "无入职日期";
      return;
    }
    //处理日期-1
    const [year, month, day] = hireDateStr.split('-').map(Number);
    const jobHireDate = new Date(year, month - 1, day);
    const today = new Date();
    //计算工龄(年+月)
    let years = today.getFullYear() - jobHireDate.getFullYear();
    let months = today.getMonth() - jobHireDate.getMonth();
    //处理负数月份
    if (months < 0) {
      years--;
      months += 12;
    }
    // 拼接输出
    Seniority.value = `${years > 0 ? years + '年' : ''}${months > 0 ? months + '个月' : ''}`;
    seeMessageUp.value = true;
  }).catch(error => {
    ElMessage.error(error.data.msg);
  });
};




//删除员工信息
const delEmpUp=(id:number)=>{ //单个删除删除警告弹窗
  if (id){ //不为空
    delIds.splice(id,delIds.length)
    delIds.push(id)
    aaa.value=id
    deleteEmpUp.value=true
  }else {
    ElMessage.warning("无该员工信息,请刷新后重试")
  }
}
//时间格式化
watch(()=>form.value.hiredate,(newValue)=>{
  form.value.hiredate = moment(newValue).format('YYYY-MM-DD HH:mm:ss');
})


//批量删除员工信息
const deleteEmpS=()=>{
  request.delete("/emp",{data:delIds}).then((res) => {
    if (res.code==200) {
      ElMessage.success(res.msg)
    //查询总人数
    request.post("/emp/CriCou",obForm).then((res) => {
      perCount.value=res.data;
      CriteriasPage()
      deleteEmpUp.value=false
      deleteEmpSUp.value=false
      delIds.splice(0,delIds.length)
    })
    }else {
      ElMessage.error(res.data.msg)
    }
  }).catch(error => {
    ElMessage.error(error.data.msg);
  })
}



//修改员工按钮点击事件
const UpdateClick=(empId:number)=>{
  previewUrl.value='';
  selectedFile.value=null;
  request.get("/emp/"+empId).then((res) => {
    // Object.assign(form,res.data.data);
    form.value=res.data;
  })
  updateEmpUp.value=true
}
// 修改用户信息
const updateEmp = async () => {
    request.put(`/emp/${form.value.empno}`,form.value).then((res) => {

      if (selectedFile.value){
        let formData = new FormData();
        formData.append('file',selectedFile.value);
        formData.append('id',String(form.value.empno));
        axios.post("http://localhost/emp/upImg",formData,{headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
          CriteriasPage()
        })
      }
      if (res.code==200) {
        ElMessage.success(res.msg)
        CriteriasPage()
        updateEmpUp.value=false
      }else {
        console.log(res)
        ElMessage.error(res.msg)
      }
    }).catch(error => {
      ElMessage.error("修改员工信息失败");
      console.error(error);
    })

}



//多条件查询员工姓名输入框模糊查询
interface RestaurantItem {
  ename: string
}
const querySearch = (value: string,cd:any) => {
  request.get("http://localhost/emp/ObscureName?name="+obForm.name).then((res) => {
    console.log(res)
    const results = res.data.map((item: RestaurantItem) => ({ value: item.ename }));
    cd(results);
  })
}



//查询全部(弃用)
const getEmp=()=>{
  axios.get("http://localhost/emp").then((res) => {
    emp.value.length=0
    Object.assign(emp, res.data);
  })
}





const thisTime=ref('');

//初始化请求现在时间
setInterval(()=>{
  axios.get("http://localhost/getTime").then((res) => {
    if (res.data.length>0) {
      thisTime.value=res.data;
    }else {
      thisTime.value=String(new Date());
    }
  })
},1000)

</script>

<style scoped>
.main-content {
  padding: 20px;
}

.top-navbar {
  background-color: white;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  font-size: 24px;
  color: var(--el-color-primary);
  margin-right: 10px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.time-display {
  margin-right: 20px;
  color: #64748b;
  font-size: 14px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f8fafc;
}

.user-dropdown span {
  margin-left: 8px;
  color: #334155;
}

/* 搜索表单样式 */
.search-form-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #334155;
  font-size: 16px;
  font-weight: 600;
}

.search-form-title .el-icon {
  margin-right: 8px;
  font-size: 18px;
  color: var(--el-color-primary);
}

.search-form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.form-item {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.form-item span, .form-item-date span {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-item-date {
  display: flex;
  flex-direction: column;
  min-width: 440px;
}

.date-range {
  display: flex;
  align-items: center;
}

.date-separator {
  margin: 0 10px;
  color: #64748b;
}

.search-button {
  height: 40px;
  margin-left: auto;
}

/* 表格标题样式 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.table-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

.table-title .el-icon {
  font-size: 20px;
  margin-right: 8px;
  color: var(--el-color-primary);
}

.table-actions {
  display: flex;
  gap: 10px;
}

/* 分页容器样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 美化按钮图标 */
.el-button .el-icon {
  margin-right: 5px;
}

/* 表格行悬停效果 */
.el-table__row {
  transition: all 0.2s ease;
}

/* 弹窗动画 */
.el-dialog__wrapper {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#form span{
  margin: 0 5px 0 20px;

}
.fa{
  background-color: #f5f6f9;
  height: 800px;
  padding: 0;
}
.obform{
  background-color: white;
  border-radius: 5px;
  align-content: center;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
.table-emp{
  background-color: white;
  align-content: center;
  border-radius: 7px;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
.table_message{
  background-color: white;
  border-radius: 7px;
  padding-top: 30px;
  height: 100%;
  background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  padding: 20px;
}

.employee-detail-modal {
  border-radius: 12px;
  overflow: hidden;
}

.employee-detail-modal :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #409EFF, #337ecc);
  margin: 0;
  padding: 16px 20px;
}

.employee-detail-modal :deep(.el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.employee-detail-modal :deep(.el-dialog__headerbtn) {
  top: 16px;
}

.employee-detail-modal :deep(.el-dialog__headerbtn .el-icon) {
  color: white;
}

.employee-card {
  padding: 0 20px;
}

.employee-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.employee-title h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #303133;
}

.employee-title :deep(.el-tag) {
  font-size: 14px;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409EFF;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.employee-details :deep(.el-descriptions) {
  margin-left: 28px;
}

.employee-details :deep(.el-descriptions__label) {
  width: 100px;
  color: #909399;
  font-weight: normal;
}

.employee-details :deep(.el-descriptions__content) {
  color: #606266;
}

.dialog-footer {
  text-align: center;
  padding: 10px 0 20px;
}

.dialog-footer .el-button {
  width: 120px;
  height: 40px;
  font-size: 14px;
}

.el-divider {
  margin: 16px 0;
}



.avatar-uploader .el-upload {
  border:1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: contain;
}

/* 加载动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  background-color: white;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 0.5s ease-in-out infinite alternate;
}

.loading-spinner .el-icon {
  font-size: 40px;
  color: var(--el-color-primary);
  margin-bottom: 10px;
}

@keyframes bounce {
  from {
    transform: translateY(-5px);
  }
  to {
    transform: translateY(5px);
  }
}

/* 添加表格行动画效果 */
.el-table .el-table__row {
  transition: transform 0.3s, box-shadow 0.3s;
}

.el-table .el-table__row:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  z-index: 1;
  position: relative;
}

/* 添加按钮点击效果 */
.el-button:active {
  transform: scale(0.95);
}
</style>
