import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\DashboardIndexController::__invoke
 * @see app/Http/Controllers/Dashboard/DashboardIndexController.php:14
 * @route '/dashboard'
 */
const DashboardIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DashboardIndexController.url(options),
    method: 'get',
})

DashboardIndexController.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\DashboardIndexController::__invoke
 * @see app/Http/Controllers/Dashboard/DashboardIndexController.php:14
 * @route '/dashboard'
 */
DashboardIndexController.url = (options?: RouteQueryOptions) => {
    return DashboardIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\DashboardIndexController::__invoke
 * @see app/Http/Controllers/Dashboard/DashboardIndexController.php:14
 * @route '/dashboard'
 */
DashboardIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DashboardIndexController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\DashboardIndexController::__invoke
 * @see app/Http/Controllers/Dashboard/DashboardIndexController.php:14
 * @route '/dashboard'
 */
DashboardIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DashboardIndexController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Dashboard\DashboardIndexController::__invoke
 * @see app/Http/Controllers/Dashboard/DashboardIndexController.php:14
 * @route '/dashboard'
 */
    const DashboardIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: DashboardIndexController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Dashboard\DashboardIndexController::__invoke
 * @see app/Http/Controllers/Dashboard/DashboardIndexController.php:14
 * @route '/dashboard'
 */
        DashboardIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DashboardIndexController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Dashboard\DashboardIndexController::__invoke
 * @see app/Http/Controllers/Dashboard/DashboardIndexController.php:14
 * @route '/dashboard'
 */
        DashboardIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DashboardIndexController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    DashboardIndexController.form = DashboardIndexControllerForm
export default DashboardIndexController