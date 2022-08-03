const LAYOUT = () => import('@/layout/index.vue')
const comp = {
  path: '/comp',
  name: '组件',
  component: LAYOUT,
  redirect: '/comp/basic',
  meta: {
    orderNo: 30,
    icon: 'ion:layers-outline',
    title: 'routes.demo.comp.comp'
  },

  children: [
    {
      path: 'form',
      name: '表单',
      redirect: '/comp/form/basic',
      component: null,
      meta: {
        // icon: 'mdi:form-select',
        title: 'routes.demo.form.form'
      },
      children: [
        {
          path: '/comp/form/basic',
          name: 'FormBasicDemo',
          component: () => import('@views/form/index.vue'),
          meta: {
            title: 'routes.demo.form.basic'
          }
        },
        {
          path: '/comp/form/useForm',
          name: 'UseFormDemo',
          component: () => import('@views/form/UseForm.vue'),
          meta: {
            title: 'routes.demo.form.useForm'
          }
        },
        {
          path: '/comp/form/refForm',
          name: 'RefFormDemo',
          component: () => import('@views/form/RefForm.vue'),
          meta: {
            title: 'routes.demo.form.refForm'
          }
        },
        {
          path: '/comp/form/advancedForm',
          name: 'AdvancedFormDemo',
          component: () => import('@views/form/AdvancedForm.vue'),
          meta: {
            title: 'routes.demo.form.advancedForm'
          }
        },
        {
          path: '/comp/form/ruleForm',
          name: 'RuleFormDemo',
          component: () => import('@views/form/RuleForm.vue'),
          meta: {
            title: 'routes.demo.form.ruleForm'
          }
        },
        {
          path: '/comp/form/dynamicForm',
          name: 'DynamicFormDemo',
          component: () => import('@views/form/DynamicForm.vue'),
          meta: {
            title: 'routes.demo.form.dynamicForm'
          }
        },
        {
          path: '/comp/form/customerForm',
          name: 'CustomerFormDemo',
          component: () => import('@views/form/CustomerForm.vue'),
          meta: {
            title: 'routes.demo.form.customerForm'
          }
        },
        {
          path: '/comp/form/appendForm',
          name: 'appendFormDemo',
          component: () => import('@views/form/AppendForm.vue'),
          meta: {
            title: 'routes.demo.form.appendForm'
          }
        },
        {
          path: '/comp/form/tabsForm',
          name: 'tabsFormDemo',
          component: () => import('@views/form/TabsForm.vue'),
          meta: {
            title: 'routes.demo.form.tabsForm'
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
        title: 'routes.demo.table.table'
      },

      children: [
        {
          path: '/comp/table/basic',
          name: 'TableBasicDemo',
          component: () => import('@views/table/Basic.vue'),
          meta: {
            title: 'routes.demo.table.basic'
          }
        }
        //     {
        //       path: 'treeTable',
        //       name: 'TreeTableDemo',
        //       component: () => import('@views/table/TreeTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.treeTable'
        //       }
        //     },
        //     {
        //       path: 'fetchTable',
        //       name: 'FetchTableDemo',
        //       component: () => import('@views/table/FetchTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.fetchTable'
        //       }
        //     },
        //     {
        //       path: 'fixedColumn',
        //       name: 'FixedColumnDemo',
        //       component: () => import('@views/table/FixedColumn.vue'),
        //       meta: {
        //         title: 'routes.demo.table.fixedColumn'
        //       }
        //     },
        //     {
        //       path: 'customerCell',
        //       name: 'CustomerCellDemo',
        //       component: () => import('@views/table/CustomerCell.vue'),
        //       meta: {
        //         title: 'routes.demo.table.customerCell'
        //       }
        //     },
        //     {
        //       path: 'formTable',
        //       name: 'FormTableDemo',
        //       component: () => import('@views/table/FormTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.formTable'
        //       }
        //     },
        //     {
        //       path: 'useTable',
        //       name: 'UseTableDemo',
        //       component: () => import('@views/table/UseTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.useTable'
        //       }
        //     },
        //     {
        //       path: 'refTable',
        //       name: 'RefTableDemo',
        //       component: () => import('@views/table/RefTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.refTable'
        //       }
        //     },
        //     {
        //       path: 'multipleHeader',
        //       name: 'MultipleHeaderDemo',
        //       component: () => import('@views/table/MultipleHeader.vue'),
        //       meta: {
        //         title: 'routes.demo.table.multipleHeader'
        //       }
        //     },
        //     {
        //       path: 'mergeHeader',
        //       name: 'MergeHeaderDemo',
        //       component: () => import('@views/table/MergeHeader.vue'),
        //       meta: {
        //         title: 'routes.demo.table.mergeHeader'
        //       }
        //     },
        //     {
        //       path: 'expandTable',
        //       name: 'ExpandTableDemo',
        //       component: () => import('@views/table/ExpandTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.expandTable'
        //       }
        //     },
        //     {
        //       path: 'fixedHeight',
        //       name: 'FixedHeightDemo',
        //       component: () => import('@views/table/FixedHeight.vue'),
        //       meta: {
        //         title: 'routes.demo.table.fixedHeight'
        //       }
        //     },
        //     {
        //       path: 'footerTable',
        //       name: 'FooterTableDemo',
        //       component: () => import('@views/table/FooterTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.footerTable'
        //       }
        //     },
        //     {
        //       path: 'editCellTable',
        //       name: 'EditCellTableDemo',
        //       component: () => import('@views/table/EditCellTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.editCellTable'
        //       }
        //     },
        //     {
        //       path: 'editRowTable',
        //       name: 'EditRowTableDemo',
        //       component: () => import('@views/table/EditRowTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.editRowTable'
        //       }
        //     },
        //     {
        //       path: 'authColumn',
        //       name: 'AuthColumnDemo',
        //       component: () => import('@views/table/AuthColumn.vue'),
        //       meta: {
        //         title: 'routes.demo.table.authColumn'
        //       }
        //     },
        //     {
        //       path: 'resizeParentHeightTable',
        //       name: 'ResizeParentHeightTable',
        //       component: () => import('@views/table/ResizeParentHeightTable.vue'),
        //       meta: {
        //         title: 'routes.demo.table.resizeParentHeightTable'
        //       }
        //     }
      ]
    }
  ]
}

export default comp
