export const ENQUIRY_ENDPOINT='https://formsubmit.co/ajax/sylvanorigin@gmail.com';

export function assertSubmissionAccepted(data:unknown):void {
 const response=data&&typeof data==='object'?data as Record<string,unknown>:{};
 const message=typeof response.message==='string'?response.message:'';
 // A 200 response and the non-empty string "false" both occur on provider errors.
 if(/activat|confirm.*(?:email|form)|verify.*email/i.test(message)){
  throw new Error('本店收件信箱尚待啟用，暫未能完成提交。你的資料仍保留，請稍後再試。');
 }
 if(response.success!==true&&response.success!=='true'){
  throw new Error('寄信服務暫未接受這次查詢，請稍後再試。你的購物車及表單資料仍然保留。');
 }
}

export async function sendEnquiry(payload:Record<string,string>,request:typeof fetch=fetch):Promise<unknown>{
 try{
  const response=await request(ENQUIRY_ENDPOINT,{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
   referrerPolicy:'strict-origin-when-cross-origin',
   body:JSON.stringify(payload),signal:AbortSignal.timeout(25000),
  });
  if(!response.ok)throw new Error('delivery-http-error');
  return await response.json();
 }catch{
  throw new Error('暫時未能確認是否已送出，請稍後重試。你的資料仍保留；重試時會沿用相同查詢編號，方便本店核對。');
 }
}
