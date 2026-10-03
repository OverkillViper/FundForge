import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProvidentFundController::show
 * @see app/Http/Controllers/ProvidentFundController.php:22
 * @route '/investments/provident-fund'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/investments/provident-fund',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::show
 * @see app/Http/Controllers/ProvidentFundController.php:22
 * @route '/investments/provident-fund'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::show
 * @see app/Http/Controllers/ProvidentFundController.php:22
 * @route '/investments/provident-fund'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProvidentFundController::show
 * @see app/Http/Controllers/ProvidentFundController.php:22
 * @route '/investments/provident-fund'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::show
 * @see app/Http/Controllers/ProvidentFundController.php:22
 * @route '/investments/provident-fund'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::show
 * @see app/Http/Controllers/ProvidentFundController.php:22
 * @route '/investments/provident-fund'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProvidentFundController::show
 * @see app/Http/Controllers/ProvidentFundController.php:22
 * @route '/investments/provident-fund'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:58
 * @route '/investments/provident-fund'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/investments/provident-fund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:58
 * @route '/investments/provident-fund'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:58
 * @route '/investments/provident-fund'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:58
 * @route '/investments/provident-fund'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::store
 * @see app/Http/Controllers/ProvidentFundController.php:58
 * @route '/investments/provident-fund'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProvidentFundController::edit
 * @see app/Http/Controllers/ProvidentFundController.php:123
 * @route '/investments/provident-fund/edit'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/investments/provident-fund/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::edit
 * @see app/Http/Controllers/ProvidentFundController.php:123
 * @route '/investments/provident-fund/edit'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::edit
 * @see app/Http/Controllers/ProvidentFundController.php:123
 * @route '/investments/provident-fund/edit'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProvidentFundController::edit
 * @see app/Http/Controllers/ProvidentFundController.php:123
 * @route '/investments/provident-fund/edit'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::edit
 * @see app/Http/Controllers/ProvidentFundController.php:123
 * @route '/investments/provident-fund/edit'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::edit
 * @see app/Http/Controllers/ProvidentFundController.php:123
 * @route '/investments/provident-fund/edit'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProvidentFundController::edit
 * @see app/Http/Controllers/ProvidentFundController.php:123
 * @route '/investments/provident-fund/edit'
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
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:141
 * @route '/investments/provident-fund'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/investments/provident-fund',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:141
 * @route '/investments/provident-fund'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:141
 * @route '/investments/provident-fund'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::update
 * @see app/Http/Controllers/ProvidentFundController.php:141
 * @route '/investments/provident-fund'
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
 * @see app/Http/Controllers/ProvidentFundController.php:141
 * @route '/investments/provident-fund'
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
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:165
 * @route '/investments/provident-fund'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/investments/provident-fund',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:165
 * @route '/investments/provident-fund'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:165
 * @route '/investments/provident-fund'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:165
 * @route '/investments/provident-fund'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::destroy
 * @see app/Http/Controllers/ProvidentFundController.php:165
 * @route '/investments/provident-fund'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\ProvidentFundController::rates
 * @see app/Http/Controllers/ProvidentFundController.php:277
 * @route '/investments/provident-fund/rates'
 */
export const rates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rates.url(options),
    method: 'get',
})

