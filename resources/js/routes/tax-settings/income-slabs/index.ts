import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/tax/income-slabs',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
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
 * @see app/Http/Controllers/Settings/SettingsController.php:82
 * @route '/settings/tax/income-slabs'
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
const incomeSlabs = {
    update: Object.assign(update, update),
}

export default incomeSlabs