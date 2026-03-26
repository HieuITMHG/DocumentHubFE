import{r as n,j as o}from"./index-3tWh6ywI.js";/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),g=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,a)=>a?a.toUpperCase():r.toLowerCase()),l=t=>{const e=g(t);return e.charAt(0).toUpperCase()+e.slice(1)},m=(...t)=>t.filter((e,r,a)=>!!e&&e.trim()!==""&&a.indexOf(e)===r).join(" ").trim(),f=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var w={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=n.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:r=2,absoluteStrokeWidth:a,className:c="",children:s,iconNode:h,...i},d)=>n.createElement("svg",{ref:d,...w,width:e,height:e,stroke:t,strokeWidth:a?Number(r)*24/Number(e):r,className:m("lucide",c),...!s&&!f(i)&&{"aria-hidden":"true"},...i},[...h.map(([u,p])=>n.createElement(u,p)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=(t,e)=>{const r=n.forwardRef(({className:a,...c},s)=>n.createElement(b,{ref:s,iconNode:e,className:m(`lucide-${x(l(t))}`,`lucide-${t}`,a),...c}));return r.displayName=l(t),r};/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"12jkf8"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"m16 19 2 2 4-4",key:"1b14m6"}]],j=k("mail-check",C),v=()=>o.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gray-100 px-4",children:o.jsxs("div",{className:"bg-white shadow-xl rounded-2xl p-8 max-w-md text-center",children:[o.jsx(j,{className:"w-16 h-16 text-blue-500 mx-auto mb-4"}),o.jsx("h1",{className:"text-2xl font-bold mb-2",children:"Xác thực Email"}),o.jsx("p",{className:"text-gray-600 mb-4",children:"Chúng tôi đã gửi một email xác thực đến địa chỉ bạn đã đăng ký."}),o.jsx("p",{className:"text-gray-600 mb-6",children:"Vui lòng kiểm tra hộp thư đến hoặc thư rác và nhấp vào liên kết trong email để hoàn tất quá trình đăng ký."})]})});export{v as default};
