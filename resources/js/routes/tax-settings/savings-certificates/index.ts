import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/tax/savings-certificates',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
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
 * @see app/Http/Controllers/Settings/SettingsController.php:57
 * @route '/settings/tax/savings-certificates'
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
const savingsCertificates = {
    update: Object.assign(update, update),
}

export default savingsCertificates