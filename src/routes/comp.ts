const LAYOUT = () => import('@/layout/index.vue')
const comp = {
  path: '/comp',
  name: '组件',
  component: LAYOUT,
  redirect: '/comp/basic',
  meta: {
    orderNo: 30,
    icon: 'ion:layers-outline',
    title: '组件'
  },

  children: [
    {
      path: 'form',
      name: '表单',
      redirect: '/comp/form/basic',
      component: null,
      meta: {
        // icon: 'mdi:form-select',
        title: '表单组件'
      },
      children: [
        {
          path: '/comp/form/basic',
          name: 'FormBasicDemo',
          component: () => import('@views/form/index.vue'),
          meta: {
            title: '基础表单'
          }
        },
        {
          path: '/comp/form/useForm',
          name: 'UseFormDemo',
          component: () => import('@views/form/UseForm.vue'),
          meta: {
            title: 'useForm'
          }
        },
        {
          path: '/comp/form/refForm',
          name: 'RefFormDemo',
          component: () => import('@views/form/RefForm.vue'),
          meta: {
            title: 'refForm'
          }
        },
        {
          path: '/comp/form/advancedForm',
          name: 'AdvancedFormDemo',
          component: () => import('@views/form/AdvancedForm.vue'),
          meta: {
            title: '可收缩表单'
          }
        },
        {
          path: '/comp/form/ruleForm',
          name: 'RuleFormDemo',
          component: () => import('@views/form/RuleForm.vue'),
          meta: {
            title: '表单验证'
          }
        },
        {
          path: '/comp/form/dynamicForm',
          name: 'DynamicFormDemo',
          component: () => import('@views/form/DynamicForm.vue'),
          meta: {
            title: '动态表单'
          }
        },
        {
          path: '/comp/form/customerForm',
          name: 'CustomerFormDemo',
          component: () => import('@views/form/CustomerForm.vue'),
          meta: {
            title: '自定义组件表单'
          }
        },
        {
          path: '/comp/form/appendForm',
          name: 'appendFormDemo',
          component: () => import('@views/form/AppendForm.vue'),
          meta: {
            title: '表单删减'
          }
        },
        {
          path: '/comp/form/tabsForm',
          name: 'tabsFormDemo',
          component: () => import('@views/form/TabsForm.vue'),
          meta: {
            title: '多标签+多级field表单'
          }
        }
      ]
    },
    {
      path: 'table',
      name: 'TableDemo',
      redirect: '/comp/table/basic',
      component: null,
      meta: {
        // icon: 'carbon:table-split',
        title: '表格组件'
      },

      children: [
        {
          path: '/comp/table/basic',
          name: 'TableBasicDemo',
          component: () => import('@views/table/Basic.vue'),
          meta: {
            title: '基础表格'
          }
        },
        {
          path: 'treeTable',
          name: 'TreeTableDemo',
          component: () => import('@views/table/TreeTable.vue'),
          meta: {
            title: '树形表格'
          }
        },
        {
          path: 'fetchTable',
          name: 'FetchTableDemo',
          component: () => import('@views/table/FetchTable.vue'),
          meta: {
            title: '远程加载表格'
          }
        },
        {
          path: 'fixedColumn',
          name: 'FixedColumnDemo',
          component: () => import('@views/table/FixedColumn.vue'),
          meta: {
            title: '固定列'
          }
        },
        {
          path: 'customerCell',
          name: 'CustomerCellDemo',
          component: () => import('@views/table/CustomerCell.vue'),
          meta: {
            title: '自定义列'
          }
        },
        {
          path: 'formTable',
          name: 'FormTableDemo',
          component: () => import('@views/table/FormTable.vue'),
          meta: {
            title: '开启搜索区域'
          }
        },
        {
          path: 'useTable',
          name: 'UseTableDemo',
          component: () => import('@views/table/UseTable.vue'),
          meta: {
            title: 'useTable'
          }
        },
        {
          path: 'refTable',
          name: 'RefTableDemo',
          component: () => import('@views/table/RefTable.vue'),
          meta: {
            title: 'refTable'
          }
        },
        {
          path: 'multipleHeader',
          name: 'MultipleHeaderDemo',
          component: () => import('@views/table/MultipleHeader.vue'),
          meta: {
            title: '多级表头'
          }
        },
        {
          path: 'mergeHeader',
          name: 'MergeHeaderDemo',
          component: () => import('@views/table/MergeHeader.vue'),
          meta: {
            title: '合并单元格'
          }
        },
        {
          path: 'expandTable',
          name: 'ExpandTableDemo',
          component: () => import('@views/table/ExpandTable.vue'),
          meta: {
            title: '可展开表格'
          }
        },
        {
          path: 'fixedHeight',
          name: 'FixedHeightDemo',
          component: () => import('@views/table/FixedHeight.vue'),
          meta: {
            title: '固定高度、表头自定义表格'
          }
        },
        {
          path: 'footerTable',
          name: 'FooterTableDemo',
          component: () => import('@views/table/FooterTable.vue'),
          meta: {
            title: '表尾合计'
          }
        },
        //     {
        //       path: 'editCellTable',
        //       name: 'EditCellTableDemo',
        //       component: () => import('@views/table/EditCellTable.vue'),
        //       meta: {
        //         title: '可编辑单元格'
        //       }
        //     },
        //     {
        //       path: 'editRowTable',
        //       name: 'EditRowTableDemo',
        //       component: () => import('@views/table/EditRowTable.vue'),
        //       meta: {
        //         title: '可编辑行'
        //       }
        //     },
        //     {
        //       path: 'authColumn',
        //       name: 'AuthColumnDemo',
        //       component: () => import('@views/table/AuthColumn.vue'),
        //       meta: {
        //         title: '权限列'
        //       }
        //     },
        {
          path: 'resizeParentHeightTable',
          name: 'ResizeParentHeightTable',
          component: () => import('@views/table/ResizeParentHeightTable.vue'),
          meta: {
            title: '继承父级高度'
          }
        }
      ]
    }
  ]
}

export default comp
