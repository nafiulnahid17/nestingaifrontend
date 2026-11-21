import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.js';

test('readiness is honest without a configured engine',async()=>{
 const response=await worker.fetch(new Request('https://example.test/api/artwork/readiness'),{ASSETS:{fetch(){throw Error('unexpected asset request')}}});
 assert.equal((await response.json()).ready,false);
});
test('test jobs reject a missing private access code',async()=>{
 const response=await worker.fetch(new Request('https://example.test/api/artwork/jobs',{method:'POST'}),{ARTWORK_ENGINE_URL:'https://engine.example.test',ENGINE_AUTH_TOKEN:'internal',TEST_ACCESS_TOKEN:'private',ASSETS:{}});
 assert.equal(response.status,403);
});
