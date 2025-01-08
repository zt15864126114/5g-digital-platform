import{_ as ae,r as g,k as se,c as w,b as e,w as t,d as o,e as m,F as T,g as U,f as i,m as oe,h as r,t as u,B as ne,E as re,p as E,i as q,j as de,y as ue}from"./index-BWeit-w-.js";const ie={class:"innovation-container"},pe={class:"stat-icon"},ce={class:"stat-info"},me={class:"stat-value"},_e={class:"stat-title"},fe={class:"card-header"},ve={class:"header-right"},ge={class:"dialog-footer"},ye={key:0,class:"project-details"},be={class:"milestone-section"},Ve={__name:"BusinessInnovation",setup(we){const $=g([{title:"进行中项目",value:"12",icon:"Connection",color:"#409EFF"},{title:"已完成项目",value:"25",icon:"TrendCharts",color:"#67C23A"},{title:"待审核项目",value:"5",icon:"Monitor",color:"#E6A23C"},{title:"暂停项目",value:"2",icon:"Cpu",color:"#F56C6C"}]),_=g([{id:1,name:"5G+智慧工厂解决方案创新",type:"产品创新",leader:"张明",startDate:"2024-01-15",endDate:"2024-06-30",progress:45,status:"进行中",description:"针对制造业数字化转型需求，开发基于5G网络的智慧工厂整体解决方案。",milestones:[{date:"2024-01-15",content:"项目启动",status:"完成"},{date:"2024-03-01",content:"需求分析完成",status:"完成"},{date:"2024-04-15",content:"方案设计",status:"进行中"},{date:"2024-06-30",content:"项目验收",status:"待完成"}]},{id:2,name:"边缘计算平台优化项目",type:"技术创新",leader:"李华",startDate:"2024-02-01",endDate:"2024-05-31",progress:65,status:"进行中",description:"优化现有边缘计算平台性能，提升数据处理效率和响应速度。",milestones:[{date:"2024-02-01",content:"项目启动",status:"完成"},{date:"2024-03-15",content:"性能分析",status:"完成"},{date:"2024-04-30",content:"优化实施",status:"进行中"},{date:"2024-05-31",content:"验收测试",status:"待完成"}]},{id:3,name:"网络切片管理系统革新",type:"平台创新",leader:"王芳",startDate:"2024-03-01",endDate:"2024-08-31",progress:30,status:"进行中",description:"重构网络切片管理系统，提升用户体验和管理效率。",milestones:[{date:"2024-03-01",content:"项目启动",status:"完成"},{date:"2024-04-15",content:"架构设计",status:"进行中"},{date:"2024-06-30",content:"系统开发",status:"待完成"},{date:"2024-08-31",content:"系统上线",status:"待完成"}]}]),A=[{value:"产品创新",label:"产品创新"},{value:"技术创新",label:"技术创新"},{value:"平台创新",label:"平台创新"},{value:"服务创新",label:"服务创新"},{value:"模式创新",label:"模式创新"}],y=g(!1),h=g(!1),D=g("add"),x=g(null),d=g(null),s=se({name:"",type:"",leader:"",startDate:"",endDate:"",progress:0,description:""}),M={name:[{required:!0,message:"请输入项目名称",trigger:"blur"}],type:[{required:!0,message:"请选择项目类型",trigger:"change"}],leader:[{required:!0,message:"请输入负责人姓名",trigger:"blur"}],startDate:[{required:!0,message:"请选择开始日期",trigger:"change"}],endDate:[{required:!0,message:"请选择完成日期",trigger:"change"}],description:[{required:!0,message:"请输入项目描述",trigger:"blur"}]},F=n=>({产品创新:"success",技术创新:"primary",平台创新:"warning",服务创新:"info",模式创新:""})[n]||"",z=n=>({进行中:"primary",已完成:"success",待审核:"warning",已暂停:"info"})[n]||"",I=n=>n>=100?"success":n>=80?"warning":"",R=()=>{D.value="add",y.value=!0,Object.keys(s).forEach(n=>{s[n]=""}),s.progress=0},G=n=>{D.value="edit",y.value=!0,Object.assign(s,n)},O=n=>{d.value=n,h.value=!0},L=n=>{re.confirm("确认删除该项目？","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{const l=_.value.findIndex(f=>f.id===n.id);l>-1&&(_.value.splice(l,1),E.success("删除成功"))}).catch(()=>{})},H=async()=>{x.value&&await x.value.validate(n=>{if(n){const l={id:_.value.length+1,status:"进行中",...s,milestones:[{date:s.startDate,content:"项目启动",status:"完成"},{date:s.endDate,content:"项目验收",status:"待完成"}]};if(D.value==="add")_.value.unshift(l),E.success("添加成功");else{const f=_.value.findIndex(k=>k.id===l.id);f>-1&&(_.value[f]=l,E.success("更新成功"))}y.value=!1}})};return(n,l)=>{const f=o("el-icon"),k=o("el-card"),j=o("el-col"),P=o("el-row"),b=o("el-button"),p=o("el-table-column"),C=o("el-tag"),N=o("el-progress"),J=o("el-table"),B=o("el-input"),v=o("el-form-item"),K=o("el-option"),Q=o("el-select"),S=o("el-date-picker"),W=o("el-slider"),X=o("el-form"),Y=o("el-dialog"),c=o("el-descriptions-item"),Z=o("el-descriptions"),ee=o("el-timeline-item"),te=o("el-timeline"),le=o("el-drawer");return m(),w("div",ie,[e(P,{gutter:20},{default:t(()=>[(m(!0),w(T,null,U($.value,(a,V)=>(m(),q(j,{span:6,key:V},{default:t(()=>[e(k,{class:"stat-card","body-style":{padding:"20px"}},{default:t(()=>[i("div",pe,[e(f,{size:24,color:a.color},{default:t(()=>[(m(),q(de(a.icon)))]),_:2},1032,["color"])]),i("div",ce,[i("div",me,u(a.value),1),i("div",_e,u(a.title),1)])]),_:2},1024)]),_:2},1024))),128))]),_:1}),e(k,{class:"project-card"},{header:t(()=>[i("div",fe,[l[11]||(l[11]=i("div",{class:"header-left"},[i("span",{class:"title"},"创新项目管理")],-1)),i("div",ve,[e(b,{type:"primary",onClick:R},{default:t(()=>[e(f,null,{default:t(()=>[e(oe(ue))]),_:1}),l[10]||(l[10]=r("新建项目 "))]),_:1})])])]),default:t(()=>[e(J,{data:_.value,style:{width:"100%"},border:"",stripe:""},{default:t(()=>[e(p,{prop:"name",label:"项目名称","min-width":"180","show-overflow-tooltip":""}),e(p,{prop:"type",label:"项目类型",width:"120"},{default:t(({row:a})=>[e(C,{type:F(a.type)},{default:t(()=>[r(u(a.type),1)]),_:2},1032,["type"])]),_:1}),e(p,{prop:"leader",label:"负责人",width:"100"}),e(p,{prop:"startDate",label:"开始日期",width:"120"}),e(p,{prop:"endDate",label:"计划完成",width:"120"}),e(p,{prop:"progress",label:"进度",width:"180"},{default:t(({row:a})=>[e(N,{percentage:a.progress,status:I(a.progress)},null,8,["percentage","status"])]),_:1}),e(p,{prop:"status",label:"状态",width:"100"},{default:t(({row:a})=>[e(C,{type:z(a.status)},{default:t(()=>[r(u(a.status),1)]),_:2},1032,["type"])]),_:1}),e(p,{label:"操作",width:"200",fixed:"right"},{default:t(a=>[e(b,{size:"small",onClick:V=>G(a.row)},{default:t(()=>l[12]||(l[12]=[r("编辑")])),_:2},1032,["onClick"]),e(b,{size:"small",type:"success",onClick:V=>O(a.row)},{default:t(()=>l[13]||(l[13]=[r("详情")])),_:2},1032,["onClick"]),e(b,{size:"small",type:"danger",onClick:V=>L(a.row)},{default:t(()=>l[14]||(l[14]=[r("删除")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])]),_:1}),e(Y,{title:D.value==="add"?"新建项目":"编辑项目",modelValue:y.value,"onUpdate:modelValue":l[8]||(l[8]=a=>y.value=a),width:"600px"},{footer:t(()=>[i("span",ge,[e(b,{onClick:l[7]||(l[7]=a=>y.value=!1)},{default:t(()=>l[15]||(l[15]=[r("取消")])),_:1}),e(b,{type:"primary",onClick:H},{default:t(()=>l[16]||(l[16]=[r("确定")])),_:1})])]),default:t(()=>[e(X,{ref_key:"formRef",ref:x,model:s,rules:M,"label-width":"100px"},{default:t(()=>[e(v,{label:"项目名称",prop:"name"},{default:t(()=>[e(B,{modelValue:s.name,"onUpdate:modelValue":l[0]||(l[0]=a=>s.name=a),placeholder:"请输入项目名称"},null,8,["modelValue"])]),_:1}),e(v,{label:"项目类型",prop:"type"},{default:t(()=>[e(Q,{modelValue:s.type,"onUpdate:modelValue":l[1]||(l[1]=a=>s.type=a),placeholder:"请选择项目类型",style:{width:"100%"}},{default:t(()=>[(m(),w(T,null,U(A,a=>e(K,{key:a.value,label:a.label,value:a.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),e(v,{label:"项目负责人",prop:"leader"},{default:t(()=>[e(B,{modelValue:s.leader,"onUpdate:modelValue":l[2]||(l[2]=a=>s.leader=a),placeholder:"请输入负责人姓名"},null,8,["modelValue"])]),_:1}),e(P,{gutter:20},{default:t(()=>[e(j,{span:12},{default:t(()=>[e(v,{label:"开始日期",prop:"startDate"},{default:t(()=>[e(S,{modelValue:s.startDate,"onUpdate:modelValue":l[3]||(l[3]=a=>s.startDate=a),type:"date",placeholder:"选择开始日期",style:{width:"100%"}},null,8,["modelValue"])]),_:1})]),_:1}),e(j,{span:12},{default:t(()=>[e(v,{label:"计划完成",prop:"endDate"},{default:t(()=>[e(S,{modelValue:s.endDate,"onUpdate:modelValue":l[4]||(l[4]=a=>s.endDate=a),type:"date",placeholder:"选择完成日期",style:{width:"100%"}},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(v,{label:"项目进度",prop:"progress"},{default:t(()=>[e(W,{modelValue:s.progress,"onUpdate:modelValue":l[5]||(l[5]=a=>s.progress=a),step:5,"show-input":""},null,8,["modelValue"])]),_:1}),e(v,{label:"项目描述",prop:"description"},{default:t(()=>[e(B,{modelValue:s.description,"onUpdate:modelValue":l[6]||(l[6]=a=>s.description=a),type:"textarea",rows:4,placeholder:"请输入项目描述"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["title","modelValue"]),e(le,{modelValue:h.value,"onUpdate:modelValue":l[9]||(l[9]=a=>h.value=a),title:"项目详情",size:"50%"},{default:t(()=>[d.value?(m(),w("div",ye,[e(Z,{column:1,border:""},{default:t(()=>[e(c,{label:"项目名称"},{default:t(()=>[r(u(d.value.name),1)]),_:1}),e(c,{label:"项目类型"},{default:t(()=>[e(C,{type:F(d.value.type)},{default:t(()=>[r(u(d.value.type),1)]),_:1},8,["type"])]),_:1}),e(c,{label:"项目负责人"},{default:t(()=>[r(u(d.value.leader),1)]),_:1}),e(c,{label:"开始日期"},{default:t(()=>[r(u(d.value.startDate),1)]),_:1}),e(c,{label:"计划完成"},{default:t(()=>[r(u(d.value.endDate),1)]),_:1}),e(c,{label:"项目进度"},{default:t(()=>[e(N,{percentage:d.value.progress,status:I(d.value.progress)},null,8,["percentage","status"])]),_:1}),e(c,{label:"项目状态"},{default:t(()=>[e(C,{type:z(d.value.status)},{default:t(()=>[r(u(d.value.status),1)]),_:1},8,["type"])]),_:1}),e(c,{label:"项目描述"},{default:t(()=>[r(u(d.value.description),1)]),_:1})]),_:1}),i("div",be,[l[17]||(l[17]=i("h3",null,"项目里程碑",-1)),e(te,null,{default:t(()=>[(m(!0),w(T,null,U(d.value.milestones,(a,V)=>(m(),q(ee,{key:V,type:a.status==="完成"?"success":"primary",timestamp:a.date},{default:t(()=>[r(u(a.content),1)]),_:2},1032,["type","timestamp"]))),128))]),_:1})])])):ne("",!0)]),_:1},8,["modelValue"])])}}},ke=ae(Ve,[["__scopeId","data-v-b3f5f9cc"]]);export{ke as default};
