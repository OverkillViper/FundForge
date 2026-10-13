import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
* @see app/Http/Controllers/Settings/SettingsController.php:19
* @route '/settings/app'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/app',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
* @see app/Http/Controllers/Settings/SettingsController.php:19
* @route '/settings/app'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
* @see app/Http/Controllers/Settings/SettingsController.php:19
* @route '/settings/app'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
* @see app/Http/Controllers/Settings/SettingsController.php:19
* @route '/settings/app'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
* @see app/Http/Controllers/Settings/SettingsController.php:19
* @route '/settings/app'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
* @see app/Http/Controllers/Settings/SettingsController.php:19
* @route '/settings/app'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::edit
* @see app/Http/Controllers/Settings/SettingsController.php:19
* @route '/settings/app'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
* @see app/Http/Controllers/Settings/SettingsController.php:47
* @route '/settings/app'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/app',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
* @see app/Http/Controllers/Settings/SettingsController.php:47
* @route '/settings/app'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
* @see app/Http/Controllers/Settings/SettingsController.php:47
* @route '/settings/app'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
* @see app/Http/Controllers/Settings/SettingsController.php:47
* @route '/settings/app'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
* @see app/Http/Controllers/Settings/SettingsController.php:47
* @route '/settings/app'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
* @see app/Http/Controllers/Settings/SettingsController.php:65
* @route '/settings/app/savings-certificates'
*/
export const updateSavingsCertificateTaxBrackets = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSavingsCertificateTaxBrackets.url(options),
    method: 'put',
})

updateSavingsCertificateTaxBrackets.definition = {
    methods: ["put"],
    url: '/settings/app/savings-certificates',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
* @see app/Http/Controllers/Settings/SettingsController.php:65
* @route '/settings/app/savings-certificates'
*/
updateSavingsCertificateTaxBrackets.url = (options?: RouteQueryOptions) => {
    return updateSavingsCertificateTaxBrackets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
* @see app/Http/Controllers/Settings/SettingsController.php:65
* @route '/settings/app/savings-certificates'
*/
updateSavingsCertificateTaxBrackets.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSavingsCertificateTaxBrackets.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
* @see app/Http/Controllers/Settings/SettingsController.php:65
* @route '/settings/app/savings-certificates'
*/
const updateSavingsCertificateTaxBracketsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSavingsCertificateTaxBrackets.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateSavingsCertificateTaxBrackets
* @see app/Http/Controllers/Settings/SettingsController.php:65
* @route '/settings/app/savings-certificates'
*/
updateSavingsCertificateTaxBracketsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSavingsCertificateTaxBrackets.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateSavingsCertificateTaxBrackets.form = updateSavingsCertificateTaxBracketsForm

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
* @see app/Http/Controllers/Settings/SettingsController.php:90
* @route '/settings/app/income-slabs'
*/
export const updateIncomeTaxSlabs = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateIncomeTaxSlabs.url(options),
    method: 'put',
})

updateIncomeTaxSlabs.definition = {
    methods: ["put"],
    url: '/settings/app/income-slabs',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
* @see app/Http/Controllers/Settings/SettingsController.php:90
* @route '/settings/app/income-slabs'
*/
updateIncomeTaxSlabs.url = (options?: RouteQueryOptions) => {
    return updateIncomeTaxSlabs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
* @see app/Http/Controllers/Settings/SettingsController.php:90
* @route '/settings/app/income-slabs'
*/
updateIncomeTaxSlabs.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateIncomeTaxSlabs.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
* @see app/Http/Controllers/Settings/SettingsController.php:90
* @route '/settings/app/income-slabs'
*/
const updateIncomeTaxSlabsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateIncomeTaxSlabs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::updateIncomeTaxSlabs
* @see app/Http/Controllers/Settings/SettingsController.php:90
* @route '/settings/app/income-slabs'
*/
updateIncomeTaxSlabsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateIncomeTaxSlabs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateIncomeTaxSlabs.form = updateIncomeTaxSlabsForm

/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
* @see app/Http/Controllers/Settings/SettingsController.php:117
* @route '/settings/app/restore-defaults'
*/
export const restoreDefaults = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restoreDefaults.url(options),
    method: 'put',
})

