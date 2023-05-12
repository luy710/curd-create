// import { computed, unref, ref, ComputedRef, watch } from 'vue';
import type { ComputedRef } from 'vue'
import type { PaginationProps } from 'element-plus'
import type { BasicTableProps } from '../types/table'
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../constant'
import { isBoolean } from '@/components/utils/is'

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<Partial<PaginationProps>>({})
  const show = ref(true)

  watch(
    () => unref(refProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...(pagination ?? {}),
        }
      }
    },
  )

  const getPaginationInfo = computed((): Partial<PaginationProps> | boolean => {
    const { pagination } = unref(refProps)

    if (!unref(show) || (isBoolean(pagination) && !pagination))
      return false

    return {
      currentPage: 1,
      pageSize: PAGE_SIZE,
      small: true,
      total: 0,
      defaultPageSize: PAGE_SIZE,
      pageSizes: PAGE_SIZE_OPTIONS,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    }
  })

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo)
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    }
  }

  function getPagination() {
    return unref(getPaginationInfo)
  }

  function getShowPagination() {
    return unref(show)
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag
  }

  return { getPagination, getPaginationInfo, setShowPagination, getShowPagination, setPagination }
}
