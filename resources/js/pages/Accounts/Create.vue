<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import ToggleSwitch from 'primevue/toggleswitch';
import Button from 'primevue/button';

const toast = useToast();
const emit = defineEmits(['cancel', 'success']);

const form = useForm({
    name: '',
    type: 'bank',
    opening_balance: 0,
    currency: 'BDT',
    is_active: true,
    account_number: '',
});

const accountTypes = [
    {
        label: 'Bank Account',
        value: 'bank',
        icon: 'pi pi-[#181518] pi-building',
    },
    { label: 'Cash', value: 'cash', icon: 'pi pi-wallet' },
    { label: 'Mobile Wallet', value: 'mobile_walllet', icon: 'pi pi-mobile' },
    { label: 'Other', value: 'other', icon: 'pi pi-ellipsis-h' },
];

const currencies = [
    { label: 'BDT (৳)', value: 'BDT' },
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' },
];

const submit = () => {
    form.post('/accounts', {
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Account Created',
                detail: `${form.name} has been created successfully.`,
                life: 3000,
            });
            emit('success');
        },
    });
};

const cancel = () => {
    form.reset();
    form.clearErrors();
    emit('cancel');
};
</script>

<template>
    <div class="flex h-full flex-col p-6">
        <form @submit.prevent="submit" class="max-w-100 space-y-4 pt-2">
            <!-- Account Name -->
            <div class="flex flex-col gap-1.5">
                <label for="name" class="text-sm font-semibold text-[#181518]"
                    >Account Name</label
                >
                <InputText
                    id="name"
                    v-model="form.name"
                    placeholder="e.g. Eastern Bank Ltd, Personal Cash"
                    :invalid="!!form.errors.name"
                    class="w-full"
                    autofocus
                    size="small"
                />
                <small v-if="form.errors.name" class="text-xs text-red-500">{{
                    form.errors.name
                }}</small>
            </div>

            <!-- Account Type -->
            <div class="flex flex-col gap-1.5">
                <label for="type" class="text-sm font-semibold text-[#181518]"
                    >Account Type</label
                >
                <Select
                    id="type"
                    v-model="form.type"
                    :options="accountTypes"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Type"
                    class="w-full"
                    :invalid="!!form.errors.type"
                    size="small"
                >
                    <template #option="slotProps">
                        <div class="flex items-center gap-2 text-sm">
                            <i
                                :class="slotProps.option.icon"
                                class="text-gray-500"
                            ></i>
                            <span>{{ slotProps.option.label }}</span>
                        </div>
                    </template>
                </Select>
                <small v-if="form.errors.type" class="text-xs text-red-500">{{
                    form.errors.type
                }}</small>
            </div>

            <!-- Account Number -->
            <div class="flex flex-col gap-1.5">
                <label
                    for="account_number"
                    class="text-sm font-semibold text-[#181518]"
                    >Account Number</label
                >
                <InputText
                    id="account_number"
                    v-model="form.account_number"
                    placeholder="e.g. 12345678901234567890"
                    :invalid="!!form.errors.account_number"
                    class="w-full"
                    size="small"
                />
                <small
                    v-if="form.errors.account_number"
                    class="text-xs text-red-500"
                    >{{ form.errors.account_number }}</small
                >
            </div>

            <!-- Currency & Opening Balance Row -->
            <div class="grid grid-cols-5 gap-3">
                <!-- Currency -->
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label
                        for="currency"
                        class="text-sm font-semibold text-[#181518]"
                        >Currency</label
                    >
                    <Select
                        id="currency"
                        v-model="form.currency"
                        :options="currencies"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full !text-sm"
                        :invalid="!!form.errors.currency"
                        size="small"
                        disabled
                    />
                </div>

                <!-- Opening Balance -->
                <div class="col-span-3 flex flex-col gap-1.5">
                    <label
                        for="opening_balance"
                        class="text-sm font-semibold text-[#181518]"
                        >Opening Balance</label
                    >
                    <InputNumber
                        id="opening_balance"
                        v-model="form.opening_balance"
                        mode="decimal"
                        :minFractionDigits="2"
                        :maxFractionDigits="2"
                        placeholder="0.00"
                        class="w-full"
                        :invalid="!!form.errors.opening_balance"
                        size="small"
                    />
                </div>
            </div>
            <small
                v-if="form.errors.opening_balance"
                class="block text-xs text-red-500"
                >{{ form.errors.opening_balance }}</small
            >

            <!-- Is Active Toggle -->
            <div
                class="mt-2 flex items-center justify-between border-t border-gray-100 py-2"
            >
                <div>
                    <span class="block text-sm font-semibold text-[#181518]"
                        >Account Status</span
                    >
                    <span class="text-[11px] text-gray-400"
                        >Enable or disable this account for active
                        transactions</span
                    >
                </div>
                <ToggleSwitch v-model="form.is_active" />
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
                <Button
                    size="small"
                    label="Cancel"
                    severity="secondary"
                    text
                    @click="cancel()"
                />
                <Button
                    size="small"
                    type="submit"
                    label="Create Account"
                    :loading="form.processing"
                    class="!border-[#181518] !bg-[#181518] hover:!bg-[#2d292d]"
                />
            </div>
        </form>
    </div>
</template>
