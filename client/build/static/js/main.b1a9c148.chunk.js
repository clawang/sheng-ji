(this["webpackJsonpsheng-ji-new"]=this["webpackJsonpsheng-ji-new"]||[]).push([[0],{40:function(e,t,n){},65:function(e,t){},70:function(e,t,n){"use strict";n.r(t);var c=n(0),r=n(1),s=n.n(r),a=n(34),i=n.n(a),d=n(3),o=n(2),u=(n(40),["spades","hearts","clubs","diamonds"]),j=["-1","0","1","2","3","4","5","6","7","8","9","10","jack","queen","king","ace"],l=["-1","0","1","2","3","4","5","6","7","8","9","10","J","Q","K","A"],h=["/spades.png","/hearts.png","/clubs.png","/diamonds.png"],b={spades:0,hearts:1,clubs:2,diamonds:3,trump:4};function p(){for(var e=[],t=1,n=0;n<4;n++)for(var c=2;c<15;c++){var r=0;5===c?r=5:10!==c&&13!==c||(r=10),e.push({name:j[c]+" of "+u[n],suit:u[n],value:c,display:l[c],points:r,index:t,img:h[n],adjustedValue:c,adjSuit:n}),t++}return e.push({name:"small joker",suit:"trump",value:100,display:"JOKER",points:0,index:t,img:"",adjustedValue:100,adjSuit:"trump"}),t++,e.push({name:"big joker",suit:"trump",value:101,display:"JOKER",points:0,index:t,img:"",adjustedValue:101,adjSuit:"trump"}),e}function O(e,t){return e.obj.adjSuit!==t.obj.adjSuit?b[e.obj.adjSuit]-b[t.obj.adjSuit]:e.obj.adjustedValue-t.obj.adjustedValue}var f=function(e){var t=Object(r.useRef)(null);return Object(r.useEffect)((function(){e.getRef(t)}),[t]),Object(c.jsxs)("label",{style:{left:e.left+"px",zIndex:e.order},ref:t,children:[Object(c.jsx)("input",{type:"checkbox",name:"card-picked",className:"card-checkbox",value:e.cd.index,checked:e.checked,onChange:e.handleChange}),Object(c.jsxs)("div",{className:"card-container",children:[Object(c.jsx)("p",{className:"card-number"+(e.cd.value<100?"":" joker")+(101===e.cd.value?" red":""),children:e.cd.display}),e.cd.value<100?Object(c.jsx)("img",{className:"card-suit",src:""+e.cd.img}):""]})]})};var m=function(e){var t=Object(r.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(r.useState)("")),i=Object(o.a)(a,2),d=i[0],u=i[1],j=Object(r.useState)([]),l=Object(o.a)(j,2),h=l[0],b=l[1],p=Object(r.useState)([]),O=Object(o.a)(p,2),f=O[0],m=O[1],x=Object(r.useRef)(null),g=Object(r.useRef)(null);Object(r.useEffect)((function(){s.on("chat message",(function(e){y(e.username,e.body,"")})),s.on("setup game",(function(e){var t=e.teams;t[0].declarers=0===e.declarers,t[1].declarers=1===e.declarers,m(t)})),s.on("user joined",(function(e){y(e.username,e.username+" has joined the game.","connection-msg")})),s.on("user left",(function(e){y(e.username,e.username+" has left the game.","disconnection-msg")}))}),[]);var y=function(e,t,n){var c={body:0===n.length?e+": "+t:t,username:e,style:n};if(b((function(e){return e.concat(c)})),g.current&&x.current){var r=g.current.clientHeight;x.current.scrollTop=r}};return Object(c.jsxs)("aside",{id:"chat",className:e.portrait?e.status?"chat-opening":"chat-closing":"",children:[Object(c.jsx)("div",{id:"current-users",children:Object(c.jsx)("div",{id:"all-users",children:f.length>0?f.map((function(e,t){return Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:(e.declarers?"Declarers":"Opponents")+" \u2013 "+e.score}),Object(c.jsx)("li",{children:e.usernames[0]}),Object(c.jsx)("li",{children:e.usernames[1]})]},t)})):""})}),Object(c.jsxs)("div",{id:"chat-container",children:[Object(c.jsx)("div",{id:"messages-container",ref:x,children:Object(c.jsx)("ul",{id:"messages",ref:g,children:h.length>0?h.map((function(e,t){return Object(c.jsx)("li",{className:"chat-msg "+e.style,children:e.body},t)})):""})}),Object(c.jsxs)("form",{id:"chatbox",action:"",children:[Object(c.jsx)("input",{id:"m",autoComplete:"off",value:d,onChange:function(e){u(e.target.value)}}),Object(c.jsx)("button",{onClick:function(t){var n=d;t.preventDefault(),s.emit("chat message",{body:n,username:e.username}),u("")},children:"Send"})]})]})]})},x=n(7);var g=function(e){var t=Object(r.useRef)(null);Object(r.useEffect)((function(){n()}),[e.left]);var n=function(){var n=e.width;"2"===e.id?x.a.fromTo(t.current,.5,{opacity:0,left:n-30},{opacity:1,left:n/2}):"3"===e.id?x.a.fromTo(t.current,.5,{opacity:0,top:-107},{opacity:1,top:30}):"4"===e.id&&x.a.fromTo(t.current,.5,{opacity:0,left:0},{opacity:1,left:n/2})};return Object(c.jsxs)("div",{className:"card-container"+(e.win?" winning":""),ref:t,style:e.left?{left:e.left+"px"}:{},children:[Object(c.jsx)("p",{className:"card-number"+(e.cd.value<100?"":" joker")+(101===e.cd.value?" red":""),children:e.cd.display}),e.cd.value<100?Object(c.jsx)("img",{className:"card-suit",src:""+e.cd.img}):""]})};var y=function(e){var t=Object(r.useState)([]),n=Object(o.a)(t,2),s=n[0],a=n[1],i=Object(r.useState)(""),d=Object(o.a)(i,2),u=d[0],j=d[1],l=Object(r.useState)(e.socket),h=Object(o.a)(l,2),b=h[0],p=(h[1],Object(r.useState)(!1)),O=Object(o.a)(p,2),f=O[0],m=O[1],x=Object(r.useRef)(-1),y=Object(r.useRef)(null);return Object(r.useEffect)((function(){e.main<0?x.current=e.id-1:x.current=(e.id-1+e.main)%4,b.on("hand played",(function(e){e.id===x.current&&(a(e.cards),j(e.username))})),b.on("win round",(function(e){e===x.current&&m(!0)})),b.on("new round",(function(){a((function(e){return[]})),m(!1)})),b.on("end game",(function(){a((function(e){return[]})),m(!1),j("")}))}),[]),Object(c.jsxs)("div",{className:"player-"+e.id,ref:y,children:[Object(c.jsx)("h2",{children:u}),Object(c.jsx)("div",{id:"player-"+e.id+"-cards",children:s.map((function(t,n){return Object(c.jsx)(g,{cd:t,win:f,id:e.id,width:y?y.current.clientWidth:150},t.index)}))})]})},v=n(4);function k(e,t){switch(t.type){case"add":return[].concat(Object(v.a)(e),[t.item]);case"remove":return[].concat(Object(v.a)(e.slice(0,t.index)),Object(v.a)(e.slice(t.index+1)));case"replace":return Object(v.a)(t.items);case"update":return[].concat(Object(v.a)(e.slice(0,t.index)),[t.item],Object(v.a)(e.slice(t.index+1)));case"filter":return e.filter((function(e,n){return!t.indices.includes(n)}));case"concat":return Object(v.a)(e).concat(t.items);case"clear":return[]}}var w=function(e){var t=Object(r.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],function(e,t){var n=Object(r.useReducer)(e,t),c=Object(o.a)(n,2),s=c[0],a=c[1],i=Object(r.useRef)(null);Object(r.useEffect)((function(){i.current&&(i.current(s),i.current=null)}),[i.current,s]);var d=Object(r.useCallback)((function(e){return a(e),new Promise((function(e){i.current=e}))}),[a]);return[s,d]}(k,[])),i=Object(o.a)(a,2),u=i[0],j=i[1],l=Object(r.useState)([]),h=Object(o.a)(l,2),b=h[0],p=h[1],m=Object(r.useReducer)(k,[]),y=Object(o.a)(m,2),w=y[0],S=y[1],N=Object(r.useState)(!1),C=Object(o.a)(N,2),T=C[0],I=C[1],R=Object(r.useState)(!1),E=Object(o.a)(R,2),P=E[0],D=E[1],M=Object(r.useState)(!1),J=Object(o.a)(M,2),W=J[0],V=J[1],A=Object(r.useState)(null),G=Object(o.a)(A,2),U=G[0],Y=G[1],H=Object(r.useRef)({currentSuit:"",state:0,playerId:-1,turn:!1,plays:0,rank:null}),q=Object(r.useRef)([]),K=Object(r.useRef)(null),B=Object(r.useRef)(null),F=Object(r.useRef)(null);Object(r.useEffect)((function(){s.on("my hand",(function(t){console.log(t.hand),H.current=Object(d.a)(Object(d.a)({},H.current),{},{playerId:t.playerId,rank:t.rank,turn:!0});var n=[],c=L(0);t.hand.forEach((function(e,t){n.push({obj:e,dom:{},position:c[t],checked:!1})})),t.dealing?(H.current=Object(d.a)(Object(d.a)({},H.current),{},{state:1,turn:!0}),e.sendMessage({body:"Play a card with the trump rank to set the trump suit."}),q.current=n,X(n,0)):j({type:"replace",items:n}),t.prevPlayed&&t.prevPlayed.forEach((function(e){S({type:"add",item:{obj:e,left:F.current.clientWidth/2}})}))})),s.on("trump set",(function(t){H.current=Object(d.a)(Object(d.a)({},H.current),{},{turn:!1}),t.username.length>0?e.sendMessage({body:t.username+" set the trump suit to "+t.suit}):e.sendMessage({body:"The trump suit was set to "+t.suit})})),s.on("sort cards",(function(e){H.current=Object(d.a)(Object(d.a)({},H.current),{},{state:0}),Y(e.suit)})),s.on("next turn",(function(e){e.turn===H.current.playerId&&(H.current=Object(d.a)(Object(d.a)({},H.current),{},{turn:!0,currentSuit:e.suit,plays:e.plays}))})),s.on("win round",(function(e){e===H.current.playerId&&V(!0)})),s.on("new round",(function(e){e!==H.current.playerId&&(p((function(e){return[]})),V(!1))})),s.on("end game",(function(){S({type:"clear"}),p([]),j({type:"clear"})}))}),[]),Object(r.useEffect)((function(){return u.length>0&&Q(),u.length<12&&q.current.length>0&&1===H.current.state&&X(q.current,u.length),u.length>=12&&1===H.current.state&&s.emit("finished deal"),u.length>12&&2===H.current.state&&e.sendMessage({body:"Select 6 cards to discard.",color:"green"}),s.on("swap cards",(function(e){H.current=Object(d.a)(Object(d.a)({},H.current),{},{state:2,turn:!0,playerId:e.id});var t=[];e.newCards.forEach((function(e){t.push({obj:e,dom:{},checked:!1})})),j({type:"concat",items:t}),Y(e.suit)})),function(){s.off("swap cards")}}),[u.join(",")]),Object(r.useEffect)((function(){Z(U)}),[U]);var L=function(e){var t=[],n=0;if(0===e){var c=u.length,r=K.current?K.current.clientWidth:681,s=(r-80)/(c-1),a=Math.min(s,80);r>80*c&&(n=(r-80*c)/2);for(var i=0;i<c;i++)t.push(n+a*i)}else{var d=w.length,o=F.current?F.current.clientWidth:60,j=(o-60)/(d-1),l=Math.min(j,70);o>70*d&&(n=(o-70*d)/2);for(var h=0;h<d;h++)t.push(n+l*h+35)}return t},z=function(e){var t=u[e];t.checked=!1,j({type:"update",index:e,item:t});var n=K.current.clientWidth/2-31-u[e].position,c=-1*(B.current.clientHeight+13),r=u[e].obj;return x.a.to(t.dom.current,1,{x:n,y:c,width:"60px",height:"80px",borderRadius:"5px"}),r},Q=function(){var e=L(0),t=Object(v.a)(u);t.forEach((function(t,n){t.position=e[n]})),j({type:"replace",items:t})},X=function(e,t){setTimeout((function(){j({type:"add",item:e[t]})}),1e3)},Z=function(e){var t=L(0);$(H.current.rank,e,t);var n=Object(v.a)(u).sort(O);n.forEach((function(e,n){e.position=t[n]})),j({type:"replace",items:n})},$=function(e,t,n){for(var c=0;c<u.length;c++){var r=u[c];r.obj.value===e&&r.obj.suit===t?(r.obj.adjSuit="trump",r.obj.adjustedValue=r.obj.value+80):r.obj.value===e?(r.obj.adjSuit="trump",r.obj.adjustedValue=r.obj.value+70):r.obj.suit===t?(r.obj.adjSuit="trump",r.obj.adjustedValue=r.obj.value+50):(r.obj.adjSuit=r.obj.suit,r.obj.adjustedValue=r.obj.value),j({type:"update",index:c,item:r})}};return Object(c.jsxs)("div",{style:{width:"100%",display:"flex",flexWrap:"wrap"},children:[Object(c.jsx)("div",{className:"play",ref:B,children:Object(c.jsxs)("div",{className:"play-hand",children:[Object(c.jsx)("p",{id:"history-message",style:P&&w.length>1?{opacity:1}:{opacity:0},children:"Click to see play history"}),Object(c.jsx)("div",{className:"play-hand-cards",onClick:function(e){T?(w.forEach((function(e,t){var n=e;n.left=F.current.clientWidth/2,S({type:"update",index:t,item:n})})),setTimeout((function(){I(!1)}),300)):(I(!0),D(!1),setTimeout((function(){var e=L(1);w.forEach((function(t,n){var c=t;c.left=e[n],S({type:"update",index:n,item:c})}))}),10))},ref:F,onMouseEnter:function(e){T||D(!0)},onMouseLeave:function(e){D(!1)},children:T?w.map((function(e,t){return Object(c.jsx)(g,{cd:e.obj,win:!1,id:1,left:e.left},e.obj.index+100)})):b.map((function(e){return Object(c.jsx)(g,{cd:e,win:W,id:1,left:F.current.clientWidth/2},e.index)}))})]})}),Object(c.jsx)("div",{className:"my-player",children:Object(c.jsx)("div",{className:"hand",children:Object(c.jsxs)("form",{id:"hand-form",action:"",children:[Object(c.jsx)("div",{className:"hand-cards",ref:K,children:Object(c.jsx)("div",{children:u.map((function(e,t){return Object(c.jsx)(f,{cd:e.obj,checked:e.checked,left:e.position,getRef:function(e){return function(e,t,n){if("active"===n){var c=u[t];c.dom=e,j({type:"update",index:t,item:c})}else{var r=w[t];r.dom=e,S({type:"update",index:t,item:r})}}(e,t,"active")},handleChange:function(){return function(e){var t=u[e];t.checked=!t.checked,j({type:"update",index:e,item:t})}(t)}},e.obj.index)}))})}),Object(c.jsx)("button",{id:"hand-submit",disabled:!H.current.turn&&(0===H.current.state||1===H.current.state),onClick:function(t){t.preventDefault();var n=u.filter((function(e){return e.checked})),c=n.map((function(e){return e.obj}));if(2===H.current.state)if(c.length>6)e.sendMessage({body:"You can only pick 6 cards!",color:"red"});else if(c.length<6)e.sendMessage({body:"You didn't select 6 cards!",color:"red"});else{e.sendMessage({body:"",color:""});var r=[];c.forEach((function(e){var t=u.findIndex((function(t){return t.obj.index===e.index}));z(t),r.push(t)})),setTimeout((function(){j({type:"filter",indices:r})}),1e3),s.emit("submit swap cards",{cards:c.map((function(e){return e.index})),id:H.current.playerId}),H.current=Object(d.a)(Object(d.a)({},H.current),{},{state:0})}else if(1===H.current.state)if(c.length>1)e.sendMessage({body:"You can only choose one card!",color:"red"});else if(c.length<1)e.sendMessage({body:"You didn't choose a card!",color:"red"});else{var a=c[0].suit;c[0].value===H.current.rank?(s.emit("set suit",a),n[0].checked=!1):e.sendMessage({body:"That card isn't of the trump rank!",color:"red"})}else if(H.current.turn)if(c.length>1)e.sendMessage({body:"You can only play one card!",color:"red"});else if(c.length<1)e.sendMessage({body:"You didn't select a card!",color:"red"});else{if(c[0].adjSuit===H.current.currentSuit||u.findIndex((function(e){return e.obj.adjSuit===H.current.currentSuit}))<0){p((function(e){return[]})),V(!1);var i=u.findIndex((function(e){return e.obj.index===c[0].index})),o=z(i);setTimeout((function(){j({type:"remove",index:i}),p((function(e){return e.concat(o)})),S({type:"add",item:{obj:o,left:F.current.clientWidth/2}}),H.current=Object(d.a)(Object(d.a)({},H.current),{},{turn:!1}),s.emit("submit hand",{cards:c.map((function(e){return e.index})),id:H.current.playerId})}),1e3)}else e.sendMessage({body:"You can't play that card!",subtitle:"You need to play "+H.current.currentSuit+".",color:"red"})}},children:"Confirm Play"}),1===H.current.state&&H.current.turn?Object(c.jsx)("button",{id:"skip-submit",onClick:function(e){e.preventDefault(),s.emit("set suit",""),H.current=Object(d.a)(Object(d.a)({},H.current),{},{turn:!1})},children:"Skip"}):""]})})})]})},S=n(20),N=n.n(S);var C=function(e){var t=Object(r.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(r.useState)([])),i=Object(o.a)(a,2),d=i[0],u=i[1],j=Object(r.useState)(""),l=Object(o.a)(j,2),h=l[0],b=l[1],p=Object(r.useState)([]),O=Object(o.a)(p,2),f=O[0],m=O[1],x=Object(r.useState)(!1),y=Object(o.a)(x,2),v=(y[0],y[1]);return Object(r.useEffect)((function(){s.on("flip discard",(function(e){u(e.cards);for(var t=[],n=0;n<e.cards.length;n++)n===e.max?t.push(!0):t.push(!1);m(t),b("The trump suit is set to "+e.suit)})),s.on("reveal discard",(function(e){u(e.discard);var t=[];e.discard.forEach((function(e){e.points>0?t.push(!0):t.push(!1)})),m(t),v(e.adding),e.adding?b("The opponents gained "+e.addPoints+" points."):b("")}))})),Object(c.jsxs)("div",{id:"discard",style:e.visible?{display:"block"}:{display:"none"},children:[Object(c.jsx)("h2",{children:"Discard Pile"}),Object(c.jsx)("div",{id:"discard-cards",children:d.map((function(e,t){return Object(c.jsx)(g,{cd:e,win:f[t]},e.index)}))}),Object(c.jsx)("p",{id:"discard-points",children:h})]})};var T=function(e){var t=Object(r.useState)(!1),n=Object(o.a)(t,2),s=n[0],a=n[1],i=Object(r.useState)(e.socket),d=Object(o.a)(i,2),u=d[0],j=(d[1],Object(r.useState)({body:"",subtitle:"",color:""})),l=Object(o.a)(j,2),h=l[0],b=l[1],p=Object(r.useState)(!1),O=Object(o.a)(p,2),f=O[0],m=O[1],x=Object(r.useRef)(null);Object(r.useEffect)((function(){u.on("set playerId",(function(e){x.current=e})),u.on("my hand",(function(e){a(!0)})),u.on("next turn",(function(e){e.turn===x.current?b({body:"It's your turn!",color:"green"}):b({body:"It's "+e.usrnm+"'s turn!",color:""})})),u.on("flip discard",(function(){g()})),u.on("reveal discard",(function(){g()})),u.on("end game",(function(e){b({body:e.msg,subtitle:e.subtitle,color:""}),a(!1)}))}),[]);var g=function(){m(!0),setTimeout((function(){m(!1)}),7e3)};return Object(c.jsxs)("div",{className:"game-space",children:[e.popUp?Object(c.jsxs)("div",{id:"pop-up",children:[Object(c.jsx)("p",{id:"pop-up-close",children:Object(c.jsx)("a",{href:"#",onClick:e.togglePop,children:"X"})}),Object(c.jsxs)("div",{id:"pop-up-inner",children:[Object(c.jsx)("h1",{children:"Game History"}),Object(c.jsx)("h3",{className:"yellow",children:"The team that was the Declarer each round is in yellow."}),Object(c.jsx)("br",{}),e.history.length>0?Object(c.jsxs)("table",{children:[Object(c.jsxs)("tr",{children:[Object(c.jsx)("th",{children:"Round"}),Object(c.jsx)("th",{children:e.history[0].teams[0].usernames[0]+" & "+e.history[0].teams[0].usernames[1]}),Object(c.jsx)("th",{children:e.history[0].teams[1].usernames[0]+" & "+e.history[0].teams[1].usernames[1]}),Object(c.jsx)("th",{children:"Starter"}),Object(c.jsx)("th",{children:"Trump Suit"}),Object(c.jsx)("th",{children:"Points"}),Object(c.jsx)("th",{children:"Winner"})]}),e.history.map((function(e){return Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:e.roundIndex}),Object(c.jsx)("td",{className:0===e.declarer?"winner":"",children:e.teams[0].score}),Object(c.jsx)("td",{className:1===e.declarer?"winner":"",children:e.teams[1].score}),Object(c.jsx)("td",{children:e.starter}),Object(c.jsx)("td",{children:e.trumpSuit}),Object(c.jsx)("td",{children:e.points}),Object(c.jsx)("td",{children:e.teams[e.winner].usernames[0]+" & "+e.teams[e.winner].usernames[1]})]})}))]}):Object(c.jsx)("p",{children:"No games yet."})]})]}):"",Object(c.jsx)(C,{socket:u,visible:f}),Object(c.jsx)("div",{id:"overlay"}),Object(c.jsxs)("div",{id:"header",children:[Object(c.jsx)("p",{className:"center-msg "+h.color,children:h.body}),Object(c.jsx)("h4",{className:h.color,children:h.subtitle})]}),null!==x.current?Object(c.jsx)(y,{id:"3",socket:u,main:x.current}):"",null!==x.current?Object(c.jsx)(y,{id:"4",socket:u,main:x.current}):"",Object(c.jsxs)("div",{className:"center",children:[Object(c.jsx)("input",{type:"text",value:e.code.current,id:"code-box",disabled:!0}),s||"player"!==e.userType.current?"":Object(c.jsx)("button",{id:"start-game",onClick:function(e){e.preventDefault(),b({body:"Waiting...",color:""}),a(!0),u.emit("start game",{})},children:null!==x.current?"Start Next Round":"Start Game"})]}),null!==x.current?Object(c.jsx)(y,{id:"2",socket:u,main:x.current}):"","player"===e.userType.current?Object(c.jsx)(w,{socket:u,playerId:x.current,sendMessage:b}):Object(c.jsx)(y,{id:"1",socket:u,main:x.current})]})};function I(e){var t=Object(r.useState)(0),n=Object(o.a)(t,2),s=n[0],a=n[1],i=Object(r.useState)(e.socket),d=Object(o.a)(i,2),u=d[0];d[1];return 1===s?Object(c.jsx)(R,{setState:function(){return a(0)},socket:u,setRoom:e.setRoom,code:e.code}):2===s?Object(c.jsx)(E,{setState:function(){return a(0)},socket:u,setRoom:e.setRoom,code:e.code}):3===s?Object(c.jsx)(P,{close:function(){return a(0)}}):Object(c.jsx)("div",{className:"start-page",children:Object(c.jsxs)("div",{className:"game-start",children:[Object(c.jsx)("h1",{children:"Sheng Ji"}),Object(c.jsxs)("div",{className:"create-game",children:[Object(c.jsx)("h2",{children:"Host"}),Object(c.jsx)("button",{onClick:function(){return a(1)},children:"Create a Game"})]}),Object(c.jsxs)("div",{className:"join-game",children:[Object(c.jsx)("h2",{children:"Guest"}),Object(c.jsx)("button",{onClick:function(){return a(2)},children:"Join a Game"})]}),Object(c.jsx)("button",{id:"instructions-btn",onClick:function(){a(3)},children:"How to Play"})]})})}function R(e){var t=Object(r.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(r.useState)("")),i=Object(o.a)(a,2),u=i[0],j=i[1],l=Object(r.useState)({rank:2}),h=Object(o.a)(l,2),b=h[0],p=h[1];return Object(c.jsx)("div",{className:"start-page",children:Object(c.jsxs)("div",{className:"game-start",children:[Object(c.jsx)("h1",{children:"Sheng Ji"}),Object(c.jsxs)("div",{className:"create-game",children:[Object(c.jsx)("h2",{children:"Settings"}),Object(c.jsxs)("form",{id:"edit-settings",children:[Object(c.jsx)("label",{children:"Trump Rank"}),Object(c.jsx)("br",{}),Object(c.jsx)("input",{id:"setTrumpValue",name:"setTrumpValue",autoComplete:"off",defaultValue:"2",min:"2",max:"14",type:"number",onChange:function(e){p(Object(d.a)(Object(d.a)({},b),{},{rank:e.target.value}))}}),Object(c.jsx)("br",{}),Object(c.jsx)("button",{onClick:function(t){t.preventDefault(),b.rank>=2&&b.rank<=14?s.emit("create game",b,(function(t){e.code.current=t,e.setRoom(0)})):j("The trump rank must be between 2 and 14.")},children:"Create Game"})]}),Object(c.jsx)("p",{id:"login-error",className:"error-message",children:u}),Object(c.jsx)("p",{children:Object(c.jsx)("a",{href:"#",onClick:e.setState,children:"\u2190 BACK"})})]})]})})}function E(e){var t=Object(r.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(r.useState)("")),i=Object(o.a)(a,2),d=i[0],u=i[1],j=Object(r.useState)(""),l=Object(o.a)(j,2),h=l[0],b=l[1];return Object(c.jsx)("div",{className:"start-page",children:Object(c.jsxs)("div",{className:"game-start",children:[Object(c.jsx)("h1",{children:"Sheng Ji"}),Object(c.jsxs)("div",{className:"create-game",children:[Object(c.jsx)("h2",{children:"Game Code"}),Object(c.jsxs)("form",{id:"edit-settings",children:[Object(c.jsx)("input",{name:"gameID",autoComplete:"off",type:"text",onChange:function(e){b(e.target.value)}}),Object(c.jsx)("br",{}),Object(c.jsx)("button",{onClick:function(t){t.preventDefault(),s.emit("join game",h,(function(t){"success"===t?(e.code.current=h,e.setRoom(0)):u("No game with that code found.")}))},children:"Join Game"}),Object(c.jsx)("p",{id:"login-error",className:"error-message",children:d})]}),Object(c.jsx)("p",{children:Object(c.jsx)("a",{href:"#",onClick:e.setState,children:"\u2190 BACK"})})]})]})})}function P(e){return Object(c.jsxs)("div",{id:"instructions",children:[Object(c.jsx)("p",{id:"instructions-close",onClick:function(){e.close()},children:Object(c.jsx)("a",{href:"#",children:"X"})}),Object(c.jsx)("h1",{children:"Rules"}),Object(c.jsx)("h3",{children:"Players and Cards"}),Object(c.jsx)("p",{children:"Sheng Ji is a game played by four players in fixed teams, with partners facing each other across the table. A standard international pack is used, with red and black jokers, making 54 cards in all. The point values of the cards are as follows:"}),Object(c.jsxs)("table",{children:[Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"Each King"}),Object(c.jsx)("td",{children:"10 points"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"Each ten"}),Object(c.jsx)("td",{children:"10 points"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"Each five "}),Object(c.jsx)("td",{children:"5 points,"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"Other cards"}),Object(c.jsx)("td",{children:"no value"})]})]}),Object(c.jsx)("h3",{children:"Ranking of Cards"}),Object(c.jsx)("p",{children:"In each hand there are eighteen trumps: the two jokers, all the cards of a particular suit (the trump suit) and all the cards of a particular rank (the trump rank). The highest trump is the red Joker, second is the black Joker, and third is the card which belongs to both the trump suit and the trump rank. Next come the other three cards of the trump rank, which are equal in status. Finally there are the remaining cards of the trump suit which rank in downwards order A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2 (omitting the trump rank). The three remaining suits also rank from highest to lowest omitting the trump rank."}),Object(c.jsx)("h3",{children:"Declarers and Opponents"}),Object(c.jsx)("p",{children:"In each game one team is the Declarers, and the other are the Opponents. The Declarers are the winners of the previous game. Each team's score is expressed as a card rank from two (low) up to Ace (high). In each game the trump rank is the Declarers' current score. Both sides start at two and the winners are the first side whose score goes above Ace."}),Object(c.jsx)("p",{children:"In each game, one of the Declarers is designated the starter. They will get to start the first round of the game. Additionally, before the game starts, the starter gets the 6 leftover cards after the cards have been dealed. They then get to choose 6 cards from their own hand to discard. No other players get to see these cards. These cards will become important after the game is finished."}),Object(c.jsx)("h3",{children:"The Deal"}),Object(c.jsx)("p",{children:"Each player receives twelve cards, but there is no dealer as such. The trump suit is picked during the dealing."}),Object(c.jsx)("p",{children:"The trump rank for the hand is known in advance of the deal: for the first hand it must be two because both sides start with a score of two, and in subsequent hands it is the current score of the declarers. Any player who draws a card of the trump rank during the deal may place it face up on the table, and its suit then becomes trumps for the hand. If you draw a card of the trump rank you need not show it immediately you draw it; you may keep it and expose at at any time provided that no other card has yet been exposed, or you may prefer never to expose it if you do not want its suit as trumps. Consultation between partners is not allowed."}),Object(c.jsx)("p",{children:"After each player has drawn a hand of twelve cards there are six face-down cards left over. If no one has yet exposed a card, the starter turns these cards face up one at a time in order. Once the first of these cards is exposed it is too late for anyone to determine the trump suit by exposing one of their own cards. If a card of the trump rank is found among the last six cards, its suit becomes trumps and no further cards are turned up. If no card of the trump rank appears, the highest ranking of the six cards, excluding Jokers, determines the trump suit; among cards of equal rank the earliest exposed takes precedence."}),Object(c.jsx)("p",{children:"In the first hand whichever player exposes a two (or the starter in the unlikely event that no one does) becomes the leader, and the leader\u2019s side become the declarers. In subsequent hands the leader is the same player as the starter. In either case the leader picks up the last six cards and adds them to his hand. Apart from any of these cards which may already have been exposed in order to choose trumps, the cards picked up are not shown to the other players. The leader then discards any six of his eighteen cards face down."}),Object(c.jsx)("h3",{children:"The Play"}),Object(c.jsx)("p",{children:"During the play, Jokers and cards of the trump rank all count as belonging to the trump suit, not to the suits marked on them. "}),Object(c.jsx)("p",{children:"Play is in counter-clockwise rotation. In the first round, the first person to play their cards is the starter; in each subsequent round, the first person to play is the winner of the previous round. Each of the other three players in turn must play a card in the same suit as the person who started, unless they have run out of cards of the suit, then they may play any cards in their hand. If playing the trump suit, among trumps of equal rank, the one which is played earliest beats the others. When playing different suits, the trump suit will beat the other suits. If everyone plays different non-trump suits, then the highest card in the suit the first person played wins."}),Object(c.jsx)("p",{children:"The goal of the game is to win rounds containing points, that is kings, tens and fives. Whenever the Opponents win a round containing any point cards, they accumulate the amount of points in the cards. When the Declarers win a round, they do not accumulate points but prevent the Opponents from winning points."}),Object(c.jsx)("h3",{children:"Scoring"}),Object(c.jsx)("p",{children:"The result of the game depends on the number of card points won by the Opponents. This determines which side scores how many points, and who will be the Declarers for the next hand."}),Object(c.jsx)("p",{children:"If the Opponents win the last round of the game, any point cards in the discard pile get added to the Opponents' points. Moreover, the value of each point card in the discard pile is doubled."}),Object(c.jsxs)("table",{children:[Object(c.jsxs)("tr",{children:[Object(c.jsx)("th",{children:"Points"}),Object(c.jsx)("th",{children:"Score"}),Object(c.jsx)("th",{children:"Declarers for next hand"}),Object(c.jsx)("th",{children:"Starter for next hand"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"0"}),Object(c.jsx)("td",{children:"Declarers score 2"}),Object(c.jsx)("td",{children:"No change"}),Object(c.jsx)("td",{children:"Previous starter's partner"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"5 to 35"}),Object(c.jsx)("td",{children:"Declarers score 1"}),Object(c.jsx)("td",{children:"No change"}),Object(c.jsx)("td",{children:"Previous starter's partner"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"40 to 75"}),Object(c.jsx)("td",{children:"Opponents score 1"}),Object(c.jsx)("td",{children:"Opponents become new declarers"}),Object(c.jsx)("td",{children:"Player to previous starter's right"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"80 to 95"}),Object(c.jsx)("td",{children:"Opponents score 2"}),Object(c.jsx)("td",{children:"Opponents become new declarers"}),Object(c.jsx)("td",{children:"Player to previous starter's right"})]}),Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:"100 or more"}),Object(c.jsx)("td",{children:"Opponents score 3"}),Object(c.jsx)("td",{children:"Opponents become new declarers"}),Object(c.jsx)("td",{children:"Player to previous starter's right"})]})]})]})}var D=function(e){var t=Object(r.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(r.useState)("")),i=Object(o.a)(a,2),d=i[0],u=i[1],j=Object(r.useState)(-1),l=Object(o.a)(j,2),h=l[0],b=l[1],p=Object(r.useState)(""),O=Object(o.a)(p,2),f=O[0],m=O[1],x=Object(r.useState)([{usernames:[]},{usernames:[]}]),g=Object(o.a)(x,2),y=g[0],v=g[1];Object(r.useEffect)((function(){s.on("set teams",(function(e){v((function(t){return e}))}))}),[]);var k=function(t){s.emit("user type",t,(function(t){"player"===t?(b(2),e.setUserType(0),u("")):"spectator"===t?(e.setUserType(1),e.finished(f)):u(t)}))},w=function(t){s.emit("set team",t,(function(t){"success"===t?e.finished(f):u(t)}))};return-1===h?Object(c.jsx)(I,{socket:s,setRoom:b,code:e.code}):0===h?Object(c.jsx)("div",{className:"start-page",children:Object(c.jsxs)("div",{id:"registration",children:[Object(c.jsx)("h1",{children:"Sheng Ji"}),Object(c.jsx)("h3",{id:"start-code",children:e.code.current}),Object(c.jsxs)("form",{id:"create-user",children:[Object(c.jsx)("label",{children:"Username"}),Object(c.jsx)("br",{}),Object(c.jsx)("input",{id:"username",name:"username",autoComplete:"off",type:"text",value:f,onChange:function(e){m(e.target.value)}}),Object(c.jsx)("button",{onClick:function(t){t.preventDefault(),""!==f&&f.replace(/\s/g,"").length?s.emit("add user",f,(function(t){"success"===t?(e.setUsername(f),b(1),u("")):"return"===t?(e.setUserType(0),e.finished(f)):u(t)})):u("Please enter a valid username.")},children:"Submit"})]}),Object(c.jsx)("p",{id:"login-error",className:"error-message",children:d})]})}):1===h?Object(c.jsx)("div",{className:"start-page",children:Object(c.jsx)("div",{id:"game-settings",children:Object(c.jsxs)("div",{id:"game-settings-player",children:[Object(c.jsx)("h1",{children:"Sheng Ji"}),Object(c.jsx)("h3",{id:"start-code",children:e.code.current}),Object(c.jsx)("h2",{children:"Would you like to join the game as a player or a spectator?"}),Object(c.jsx)("button",{id:"join-player",onClick:function(){return k("player")},children:"Player"}),Object(c.jsx)("button",{id:"join-spectator",onClick:function(){return k("spectator")},children:"Spectator"}),Object(c.jsx)("p",{id:"setting-error",className:"error-message",children:d})]})})}):2===h?Object(c.jsx)("div",{className:"start-page",children:Object(c.jsx)("div",{id:"game-settings",children:Object(c.jsxs)("div",{id:"team",children:[Object(c.jsx)("h1",{children:"Sheng Ji"}),Object(c.jsx)("h3",{id:"start-code",children:e.code.current}),Object(c.jsx)("h2",{id:"team-header",children:"Which team would you like to join?"}),Object(c.jsxs)("div",{id:"team-container",children:[Object(c.jsxs)("div",{id:"declarers",onClick:function(){return w(0)},children:[Object(c.jsx)("h3",{children:"Declarers"}),Object(c.jsx)("div",{children:Object(c.jsx)("ul",{children:y[0].usernames.length>0?y[0].usernames.map((function(e){return Object(c.jsx)("li",{children:e})})):Object(c.jsx)("li",{children:"No players yet"})})})]}),Object(c.jsxs)("div",{id:"opponents",onClick:function(){return w(1)},children:[Object(c.jsx)("h3",{children:"Opponents"}),Object(c.jsx)("div",{children:Object(c.jsx)("ul",{children:y[1].usernames.length>0?y[1].usernames.map((function(e){return Object(c.jsx)("li",{children:e})})):Object(c.jsx)("li",{children:"No players yet"})})})]})]}),Object(c.jsx)("p",{id:"team-error",className:"error-message",children:d})]})})}):void 0},M=n(21),J=N()();function W(e){var t=Object(r.useState)(e.socket),n=Object(o.a)(t,2),s=n[0],a=(n[1],Object(r.useState)(!1)),i=Object(o.a)(a,2),d=i[0],u=i[1];return Object(r.useEffect)((function(){s.on("chat message",(function(e){u(!0)}))}),[]),Object(r.useEffect)((function(){e.status&&u(!1)}),[e.status]),Object(c.jsxs)("div",{id:"chat-icon",onClick:e.handleClick,children:[d?Object(c.jsx)("div",{id:"chat-notif"}):"",Object(c.jsx)("img",{src:"/chaticon.png"})]})}var V=function(){var e=Object(r.useState)([]),t=Object(o.a)(e,2),n=t[0],s=t[1],a=Object(r.useState)(!1),i=Object(o.a)(a,2),u=i[0],j=i[1],l=Object(r.useState)([]),h=Object(o.a)(l,2),b=h[0],O=h[1],f=Object(r.useState)(!1),x=Object(o.a)(f,2),g=x[0],y=x[1],v=Object(r.useState)({username:"",loggedIn:!1}),k=Object(o.a)(v,2),w=k[0],S=k[1],N=Object(r.useState)({trumpSuit:"",trumpRank:null,points:0}),C=Object(o.a)(N,2),I=C[0],R=C[1],E=Object(r.useState)(!1),V=Object(o.a)(E,2),A=V[0],G=V[1],U=Object(r.useState)(!1),Y=Object(o.a)(U,2),H=Y[0],q=Y[1],K=Object(r.useRef)(""),B=Object(r.useRef)("");return Object(r.useEffect)((function(){s(p()),window.innerWidth<window.innerHeight&&G(!0),J.on("setup game",(function(e){R(Object(d.a)(Object(d.a)({},I),{},{trumpRank:e.trumpValue}))})),J.on("trump set",(function(e){R(Object(d.a)(Object(d.a)({},I),{},{trumpSuit:e.suit,trumpRank:e.rank}))})),J.on("update points",(function(e){R((function(t){return Object(d.a)(Object(d.a)({},t),{},{points:e})}))})),J.on("disconnected",(function(){alert("You have disconnected from the server. Please refresh your page.")}))}),[s]),Object(c.jsxs)("div",{className:"App",children:[w.loggedIn?"":Object(c.jsx)(M.a,{children:Object(c.jsx)(D,{username:w.username,socket:J,setUsername:function(e){S({username:e,loggedIn:w.loggedIn})},setUserType:function(e){K.current=0===e?"player":"spectator"},finished:function(e){S({username:e,loggedIn:!0})},code:B})}),g?Object(c.jsx)(P,{close:function(){return y(!1)}}):"",Object(c.jsx)(M.a,{children:Object(c.jsxs)("div",{id:"chat-page",children:[Object(c.jsxs)("div",{className:"sidebar",children:[Object(c.jsxs)("div",{className:"legend",children:[Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Trump Suit"}),Object(c.jsxs)("p",{id:"trump-suit",children:[I.trumpSuit?Object(c.jsx)("img",{src:"/"+I.trumpSuit+".png"}):"?"," "]})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Trump Rank"}),Object(c.jsx)("p",{id:"trump-rank",children:I.trumpRank?I.trumpRank:""})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Points"}),Object(c.jsx)("p",{id:"points",children:I.points})]}),Object(c.jsxs)("div",{children:[Object(c.jsxs)("h2",{children:["Game",Object(c.jsx)("br",{}),"History"]}),Object(c.jsx)("p",{children:Object(c.jsx)("a",{id:"game-history",href:"#",onClick:function(e){J.emit("get game history",{},(function(e){O(e)})),j(!0)},children:"View"})})]})]}),Object(c.jsxs)("div",{id:"my-player-stats",children:[Object(c.jsx)("h3",{id:"my-username",children:w.username}),Object(c.jsx)("p",{children:Object(c.jsx)("a",{href:"#",id:"help-link",style:{fontSize:"10px"},onClick:function(){return y(!0)},children:"Help"})})]})]}),n.length>0?Object(c.jsx)(T,{deck:n,socket:J,popUp:u,togglePop:function(){j(!1)},history:b,userType:K,code:B}):"",Object(c.jsx)(W,{handleClick:function(){return q(!H)},socket:J,status:H}),Object(c.jsx)(m,{socket:J,username:w.username,portrait:A,status:H})]})})]})},A=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,71)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,s=t.getLCP,a=t.getTTFB;n(e),c(e),r(e),s(e),a(e)}))};i.a.render(Object(c.jsx)(s.a.StrictMode,{children:Object(c.jsx)(V,{})}),document.getElementById("root")),A()}},[[70,1,2]]]);
//# sourceMappingURL=main.b1a9c148.chunk.js.map