rates.definition = {
    methods: ["get","head"],
    url: '/investments/provident-fund/rates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::rates
 * @see app/Http/Controllers/ProvidentFundController.php:277
 * @route '/investments/provident-fund/rates'
 */
rates.url = (options?: RouteQueryOptions) => {
    return rates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::rates
 * @see app/Http/Controllers/ProvidentFundController.php:277
 * @route '/investments/provident-fund/rates'
 */
rates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProvidentFundController::rates
 * @see app/Http/Controllers/ProvidentFundController.php:277
 * @route '/investments/provident-fund/rates'
 */
rates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::rates
 * @see app/Http/Controllers/ProvidentFundController.php:277
 * @route '/investments/provident-fund/rates'
 */
    const ratesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: rates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::rates
 * @see app/Http/Controllers/ProvidentFundController.php:277
 * @route '/investments/provident-fund/rates'
 */
        ratesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProvidentFundController::rates
 * @see app/Http/Controllers/ProvidentFundController.php:277
 * @route '/investments/provident-fund/rates'
 */
        ratesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    rates.form = ratesForm
/**
* @see \App\Http\Controllers\ProvidentFundController::updateRates
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
export const updateRates = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRates.url(options),
    method: 'put',
})

updateRates.definition = {
    methods: ["put"],
    url: '/investments/provident-fund/rates',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::updateRates
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
updateRates.url = (options?: RouteQueryOptions) => {
    return updateRates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::updateRates
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
updateRates.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRates.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::updateRates
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
    const updateRatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateRates.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::updateRates
 * @see app/Http/Controllers/ProvidentFundController.php:295
 * @route '/investments/provident-fund/rates'
 */
        updateRatesForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateRates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateRates.form = updateRatesForm
/**
* @see \App\Http\Controllers\ProvidentFundController::storeContribution
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
export const storeContribution = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeContribution.url(options),
    method: 'post',
})

storeContribution.definition = {
    methods: ["post"],
    url: '/investments/provident-fund/contribution',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::storeContribution
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
storeContribution.url = (options?: RouteQueryOptions) => {
    return storeContribution.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::storeContribution
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
storeContribution.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeContribution.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::storeContribution
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
    const storeContributionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeContribution.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::storeContribution
 * @see app/Http/Controllers/ProvidentFundController.php:186
 * @route '/investments/provident-fund/contribution'
 */
        storeContributionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeContribution.url(options),
            method: 'post',
        })
    
    storeContribution.form = storeContributionForm
/**
* @see \App\Http\Controllers\ProvidentFundController::updateContribution
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
export const updateContribution = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateContribution.url(args, options),
    method: 'put',
})

updateContribution.definition = {
    methods: ["put"],
    url: '/investments/provident-fund/contribution/{contribution}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::updateContribution
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
updateContribution.url = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contribution: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { contribution: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    contribution: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contribution: typeof args.contribution === 'object'
                ? args.contribution.id
                : args.contribution,
                }

    return updateContribution.definition.url
            .replace('{contribution}', parsedArgs.contribution.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::updateContribution
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
updateContribution.put = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateContribution.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::updateContribution
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
    const updateContributionForm = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateContribution.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::updateContribution
 * @see app/Http/Controllers/ProvidentFundController.php:217
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
        updateContributionForm.put = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateContribution.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateContribution.form = updateContributionForm
/**
* @see \App\Http\Controllers\ProvidentFundController::destroyContribution
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
export const destroyContribution = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyContribution.url(args, options),
    method: 'delete',
})

destroyContribution.definition = {
    methods: ["delete"],
    url: '/investments/provident-fund/contribution/{contribution}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProvidentFundController::destroyContribution
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
destroyContribution.url = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contribution: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { contribution: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    contribution: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contribution: typeof args.contribution === 'object'
                ? args.contribution.id
                : args.contribution,
                }

    return destroyContribution.definition.url
            .replace('{contribution}', parsedArgs.contribution.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProvidentFundController::destroyContribution
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
destroyContribution.delete = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyContribution.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProvidentFundController::destroyContribution
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
    const destroyContributionForm = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyContribution.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProvidentFundController::destroyContribution
 * @see app/Http/Controllers/ProvidentFundController.php:252
 * @route '/investments/provident-fund/contribution/{contribution}'
 */
        destroyContributionForm.delete = (args: { contribution: string | number | { id: string | number } } | [contribution: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyContribution.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyContribution.form = destroyContributionForm
const ProvidentFundController = { show, store, edit, update, destroy, rates, updateRates, storeContribution, updateContribution, destroyContribution }

export default ProvidentFundController