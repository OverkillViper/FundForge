import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SalaryTdsController::index
 * @see app/Http/Controllers/SalaryTdsController.php:14
 * @route '/income-taxes/salary-tds'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/income-taxes/salary-tds',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalaryTdsController::index
 * @see app/Http/Controllers/SalaryTdsController.php:14
 * @route '/income-taxes/salary-tds'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryTdsController::index
 * @see app/Http/Controllers/SalaryTdsController.php:14
 * @route '/income-taxes/salary-tds'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SalaryTdsController::index
 * @see app/Http/Controllers/SalaryTdsController.php:14
 * @route '/income-taxes/salary-tds'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SalaryTdsController::index
 * @see app/Http/Controllers/SalaryTdsController.php:14
 * @route '/income-taxes/salary-tds'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SalaryTdsController::index
 * @see app/Http/Controllers/SalaryTdsController.php:14
 * @route '/income-taxes/salary-tds'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SalaryTdsController::index
 * @see app/Http/Controllers/SalaryTdsController.php:14
 * @route '/income-taxes/salary-tds'
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
/**
* @see \App\Http\Controllers\SalaryTdsController::create
 * @see app/Http/Controllers/SalaryTdsController.php:37
 * @route '/income-taxes/salary-tds/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/income-taxes/salary-tds/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalaryTdsController::create
 * @see app/Http/Controllers/SalaryTdsController.php:37
 * @route '/income-taxes/salary-tds/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryTdsController::create
 * @see app/Http/Controllers/SalaryTdsController.php:37
 * @route '/income-taxes/salary-tds/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SalaryTdsController::create
 * @see app/Http/Controllers/SalaryTdsController.php:37
 * @route '/income-taxes/salary-tds/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SalaryTdsController::create
 * @see app/Http/Controllers/SalaryTdsController.php:37
 * @route '/income-taxes/salary-tds/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SalaryTdsController::create
 * @see app/Http/Controllers/SalaryTdsController.php:37
 * @route '/income-taxes/salary-tds/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SalaryTdsController::create
 * @see app/Http/Controllers/SalaryTdsController.php:37
 * @route '/income-taxes/salary-tds/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\SalaryTdsController::store
 * @see app/Http/Controllers/SalaryTdsController.php:44
 * @route '/income-taxes/salary-tds'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/income-taxes/salary-tds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SalaryTdsController::store
 * @see app/Http/Controllers/SalaryTdsController.php:44
 * @route '/income-taxes/salary-tds'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryTdsController::store
 * @see app/Http/Controllers/SalaryTdsController.php:44
 * @route '/income-taxes/salary-tds'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SalaryTdsController::store
 * @see app/Http/Controllers/SalaryTdsController.php:44
 * @route '/income-taxes/salary-tds'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SalaryTdsController::store
 * @see app/Http/Controllers/SalaryTdsController.php:44
 * @route '/income-taxes/salary-tds'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SalaryTdsController::edit
 * @see app/Http/Controllers/SalaryTdsController.php:80
 * @route '/income-taxes/salary-tds/{salaryTds}/edit'
 */
export const edit = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/income-taxes/salary-tds/{salaryTds}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalaryTdsController::edit
 * @see app/Http/Controllers/SalaryTdsController.php:80
 * @route '/income-taxes/salary-tds/{salaryTds}/edit'
 */
edit.url = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { salaryTds: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { salaryTds: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    salaryTds: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        salaryTds: typeof args.salaryTds === 'object'
                ? args.salaryTds.id
                : args.salaryTds,
                }

    return edit.definition.url
            .replace('{salaryTds}', parsedArgs.salaryTds.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryTdsController::edit
 * @see app/Http/Controllers/SalaryTdsController.php:80
 * @route '/income-taxes/salary-tds/{salaryTds}/edit'
 */
edit.get = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SalaryTdsController::edit
 * @see app/Http/Controllers/SalaryTdsController.php:80
 * @route '/income-taxes/salary-tds/{salaryTds}/edit'
 */
edit.head = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SalaryTdsController::edit
 * @see app/Http/Controllers/SalaryTdsController.php:80
 * @route '/income-taxes/salary-tds/{salaryTds}/edit'
 */
    const editForm = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SalaryTdsController::edit
 * @see app/Http/Controllers/SalaryTdsController.php:80
 * @route '/income-taxes/salary-tds/{salaryTds}/edit'
 */
        editForm.get = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SalaryTdsController::edit
 * @see app/Http/Controllers/SalaryTdsController.php:80
 * @route '/income-taxes/salary-tds/{salaryTds}/edit'
 */
        editForm.head = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\SalaryTdsController::update
 * @see app/Http/Controllers/SalaryTdsController.php:92
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
export const update = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/income-taxes/salary-tds/{salaryTds}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SalaryTdsController::update
 * @see app/Http/Controllers/SalaryTdsController.php:92
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
update.url = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { salaryTds: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { salaryTds: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    salaryTds: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        salaryTds: typeof args.salaryTds === 'object'
                ? args.salaryTds.id
                : args.salaryTds,
                }

    return update.definition.url
            .replace('{salaryTds}', parsedArgs.salaryTds.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryTdsController::update
 * @see app/Http/Controllers/SalaryTdsController.php:92
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
update.put = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SalaryTdsController::update
 * @see app/Http/Controllers/SalaryTdsController.php:92
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
update.patch = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SalaryTdsController::update
 * @see app/Http/Controllers/SalaryTdsController.php:92
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
    const updateForm = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SalaryTdsController::update
 * @see app/Http/Controllers/SalaryTdsController.php:92
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
        updateForm.put = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\SalaryTdsController::update
 * @see app/Http/Controllers/SalaryTdsController.php:92
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
        updateForm.patch = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\SalaryTdsController::destroy
 * @see app/Http/Controllers/SalaryTdsController.php:127
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
export const destroy = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/income-taxes/salary-tds/{salaryTds}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SalaryTdsController::destroy
 * @see app/Http/Controllers/SalaryTdsController.php:127
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
destroy.url = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { salaryTds: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { salaryTds: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    salaryTds: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        salaryTds: typeof args.salaryTds === 'object'
                ? args.salaryTds.id
                : args.salaryTds,
                }

    return destroy.definition.url
            .replace('{salaryTds}', parsedArgs.salaryTds.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryTdsController::destroy
 * @see app/Http/Controllers/SalaryTdsController.php:127
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
destroy.delete = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SalaryTdsController::destroy
 * @see app/Http/Controllers/SalaryTdsController.php:127
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
    const destroyForm = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SalaryTdsController::destroy
 * @see app/Http/Controllers/SalaryTdsController.php:127
 * @route '/income-taxes/salary-tds/{salaryTds}'
 */
        destroyForm.delete = (args: { salaryTds: string | number | { id: string | number } } | [salaryTds: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const SalaryTdsController = { index, create, store, edit, update, destroy }

export default SalaryTdsController