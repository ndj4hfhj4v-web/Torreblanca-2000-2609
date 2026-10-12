// Specials are disabled for every selectable character, on keyboard and touch.
function clearDisabledSpecials(){
 const active=rafaSpecialAttack||pulidoSpecialAttack||salviSpecialAttack||cajamanSpecialAttack;
 if(active){
  for(const actor of combatActors()){delete actor.specialLiftOffset;delete actor.specialFallStart;}
  attackTimer=0;state=playerDead?'dead':playerKnocked?'down':'idle';
 }
 rafaSpecialAttack=null;pulidoSpecialAttack=null;salviSpecialAttack=null;cajamanSpecialAttack=null;
 rafaSpecialMeter=0;specialPressed=false;
}
specialAvailable=function(){return false};
gainRafaSpecial=function(){};
drawSpecialMeter=function(){};
usesPunchBarrage=function(){return false};
startRafaSpecial=function(){};
const noSpecialUpdateBase=update;
update=function(...args){clearDisabledSpecials();return noSpecialUpdateBase(...args)};
clearDisabledSpecials();
