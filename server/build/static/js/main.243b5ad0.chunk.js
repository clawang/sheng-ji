(this["webpackJsonpsheng-ji-new"]=this["webpackJsonpsheng-ji-new"]||[]).push([[0],{39:function(e,t,n){},64:function(e,t){},69:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n(1),s=n.n(c),a=n(33),i=n.n(a),d=n(3),o=n(2),u=(n(39),["spades","hearts","clubs","diamonds"]),l=["-1","0","1","2","3","4","5","6","7","8","9","10","jack","queen","king","ace"],j=["-1","0","1","2","3","4","5","6","7","8","9","10","J","Q","K","A"],h=["/spades.png","/hearts.png","/clubs.png","/diamonds.png"],b={spades:0,hearts:1,clubs:2,diamonds:3,trump:4};function p(){for(var e=[],t=1,n=0;n<4;n++)for(var r=2;r<15;r++){var c=0;5===r?c=5:10!==r&&13!==r||(c=10),e.push({name:l[r]+" of "+u[n],suit:u[n],value:r,display:j[r],points:c,index:t,img:h[n],adjustedValue:r,adjSuit:n}),t++}return e.push({name:"small joker",suit:"trump",value:100,display:"JOKER",points:0,index:t,img:"",adjustedValue:100,adjSuit:"trump"}),t++,e.push({name:"big joker",suit:"trump",value:101,display:"JOKER",points:0,index:t,img:"",adjustedValue:101,adjSuit:"trump"}),e}function O(e,t){return e.obj.adjSuit!==t.obj.adjSuit?b[e.obj.adjSuit]-b[t.obj.adjSuit]:e.obj.adjustedValue-t.obj.adjustedValue}var m=function(e){var t=Object(c.useRef)(null);return Object(c.useEffect)((function(){e.getRef(t)}),[t]),Object(r.jsxs)("label",{style:{left:e.left+"px",zIndex:e.order},ref:t,children:[Object(r.jsx)("input",{type:"checkbox",name:"card-picked",className:"card-checkbox",value:e.cd.index,checked:e.checked,onChange:e.handleChange}),Object(r.jsxs)("div",{className:"card-container",children:[Object(r.jsx)("p",{className:"card-number"+(e.cd.value<100?"":" joker")+(101===e.cd.value?" red":""),children:e.cd.display}),e.cd.value<100?Object(r.jsx)("img",{className:"card-suit",src:""+e.cd.img}):""]})]})};var f=function(e){var t=Object(c.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(c.useState)("")),i=Object(o.a)(a,2),d=i[0],u=i[1],l=Object(c.useState)([]),j=Object(o.a)(l,2),h=j[0],b=j[1],p=Object(c.useState)([]),O=Object(o.a)(p,2),m=O[0],f=O[1],x=Object(c.useRef)(null),g=Object(c.useRef)(null);Object(c.useEffect)((function(){s.on("chat message",(function(e){y(e.username,e.body,"")})),s.on("setup game",(function(e){var t=e.teams;t[0].declarers=0===e.declarers,t[1].declarers=1===e.declarers,f(t)})),s.on("user joined",(function(e){y(e.username,e.username+" has joined the game.","connection-msg")})),s.on("user left",(function(e){y(e.username,e.username+" has left the game.","disconnection-msg")}))}),[]);var y=function(e,t,n){var r={body:0===n.length?e+": "+t:t,username:e,style:n};if(b((function(e){return e.concat(r)})),g.current&&x.current){var c=g.current.clientHeight;x.current.scrollTop=c}};return Object(r.jsxs)("aside",{id:"chat",children:[Object(r.jsx)("div",{id:"current-users",children:Object(r.jsx)("div",{id:"all-users",children:m.length>0?m.map((function(e,t){return Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:(e.declarers?"Declarers":"Opponents")+" \u2013 "+e.score}),Object(r.jsx)("li",{children:e.usernames[0]}),Object(r.jsx)("li",{children:e.usernames[1]})]},t)})):""})}),Object(r.jsxs)("div",{id:"chat-container",children:[Object(r.jsx)("div",{id:"messages-container",ref:x,children:Object(r.jsx)("ul",{id:"messages",ref:g,children:h.length>0?h.map((function(e,t){return Object(r.jsx)("li",{className:"chat-msg "+e.style,children:e.body},t)})):""})}),Object(r.jsxs)("form",{id:"chatbox",action:"",children:[Object(r.jsx)("input",{id:"m",autoComplete:"off",value:d,onChange:function(e){u(e.target.value)}}),Object(r.jsx)("button",{onClick:function(t){var n=d;t.preventDefault(),s.emit("chat message",{body:n,username:e.username}),u("")},children:"Send"})]})]})]})},x=n(7);var g=function(e){var t=Object(c.useRef)(null);Object(c.useEffect)((function(){n()}),[e.left]);var n=function(){var n=e.width;"2"===e.id?x.a.fromTo(t.current,.5,{opacity:0,left:n-30},{opacity:1,left:n/2}):"3"===e.id?x.a.fromTo(t.current,.5,{opacity:0,top:-107},{opacity:1,top:30}):"4"===e.id&&x.a.fromTo(t.current,.5,{opacity:0,left:0},{opacity:1,left:n/2})};return Object(r.jsxs)("div",{className:"card-container"+(e.win?" winning":""),ref:t,style:e.left?{left:e.left+"px"}:{},children:[Object(r.jsx)("p",{className:"card-number"+(e.cd.value<100?"":" joker")+(101===e.cd.value?" red":""),children:e.cd.display}),e.cd.value<100?Object(r.jsx)("img",{className:"card-suit",src:""+e.cd.img}):""]})};var y=function(e){var t=Object(c.useState)([]),n=Object(o.a)(t,2),s=n[0],a=n[1],i=Object(c.useState)(""),d=Object(o.a)(i,2),u=d[0],l=d[1],j=Object(c.useState)(e.socket),h=Object(o.a)(j,2),b=h[0],p=(h[1],Object(c.useState)(!1)),O=Object(o.a)(p,2),m=O[0],f=O[1],x=Object(c.useRef)(-1),y=Object(c.useRef)(null);return Object(c.useEffect)((function(){e.main<0?x.current=e.id-1:x.current=(e.id-1+e.main)%4,b.on("hand played",(function(e){e.id===x.current&&(a(e.cards),l(e.username))})),b.on("win round",(function(e){e===x.current&&f(!0)})),b.on("new round",(function(){a((function(e){return[]})),f(!1)})),b.on("end game",(function(){a((function(e){return[]})),f(!1),l("")}))}),[]),Object(r.jsxs)("div",{className:"player-"+e.id,ref:y,children:[Object(r.jsx)("h2",{children:u}),Object(r.jsx)("div",{id:"player-"+e.id+"-cards",children:s.map((function(t,n){return Object(r.jsx)(g,{cd:t,win:m,id:e.id,width:y?y.current.clientWidth:150},t.index)}))})]})},v=n(4);function k(e,t){switch(t.type){case"add":return[].concat(Object(v.a)(e),[t.item]);case"remove":return[].concat(Object(v.a)(e.slice(0,t.index)),Object(v.a)(e.slice(t.index+1)));case"replace":return Object(v.a)(t.items);case"update":return[].concat(Object(v.a)(e.slice(0,t.index)),[t.item],Object(v.a)(e.slice(t.index+1)));case"filter":return e.filter((function(e,n){return!t.indices.includes(n)}));case"concat":return Object(v.a)(e).concat(t.items);case"clear":return[]}}var w=function(e){var t=Object(c.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],function(e,t){var n=Object(c.useReducer)(e,t),r=Object(o.a)(n,2),s=r[0],a=r[1],i=Object(c.useRef)(null);Object(c.useEffect)((function(){i.current&&(i.current(s),i.current=null)}),[i.current,s]);var d=Object(c.useCallback)((function(e){return a(e),new Promise((function(e){i.current=e}))}),[a]);return[s,d]}(k,[])),i=Object(o.a)(a,2),u=i[0],l=i[1],j=Object(c.useState)([]),h=Object(o.a)(j,2),b=h[0],p=h[1],f=Object(c.useReducer)(k,[]),y=Object(o.a)(f,2),w=y[0],S=y[1],N=Object(c.useState)(!1),C=Object(o.a)(N,2),T=C[0],I=C[1],R=Object(c.useState)(!1),E=Object(o.a)(R,2),P=E[0],D=E[1],M=Object(c.useState)(!1),J=Object(o.a)(M,2),W=J[0],V=J[1],A=Object(c.useState)(null),G=Object(o.a)(A,2),U=G[0],Y=G[1],q=Object(c.useRef)({currentSuit:"",state:0,playerId:-1,turn:!1,plays:0,rank:null}),H=Object(c.useRef)([]),K=Object(c.useRef)(null),B=Object(c.useRef)(null),F=Object(c.useRef)(null);Object(c.useEffect)((function(){s.on("my hand",(function(t){console.log(t.hand),q.current=Object(d.a)(Object(d.a)({},q.current),{},{playerId:t.playerId,rank:t.rank,turn:!0});var n=[],r=L(0);t.hand.forEach((function(e,t){n.push({obj:e,dom:{},position:r[t],checked:!1})})),t.dealing?(q.current=Object(d.a)(Object(d.a)({},q.current),{},{state:1,turn:!0}),e.sendMessage({body:"Play a card with the trump rank to set the trump suit."}),H.current=n,X(n,0)):l({type:"replace",items:n}),t.prevPlayed&&t.prevPlayed.forEach((function(e){S({type:"add",item:{obj:e,left:F.current.clientWidth/2}})}))})),s.on("trump set",(function(t){q.current=Object(d.a)(Object(d.a)({},q.current),{},{turn:!1}),t.username.length>0?e.sendMessage({body:t.username+" set the trump suit to "+t.suit}):e.sendMessage({body:"The trump suit was set to "+t.suit})})),s.on("sort cards",(function(e){q.current=Object(d.a)(Object(d.a)({},q.current),{},{state:0}),Y(e.suit)})),s.on("next turn",(function(e){e.turn===q.current.playerId&&(q.current=Object(d.a)(Object(d.a)({},q.current),{},{turn:!0,currentSuit:e.suit,plays:e.plays}))})),s.on("win round",(function(e){e===q.current.playerId&&V(!0)})),s.on("new round",(function(e){e!==q.current.playerId&&(p((function(e){return[]})),V(!1))})),s.on("end game",(function(){S({type:"clear"}),p([]),l({type:"clear"})}))}),[]),console.log(u),Object(c.useEffect)((function(){return u.length>0&&Q(),u.length<12&&H.current.length>0&&1===q.current.state&&(console.log(u),X(H.current,u.length)),u.length>=12&&1===q.current.state&&s.emit("finished deal"),u.length>12&&2===q.current.state&&e.sendMessage({body:"Select 6 cards to discard.",color:"green"}),s.on("swap cards",(function(e){q.current=Object(d.a)(Object(d.a)({},q.current),{},{state:2,turn:!0,playerId:e.id});var t=[];e.newCards.forEach((function(e){t.push({obj:e,dom:{},checked:!1})})),l({type:"concat",items:t}),Y(e.suit)})),function(){s.off("swap cards")}}),[u.join(",")]),Object(c.useEffect)((function(){Z(U)}),[U]);var L=function(e){var t=[],n=0;if(0===e){var r=u.length,c=K.current?K.current.clientWidth:681,s=(c-80)/(r-1),a=Math.min(s,80);c>80*r&&(n=(c-80*r)/2);for(var i=0;i<r;i++)t.push(n+a*i)}else{var d=w.length,o=F.current?F.current.clientWidth:60,l=(o-60)/(d-1),j=Math.min(l,70);o>70*d&&(n=(o-70*d)/2);for(var h=0;h<d;h++)t.push(n+j*h+35)}return t},z=function(e){var t=u[e];t.checked=!1,l({type:"update",index:e,item:t});var n=K.current.clientWidth/2-31-u[e].position,r=-1*(B.current.clientHeight+13),c=u[e].obj;return x.a.to(t.dom.current,1,{x:n,y:r,width:"60px",height:"80px",borderRadius:"5px"}),c},Q=function(){console.log("repositioning");var e=L(0),t=Object(v.a)(u);t.forEach((function(t,n){t.position=e[n]})),l({type:"replace",items:t})},X=function(e,t){setTimeout((function(){console.log("adding "+t),l({type:"add",item:e[t]})}),1e3)},Z=function(e){console.log("sorting cards");var t=L(0);$(q.current.rank,e,t);var n=Object(v.a)(u).sort(O);n.forEach((function(e,n){e.position=t[n]})),l({type:"replace",items:n})};console.log(q);var $=function(e,t,n){for(var r=0;r<u.length;r++){var c=u[r];c.obj.value===e&&c.obj.suit===t?(c.obj.adjSuit="trump",c.obj.adjustedValue=c.obj.value+80):c.obj.value===e?(c.obj.adjSuit="trump",c.obj.adjustedValue=c.obj.value+70):c.obj.suit===t?(c.obj.adjSuit="trump",c.obj.adjustedValue=c.obj.value+50):(c.obj.adjSuit=c.obj.suit,c.obj.adjustedValue=c.obj.value),l({type:"update",index:r,item:c})}};return Object(r.jsxs)("div",{style:{width:"100%",display:"flex",flexWrap:"wrap"},children:[Object(r.jsx)("div",{className:"play",ref:B,children:Object(r.jsxs)("div",{className:"play-hand",children:[Object(r.jsx)("p",{id:"history-message",style:P&&w.length>1?{opacity:1}:{opacity:0},children:"Click to see play history"}),Object(r.jsx)("div",{className:"play-hand-cards",onClick:function(e){T?(w.forEach((function(e,t){var n=e;n.left=F.current.clientWidth/2,S({type:"update",index:t,item:n})})),setTimeout((function(){I(!1)}),300)):(I(!0),D(!1),setTimeout((function(){var e=L(1);w.forEach((function(t,n){var r=t;r.left=e[n],S({type:"update",index:n,item:r})}))}),10))},ref:F,onMouseEnter:function(e){T||D(!0)},onMouseLeave:function(e){D(!1)},children:T?w.map((function(e,t){return Object(r.jsx)(g,{cd:e.obj,win:!1,id:1,left:e.left},e.obj.index+100)})):b.map((function(e){return Object(r.jsx)(g,{cd:e,win:W,id:1,left:F.current.clientWidth/2},e.index)}))})]})}),Object(r.jsx)("div",{className:"my-player",children:Object(r.jsx)("div",{className:"hand",children:Object(r.jsxs)("form",{id:"hand-form",action:"",children:[Object(r.jsx)("div",{className:"hand-cards",ref:K,children:Object(r.jsx)("div",{children:u.map((function(e,t){return Object(r.jsx)(m,{cd:e.obj,checked:e.checked,left:e.position,getRef:function(e){return function(e,t,n){if("active"===n){var r=u[t];r.dom=e,l({type:"update",index:t,item:r})}else{var c=w[t];c.dom=e,S({type:"update",index:t,item:c})}}(e,t,"active")},handleChange:function(){return function(e){var t=u[e];t.checked=!t.checked,l({type:"update",index:e,item:t})}(t)}},e.obj.index)}))})}),Object(r.jsx)("button",{id:"hand-submit",disabled:!q.current.turn&&(0===q.current.state||1===q.current.state),onClick:function(t){t.preventDefault();var n=u.filter((function(e){return e.checked})),r=n.map((function(e){return e.obj}));if(2===q.current.state)if(r.length>6)e.sendMessage({body:"You can only pick 6 cards!",color:"red"});else if(r.length<6)e.sendMessage({body:"You didn't select 6 cards!",color:"red"});else{e.sendMessage({body:"",color:""});var c=[];r.forEach((function(e){var t=u.findIndex((function(t){return t.obj.index===e.index}));z(t),c.push(t)})),setTimeout((function(){l({type:"filter",indices:c})}),1e3),s.emit("submit swap cards",{cards:r.map((function(e){return e.index})),id:q.current.playerId}),q.current=Object(d.a)(Object(d.a)({},q.current),{},{state:0})}else if(1===q.current.state)if(r.length>1)e.sendMessage({body:"You can only choose one card!",color:"red"});else if(r.length<1)e.sendMessage({body:"You didn't choose a card!",color:"red"});else{var a=r[0].suit;r[0].value===q.current.rank?(s.emit("set suit",a),n[0].checked=!1):e.sendMessage({body:"That card isn't of the trump rank!",color:"red"})}else if(q.current.turn)if(r.length>1)e.sendMessage({body:"You can only play one card!",color:"red"});else if(r.length<1)e.sendMessage({body:"You didn't select a card!",color:"red"});else{if(r[0].adjSuit===q.current.currentSuit||u.findIndex((function(e){return e.obj.adjSuit===q.current.currentSuit}))<0){p((function(e){return[]})),V(!1);var i=u.findIndex((function(e){return e.obj.index===r[0].index})),o=z(i);setTimeout((function(){l({type:"remove",index:i}),p((function(e){return e.concat(o)})),S({type:"add",item:{obj:o,left:F.current.clientWidth/2}}),q.current=Object(d.a)(Object(d.a)({},q.current),{},{turn:!1}),s.emit("submit hand",{cards:r.map((function(e){return e.index})),id:q.current.playerId})}),1e3)}else e.sendMessage({body:"You can't play that card!",subtitle:"You need to play "+q.current.currentSuit+".",color:"red"})}},children:"Confirm Play"}),1===q.current.state&&q.current.turn?Object(r.jsx)("button",{id:"skip-submit",onClick:function(e){e.preventDefault(),s.emit("set suit",""),q.current=Object(d.a)(Object(d.a)({},q.current),{},{turn:!1})},children:"Skip"}):""]})})})]})},S=n(20);var N=function(e){var t=Object(c.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(c.useState)([])),i=Object(o.a)(a,2),d=i[0],u=i[1],l=Object(c.useState)(""),j=Object(o.a)(l,2),h=j[0],b=j[1],p=Object(c.useState)([]),O=Object(o.a)(p,2),m=O[0],f=O[1],x=Object(c.useState)(!1),y=Object(o.a)(x,2),v=(y[0],y[1]);return Object(c.useEffect)((function(){s.on("flip discard",(function(e){u(e.cards);for(var t=[],n=0;n<e.cards.length;n++)n===e.max?t.push(!0):t.push(!1);f(t),b("The trump suit is set to "+e.suit)})),s.on("reveal discard",(function(e){u(e.discard);var t=[];e.discard.forEach((function(e){e.points>0?t.push(!0):t.push(!1)})),f(t),v(e.adding),e.adding?b("The opponents gained "+e.addPoints+" points."):b("")}))})),Object(r.jsxs)("div",{id:"discard",style:e.visible?{display:"block"}:{display:"none"},children:[Object(r.jsx)("h2",{children:"Discard Pile"}),Object(r.jsx)("div",{id:"discard-cards",children:d.map((function(e,t){return Object(r.jsx)(g,{cd:e,win:m[t]},e.index)}))}),Object(r.jsx)("p",{id:"discard-points",children:h})]})};var C=function(e){var t=Object(c.useState)(!1),n=Object(o.a)(t,2),s=n[0],a=n[1],i=Object(c.useState)(e.socket),d=Object(o.a)(i,2),u=d[0],l=(d[1],Object(c.useState)({body:"",subtitle:"",color:""})),j=Object(o.a)(l,2),h=j[0],b=j[1],p=Object(c.useState)(!1),O=Object(o.a)(p,2),m=O[0],f=O[1],x=Object(c.useRef)(null);return Object(c.useEffect)((function(){u.on("set playerId",(function(e){x.current=e})),u.on("my hand",(function(e){a(!0)})),u.on("next turn",(function(e){e.turn===x.current?b({body:"It's your turn!",color:"green"}):b({body:"It's "+e.usrnm+"'s turn!",color:""})})),u.on("flip discard",(function(){f(!0),setTimeout((function(){f(!1)}),7e3)})),u.on("reveal discard",(function(){f(!0),setTimeout((function(){f(!1)}),7e3)})),u.on("end game",(function(e){b({body:e.msg,subtitle:e.subtitle,color:""}),a(!1)}))}),[]),Object(r.jsxs)("div",{className:"game-space",children:[e.popUp?Object(r.jsxs)("div",{id:"pop-up",children:[Object(r.jsx)("p",{id:"pop-up-close",children:Object(r.jsx)("a",{href:"#",onClick:e.togglePop,children:"X"})}),Object(r.jsxs)("div",{id:"pop-up-inner",children:[Object(r.jsx)("h1",{children:"Game History"}),Object(r.jsx)("h3",{className:"yellow",children:"The team that was the Declarer each round is in yellow."}),Object(r.jsx)("br",{}),e.history.length>0?Object(r.jsxs)("table",{children:[Object(r.jsxs)("tr",{children:[Object(r.jsx)("th",{children:"Round"}),Object(r.jsx)("th",{children:e.history[0].teams[0].usernames[0]+" & "+e.history[0].teams[0].usernames[1]}),Object(r.jsx)("th",{children:e.history[0].teams[1].usernames[0]+" & "+e.history[0].teams[1].usernames[1]}),Object(r.jsx)("th",{children:"Starter"}),Object(r.jsx)("th",{children:"Trump Suit"}),Object(r.jsx)("th",{children:"Points"}),Object(r.jsx)("th",{children:"Winner"})]}),e.history.map((function(e){return Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:e.roundIndex}),Object(r.jsx)("td",{className:0===e.declarer?"winner":"",children:e.teams[0].score}),Object(r.jsx)("td",{className:1===e.declarer?"winner":"",children:e.teams[1].score}),Object(r.jsx)("td",{children:e.starter}),Object(r.jsx)("td",{children:e.trumpSuit}),Object(r.jsx)("td",{children:e.points}),Object(r.jsx)("td",{children:e.teams[e.winner].usernames[0]+" & "+e.teams[e.winner].usernames[1]})]})}))]}):Object(r.jsx)("p",{children:"No games yet."})]})]}):"",Object(r.jsx)(N,{socket:u,visible:m}),Object(r.jsx)("div",{id:"overlay"}),Object(r.jsxs)("div",{id:"header",children:[Object(r.jsx)("p",{className:"center-msg "+h.color,children:h.body}),Object(r.jsx)("h4",{className:h.color,children:h.subtitle})]}),null!==x.current?Object(r.jsx)(y,{id:"3",socket:u,main:x.current}):"",null!==x.current?Object(r.jsx)(y,{id:"4",socket:u,main:x.current}):"",Object(r.jsxs)("div",{className:"center",children:[Object(r.jsx)("input",{type:"text",value:e.code.current,id:"code-box",disabled:!0}),s||"player"!==e.userType.current?"":Object(r.jsx)("button",{id:"start-game",onClick:function(e){e.preventDefault(),b({body:"Waiting...",color:""}),a(!0),u.emit("start game",{})},children:null!==x.current?"Start Next Round":"Start Game"})]}),null!==x.current?Object(r.jsx)(y,{id:"2",socket:u,main:x.current}):"","player"===e.userType.current?Object(r.jsx)(w,{socket:u,playerId:x.current,sendMessage:b}):Object(r.jsx)(y,{id:"1",socket:u,main:x.current})]})};function T(e){var t=Object(c.useState)(0),n=Object(o.a)(t,2),s=n[0],a=n[1],i=Object(c.useState)(e.socket),d=Object(o.a)(i,2),u=d[0];d[1];return 1===s?Object(r.jsx)(I,{setState:function(){return a(0)},socket:u,setRoom:e.setRoom,code:e.code}):2===s?Object(r.jsx)(R,{setState:function(){return a(0)},socket:u,setRoom:e.setRoom,code:e.code}):3===s?Object(r.jsx)(E,{close:function(){return a(0)}}):Object(r.jsx)("div",{className:"start-page",children:Object(r.jsxs)("div",{className:"game-start",children:[Object(r.jsx)("h1",{children:"Sheng Ji"}),Object(r.jsxs)("div",{className:"create-game",children:[Object(r.jsx)("h2",{children:"Host"}),Object(r.jsx)("button",{onClick:function(){return a(1)},children:"Create a Game"})]}),Object(r.jsxs)("div",{className:"join-game",children:[Object(r.jsx)("h2",{children:"Guest"}),Object(r.jsx)("button",{onClick:function(){return a(2)},children:"Join a Game"})]}),Object(r.jsx)("button",{id:"instructions-btn",onClick:function(){a(3)},children:"How to Play"})]})})}function I(e){var t=Object(c.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(c.useState)("")),i=Object(o.a)(a,2),u=i[0],l=i[1],j=Object(c.useState)({rank:2}),h=Object(o.a)(j,2),b=h[0],p=h[1];return Object(r.jsx)("div",{className:"start-page",children:Object(r.jsxs)("div",{className:"game-start",children:[Object(r.jsx)("h1",{children:"Sheng Ji"}),Object(r.jsxs)("div",{className:"create-game",children:[Object(r.jsx)("h2",{children:"Settings"}),Object(r.jsxs)("form",{id:"edit-settings",children:[Object(r.jsx)("label",{children:"Trump Rank"}),Object(r.jsx)("br",{}),Object(r.jsx)("input",{id:"setTrumpValue",name:"setTrumpValue",autoComplete:"off",defaultValue:"2",min:"2",max:"14",type:"number",onChange:function(e){p(Object(d.a)(Object(d.a)({},b),{},{rank:e.target.value}))}}),Object(r.jsx)("br",{}),Object(r.jsx)("button",{onClick:function(t){t.preventDefault(),b.rank>=2&&b.rank<=14?s.emit("create game",b,(function(t){e.code.current=t,e.setRoom(0)})):l("The trump rank must be between 2 and 14.")},children:"Create Game"})]}),Object(r.jsx)("p",{id:"login-error",className:"error-message",children:u}),Object(r.jsx)("p",{children:Object(r.jsx)("a",{href:"#",onClick:e.setState,children:"\u2190 BACK"})})]})]})})}function R(e){var t=Object(c.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(c.useState)("")),i=Object(o.a)(a,2),d=i[0],u=i[1],l=Object(c.useState)(""),j=Object(o.a)(l,2),h=j[0],b=j[1];return Object(r.jsx)("div",{className:"start-page",children:Object(r.jsxs)("div",{className:"game-start",children:[Object(r.jsx)("h1",{children:"Sheng Ji"}),Object(r.jsxs)("div",{className:"create-game",children:[Object(r.jsx)("h2",{children:"Game Code"}),Object(r.jsxs)("form",{id:"edit-settings",children:[Object(r.jsx)("input",{name:"gameID",autoComplete:"off",type:"text",onChange:function(e){b(e.target.value)}}),Object(r.jsx)("br",{}),Object(r.jsx)("button",{onClick:function(t){t.preventDefault(),s.emit("join game",h,(function(t){"success"===t?(e.code.current=h,e.setRoom(0)):u("No game with that code found.")}))},children:"Join Game"}),Object(r.jsx)("p",{id:"login-error",className:"error-message",children:d})]}),Object(r.jsx)("p",{children:Object(r.jsx)("a",{href:"#",onClick:e.setState,children:"\u2190 BACK"})})]})]})})}function E(e){return Object(r.jsxs)("div",{id:"instructions",children:[Object(r.jsx)("p",{id:"instructions-close",onClick:function(){e.close()},children:Object(r.jsx)("a",{href:"#",children:"X"})}),Object(r.jsx)("h1",{children:"Rules"}),Object(r.jsx)("h3",{children:"Players and Cards"}),Object(r.jsx)("p",{children:"Sheng Ji is a game played by four players in fixed teams, with partners facing each other across the table. A standard international pack is used, with red and black jokers, making 54 cards in all. The point values of the cards are as follows:"}),Object(r.jsxs)("table",{children:[Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"Each King"}),Object(r.jsx)("td",{children:"10 points"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"Each ten"}),Object(r.jsx)("td",{children:"10 points"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"Each five "}),Object(r.jsx)("td",{children:"5 points,"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"Other cards"}),Object(r.jsx)("td",{children:"no value"})]})]}),Object(r.jsx)("h3",{children:"Ranking of Cards"}),Object(r.jsx)("p",{children:"In each hand there are eighteen trumps: the two jokers, all the cards of a particular suit (the trump suit) and all the cards of a particular rank (the trump rank). The highest trump is the red Joker, second is the black Joker, and third is the card which belongs to both the trump suit and the trump rank. Next come the other three cards of the trump rank, which are equal in status. Finally there are the remaining cards of the trump suit which rank in downwards order A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2 (omitting the trump rank). The three remaining suits also rank from highest to lowest omitting the trump rank."}),Object(r.jsx)("h3",{children:"Declarers and Opponents"}),Object(r.jsx)("p",{children:"In each game one team is the Declarers, and the other are the Opponents. The Declarers are the winners of the previous game. Each team's score is expressed as a card rank from two (low) up to Ace (high). In each game the trump rank is the Declarers' current score. Both sides start at two and the winners are the first side whose score goes above Ace."}),Object(r.jsx)("p",{children:"In each game, one of the Declarers is designated the starter. They will get to start the first round of the game. Additionally, before the game starts, the starter gets the 6 leftover cards after the cards have been dealed. They then get to choose 6 cards from their own hand to discard. No other players get to see these cards. These cards will become important after the game is finished."}),Object(r.jsx)("h3",{children:"The Deal"}),Object(r.jsx)("p",{children:"Each player receives twelve cards, but there is no dealer as such. The trump suit is picked during the dealing."}),Object(r.jsx)("p",{children:"The trump rank for the hand is known in advance of the deal: for the first hand it must be two because both sides start with a score of two, and in subsequent hands it is the current score of the declarers. Any player who draws a card of the trump rank during the deal may place it face up on the table, and its suit then becomes trumps for the hand. If you draw a card of the trump rank you need not show it immediately you draw it; you may keep it and expose at at any time provided that no other card has yet been exposed, or you may prefer never to expose it if you do not want its suit as trumps. Consultation between partners is not allowed."}),Object(r.jsx)("p",{children:"After each player has drawn a hand of twelve cards there are six face-down cards left over. If no one has yet exposed a card, the starter turns these cards face up one at a time in order. Once the first of these cards is exposed it is too late for anyone to determine the trump suit by exposing one of their own cards. If a card of the trump rank is found among the last six cards, its suit becomes trumps and no further cards are turned up. If no card of the trump rank appears, the highest ranking of the six cards, excluding Jokers, determines the trump suit; among cards of equal rank the earliest exposed takes precedence."}),Object(r.jsx)("p",{children:"In the first hand whichever player exposes a two (or the starter in the unlikely event that no one does) becomes the leader, and the leader\u2019s side become the declarers. In subsequent hands the leader is the same player as the starter. In either case the leader picks up the last six cards and adds them to his hand. Apart from any of these cards which may already have been exposed in order to choose trumps, the cards picked up are not shown to the other players. The leader then discards any six of his eighteen cards face down."}),Object(r.jsx)("h3",{children:"The Play"}),Object(r.jsx)("p",{children:"During the play, Jokers and cards of the trump rank all count as belonging to the trump suit, not to the suits marked on them. "}),Object(r.jsx)("p",{children:"Play is in counter-clockwise rotation. In the first round, the first person to play their cards is the starter; in each subsequent round, the first person to play is the winner of the previous round. Each of the other three players in turn must play a card in the same suit as the person who started, unless they have run out of cards of the suit, then they may play any cards in their hand. If playing the trump suit, among trumps of equal rank, the one which is played earliest beats the others. When playing different suits, the trump suit will beat the other suits. If everyone plays different non-trump suits, then the highest card in the suit the first person played wins."}),Object(r.jsx)("p",{children:"The goal of the game is to win rounds containing points, that is kings, tens and fives. Whenever the Opponents win a round containing any point cards, they accumulate the amount of points in the cards. When the Declarers win a round, they do not accumulate points but prevent the Opponents from winning points."}),Object(r.jsx)("h3",{children:"Scoring"}),Object(r.jsx)("p",{children:"The result of the game depends on the number of card points won by the Opponents. This determines which side scores how many points, and who will be the Declarers for the next hand."}),Object(r.jsx)("p",{children:"If the Opponents win the last round of the game, any point cards in the discard pile get added to the Opponents' points. Moreover, the value of each point card in the discard pile is doubled."}),Object(r.jsxs)("table",{children:[Object(r.jsxs)("tr",{children:[Object(r.jsx)("th",{children:"Points"}),Object(r.jsx)("th",{children:"Score"}),Object(r.jsx)("th",{children:"Declarers for next hand"}),Object(r.jsx)("th",{children:"Starter for next hand"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"0"}),Object(r.jsx)("td",{children:"Declarers score 2"}),Object(r.jsx)("td",{children:"No change"}),Object(r.jsx)("td",{children:"Previous starter's partner"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"5 to 35"}),Object(r.jsx)("td",{children:"Declarers score 1"}),Object(r.jsx)("td",{children:"No change"}),Object(r.jsx)("td",{children:"Previous starter's partner"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"40 to 75"}),Object(r.jsx)("td",{children:"Opponents score 1"}),Object(r.jsx)("td",{children:"Opponents become new declarers"}),Object(r.jsx)("td",{children:"Player to previous starter's right"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"80 to 95"}),Object(r.jsx)("td",{children:"Opponents score 2"}),Object(r.jsx)("td",{children:"Opponents become new declarers"}),Object(r.jsx)("td",{children:"Player to previous starter's right"})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"100 or more"}),Object(r.jsx)("td",{children:"Opponents score 3"}),Object(r.jsx)("td",{children:"Opponents become new declarers"}),Object(r.jsx)("td",{children:"Player to previous starter's right"})]})]})]})}var P=function(e){var t=Object(c.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(c.useState)("")),i=Object(o.a)(a,2),d=i[0],u=i[1],l=Object(c.useState)(-1),j=Object(o.a)(l,2),h=j[0],b=j[1],p=Object(c.useState)(""),O=Object(o.a)(p,2),m=O[0],f=O[1],x=Object(c.useState)([{usernames:[]},{usernames:[]}]),g=Object(o.a)(x,2),y=g[0],v=g[1];Object(c.useEffect)((function(){s.on("set teams",(function(e){v((function(t){return e}))}))}),[]);var k=function(t){s.emit("user type",t,(function(t){"player"===t?(b(2),e.setUserType(0),u("")):"spectator"===t?(e.setUserType(1),e.finished(m)):u(t)}))},w=function(t){s.emit("set team",t,(function(t){"success"===t?e.finished(m):u(t)}))};return-1===h?Object(r.jsx)(T,{socket:s,setRoom:b,code:e.code}):0===h?Object(r.jsx)("div",{className:"start-page",children:Object(r.jsxs)("div",{id:"registration",children:[Object(r.jsx)("h1",{children:"Sheng Ji"}),Object(r.jsx)("h3",{id:"start-code",children:e.code.current}),Object(r.jsxs)("form",{id:"create-user",children:[Object(r.jsx)("label",{children:"Username"}),Object(r.jsx)("br",{}),Object(r.jsx)("input",{id:"username",name:"username",autoComplete:"off",type:"text",value:m,onChange:function(e){f(e.target.value)}}),Object(r.jsx)("button",{onClick:function(t){t.preventDefault(),""!==m&&m.replace(/\s/g,"").length?s.emit("add user",m,(function(t){"success"===t?(e.setUsername(m),b(1),u("")):"return"===t?(e.setUserType(0),e.finished(m)):u(t)})):u("Please enter a valid username.")},children:"Submit"})]}),Object(r.jsx)("p",{id:"login-error",className:"error-message",children:d})]})}):1===h?Object(r.jsx)("div",{className:"start-page",children:Object(r.jsx)("div",{id:"game-settings",children:Object(r.jsxs)("div",{id:"game-settings-player",children:[Object(r.jsx)("h1",{children:"Sheng Ji"}),Object(r.jsx)("h3",{id:"start-code",children:e.code.current}),Object(r.jsx)("h2",{children:"Would you like to join the game as a player or a spectator?"}),Object(r.jsx)("button",{id:"join-player",onClick:function(){return k("player")},children:"Player"}),Object(r.jsx)("button",{id:"join-spectator",onClick:function(){return k("spectator")},children:"Spectator"}),Object(r.jsx)("p",{id:"setting-error",className:"error-message",children:d})]})})}):2===h?Object(r.jsx)("div",{className:"start-page",children:Object(r.jsx)("div",{id:"game-settings",children:Object(r.jsxs)("div",{id:"team",children:[Object(r.jsx)("h1",{children:"Sheng Ji"}),Object(r.jsx)("h3",{id:"start-code",children:e.code.current}),Object(r.jsx)("h2",{id:"team-header",children:"Which team would you like to join?"}),Object(r.jsxs)("div",{id:"team-container",children:[Object(r.jsxs)("div",{id:"declarers",onClick:function(){return w(0)},children:[Object(r.jsx)("h3",{children:"Declarers"}),Object(r.jsx)("div",{children:Object(r.jsx)("ul",{children:y[0].usernames.length>0?y[0].usernames.map((function(e){return Object(r.jsx)("li",{children:e})})):Object(r.jsx)("li",{children:"No players yet"})})})]}),Object(r.jsxs)("div",{id:"opponents",onClick:function(){return w(1)},children:[Object(r.jsx)("h3",{children:"Opponents"}),Object(r.jsx)("div",{children:Object(r.jsx)("ul",{children:y[1].usernames.length>0?y[1].usernames.map((function(e){return Object(r.jsx)("li",{children:e})})):Object(r.jsx)("li",{children:"No players yet"})})})]})]}),Object(r.jsx)("p",{id:"team-error",className:"error-message",children:d})]})})}):void 0},D=n.n(S)()();var M=function(){var e=Object(c.useState)([]),t=Object(o.a)(e,2),n=t[0],s=t[1],a=Object(c.useState)(!1),i=Object(o.a)(a,2),u=i[0],l=i[1],j=Object(c.useState)([]),h=Object(o.a)(j,2),b=h[0],O=h[1],m=Object(c.useState)(!1),x=Object(o.a)(m,2),g=x[0],y=x[1],v=Object(c.useState)({username:"",loggedIn:!1}),k=Object(o.a)(v,2),w=k[0],S=k[1],N=Object(c.useState)({trumpSuit:"",trumpRank:null,points:0}),T=Object(o.a)(N,2),I=T[0],R=T[1],M=Object(c.useRef)(""),J=Object(c.useRef)("");return Object(c.useEffect)((function(){s(p()),D.on("setup game",(function(e){R(Object(d.a)(Object(d.a)({},I),{},{trumpRank:e.trumpValue}))})),D.on("trump set",(function(e){R(Object(d.a)(Object(d.a)({},I),{},{trumpSuit:e.suit,trumpRank:e.rank}))})),D.on("update points",(function(e){R((function(t){return Object(d.a)(Object(d.a)({},t),{},{points:e})}))})),D.on("disconnected",(function(){alert("You have disconnected from the server. Please refresh your page.")}))}),[s]),Object(r.jsxs)("div",{className:"App",children:[w.loggedIn?"":Object(r.jsx)(P,{username:w.username,socket:D,setUsername:function(e){S({username:e,loggedIn:w.loggedIn})},setUserType:function(e){M.current=0===e?"player":"spectator"},finished:function(e){S({username:e,loggedIn:!0})},code:J}),g?Object(r.jsx)(E,{close:function(){return y(!1)}}):"",Object(r.jsxs)("div",{id:"chat-page",children:[Object(r.jsxs)("div",{className:"sidebar",children:[Object(r.jsxs)("div",{className:"legend",children:[Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:"Trump Suit"}),Object(r.jsxs)("p",{id:"trump-suit",children:[I.trumpSuit?Object(r.jsx)("img",{src:"/"+I.trumpSuit+".png"}):"?"," "]})]}),Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:"Trump Rank"}),Object(r.jsx)("p",{id:"trump-rank",children:I.trumpRank?I.trumpRank:""})]}),Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:"Points"}),Object(r.jsx)("p",{id:"points",children:I.points})]}),Object(r.jsxs)("div",{children:[Object(r.jsxs)("h2",{children:["Game",Object(r.jsx)("br",{}),"History"]}),Object(r.jsx)("p",{children:Object(r.jsx)("a",{id:"game-history",href:"#",onClick:function(e){D.emit("get game history",{},(function(e){O(e)})),l(!0)},children:"View"})})]})]}),Object(r.jsxs)("div",{id:"my-player-stats",children:[Object(r.jsx)("h3",{id:"my-username",children:w.username}),Object(r.jsx)("p",{children:Object(r.jsx)("a",{href:"#",id:"help-link",style:{fontSize:"10px"},onClick:function(){return y(!0)},children:"Help"})})]})]}),n.length>0?Object(r.jsx)(C,{deck:n,socket:D,popUp:u,togglePop:function(){l(!1)},history:b,userType:M,code:J}):"",Object(r.jsx)(f,{socket:D,username:w.username})]})]})},J=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,70)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,s=t.getLCP,a=t.getTTFB;n(e),r(e),c(e),s(e),a(e)}))};i.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(M,{})}),document.getElementById("root")),J()}},[[69,1,2]]]);
//# sourceMappingURL=main.243b5ad0.chunk.js.map