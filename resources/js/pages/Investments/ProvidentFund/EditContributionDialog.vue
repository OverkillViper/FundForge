<script lang="ts" setup>
import { watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import { useForm } from '@inertiajs/vue3';
import { update } from '@/routes/investments/provident-fund/contribution';

interface Contribution {
    id: number;
    amount: number;
    contribution_date: string;
}

const props = defineProps<{
    visible: boolean;
    contribution: Contribution | null;
}>();

const emit = defineEmits<{
    'update:visible': [value: boolean];
}>();

const form = useForm<{
    amount: number | null;
    contribution_date: Date | null;
}>({
    amount: null,
    contribution_date: null,
});

watch(
    () => props.contribution,
    (contribution) => {
        if (!contribution) {
            form.reset();
            return;
        }

        form.amount = Number(contribution.amount);

        // Laravel date is a date-only value.
        // Take only YYYY-MM-DD and construct a local Date.
        const [year, month, day] = contribution.contribution_date
            .substring(0, 10)
            .split('-')
            .map(Number);

        form.contribution_date = new Date(year, month - 1, day);
    },
    { immediate: true },
);

function close() {
    if (form.processing) {
        return;
    }

    emit('update:visible', false);
}

function save() {
    if (
        !props.contribution ||
        form.amount === null ||
        form.amount <= 0 ||
        !form.contribution_date
    ) {
        return;
    }

    const year = form.contribution_date.getFullYear();

    const month = String(form.contribution_date.getMonth() + 1).padStart(
        2,
        '0',
    );

    const day = String(form.contribution_date.getDate()).padStart(2, '0');

    form.transform(() => ({
        amount: form.amount,
        contribution_date: `${year}-${month}-${day}`,
    })).put(update.url(props.contribution.id), {
        preserveScroll: true,

        onSuccess: () => {
            emit('update:visible', false);
        },
    });
}
</script>

<template>
    <Dialog
        :visible="visible"
        modal
        header="Edit Contribution"
        :style="{ width: '28rem' }"
        :closable="!form.processing"
        :close-on-escape="!form.processing"
        @update:visible="emit('update:visible', $event)"
    >
        <form class="flex flex-col gap-5" @submit.prevent="save">
            <div class="flex flex-col gap-2">
                <label
                    for="edit-contribution-date"
                    class="text-sm font-medium text-gray-700"
                >
                    Contribution Date
                </label>

                <DatePicker
                    id="edit-contribution-date"
                    v-model="form.contribution_date"
                    date-format="dd-M-yy"
                    show-icon
                    fluid
                    show-button-bar
                    :invalid="!!form.errors.contribution_date"
                    size="small"
                />

                <small
                    v-if="form.errors.contribution_date"
                    class="text-red-500"
                >
                    {{ form.errors.contribution_date }}
                </small>
            </div>

            <div class="flex flex-col gap-2">
                <label
                    for="edit-contribution-amount"
                    class="text-sm font-medium text-gray-700"
                >
                    Amount
                </label>

                <InputNumber
                    id="edit-contribution-amount"
                    v-model="form.amount"
                    locale="en-IN"
                    suffix=" BDT"
                    :min="0"
                    :min-fraction-digits="2"
                    :max-fraction-digits="2"
                    fluid
                    :invalid="!!form.errors.amount"
                    size="small"
                />

                <small v-if="form.errors.amount" class="text-red-500">
                    {{ form.errors.amount }}
                </small>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    text
                    :disabled="form.processing"
                    @click="close"
                    size="small"
                />

                <Button
                    type="submit"
                    label="Save Changes"
                    icon="pi pi-check"
                    :loading="form.processing"
                    size="small"
                />
            </div>
        </form>
    </Dialog>
</template>
