<script lang="ts" setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { store } from '@/routes/salary-tds';

const visible = ref(false);

const form = useForm({
    date: null as Date | null,
    amount: null as number | null,
});

const open = () => {
    form.reset();
    form.clearErrors();
    visible.value = true;
};

const close = () => {
    if (form.processing) {
        return;
    }

    visible.value = false;
};

const submit = () => {
    if (!form.date || form.amount === null) {
        return;
    }

    const year = form.date.getFullYear();
    const month = String(form.date.getMonth() + 1).padStart(2, '0');

    form.transform(() => ({
        date: `${year}-${month}-01`,
        amount: form.amount,
    })).post(store.url(), {
        preserveScroll: true,
        onSuccess: () => {
            visible.value = false;
            form.reset();
        },
    });
};

defineExpose({
    open,
});
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Create Salary TDS Record"
        :style="{ width: '28rem' }"
        :closable="!form.processing"
        :closeOnEscape="!form.processing"
    >
        <div class="flex flex-col gap-5">
            <!-- Month -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"> Month </label>

                <DatePicker
                    v-model="form.date"
                    view="month"
                    dateFormat="M-yy"
                    placeholder="Select month"
                    class="w-full"
                    :maxDate="new Date()"
                    :disabled="form.processing"
                    size="small"
                    showButtonBar
                />

                <small v-if="form.errors.date" class="text-red-500">
                    {{ form.errors.date }}
                </small>
            </div>

            <!-- Amount -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">
                    TDS Amount
                </label>

                <InputNumber
                    v-model="form.amount"
                    mode="decimal"
                    :min="0"
                    :minFractionDigits="2"
                    :maxFractionDigits="2"
                    placeholder="Enter TDS amount"
                    class="w-full"
                    inputClass="w-full"
                    :disabled="form.processing"
                    size="small"
                    locale="en-IN"
                    suffix=" BDT"
                />

                <small v-if="form.errors.amount" class="text-red-500">
                    {{ form.errors.amount }}
                </small>
            </div>

            <Message v-if="form.hasErrors" severity="error" :closable="false">
                Please correct the errors above.
            </Message>
        </div>

        <template #footer>
            <Button
                label="Cancel"
                severity="secondary"
                variant="text"
                size="small"
                :disabled="form.processing"
                @click="close"
            />

            <Button
                label="Create"
                icon="pi pi-check"
                size="small"
                :loading="form.processing"
                @click="submit"
            />
        </template>
    </Dialog>
</template>
