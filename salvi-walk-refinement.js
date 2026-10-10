// One coherent sheet; original sprites remain untouched as fallbacks.
const salviRefineSheet=imgFromData('assets/characters/salvi/walk-guard-revision-v1.png');
let salviRefineFrames=null,salviRefineClock=0;
function prepareSalviRefinement(){
 if(!salviRefineSheet.complete||!salviRefineSheet.naturalWidth)return;
 const sheet=document.createElement('canvas');sheet.width=salviRefineSheet.naturalWidth;sheet.height=salviRefineSheet.naturalHeight;
 const sheetPaint=sheet.getContext('2d');sheetPaint.drawImage(salviRefineSheet,0,0);
 const sw=sheet.width,sh=sheet.height,pixels=sheetPaint.getImageData(0,0,sw,sh).data,seen=new Uint8Array(sw*sh),groups=[];
 for(let start=0;start<sw*sh;start++){
  if(seen[start]||pixels[start*4+3]<=60)continue;
  const queue=[start];seen[start]=1;let left=sw,top=sh,right=0,bottom=0;
  for(let k=0;k<queue.length;k++){const p=queue[k],x=p%sw,y=Math.floor(p/sw);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(const n of [x?p-1:-1,x<sw-1?p+1:-1,y?p-sw:-1,y<sh-1?p+sw:-1])if(n>=0&&!seen[n]&&pixels[n*4+3]>60){seen[n]=1;queue.push(n)}
  }
  if(queue.length>1000)groups.push({left,top,right,bottom,count:queue.length,points:queue});
 }
 const largest=groups.sort((a,b)=>b.count-a.count).slice(0,12).sort((a,b)=>a.top-b.top),regions=[];
 if(largest.length!==12)return;
 for(let row=0;row<3;row++)regions.push(...largest.slice(row*4,row*4+4).sort((a,b)=>a.left-b.left));
 salviRefineFrames=[];
 for(let index=0;index<12;index++){
  const r=regions[index],surface=document.createElement('canvas');surface.width=r.right-r.left+1;surface.height=r.bottom-r.top+1;
  const paint=surface.getContext('2d');paint.drawImage(salviRefineSheet,r.left,r.top,surface.width,surface.height,0,0,surface.width,surface.height);
  const w=surface.width,h=surface.height,cell=paint.getImageData(0,0,w,h),d=cell.data,mask=new Uint8Array(w*h);
  for(const p of r.points)mask[(Math.floor(p/sw)-r.top)*w+p%sw-r.left]=1;
  for(let p=0;p<w*h;p++)if(!mask[p])d[p*4+3]=0;
  paint.putImageData(cell,0,0);
  let top=h,bottom=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>60){top=Math.min(top,y);bottom=Math.max(bottom,y)}
  // Stable torso registration (not the lowest shoe, which alternates each step).
  let sum=0,count=0;
  for(let y=Math.floor(top+(bottom-top)*.38);y<top+(bottom-top)*.49;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>60){sum+=x;count++}
  // Raised bat must not contribute to body height; hair starts below its tip.
  const headTop=index===8||index===9?top+Math.round((bottom-top)*.065):top;
  salviRefineFrames.push({image:surface,anchorX:count?sum/count:w/2,bottom,height:bottom-headTop+1});
 }
}
salviRefineSheet.onload=prepareSalviRefinement;prepareSalviRefinement();
const salviRefineUpdateBase=update;
update=function(dt){salviRefineClock+=dt*16.67;return salviRefineUpdateBase(dt)};
const salviRefineDrawBase=drawPlayer;
drawPlayer=function(){
 if(selectedCharacter!=='salvi'||!salviRefineFrames||introPhase!=='done'||jumpActive||playerDead||playerKnocked||playerHitTimer>0||batSpecialActive()||pakoBatAttack){return salviRefineDrawBase()}
 let index;
 if(state==='walk')index=(pakoHasBat?4:0)+Math.floor(walkDistance/14)%4;
 else if(state==='idle')index=(pakoHasBat?8:10)+Math.floor(salviRefineClock/330)%2;
 else return salviRefineDrawBase();
 const frame=salviRefineFrames[index],bodyHeight=salviRefineFrames.slice(0,4).reduce((sum,f)=>sum+f.height,0)/4;
 const scale=mobileGameplayScale(.71)*salvi.f1HeightReference/bodyHeight;
 ctx.save();ctx.translate(player.x-cam,player.y);ctx.scale(facing,1);
 ctx.drawImage(frame.image,-frame.anchorX*scale,-frame.bottom*scale,frame.image.width*scale,frame.image.height*scale);ctx.restore();
};
// Measure the original standing body's height to retain the existing game size.
function salviOriginalHeight(){
 if(!salvi.idle.complete||!salvi.idle.width)return;
 const c=document.createElement('canvas');c.width=salvi.idle.width;c.height=salvi.idle.height;
 const p=c.getContext('2d');p.drawImage(salvi.idle,0,0);const d=p.getImageData(0,0,c.width,c.height).data;
 let top=c.height,bottom=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>60){top=Math.min(top,y);bottom=Math.max(bottom,y)}
 salvi.f1HeightReference=bottom-top+1;
}
salvi.f1HeightReference=salvi.idle.height||225;
if(salvi.idle.complete)salviOriginalHeight();else salvi.idle.addEventListener('load',salviOriginalHeight);
