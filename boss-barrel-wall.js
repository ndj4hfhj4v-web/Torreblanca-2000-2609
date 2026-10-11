// First pass: one ground-level line from the near screen edge to the building.
function bossBarrelWallPosition(){
 const finalCamera=Math.max(0,worldW-W),anchor=finalCamera+W/.8192*.94-punkBackdropOffsetAt(finalCamera);
 return {x:streetPropWorldX(anchor),top:laneTop()-H*.12,bottom:laneBottom()+8};
}
function bossBarrelWallSize(){const height=punkBossHeight()*.62;return {height,width:height*smokingBarrelImage.width/smokingBarrelImage.height}}
function bossBarrelWallFootprint(){const p=bossBarrelWallPosition(),size=bossBarrelWallSize();return {left:p.x-size.width/2,right:p.x+size.width*.95,top:p.top,bottom:p.bottom+8}}
function bossBuildingBarrels(){
 const p=bossBarrelWallPosition(),size=bossBarrelWallSize();
 // Two cylinders against the building; their edge-to-edge gap is one width.
 return [3,1].map(offset=>({x:p.x-size.width*offset,y:p.top,...size}));
}
function drawBossBarrelWall(){
 if(introPhase==='none'||!smokingBarrelImage.complete||!smokingBarrelImage.naturalWidth)return;
 const p=bossBarrelWallPosition();if(p.x-cam<-140||p.x-cam>W/.8192+140)return;
 const {height,width}=bossBarrelWallSize();
 const count=Math.max(6,Math.ceil((p.bottom-p.top)/(width*.5))+1);
 for(let line=1;line>=0;line--)for(let row=0;row<count;row++){
  const spacing=(p.bottom-p.top)/(count-1);
  const y=p.top+spacing*(row-line*.5),x=p.x+line*width*.45;
  const draw=()=>{
   ctx.save();ctx.filter='brightness(.67) saturate(.8)';
   ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x-cam,y+2,width*.48,8,0,0,Math.PI*2);ctx.fill();
   const levels=line===1?((row===2||row===5)?3:2):1;
   for(let level=0;level<levels;level++)ctx.drawImage(smokingBarrelImage,x-cam-width/2,y-height-level*height*.98,width,height);
   ctx.restore();
  };
  // At each gap the second line sits farther right, behind the first.
  if(policeSceneQueue)policeSceneQueue.push({depth:y-line*.01,draw});else draw();
 }
 for(const barrel of bossBuildingBarrels()){
  const draw=()=>{ctx.save();ctx.filter='brightness(.67) saturate(.8)';ctx.drawImage(smokingBarrelImage,barrel.x-cam-barrel.width/2,barrel.y-barrel.height,barrel.width,barrel.height);ctx.restore()};
  if(policeSceneQueue)policeSceneQueue.push({depth:barrel.y,draw});else draw();
 }
}
const barrelWallSceneBase=drawIntroCar;
drawIntroCar=function(){const result=barrelWallSceneBase();drawBossBarrelWall();return result};
const barrelWallObstacleBase=streetObstacleAt;
streetObstacleAt=function(x,y){
 const obstacle=barrelWallObstacleBase(x,y);if(obstacle||introPhase!=='done')return obstacle;
 const r=bossBarrelWallFootprint();if(x>r.left-13&&x<r.right+13&&y>r.top-8&&y<r.bottom+8)return r;
 return bossBuildingBarrels().map(b=>({left:b.x-b.width/2,right:b.x+b.width/2,top:b.y-b.width*.18,bottom:b.y+4})).find(b=>x>b.left-13&&x<b.right+13&&y>b.top-8&&y<b.bottom+8)||null;
};
