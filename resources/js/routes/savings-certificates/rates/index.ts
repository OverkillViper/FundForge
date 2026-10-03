import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:369
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
export const update = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/investments/savings-certificates/{savingsCertificate}/rates',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:369
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
update.url = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { savingsCertificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { savingsCertificate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    savingsCertificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        savingsCertificate: typeof args.savingsCertificate === 'object'
                ? args.savingsCertificate.id
                : args.savingsCertificate,
                }

    return update.definition.url
            .replace('{savingsCertificate}', parsedArgs.savingsCertificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:369
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
update.put = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:369
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
    const updateForm = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SavingsCertificateController::update
 * @see app/Http/Controllers/SavingsCertificateController.php:369
 * @route '/investments/savings-certificates/{savingsCertificate}/rates'
 */
        updateForm.put = (args: { savingsCertificate: string | number | { id: string | number } } | [savingsCertificate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
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