restoreDefaults.definition = {
    methods: ["put"],
    url: '/settings/app/restore-defaults',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
* @see app/Http/Controllers/Settings/SettingsController.php:117
* @route '/settings/app/restore-defaults'
*/
restoreDefaults.url = (options?: RouteQueryOptions) => {
    return restoreDefaults.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
* @see app/Http/Controllers/Settings/SettingsController.php:117
* @route '/settings/app/restore-defaults'
*/
restoreDefaults.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restoreDefaults.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
* @see app/Http/Controllers/Settings/SettingsController.php:117
* @route '/settings/app/restore-defaults'
*/
const restoreDefaultsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restoreDefaults.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::restoreDefaults
* @see app/Http/Controllers/Settings/SettingsController.php:117
* @route '/settings/app/restore-defaults'
*/
restoreDefaultsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restoreDefaults.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

restoreDefaults.form = restoreDefaultsForm

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAllAccountBalances
* @see app/Http/Controllers/Settings/SettingsController.php:172
* @route '/settings/app/sync'
*/
export const syncAllAccountBalances = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAllAccountBalances.url(options),
    method: 'post',
})

syncAllAccountBalances.definition = {
    methods: ["post"],
    url: '/settings/app/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAllAccountBalances
* @see app/Http/Controllers/Settings/SettingsController.php:172
* @route '/settings/app/sync'
*/
syncAllAccountBalances.url = (options?: RouteQueryOptions) => {
    return syncAllAccountBalances.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAllAccountBalances
* @see app/Http/Controllers/Settings/SettingsController.php:172
* @route '/settings/app/sync'
*/
syncAllAccountBalances.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAllAccountBalances.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAllAccountBalances
* @see app/Http/Controllers/Settings/SettingsController.php:172
* @route '/settings/app/sync'
*/
const syncAllAccountBalancesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAllAccountBalances.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAllAccountBalances
* @see app/Http/Controllers/Settings/SettingsController.php:172
* @route '/settings/app/sync'
*/
syncAllAccountBalancesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAllAccountBalances.url(options),
    method: 'post',
})

syncAllAccountBalances.form = syncAllAccountBalancesForm

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAccountBalance
* @see app/Http/Controllers/Settings/SettingsController.php:186
* @route '/settings/app/{account}/sync'
*/
export const syncAccountBalance = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAccountBalance.url(args, options),
    method: 'post',
})

syncAccountBalance.definition = {
    methods: ["post"],
    url: '/settings/app/{account}/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAccountBalance
* @see app/Http/Controllers/Settings/SettingsController.php:186
* @route '/settings/app/{account}/sync'
*/
syncAccountBalance.url = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { account: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            account: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        account: typeof args.account === 'object'
        ? args.account.id
        : args.account,
    }

    return syncAccountBalance.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAccountBalance
* @see app/Http/Controllers/Settings/SettingsController.php:186
* @route '/settings/app/{account}/sync'
*/
syncAccountBalance.post = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAccountBalance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAccountBalance
* @see app/Http/Controllers/Settings/SettingsController.php:186
* @route '/settings/app/{account}/sync'
*/
const syncAccountBalanceForm = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAccountBalance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SettingsController::syncAccountBalance
* @see app/Http/Controllers/Settings/SettingsController.php:186
* @route '/settings/app/{account}/sync'
*/
syncAccountBalanceForm.post = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAccountBalance.url(args, options),
    method: 'post',
})

syncAccountBalance.form = syncAccountBalanceForm

const SettingsController = { edit, update, updateSavingsCertificateTaxBrackets, updateIncomeTaxSlabs, restoreDefaults, syncAllAccountBalances, syncAccountBalance }

export default SettingsController