// Remove detached export remnants without resizing or repositioning the sprites.
function cleanEnemyFrame(source){
 const canvas=document.createElement('canvas');
 canvas.width=source.naturalWidth||source.width;canvas.height=source.naturalHeight||source.height;
 const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(source,0,0);
 const pixels=context.getImageData(0,0,canvas.width,canvas.height),data=pixels.data,w=canvas.width,h=canvas.height;
 const visited=new Uint8Array(w*h),parts=[];
 for(let p=0;p<w*h;p++){
  if(visited[p]||!data[p*4+3])continue;
  const stack=[p],indices=[];visited[p]=1;let left=w,right=0,top=h,bottom=0;
  while(stack.length){
   const q=stack.pop(),x=q%w,y=Math.floor(q/w);indices.push(q);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;
    const n=ny*w+nx;if(!visited[n]&&data[n*4+3]){visited[n]=1;stack.push(n)}
   }
  }
  parts.push({indices,left,right,top,bottom});
 }
 if(!parts.length)return source;
 const body=parts.reduce((a,b)=>a.indices.length>b.indices.length?a:b);let removed=0;
 for(const part of parts){
  // Keep detached details within the body bounds; discard only external debris.
  if(part===body||!(part.right<body.left-2||part.left>body.right+2||part.bottom<body.top-2||part.top>body.bottom+2))continue;
  for(const p of part.indices){data[p*4+3]=0;removed++}
 }
 if(!removed)return source;
 context.putImageData(pixels,0,0);canvas.complete=true;canvas.naturalWidth=w;canvas.naturalHeight=h;
 return canvas;
}
// Clothing palette only: preserve dimensions, alpha, animation and skin tones.
function darkTracksuitPixel(r,g,b){
 if(r>65&&g<r*.25&&b<r*.25)return [Math.round(r*.56),Math.round(g*.65),Math.min(255,Math.round(b*.65+r*.065))];
 if(Math.max(r,g,b)-Math.min(r,g,b)<26&&Math.max(r,g,b)>55)return [Math.round(r*.59),Math.round(g*.61),Math.round(b*.64)];
 return [r,g,b];
}
function darkenTracksuitFrame(source){
 const sheet=document.createElement('canvas');sheet.width=source.naturalWidth||source.width;sheet.height=source.naturalHeight||source.height;
 const paint=sheet.getContext('2d',{willReadFrequently:true});paint.drawImage(source,0,0);
 const pixels=paint.getImageData(0,0,sheet.width,sheet.height),data=pixels.data;
 for(let i=0;i<data.length;i+=4){if(!data[i+3])continue;const rgb=darkTracksuitPixel(data[i],data[i+1],data[i+2]);data[i]=rgb[0];data[i+1]=rgb[1];data[i+2]=rgb[2]}
 paint.putImageData(pixels,0,0);sheet.complete=true;sheet.naturalWidth=sheet.width;sheet.naturalHeight=sheet.height;return sheet;
}
for(const set of [yonki3Nike,kani2]){
 for(const key of Object.keys(set)){
  const frames=Array.isArray(set[key])?set[key]:[set[key]];
  frames.forEach((source,index)=>{
   const apply=()=>{const cleaned=darkenTracksuitFrame(cleanEnemyFrame(source));if(Array.isArray(set[key]))set[key][index]=cleaned;else set[key]=cleaned};
   if(source.complete&&(source.naturalWidth||source.width))apply();else source.addEventListener('load',apply,{once:true});
  });
 }
}
