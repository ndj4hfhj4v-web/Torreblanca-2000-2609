(function(root){
 'use strict';
 function prepare(image,makeCanvas,count=12,columns=4){
  const w=image.width,h=image.height,c=makeCanvas(w,h),ctx=c.getContext('2d');ctx.drawImage(image,0,0);
  const pixels=ctx.getImageData(0,0,w,h),d=pixels.data,seen=new Uint8Array(w*h),groups=[];
  for(let p=0;p<w*h;p++){
   if(seen[p]||d[p*4+3]<=40)continue;
   const queue=[p];seen[p]=1;let left=w,right=0,top=h,bottom=0,sx=0,sy=0;
   for(let i=0;i<queue.length;i++){
    const q=queue[i],x=q%w,y=Math.floor(q/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);sx+=x;sy+=y;
    for(const n of [x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!seen[n]&&d[n*4+3]>40){seen[n]=1;queue.push(n)}
   }
   groups.push({queue,left,right,top,bottom,cx:sx/queue.length,cy:sy/queue.length});
  }
  const large=groups.sort((a,b)=>b.queue.length-a.queue.length).slice(0,count).sort((a,b)=>a.cy-b.cy),ordered=[];
  if(large.length!==count||large.some(g=>g.queue.length<2000))throw Error('No se han encontrado los fotogramas completos');
  for(let row=0;row<count/columns;row++)ordered.push(...large.slice(row*columns,row*columns+columns).sort((a,b)=>a.cx-b.cx));
  const frames=ordered.map(g=>{
   const left=Math.max(0,g.left-2),top=Math.max(0,g.top-2),cw=Math.min(w,g.right+3)-left,ch=Math.min(h,g.bottom+3)-top;
   const out=makeCanvas(cw,ch),paint=out.getContext('2d'),data=paint.createImageData(cw,ch);
   // Each connected silhouette owns its pixels even when the lash crosses a cell boundary.
   for(const p of g.queue){const x=p%w-left,y=Math.floor(p/w)-top,q=(y*cw+x)*4;data.data.set(d.subarray(p*4,p*4+4),q)}
   paint.putImageData(data,0,0);
   const band=[];
   for(const p of g.queue){const y=Math.floor(p/w);if(y>=g.top+(g.bottom-g.top)*.48&&y<=g.top+(g.bottom-g.top)*.58)band.push(p%w)}
   band.sort((a,b)=>a-b);
   return {image:out,height:g.bottom-g.top+1,anchorX:band[Math.floor(band.length/2)]-left,anchorY:g.bottom-top,pixelCount:g.queue.length};
  });
  const standing=frames.slice(0,4).map(f=>f.height).sort((a,b)=>a-b);
  return {frames,height:(standing[1]+standing[2])/2};
 }
 function paint(ctx,frame,x,y,scale,mirror){scale*=frame.relativeScale||1;ctx.save();ctx.translate(x,y);ctx.scale(mirror?-scale:scale,scale);ctx.drawImage(frame.image,-frame.anchorX,-frame.anchorY);ctx.restore()}
 root.PunkBossPreview={prepare,paint};
 if(typeof module!=='undefined')module.exports=root.PunkBossPreview;
})(typeof window==='undefined'?globalThis:window);
