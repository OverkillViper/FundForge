import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import savingsCertificates from './savings-certificates'
import dps from './dps'
import providentFund from './provident-fund'
/**
* @see \App\Http\Controllers\InvestmentController::index
 * @see app/Http/Controllers/InvestmentController.php:15
 * @route '/investments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/investments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvestmentController::index
 * @see app/Http/Controllers/InvestmentController.php:15
 * @route '/investments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvestmentController::index
 * @see app/Http/Controllers/InvestmentController.php:15
 * @route '/investments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvestmentController::index
 * @see app/Http/Controllers/InvestmentController.php:15
 * @route '/investments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvestmentController::index
 * @see app/Http/Controllers/InvestmentController.php:15
 * @route '/investments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvestmentController::index
 * @see app/Http/Controllers/InvestmentController.php:15
 * @route '/investments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvestmentController::index
 * @see app/Http/Controllers/InvestmentController.php:15
 * @route '/investments'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const investments = {
    index: Object.assign(index, index),
savingsCertificates: Object.assign(savingsCertificates, savingsCertificates),
dps: Object.assign(dps, dps),
providentFund: Object.assign(providentFund, providentFund),
}

export default investments