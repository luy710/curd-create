import type { FormProps, FormActionType, FormSchema, UseFormReturnType } from '../types/form'
import type { FormItemProp } from 'element-plus'
import { DynamicProps } from '#/utils.d'
import { getDynamicProps } from '@/components/utils'

export declare type ValidateFields = (nameList?: FormItemProp) => Promise<Recordable>

type Props = Partial<DynamicProps<FormProps>>

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  async function getForm() {
    const form = unref(formRef)
    if (!form) {
      throw new Error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
      )
    }
    await nextTick()
    return form as FormActionType
  }

  function register(instance: FormActionType) {
    onUnmounted(() => {
      formRef.value = null
      loadedRef.value = null
    })
    if (unref(loadedRef) && instance === unref(formRef)) return

    formRef.value = instance
    loadedRef.value = true

    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props))
      },
      {
        immediate: true,
        deep: true
      }
    )
  }

  const methods: FormActionType = {
    scrollToField: async (name: FormItemProp) => {
      const form = await getForm()
      form.scrollToField(name)
    },
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm()
      form.setProps(formProps)
    },

    updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm()
      form.updateSchema(data)
    },

    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm()
      form.resetSchema(data)
    },

    clearValidate: async (name?: string | string[]) => {
      const form = await getForm()
      form.clearValidate(name)
    },

    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields()
      })
    },

    removeSchemaByFiled: async (field: string | string[]) => {
      unref(formRef)?.removeSchemaByFiled(field)
    },

    // TODO promisify
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T
    },

    setFieldsValue: async <T>(values: T) => {
      const form = await getForm()
      form.setFieldsValue<T>(values)
    },

    appendSchemaByField: async (schema: FormSchema, prefixField: string | undefined, first?: boolean) => {
      const form = await getForm()
      form.appendSchemaByField(schema, prefixField, first)
    },

    submit: async (): Promise<any> => {
      const form = await getForm()
      return form.submit()
    },

    validate: async (): Promise<Recordable> => {
      const form = await getForm()
      return form.validate()
    },

    validateField: async (nameList?: FormItemProp): Promise<Recordable> => {
      const form = await getForm()
      return form.validateField(nameList)
    }
  }

  return [register, methods]
}
