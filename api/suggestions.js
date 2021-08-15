"use strict";
/*!
* @project      suggestify-engine
* @author      	Max van der Schee <hello@maxvanderschee.nl>
* @build        1629037550343
* @release      1.2.0
* @copyright    Copyright (c) 2021 Max van der Schee <hello@maxvanderschee.nl>
*/const e={MIN_DISTANCE:3,ITEM_CAP:8,RATELIMIT_CAP:50,RATELIMIT_TEXT:"Too Many Requests",INTERNAL_ERROR:"Woopsie, we will look into it!",ALLOWED_ORIGINS:["http://localhost:3000","http://localhost:3001","https://suggestify.maxvanderschee.nl"],SANITIZE:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&grave;","/":"&#x2F;"}};async function t(t,r,s){const n=t.charAt(0),o=s[n]?s[n]:r,a=new RegExp(t.replace(/\W+/g,"|"),"i"),l={match:[],alt:[]},c=r=>{((e,t)=>{if(!e.length)return t.length;if(!t.length)return e.length;const r=[];for(let s=0;s<=t.length;s++){r[s]=[s];for(let n=1;n<=e.length;n++)r[s][n]=0===s?n:Math.min(r[s-1][n]+1,r[s][n-1]+1,r[s-1][n-1]+(e[n-1]===t[s-1]?0:1))}return r[t.length][e.length]})(r,t)<=e.MIN_DISTANCE&&l.alt.push(r)};for(let e=0;e<o.length;e++)i=o[e],a.test(i)&&l.match.push(i);var i;if(l.match.length<=e.ITEM_CAP)for(let e=0;e<o.length;e++)c(o[e]);const h=function(e,t){const r=[],s=new RegExp(t,"i"),n=new RegExp(t.replace(/\W+/g,"|"),"i"),o={},a=e.filter((e=>{const t=s.exec(e);return!t||0!==t.index||(r.push(e),!1)})).filter((e=>!s.test(e)||(r.push(e),!1))).filter((e=>{const t=n.exec(e);return!t||(o[e]=t.index,!1)})),l=Object.keys(o).sort(((e,t)=>o[e]-o[t]));return[...r,...l,...a]}(l.match,t),u=new Set([...h,...l.alt.sort()]);return Promise.resolve([...u].slice(0,e.ITEM_CAP))}const r=require("./data/default.json"),s=require("./data/sorted.json"),n=require("./data/recommended.json"),o=require("lambda-rate-limiter")({interval:6e4,uniqueTokenPerInterval:500}),a=t=>t.replace(/[&<>"'/`]/gi,(t=>e.SANITIZE[t])).trim().toLowerCase();var l,c=(l=async(l,c)=>{const{headers:i,body:h}=l;let u,A;try{await o.check(e.RATELIMIT_CAP,i["x-real-ip"])}catch(d){return c.status(429).send(e.RATELIMIT_TEXT)}try{A=JSON.parse(h)}catch(d){A=h}if(A.search&&(u=a(A.search)),!u)return c.status(200).json({type:"suggestions",items:n,time:0});try{let e=process.hrtime();const n=await t(u,r,s);let o=process.hrtime(e);return c.status(200).json({type:n.length?"results":"empty",items:n,time:`${(1e3*o[0]+o[1]/1e6).toFixed(2)}ms`})}catch(g){return c.status(500).send(e.INTERNAL_ERROR)}},async(t,r)=>{const s=t.headers.origin;return e.ALLOWED_ORIGINS.indexOf(s)>-1&&r.setHeader("Access-Control-Allow-Origin",s),r.setHeader("Access-Control-Allow-Credentials",!0),r.setHeader("Access-Control-Allow-Methods","POST"),r.setHeader("Access-Control-Allow-Headers","X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"),await l(t,r)});module.exports=c;
