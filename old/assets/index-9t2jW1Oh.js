(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();function O(e,t,r,l){e.camera(t.x,t.y,t.z,r.x,r.y,r.z,l.x,l.y,l.z)}function Z(e){e%=80;let t=Math.floor(e/80*24)%24,r=Math.round((e-t*80/24)*18%60),l=t%12===0?"12":String(t%12),o=String(r).padStart(2,0),a=t<12?"AM":"PM",s="";return e===0?s=`
(midnight)`:e===40&&(s=`
(noon)`),`${l}:${o} ${a}${s}`}function v(e,t,r,l,o=!1){let a=l.elt.max-l.elt.min,s=t.copy(),i=r.copy(),n=e.map(l.value(),l.elt.min,l.elt.max,0,1);return o&&(l.value()<a/2?(s=t.copy(),i=e.createVector(1,1,0),n=e.map(l.value(),l.elt.min,a/2,0,1)):(s=e.createVector(1,1,0),i=e.createVector(0,1,0),n=e.map(l.value()-a/2,l.elt.min,a/2,0,1))),s.copy().lerp(i,n)}function W(e){let t=e.mouseX>=0&&e.mouseX<e.width,r=e.mouseY>=0&&e.mouseY<e.height;return t&&r}function I(e,t,r,l,o=[0,0]){let a=e.createVector(t.centerX,t.centerY,t.centerZ),s=e.createVector(t.eyeX,t.eyeY,t.eyeZ),i=a.sub(s).normalize(),n=s.copy().add(i.mult(100));e.textSize(l),B(e,t,r,n,e.CENTER,o)}function B(e,t,r,l,o=null,a=[0,0]){e.push(),o&&e.textAlign(o),e.translate(l),J(e,t);let s=e.textWidth(r),i=e.textAscent(),n=o==e.CENTER?0:-s/2+a[0],c=i/2+a[1];e.text(r,n,c),e.pop()}function $(e,t){let r=t,l=e.createVector(1,1,1),o=r.cross(l).normalize(),a=r.cross(o).normalize(),s=[o.x,o.y,o.z,0,a.x,a.y,a.z,0,r.x,r.y,r.z,0,0,0,0,1];e.applyMatrix(...s)}function J(e,t,r=[1,1,1]){let l=e.createVector(t.eyeX,t.eyeY,t.eyeZ),o=e.createVector(-t.upX,-t.upY,-t.upZ),i=e.createVector(t.centerX,t.centerY,t.centerZ).copy().sub(l).normalize().copy().mult(-1);i.normalize().mult(r[2]);let n=i.copy().cross(o);n.normalize().mult(r[0]);let c=i.copy().cross(n);c.normalize().mult(r[1]);let u=[n.x,n.y,n.z,0,c.x,c.y,c.z,0,i.x,i.y,i.z,0,0,0,0,1];e.applyMatrix(...u)}class A{constructor(t,r,l){this.p=t,this.fam=r,this.isTTF=l,this.fonts=this.loadFonts()}loadFonts(){const[t,r]=[this.p,this.fam];let l=this.isTTF?".ttf":".otf",o="/moon/old",a=t.loadFont(`${o}/assets/${r}/${r}-Regular${l}`),s=t.loadFont(`${o}/assets/${r}/${r}-Bold${l}`),i=t.loadFont(`${o}/assets/${r}/${r}-Italic${l}`),n=t.loadFont(`${o}/assets/${r}/${r}-BoldItalic${l}`);return[a,s,i,n]}regular(){return this.fonts[0]}bold(){return this.fonts[1]}italic(){return this.fonts[2]}bolditalic(){return this.fonts[3]}}class D{constructor(t,r,l,o){this.p=t,this.pos=r,this.dir=l,this.size=o}draw(){const[t,r,l,o]=[this.p,this.pos,this.dir,this.size];t.push(),t.fill(255,0,0),t.stroke(255,0,0),l.normalize(),t.translate(r);let a=t.atan2(l.z,l.y);t.rotateX(a);let s=0;l.y!==1&&l.y!==-1&&(s=t.atan2(l.x,l.y),t.rotateZ(s)),t.strokeWeight(o/5),t.line(0,0,0,0,-o,0),t.strokeWeight(0),t.translate(0,-o,0),t.rotateX(t.PI),t.cone(o/4,o/2,10),t.pop()}}class M{constructor(t,r,l,o,a=80,s=null){this.p=t,this.pos=r||t.createVector(0,0,0),this.r=l,this.color=t.color(255),this.rot=o,this.res=t.TWO_PI/a,this.light=s||t.PI,this.shadowOn=!1,this.shadowColor=t.color(50,150)}instanceVars(){return[this.p,this.pos,this.r,this.color,this.rot,this.res,this.light]}draw(){const[t,r,l,o,a,s,i]=this.instanceVars();t.push(),t.translate(r),re(t,l,o,a,s,i),t.pop()}drawShadow(t){const[r,l,o,a,s,i,n]=this.instanceVars();r.push(),r.translate(l),r.rotateY(r.PI-n),r.rotateZ(-r.HALF_PI),r.translate(0,t/2,0),r.fill(this.shadowColor),r.cylinder(o+1,t),r.pop()}rotate(t){this.rot=(this.rot-t*this.res)%this.p.TWO_PI}showShadow(){this.shadowOn=!0}hideShadow(){this.shadowOn=!1}drawPerson(t=!1){const[r,l,o,a,s,i,n]=this.instanceVars();t&&(r.push(),r.translate(l),r.rotateY(-s),r.translate(o,0,0),r.fill(255,255,0,30),$(r,r.createVector(0,0,0).sub(l)),r.circle(0,0,o*6),r.pop()),r.push(),r.translate(l),r.rotateY(-s),r.translate(o+2,0,0),r.fill("red"),r.sphere(4),r.pop()}}class C extends M{constructor(t,r,l,o,a=80,s=0){super(t,r,l,o,a,s),this.color=t.color(200)}}class R extends M{constructor(t,r,l,o,a=80,s=0){super(t,r,l,o,a,s),this.color=t.color(4,21,207),this.shadowColor=t.color(30,200)}}class H extends M{constructor(t,r,l,o,a=80){super(t,r,l,o,a,-1),this.color=t.color("orange")}}function p(e,t){return e.color(e.red(t)*.15,e.green(t)*.15,e.blue(t)*.15)}function ee(e,t,r){let l=e.random(-5,r);return e.color(e.red(t)+l,e.green(t)+l,e.blue(t)+l)}function te(e,t,r){if(r<0)return!0;let l=Math.abs(t-r)%e.TWO_PI;return l>e.PI&&(l=e.TWO_PI-l),l<e.PI/2}function re(e,t,r,l,o,a){e.beginShape(e.TRIANGLES);for(let s=l;s<l+e.TWO_PI;s+=o){let i=te(e,s+o/2,a)?r:p(e,r);for(let n=-e.PI/2;n<e.PI/2;n+=o){let c=e.cos(n)*e.cos(s)*t,u=e.sin(n)*t,h=e.cos(n)*e.sin(s)*t,m=e.cos(n+o)*e.cos(s)*t,P=e.sin(n+o)*t,V=e.cos(n+o)*e.sin(s)*t,y=e.cos(n)*e.cos(s+o)*t,f=e.sin(n)*t,d=e.cos(n)*e.sin(s+o)*t,w=e.cos(n+o)*e.cos(s+o)*t,g=e.sin(n+o)*t,b=e.cos(n+o)*e.sin(s+o)*t;e.shininess(10),e.fill(ee(e,i,5)),e.vertex(c,u,h),e.vertex(m,P,V),e.vertex(y,f,d),e.vertex(y,f,d),e.vertex(m,P,V),e.vertex(w,g,b)}}e.endShape()}class S{constructor(t,r,l,o,a){this.p=t,this.pri=r,this.sat=l,this.r=o,this.tilt=a.normalize(),this.rev=t.HALF_PI,this.showOrbitPath=!1,this.showPrimary=!0}instanceVariables(){return[this.p,this.pri,this.sat,this.r,this.tilt,this.rev]}calculateCoords(){const[t,r,l,o,a,s]=this.instanceVariables();let i=a,n=t.createVector(1,0,0),c=i.cross(n).normalize(),u=i.cross(c).normalize(),h=c.mult(o*t.cos(s)),m=u.mult(o*t.sin(s));return r.pos.copy().add(h).add(m)}render(){const[t,r,l,o,a,s]=this.instanceVariables();this.showOrbitPath&&this.drawOrbit(),this.showPrimary&&r.draw(),l.pos=this.calculateCoords(),l.draw()}revolve(t){this.rev-=t}drawOrbit(){const[t,r,l,o,a,s]=this.instanceVariables();t.push(),t.translate(r.pos),$(t,a),t.fill(255,255,255,30),t.strokeWeight(.5),t.torus(o,1,50),t.pop()}drawOrbitalPlane(t){const[r,l,o,a,s,i]=this.instanceVariables();r.push(),r.translate(l.pos),$(r,s),r.fill(t);let n=a*3;r.circle(0,0,n),r.pop()}showOrbit(){this.showOrbitPath=!0}hideOrbit(){this.showOrbitPath=!1}setOrbitAngle(t){this.rev=t}}const T=document.getElementById("main").getBoundingClientRect().width,oe=e=>{let t,r=-e.HALF_PI,l=e.TWO_PI/80;e.setup=()=>{e.createCanvas(T,T*2/3,e.WEBGL),e.noStroke(),e.frameRate(10);let o=e.createVector(0,0,0);t=new C(e,o,100,0)},e.draw=()=>{e.background(0),e.randomSeed(1),e.rotateY(r),r-=l,t.draw(),t.rotate(1)}},le=e=>{let t,r,l,o,a=e.TWO_PI/80,s,i;e.preload=()=>{i=new A(e,"Roboto",!0)},e.setup=()=>{e.createCanvas(T,T*2/3,e.WEBGL),e.noStroke(),e.frameRate(10);let n=e.createVector(0,0,0);t=new R(e,n,40,0,80),r=new C(e,null,10,0,80),l=new S(e,t,r,180,e.createVector(0,-1,0)),l.showOrbit(),o=e.createCamera(),o.camera(0,-400,0,0,0,0,0,0,1);let c=e.createVector(-250,0,0),u=e.createVector(-1,0,0);s=new D(e,c,u,30),e.textFont(i.regular())},e.draw=()=>{e.background(0),e.randomSeed(1),l.render(),l.revolve(a),t.rotate(28),r.rotate(1),s.draw(),e.textSize(20),e.fill("red"),B(e,o,"Sun",e.createVector(-265,0,20),1)}},ae=e=>{let t,r,l,o,a,s=e.TWO_PI/80,i=0,n=0,c=!1;e.preload=()=>{r=new A(e,"Roboto",!0)},e.setup=()=>{e.createCanvas(T,T,e.WEBGL),e.noStroke(),e.frameRate(10),e.textFont(r.regular()),t=e.createCamera(),t.camera(0,-800,0,0,0,0,0,0,1),e.perspective(e.PI/5,e.width/e.height,.1,1e3);let h=e.createVector(0,0,0);l=new R(e,h,60,0,80),o=new C(e,null,15,0,80),a=new S(e,l,o,200,e.createVector(.1,-1,0)),a.showOrbit()};function u(){let h=i%e.TWO_PI;return h<e.HALF_PI?"new moon":h<e.PI?"first quarter":h<e.PI*3/2?"full moon":"third quarter"}e.draw=()=>{if(e.background(0),e.randomSeed(1),a.render(),c)a.revolve(s),l.rotate(28),o.rotate(1),i+=s,c=i<n;else{e.textSize(15),e.fill("white");let h=l.pos.copy().sub(o.pos),m=o.pos.copy().add(h.mult(.3));B(e,t,u(),m)}e.fill(200),I(e,t,`Click for
next quarter`,2,[0,-7.5])},e.mouseClicked=()=>{W(e)&&!c&&(c=!0,n+=e.HALF_PI)}},z=(e,t)=>r=>{let l,o,a,s,i,n=r.TWO_PI/80,c,u=r.createVector(0,-800,0),h=r.createVector(0,0,0),m=r.createVector(0,0,1),P=!1;r.preload=()=>{o=new A(r,"Roboto",!0)},r.setup=()=>{let d=t?T:T/2;r.createCanvas(d,d,r.WEBGL),r.noStroke(),r.frameRate(10),r.textFont(o.regular()),l=r.createCamera(),O(l,u,h,m),r.perspective(r.PI/5,r.width/r.height,.1,1e3);let w=r.createVector(0,0,0);a=new R(r,w,60,0,80),s=new C(r,null,15,0,80),i=new S(r,a,s,200,r.createVector(0,-1,0)),i.setOrbitAngle(r.HALF_PI-e*r.HALF_PI),i.showOrbit(),c=r.createSlider(0,100,0),c.size(r.width-10)},r.draw=()=>{r.background(0),r.randomSeed(1);let d=r.canvas.getBoundingClientRect();c.position(d.left+window.scrollX+2,d.top+window.scrollY+r.height+10),i.render(),t&&(P?(i.revolve(n),a.rotate(28),s.rotate(1)):(r.fill(200),I(r,l,"Click to start animation",2,[0,-29])));let w=s.pos.copy().sub(a.pos).normalize(),g=a.pos.copy().add(w.mult(a.r+1)),b=s.pos.copy(),x=r.createVector(0,1,0),L=v(r,u,g,c),k=v(r,h,b,c),U=!P&&r.abs(i.rev,r.PI)<r.PI/8,Y=v(r,m,x,c,U);O(l,L,k,Y);let X=s.pos.copy(),K=Y.copy();X.add(K.mult(30));let j=r.map(c.value(),c.elt.min,c.elt.max,20,5);r.textSize(j),B(r,l,f(),X)};function V(d){return r.createVector(-r.sin(d),0,r.cos(d))}function y(d){return V(r.HALF_PI-d/2*r.HALF_PI)}function f(){let d=["new moon","waxing crescent","first quarter","waxing gibbous","full moon","waning gibbous","third quarter","waning crescent"],w=V(i.rev);for(let g=0;g<8;g++)if(w.angleBetween(y(g))<r.PI/8)return d[g];return""}r.mouseClicked=()=>{W(r)&&(P=!P)},r.stopAnimation=()=>{P=!1},r.hideSlider=()=>{c&&c.hide()},r.showSlider=()=>{c&&c.show()}},E=document.getElementById("main").getBoundingClientRect().width,se=e=>{let t,r,l,o,a,s,i,n,c=e.createVector(0,-1e3,0),u=e.createVector(0,0,0),h=e.createVector(0,0,1);e.preload=()=>{r=new A(e,"Roboto",!0),n=e.createSlider(0,100,0)},e.setup=()=>{e.createCanvas(E,E/3,e.WEBGL),e.noStroke(),e.frameRate(10),e.textFont(r.italic()),t=e.createCamera(),O(t,c,u,h),e.perspective(e.PI/6,e.width/e.height,.1,2e3);let m=e.createVector(-550,0,0);l=new H(e,m,100,0),o=new R(e,null,60,0),a=new C(e,null,15,0),s=new S(e,l,o,950,e.createVector(0,-1,0)),s.rev=-e.HALF_PI,i=new S(e,o,a,200,e.createVector(0,-1,0)),i.rev=-e.HALF_PI,n.size(e.width-10)},e.draw=()=>{e.background(0),e.randomSeed(1);let m=e.canvas.getBoundingClientRect();n.position(m.left+window.scrollX+2,m.top+window.scrollY+e.height+10),e.createVector(t.eyeX,t.eyeY,t.eyeZ).dist(o.pos)>o.r&&(s.render(),i.render()),o.drawShadow(i.r*2),a.draw();let V=l.pos.copy().sub(o.pos),y=e.createVector(o.pos.x+V.x/5,o.pos.y-o.r*1.5,o.pos.z+o.r*2),f=a.pos.copy().sub(o.pos),d=a.pos.copy().sub(f.mult(.5)),w=e.createVector(0,1,0),g=v(e,c,y,n),b=v(e,u,d,n),x=v(e,h,w,n);O(t,g,b,x),e.fill(200),I(e,t,"(Sizes and distances not to scale)",4,[0,20])},e.hideSlider=()=>{n&&n.hide()},e.showSlider=()=>{n&&n.show()}},ne=e=>{let t,r,l,o,a,s,i,n,c=e.createVector(0,-1e3,0),u=e.createVector(0,0,0),h=e.createVector(0,0,1);e.preload=()=>{r=new A(e,"Roboto",!0),n=e.createSlider(0,100,0)},e.setup=()=>{e.createCanvas(E,E/3,e.WEBGL),e.noStroke(),e.frameRate(10),e.textFont(r.italic()),t=e.createCamera(),O(t,c,u,h),e.perspective(e.PI/6,e.width/e.height,.1,2e3);let m=e.createVector(-550,0,0);l=new H(e,m,100,0),o=new R(e,null,60,0),a=new C(e,null,15,0),s=new S(e,l,o,950,e.createVector(0,-1,0)),s.rev=-e.HALF_PI,i=new S(e,o,a,190,e.createVector(0,-1,0)),n.size(e.width-10)},e.draw=()=>{e.background(0),e.randomSeed(1);let m=e.canvas.getBoundingClientRect();n.position(m.left+window.scrollX+2,m.top+window.scrollY+e.height+10),e.createVector(t.eyeX,t.eyeY,t.eyeZ).dist(o.pos)>o.r&&(s.render(),i.render()),a.drawShadow(i.r),a.draw();let V=l.pos.copy().sub(o.pos).normalize(),y=o.pos.copy().add(V.mult(o.r+1)),f=a.pos.copy(),d=e.createVector(0,1,0),w=v(e,c,y,n),g=v(e,u,f,n),b=v(e,h,d,n);O(t,w,g,b),e.fill(200),I(e,t,"(Sizes and distances not to scale)",4,[0,20])},e.hideSlider=()=>{n&&n.hide()},e.showSlider=()=>{n&&n.show()}},G=e=>t=>{let r,l,o,a,s,i,n,c=t.TWO_PI/80,u,h=t.createVector(0,-1500,0),m=t.createVector(0,0,0),P=t.createVector(0,0,1),V=!1;t.preload=()=>{l=new A(t,"Roboto",!0),u=t.createSlider(0,100,0)},t.setup=()=>{t.createCanvas(E,E,t.WEBGL),t.noStroke(),t.frameRate(10),t.textFont(l.regular()),r=t.createCamera(),O(r,h,m,P),t.perspective(t.PI/2,t.width/t.height,.1,2e3);let y=t.createVector(0,0,0);o=new H(t,y,100,0),a=new R(t,null,60,0),s=new C(t,null,15,0),i=new S(t,o,a,950,t.createVector(0,-1,0)),i.rev=-t.HALF_PI;let f=t.radians(20),d=e?t.createVector(-t.sin(f),-t.cos(f),0):t.createVector(0,-1,0),w=e?300:190;n=new S(t,a,s,w,d),n.showPrimary=!1,n.showOrbit(),u.size(t.width-10)},t.draw=()=>{t.background(0),t.randomSeed(1);let y=t.canvas.getBoundingClientRect();if(u.position(y.left+window.scrollX+2,y.top+window.scrollY+t.height+10),i.render(),n.render(),a.drawShadow(n.r*2),s.drawShadow(n.r),i.drawOrbitalPlane(t.color(0,150,255,40)),V){let k=c/6;i.revolve(k),n.revolve(k*12),a.light-=k,s.light-=k,a.rotate(12),s.rotate(1)}else t.fill(255,255,255,200),t.textFont(l.regular()),I(t,r,"Click to start animation",5,[0,-90]);let f=o.pos.copy().sub(t.createVector(0,o.r*1.2,0)),d=a.pos.copy(),w=t.createVector(0,1,0),g=v(t,h,f,u),b=v(t,m,d,u),x=v(t,P,w,u);O(r,g,b,x),t.fill(200);let L=e?"(Moon's orbit angle exaggerated to 20°)":"(Sizes and distances not to scale)";t.textFont(l.italic()),I(t,r,L,5,[0,90])},t.mouseClicked=()=>{W(t)&&(V=!V)},t.stopAnimation=()=>{V=!1},t.hideSlider=()=>{u&&u.hide()},t.showSlider=()=>{u&&u.show()}},Q=document.getElementById("main"),F=Q.getBoundingClientRect().width,q=parseFloat(getComputedStyle(Q).fontSize),N=(e,t)=>r=>{let l,o,a,s,i,n,c,u=r.TWO_PI/80,h,m,P,V,y=t;r.preload=()=>{o=new A(r,"Roboto",!0),h=r.createSlider(0,80,0)},r.setup=()=>{r.createCanvas(F,F*2/3,r.WEBGL),r.noStroke(),r.frameRate(10),r.textFont(o.regular()),l=r.createCamera(),r.perspective(r.PI/2,r.width/r.height,.1,1e3),l.ortho(-F/2,F/2,-r.height/2,r.height/2,-1e3,1e3);let d=r.createVector(-200,0,0),w=e===0?30:80;a=new H(r,d,w,0),s=new R(r,null,60,0),i=new C(r,null,15,0);let g=e===0?600:500;n=new S(r,a,s,g,r.createVector(0,-1,0)),n.rev=-r.HALF_PI;let b=r.createVector(0,-1,0);c=new S(r,s,i,200,b),c.setOrbitAngle(r.HALF_PI-e*r.HALF_PI),c.showPrimary=!1,c.showOrbit(),h.size(r.width-10),n.render(),[m,P,V]=f(),O(l,m,P,V)},r.draw=()=>{r.background(0),r.randomSeed(1);let d=r.canvas.getBoundingClientRect();h.position(d.left+window.scrollX+2,d.top+window.scrollY+r.height+10),n.render(),c.render(),s.rot=-(t+h.value())*u,y=t+h.value(),O(l,...f()),s.drawPerson(!0),r.fill(200),r.textFont(o.regular()),I(r,l,Z(y),18,[0,-F*.28]),r.textFont(o.italic()),I(r,l,"(Sizes and distances not to scale)",12,[0,F*.3])},r.stopAnimation=()=>{},r.hideSlider=()=>{h&&h.hide()},r.showSlider=()=>{h&&h.show()};function f(){let d=a.pos.copy().sub(s.pos),w=d.copy().normalize(),g=r.createVector(0,1,0),b=w.copy().cross(g),x=s.pos.copy(),L=e===0;x.sub(w.mult(L?300:-400)).sub(g.mult(L?150:120)).add(b.mult(L?120:150));let k=L?s.pos.copy().add(d.mult(.5)):s.pos.copy(),U=r.createVector(0,1,0);return[x,k,U]}},ie=e=>{let t,r,l,o,a,s,i,n=e.TWO_PI/80,c,u,h,m,P,V=0;e.preload=()=>{r=new A(e,"Roboto",!0),c=e.createSlider(0,80,0),u=e.createSlider(0,100,0)},e.setup=()=>{e.createCanvas(F-q*1.5,F-q*1.5,e.WEBGL),e.noStroke(),e.frameRate(10),e.textFont(r.regular()),t=e.createCamera(),e.perspective(e.PI/2,e.width/e.height,.1,3e3);let f=e.createVector(-800,0,0);l=new H(e,f,100,0),o=new R(e,null,60,0),a=new C(e,null,15,0);let d=1600;s=new S(e,l,o,d,e.createVector(0,-1,0)),s.rev=-e.HALF_PI;let w=e.createVector(0,-1,0);i=new S(e,o,a,200,w),i.setOrbitAngle(e.HALF_PI),i.showPrimary=!1,i.showOrbit(),c.size(e.width-10),u.size(e.height-10),u.style("transform","rotate(-90deg)"),u.style("transform-origin","left top"),s.render(),[h,m,P]=y(),O(t,h,m,P)},e.draw=()=>{e.background(0),e.randomSeed(1);let f=e.canvas.getBoundingClientRect();c.position(f.left+window.scrollX+2,f.top+window.scrollY+e.height+10),u.position(f.right+window.scrollX+10,f.top+window.scrollY+e.height-4),s.render(),i.render(),V=c.value(),o.rot=-V*n;let d=e.createVector(-300,-1e3,-300),w=e.createVector(0,0,0),g=e.createVector(-1,0,-1).normalize(),b=v(e,h,d,u),x=v(e,m,w,u),L=v(e,P,g,u);O(t,b,x,L),W(e)&&e.mouseIsPressed?(i.revolve(n),a.rotate(1)):(e.textFont(r.italic()),I(e,t,"Hold mouse to move Moon",4,[0,90])),o.drawPerson(!0),e.fill(200),e.textFont(r.regular()),I(e,t,Z(V),6,[0,-90])},e.stopAnimation=()=>{},e.hideSlider=()=>{c&&c.hide(),u&&u.hide()},e.showSlider=()=>{c&&c.show(),u&&u.show()};function y(){let f=l.pos.copy().sub(o.pos),d=f.copy().normalize(),w=e.createVector(0,1,0),g=d.copy().cross(w),b=o.pos.copy();b.sub(d.mult(300)).sub(w.mult(50)).add(g.mult(150));let x=o.pos.copy().add(f.mult(.1)),L=e.createVector(0,1,0);return[b,x,L]}},ce={moonPhases:oe,moonRevolve:le,moonQuarters:ae,quarterView0:z(0,!1),quarterView1:z(1,!1),quarterView2:z(2,!1),quarterView3:z(3,!1),waxingCrescent:z(.5,!1),waxingGibbous:z(1.5,!1),waningGibbous:z(2.5,!1),waningCrescent:z(3.5,!1),phaseView:z(0,!0),lunarEclipse:se,solarEclipse:ne,allEcliptic:G(!1),moonTilt:G(!0),timeViewNew:N(0,0),timeViewFull:N(2,40),everythingView:ie},_={};function ue(e){if(_[e]){const t=_[e],r=document.getElementById(e).querySelector("canvas");r&&(r.style.display="block"),t.loop(),t.showSlider&&t.showSlider()}else{const t=ce[e];_[e]=new p5(t,e)}}function de(e){if(_[e]){const t=_[e];t.hideSlider&&t.hideSlider(),t.stopAnimation&&t.stopAnimation();const r=document.getElementById(e).querySelector("canvas");r&&(r.style.display="none"),t.noLoop()}}function he(e){e.forEach(t=>{const r=t.target.id;t.isIntersecting?ue(r):de(r)})}const me=new IntersectionObserver(he,{root:null,rootMargin:"500px",threshold:0});document.querySelectorAll(".sketch-container").forEach(e=>{me.observe(e)});
