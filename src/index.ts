import type { FastifyInstance, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

// when created, returns a 2-part proxy:
// one part acts as a router when accessing properties [router.get()]
// another acts as the plugin when calling it like a function [fastify.register(router)]
export type Router<App extends FastifyInstance = FastifyInstance> = App & FastifyPluginCallback

function create_router<App extends FastifyInstance = FastifyInstance>(): Router<App> {
  type Prop = keyof FastifyInstance
  type Args = unknown[]

  let instances: FastifyInstance[] = []
  let queue: [prop: Prop, args: Args][] = []

  function register(fastify: FastifyInstance, prop: Prop, args: Args) {
    // @ts-expect-error complex type
    fastify[prop](...args)
  }

  function add_instance(fastify: FastifyInstance) {
    for (let [prop, args] of queue) {
      register(fastify, prop, args)
    }

    // save instances for late invocation of routes
    instances.push(fastify)
  }

  function enqueue(prop: Prop, args: Args) {
    queue.push([prop, args])

    // register for previously installed instances
    for (let fastify of instances) {
      register(fastify, prop, args)
    }
  }

  let plugin = fp((fastify, opts, done) => {
    fastify.register(add_instance, opts)
    done()
  })

  let router = new Proxy<Router<App>>((() => {}) as never, {
    apply(_target, _self, args: Parameters<FastifyPluginCallback>) {
      plugin(...args)
    },
    get(_target, prop) {
      return (...args: Args) => {
        enqueue(prop as Prop, args)
        return router
      }
    },
  })

  return router
}

export let Router: typeof create_router = create_router
export { Router as createRouter }
