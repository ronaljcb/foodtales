import axios, { AxiosError } from 'axios';
import {DEMO,demoRequest} from './api';
const http=axios.create();
if(DEMO) http.defaults.adapter=async config=>{
 const url=new URL(config.url||'/api','https://demo.local');
 if(config.params)for(const [k,v] of Object.entries(config.params))if(v!=null)url.searchParams.set(k,String(v));
 const response=await demoRequest(url.toString(),{method:config.method,body:config.data});
 const result={data:await response.json(),status:response.status,statusText:response.statusText,headers:{},config};
 if(!response.ok)throw new AxiosError(result.data.message||'Error en demo',String(response.status),config,undefined,result);
 return result;
};
export default http;
