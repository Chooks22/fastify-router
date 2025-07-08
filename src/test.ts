import assert from 'node:assert'
import { afterEach, beforeEach, describe, it } from 'node:test'
import fastify, { type FastifyInstance, type RegisterOptions } from 'fastify'
import { createRouter, type Router } from './index.ts'

describe('router', () => {
  let app: FastifyInstance

  beforeEach(() => {
    app = fastify()
  })

  afterEach(() => {
    app.close()
  })

  async function install(router: Router, opts: RegisterOptions = {}) {
    await app.register(router, opts)
    await app.listen({ port: 9901 })
  }

  async function get(path: string) {
    let res = await fetch(`http://localhost:9901${path}`)
    return res.text()
  }

  it('works', async t => {
    let router = createRouter()
    let v = 'foo'
    let fn = t.mock.fn(async () => v)

    router.get('/foo', fn)
    await install(router)

    let data = await get('/foo')

    assert.strictEqual(data, v)
    assert.strictEqual(fn.mock.callCount(), 1)
  })

  it('works nested', async t => {
    let router = createRouter()
    let v = 'bar'
    let fn = t.mock.fn(async () => v)

    router.get('/foo', fn)
    await install(router, { prefix: '/bar' })

    let data = await get('/bar/foo')

    assert.strictEqual(data, v)
    assert.strictEqual(fn.mock.callCount(), 1)
  })
})
