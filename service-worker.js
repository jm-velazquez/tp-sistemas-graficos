if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,c)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let o={};const t=e=>r(e,a),f={module:{uri:a},exports:o,require:t};s[a]=Promise.all(i.map((e=>f[e]||t(e)))).then((e=>(c(...e),o)))}}define(["./workbox-9a84fccb"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/tp-sistemas-graficos/index.html",revision:"4f1a3e4a1e03a40b1abc67635c8b36f9"},{url:"/tp-sistemas-graficos/main.js",revision:"2eac38b7fb42922ed47ec349dbfc1e0a"},{url:"/tp-sistemas-graficos/resources/buildings.jpg",revision:"13421cfcc9a5f20cc63596c6668ee48d"},{url:"/tp-sistemas-graficos/resources/concrete.jpg",revision:"05af2fa7aae1bdbe2cd590e075462790"},{url:"/tp-sistemas-graficos/resources/concrete_wall.jpg",revision:"62ac61307a3321ecec26e1abd045f2ab"},{url:"/tp-sistemas-graficos/resources/grass.jpg",revision:"613f804e597e7dff1ff71a784dc6893b"},{url:"/tp-sistemas-graficos/resources/grass2.jpg",revision:"b1cb04bd612429c85b4e00a1eb009d7c"},{url:"/tp-sistemas-graficos/resources/grass2_normal.jpg",revision:"4a2ec723b7dfda785e170f4a7b96046c"},{url:"/tp-sistemas-graficos/resources/highway_road.jpg",revision:"e3390266c88d0be7980af6760fd13cd4"},{url:"/tp-sistemas-graficos/resources/highway_road_wide.jpg",revision:"b2a64e1c00c2b0fba8bbf04c823ae342"},{url:"/tp-sistemas-graficos/resources/sidewalk.jpg",revision:"5ec055fb7a0131ade730fa37e1178ab1"},{url:"/tp-sistemas-graficos/resources/skybox.png",revision:"ce5ac221970915c628202649621d5135"},{url:"/tp-sistemas-graficos/resources/street.jpg",revision:"f03c7c9b4eefa47b72c572d935ab2dc3"}],{})}));
