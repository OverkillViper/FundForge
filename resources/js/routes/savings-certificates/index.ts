import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import rates0e6f2f from './rates'
/**
* @see \App\Http\Controllers\SavingsCertificateController::rates
 * @see app/Http/Controllers/SavingsCertificateController.php:0
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
export const rates = (args: { savingsCertificate: string | number } | [savingsCertificate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rates.url(args, options),
    method: 'get',
})

rates.definition = {
    methods: ["get","head"],
    url: '/investments/savings-certificates/{savingsCertificate}/rates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::rates
 * @see app/Http/Controllers/SavingsCertificateController.php:0
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
rates.url = (args: { savingsCertificate: string | number } | [savingsCertificate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savingsCertificate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    savingsCertificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        savingsCertificate: args.savingsCertificate,
                }

    return rates.definition.url
            .replace('{savingsCertificate}', parsedArgs.savingsCertificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::rates
 * @see app/Http/Controllers/SavingsCertificateController.php:0
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
rates.get = (args: { savingsCertificate: string | number } | [savingsCertificate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rates.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SavingsCertificateController::rates
 * @see app/Http/Controllers/SavingsCertificateController.php:0
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
rates.head = (args: { savingsCertificate: string | number } | [savingsCertificate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rates.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::rates
 * @see app/Http/Controllers/SavingsCertificateController.php:0
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
    const ratesForm = (args: { savingsCertificate: string | number } | [savingsCertificate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: rates.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::rates
 * @see app/Http/Controllers/SavingsCertificateController.php:0
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
        ratesForm.get = (args: { savingsCertificate: string | number } | [savingsCertificate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rates.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SavingsCertificateController::rates
 * @see app/Http/Controllers/SavingsCertificateController.php:0
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
        ratesForm.head = (args: { savingsCertificate: string | number } | [savingsCertificate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rates.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    rates.form = ratesForm
const savingsCertificates = {
    rates: Object.assign(rates, rates0e6f2f),
}

export default savingsCertificates