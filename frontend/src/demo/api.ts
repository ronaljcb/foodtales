import {store,save,reply,payload,mutate} from './core';
const photo=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
const foodPhoto=photo('photo-1546069901-ba9599a7e63c');
const user={userId:'1',name:'Explorador FoodTales',email:'demo@foodtales.local',bio:'Historias y sabores de Lima. Perfil ficticio de demostración.',userType:'INFLUENCER',profilePicture:'',createdAt:'2026-01-01',updatedAt:'2026-01-01'};
const restaurants=[{restaurantId:1,name:'Mesa Criolla',email:'demo@mesacriolla.local',latitude:-12.121,longitude:-77.03,image:photo('photo-1517248135467-4c7edcad34c4'),status:'OPEN',createdDate:'2026-01-01'},{restaurantId:2,name:'Verde & Grano',email:'demo@verde.local',latitude:-12.116,longitude:-77.04,image:photo('photo-1414235077428-338989a2e8c0'),status:'OPEN',createdDate:'2026-01-02'},{restaurantId:3,name:'Costa de Sabores',email:'demo@costa.local',latitude:-12.13,longitude:-77.02,image:photo('photo-1552566626-52f8b828add9'),status:'OPEN',createdDate:'2026-01-03'}];
const foods=[{foodId:1,name:'Bowl de la casa',description:'Quinua, vegetales y un toque de limón.',price:28,restaurantId:1,status:'AVAILABLE',imageUrl:foodPhoto},{foodId:2,name:'Ensalada de estación',description:'Ingredientes frescos y sabores de temporada.',price:24,restaurantId:2,status:'AVAILABLE',imageUrl:foodPhoto},{foodId:3,name:'Especial de la costa',description:'La recomendación del chef.',price:36,restaurantId:3,status:'AVAILABLE',imageUrl:foodPhoto}];
const posts=[{postId:1,title:'Una mesa, muchas historias',content:'Exploramos los sabores de Lima. ¿Cuál es ese restaurante al que siempre quieres volver?',image:foodPhoto,createdDate:'2026-10-01',status:'ACTIVE',userId:1,userName:user.name,userProfilePicture:''},{postId:2,title:'El sabor de descubrir',content:'Productos de temporada, platos para compartir y buenas conversaciones. Así empieza nuestra ruta gastronómica.',image:restaurants[0].image,createdDate:'2026-10-02',status:'ACTIVE',userId:2,userName:'Comunidad FoodTales',userProfilePicture:''}];
export const DEMO=import.meta.env.VITE_DEMO_MODE !== 'false';
export async function demoRequest(input: string, init: RequestInit = {}): Promise<Response> {
 if(!DEMO) return fetch(input,init);
 const url=new URL(input,window.location.origin), p=url.pathname.replace(/^\/api/,'');
 const method=(init.method||'GET').toUpperCase(); const b=await payload(init.body);
 const current=store('foodtales:v1:users',[user])[0];
 if(p.startsWith('/auth/')) {
  if(p.endsWith('register')) { const {password: _password,...profile}=b; void _password; save('foodtales:v1:users',[{...user,...profile}]); }
  else if(b.email!=='demo@foodtales.local' || b.password!=='Demo123!') return reply({message:'Usa demo@foodtales.local y Demo123! para explorar.'},401);
  return reply({token:'demo-local-session',user:store('foodtales:v1:users',[user])[0]});
 }
 if(p.startsWith('/users/')) return method==='GET'?reply(current):mutate('foodtales:v1:users',[current],method,current.userId,b,'userId');
 let key='', seed:Row[]=[], idKey='';
 if(p.startsWith('/restaurants')){key='restaurants';seed=restaurants;idKey='restaurantId';}
 else if(p.startsWith('/foods')){key='foods';seed=foods;idKey='foodId';}
 else if(p.startsWith('/posts')){key='posts';seed=posts;idKey='postId';}
 else if(p.startsWith('/comments')){key='comments';idKey='commentId';}
 else if(p.startsWith('/restaurantratings')){key='restaurant-ratings';idKey='restaurantRatingId';}
 else if(p.startsWith('/foodratings')){key='food-ratings';idKey='foodRatingId';}
 else return reply({message:'Ruta de demo no disponible'},404);
 const storageKey=`foodtales:v1:${key}`,rows=store(storageKey,seed),parts=p.split('/').filter(Boolean);
 if(method==='GET') {
  if(p.includes('/restaurants/')&&parts[0]==='foods') return reply(rows.filter(r=>String(r.restaurantId)===parts[2]));
  if(parts.includes('comments')&&parts[0]!=='comments') return reply(rows.filter(r=>String(r.restaurantId||r.foodId)===parts[2]));
  if(parts[0]==='comments'&&parts[1]==='post')return reply(rows.filter(r=>String(r.postId)===parts[2]));
  if(parts[1]&&/^\d+$/.test(parts[1]))return reply(rows.find(r=>String(r[idKey])===parts[1])||{},rows.some(r=>String(r[idKey])===parts[1])?200:404);
  const q=(url.searchParams.get('search')||'').toLowerCase();return reply(rows.filter(r=>!q||String(r.name||r.title||'').toLowerCase().includes(q)));
 }
 return mutate(storageKey,rows,method,parts[1],{...b, userId:b.userId||1,userName:current.name,userProfilePicture:current.profilePicture,createdDate:new Date().toISOString(),createdAt:new Date().toISOString(),imageUrl:b.image||b.imageUrl},idKey);
}
type Row=Record<string,any>;
