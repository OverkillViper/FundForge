import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/investments/provident-fund/rates',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
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
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
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
const rates = {
    update: Object.assign(update, update),
}

export default rates