// Settled corpses share the asphalt anchor, not the camera's gameplay plane.
const corpseSceneryAnchors=new Map();
function updateCorpseSceneryAnchors(){
 for(const actor of [...normalActors,jefe]){
  if(!actor.dead||!actor.active||actor.hidden){corpseSceneryAnchors.delete(actor);continue}
  // Let knockback and Pulido's falling animation finish before planting the body.
  if((typeof aerialFalls!=='undefined'&&aerialFalls.has(actor))||actor.specialLiftOffset){
   corpseSceneryAnchors.delete(actor);continue;
  }
  if(!corpseSceneryAnchors.has(actor))corpseSceneryAnchors.set(actor,actor.x-streetPropWorldX(0));
  actor.x=streetPropWorldX(corpseSceneryAnchors.get(actor));
 }
}
const corpseSceneryUpdateBase=update;
update=function(dt){const result=corpseSceneryUpdateBase(dt);updateCorpseSceneryAnchors();return result};
const corpseSceneryResetBase=resetWaveActor;
resetWaveActor=function(actor,...args){corpseSceneryAnchors.delete(actor);return corpseSceneryResetBase(actor,...args)};
const corpseScenerySelectBase=selectCharacter;
selectCharacter=function(name){corpseSceneryAnchors.clear();return corpseScenerySelectBase(name)};
