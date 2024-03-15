import {createRouter, createWebHistory} from 'vue-router'
import Login from "../views/Login.vue"
import MainView from "../views/MainView";
import AllUsers from "@/components/AllUsers";
import Companies from "@/components/Companies";
import DelegationRecord from "@/components/DelegationRecord";
import EquipmentInfos from "@/components/EquipmentInfos";
import EquipmentLends from "@/components/EquipmentLends";
import Experiments from "@/components/Experiments";
import MyEquipments from "@/components/MyEquipments";
import MyProjects from "@/components/MyProjects";
import ProjectAllocate from "@/components/ProjectAllocate";
import ProjectDetails from "@/components/ProjectDetails";
import RegistVerify from "@/components/RegistVerify";
import SampleList from "@/components/SampleList";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Login
    },
    {
        path: '/mainView',
        component: MainView,
        redirect:'/mainView/allUsers',
        children: [
            {
                path: '/mainView/allUsers',
                name: '详细信息',
                component: AllUsers
            },
            {
                path: '/mainView/companies',
                name: '委托单位',
                component: Companies
            },
            {
                path: '/mainView/delegationRecord',
                name: '委托登记',
                component: DelegationRecord
            },
            {
                path: '/mainView/equipmentInfos',
                name: '设备信息',
                component: EquipmentInfos
            },
            {
                path: '/mainView/equipmentLends',
                name: '设备借出',
                component: EquipmentLends
            },
            {
                path: '/mainView/experiments',
                name: '数据录入',
                component: Experiments
            },
            {
                path: '/mainView/myEquipments',
                name: '实验设备',
                component: MyEquipments
            },
            {
                path: '/mainView/myProjects',
                name: '我的项目',
                component: MyProjects
            },
            {
                path: '/mainView/projectAllocate',
                name: '项目分配',
                component: ProjectAllocate
            },
            {
                path: '/mainView/projectDetails',
                name: '项目详情',
                component: ProjectDetails
            },
            {
                path: '/mainView/registVerify',
                name: '注册审核',
                component: RegistVerify
            },
            {
                path: '/mainView/sampleList',
                name: '样本清单',
                component: SampleList
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
