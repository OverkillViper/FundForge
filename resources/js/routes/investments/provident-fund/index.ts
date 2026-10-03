import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import rates0e6f2f from './rates'
import contribution from './contribution'
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
const providentFund = {
    show: Object.assign(show, show),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
rates: Object.assign(rates, rates0e6f2f),
contribution: Object.assign(contribution, contribution),
}

export default providentFund