<template>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>{{ $t('add_transaction') }}</template>
      <UForm :state="formData" :validate="formValidate" ref="form" @submit.prevent="saveForm">
        <!-- 交易類型 -->
        <UFormGroup :required="true" :key="$t('transaction_type')" name="type" class="mb-4">
          <USelectMenu
            :placeholder="$t('transaction_type_msg')"
            :options="types"
            v-model="formData.type"
          >
            <!-- <template #label>{{ $t(formData.type?.label) || '' }}</template> -->
            <!-- <template #option="{ option }">
              <span>{{ $t(option?.label) }}</span>
            </template> -->
          </USelectMenu>
        </UFormGroup>

        <!-- 金額 -->
        <UFormGroup :label="$t('amount')" :required="true" name="amount" class="mb-4">
          <UInput type="number" :placeholder="$t('amount')" v-model.number="formData.amount" />
        </UFormGroup>

        <!-- 交易日期 -->
        <UFormGroup :label="$t('transaction_date')" :required="true" name="created_at" class="mb-4">
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="formData.created_at"
          />
        </UFormGroup>

        <!-- 描述 -->
        <UFormGroup
          :label="$t('description')"
          :hint="$t('optional')"
          name="description"
          class="mb-4"
        >
          <UInput :placeholder="$t('description')" v-model="formData.description" />
        </UFormGroup>

        <!-- 花費分類 -->
        <UFormGroup
          :required="true"
          :label="$t('category')"
          name="category"
          class="mb-4"
          v-if="formData.type === 'Expense'"
        >
          <USelect
            :placeholder="$t('category')"
            :options="categories"
            v-model="formData.category"
          />
        </UFormGroup>

        <!-- 儲存按鈕 -->
        <UButton
          type="submit"
          color="black"
          variant="solid"
          :label="$t('save')"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, types } from '~/constants.js'

const { t } = useI18n()

const props = defineProps({
  // 彈窗開關
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

// 表單初始化資訊
const defaultFormData = {
  // 類型
  type: undefined,
  // 金額
  amount: 0,
  // 建立日期
  created_at: undefined,
  // 敘述
  description: undefined,
  // 分類
  category: undefined
}

// 表單資訊
const formData = ref({ ...defaultFormData })
// 表單元素
const form = ref()
// 加載狀態
const isLoading = ref(false)
// 引用 supabase
const supabase = useSupabaseClient()
// 引用彈窗
const toast = useToast()

// 彈窗開關：父子同步 v-model 綁定
const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm()
    emit('update:modelValue', value)
  }
})

/**
 * 驗證資訊
 */
const formValidate = (state) => {
  const { type, amount, created_at, category } = state
  const created_at_year = new Date(created_at).getFullYear()
  const errors = []
  // 類型：必填
  if (!type) errors.push({ path: 'type', message: t('required') })
  // 分類：必填
  if (!category) errors.push({ path: 'category', message: t('required') })
  // 建立日期：必填
  if (!created_at) errors.push({ path: 'created_at', message: t('required') })
  // 建立日期：年份防呆機制
  if (!isValidYear(created_at_year))
    errors.push({ path: 'created_at', message: t('created_at_validate_msg') })
  // 金額：必填且必須 > 0
  if (amount <= 0) errors.push({ path: 'amount', message: t('amount_validate_msg') })
  return errors
}

/**
 * 驗證年份是否正確：預設最小年份為 1900 年
 */
const isValidYear = (year, minYear = 1900) => year >= minYear

/**
 * 表單送出
 */
const saveForm = async () => {
  if (form.value.errors.length) return
  isLoading.value = true
  // 存到 supabase
  try {
    const { error } = await supabase.from('transactions').upsert({ ...state.value })
    if (!error) {
      toast.add({
        title: t('saved_msg_success'),
        icon: 'i-heroicons-check-circle'
      })
      isOpen.value = false
      emit('saved')
      return
    }
    //
    throw error
  } catch (e) {
    toast.add({
      title: t('saved_msg_unsuccess'),
      description: e.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

/**
 * 表單重置
 */
const resetForm = () => {
  Object.assign(formData.value, defaultFormData)
  // 清除表單驗證資訊
  // form.value.clear()
}

async function onError(event) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
