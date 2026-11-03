import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assertSubmissionAccepted,sendEnquiry,ENQUIRY_ENDPOINT} from './submission.ts';

test('only explicit acceptance succeeds, including the provider string format',()=>{
 for(const success of [true,'true']) assert.doesNotThrow(()=>assertSubmissionAccepted({success}));
 for(const success of [false,'false',null,undefined,1,'yes']) assert.throws(()=>assertSubmissionAccepted({success}));
 for(const data of [undefined,null,[],{},'OK']) assert.throws(()=>assertSubmissionAccepted(data));
});
test('activation is never shown as a delivered enquiry, even with success true',()=>{
 for(const message of ['This form needs Activation','Please confirm your email','Verify your email'])
  assert.throws(()=>assertSubmissionAccepted({success:'true',message}),/尚待啟用/);
});
test('submits all fields once to the exact merchant endpoint',async()=>{
 let calls=0;
 const payload={name:'TEST',email:'qa@example.com',enquiry_reference:'SO-Q-TEST',items:'GPU × 2',address:'TEST ONLY'};
 const request=(async (url:unknown,options:RequestInit)=>{
  calls++;assert.equal(url,ENQUIRY_ENDPOINT);assert.equal(options.method,'POST');
  assert.deepEqual(JSON.parse(String(options.body)),payload);
  return new Response(JSON.stringify({success:'true'}),{status:200});
 }) as typeof fetch;
 assertSubmissionAccepted(await sendEnquiry(payload,request));assert.equal(calls,1);
});
test('HTTP, invalid JSON and network failure do not show success or silently retry',async()=>{
 for(const request of [async()=>new Response('{}',{status:429}),async()=>new Response('not json'),async()=>{throw new Error('offline')}]){
  let calls=0;await assert.rejects(()=>sendEnquiry({},(async()=>{calls++;return request()}) as typeof fetch),/資料仍保留/);assert.equal(calls,1);
 }
});
