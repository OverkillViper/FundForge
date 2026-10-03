<script setup lang="ts">
import { computed } from 'vue';
import DatePicker from 'primevue/datepicker';

const props = withDefaults(
    defineProps<{
        modelValue?: string | null;
        placeholder?: string;
        dateFormat?: string;
    }>(),
    {
        modelValue: null,
        placeholder: '29-Aug-2025',
        dateFormat: 'dd-M-yy',
    },
);

// Accept Date | string | null to satisfy PrimeVue's internal handler typing
const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void;
}>();

const dateValue = computed(() => {
    if (!props.modelValue) return null;
    const [year, month, day] = props.modelValue.split('-').map(Number);
    return new Date(year, month - 1, day);
});

// Update type signature to include Date, null, undefined, or array
function onDateSelect(val: unknown) {
    if (!val || !(val instanceof Date)) {
        emit('update:modelValue', null);
        return;
    }

    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');

    emit('update:modelValue', `${year}-${month}-${day}`);
}
</script>

<template>
    <DatePicker
        :modelValue="dateValue"
        @update:modelValue="onDateSelect"
        :dateFormat="dateFormat"
        :placeholder="placeholder"
        v-bind="$attrs"
    />
</template>
