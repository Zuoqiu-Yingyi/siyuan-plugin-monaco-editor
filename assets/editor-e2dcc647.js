var Ne=Object.defineProperty;var Be=(t,e,n)=>e in t?Ne(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var y=(t,e,n)=>(Be(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const K=We(),oe=qe(),Oe=Ge();Ke();Ve();function He(){return!!globalThis.require}function Ue(){return!!globalThis.process}function We(){return Ue()&&He()}function qe(){return globalThis.self!==globalThis.top}function Ge(){return!globalThis.opener}function Ke(){var t,e,n;return((n=(e=(t=globalThis.siyuan)==null?void 0:t.config)==null?void 0:e.appearance)==null?void 0:n.mode)===0}function Ve(){var t,e,n;return((n=(e=(t=globalThis.siyuan)==null?void 0:t.config)==null?void 0:e.appearance)==null?void 0:n.mode)===1}class Xe{constructor(e,n=!0){this.label=e,this.collapsed=n}stdout(e,n,...r){const i=`[\x1B[4m${this.label}\x1B[0m] - <\x1B[1m${e.name.toUpperCase()}\x1B[0m>`;this.collapsed?globalThis.console.groupCollapsed(i):globalThis.console.group(i),n?r.forEach(o=>Array.isArray(o)?e(...o):e(o)):e(...r),globalThis.console.trace(),globalThis.console.groupEnd()}dir(...e){this.stdout(globalThis.console.dir,!1,...e)}dirs(...e){this.stdout(globalThis.console.dir,!0,...e)}table(...e){this.stdout(globalThis.console.table,!1,...e)}tables(...e){this.stdout(globalThis.console.table,!0,...e)}debug(...e){this.stdout(globalThis.console.debug,!1,...e)}debugs(...e){this.stdout(globalThis.console.debug,!0,...e)}info(...e){this.stdout(globalThis.console.info,!1,...e)}infos(...e){this.stdout(globalThis.console.info,!0,...e)}log(...e){this.stdout(globalThis.console.log,!1,...e)}logs(...e){this.stdout(globalThis.console.log,!0,...e)}warn(...e){this.stdout(globalThis.console.warn,!1,...e)}warns(...e){this.stdout(globalThis.console.warn,!0,...e)}error(...e){this.stdout(globalThis.console.error,!1,...e)}errors(...e){this.stdout(globalThis.console.error,!0,...e)}}function D(){}function Ee(t){return t()}function de(){return Object.create(null)}function X(t){t.forEach(Ee)}function je(t){return typeof t=="function"}function Ye(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function Ze(t){return Object.keys(t).length===0}function Je(t,e,n){t.insertBefore(e,n||null)}function Me(t){t.parentNode&&t.parentNode.removeChild(t)}function Qe(t){return document.createElement(t)}function $e(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function et(t){return Array.from(t.childNodes)}function W(t,e,n){t.classList[n?"add":"remove"](e)}function tt(t,e,{bubbles:n=!1,cancelable:r=!1}={}){const i=document.createEvent("CustomEvent");return i.initCustomEvent(t,n,r,e),i}let F;function z(t){F=t}function Ae(){if(!F)throw new Error("Function called outside component initialization");return F}function nt(t){Ae().$$.on_mount.push(t)}function rt(){const t=Ae();return(e,n,{cancelable:r=!1}={})=>{const i=t.$$.callbacks[e];if(i){const o=tt(e,n,{cancelable:r});return i.slice().forEach(s=>{s.call(t,o)}),!o.defaultPrevented}return!0}}const x=[],te=[];let I=[];const he=[],it=Promise.resolve();let ne=!1;function ot(){ne||(ne=!0,it.then(Te))}function re(t){I.push(t)}const J=new Set;let P=0;function Te(){if(P!==0)return;const t=F;do{try{for(;P<x.length;){const e=x[P];P++,z(e),at(e.$$)}}catch(e){throw x.length=0,P=0,e}for(z(null),x.length=0,P=0;te.length;)te.pop()();for(let e=0;e<I.length;e+=1){const n=I[e];J.has(n)||(J.add(n),n())}I.length=0}while(x.length);for(;he.length;)he.pop()();ne=!1,J.clear(),z(t)}function at(t){if(t.fragment!==null){t.update(),X(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(re)}}function st(t){const e=[],n=[];I.forEach(r=>t.indexOf(r)===-1?e.push(r):n.push(r)),n.forEach(r=>r()),I=e}const ct=new Set;function ut(t,e){t&&t.i&&(ct.delete(t),t.i(e))}function lt(t,e,n,r){const{fragment:i,after_update:o}=t.$$;i&&i.m(e,n),r||re(()=>{const s=t.$$.on_mount.map(Ee).filter(je);t.$$.on_destroy?t.$$.on_destroy.push(...s):X(s),t.$$.on_mount=[]}),o.forEach(re)}function ft(t,e){const n=t.$$;n.fragment!==null&&(st(n.after_update),X(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function dt(t,e){t.$$.dirty[0]===-1&&(x.push(t),ot(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ht(t,e,n,r,i,o,s,h=[-1]){const l=F;z(t);const a=t.$$={fragment:null,ctx:[],props:o,update:D,not_equal:i,bound:de(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:de(),dirty:h,skip_bound:!1,root:e.target||l.$$.root};s&&s(a.root);let u=!1;if(a.ctx=n?n(t,e.props||{},(f,d,...b)=>{const j=b.length?b[0]:d;return a.ctx&&i(a.ctx[f],a.ctx[f]=j)&&(!a.skip_bound&&a.bound[f]&&a.bound[f](j),u&&dt(t,f)),d}):[],a.update(),u=!0,X(a.before_update),a.fragment=r?r(a.ctx):!1,e.target){if(e.hydrate){const f=et(e.target);a.fragment&&a.fragment.l(f),f.forEach(Me)}else a.fragment&&a.fragment.c();e.intro&&ut(t.$$.fragment),lt(t,e.target,e.anchor,e.customElement),Te()}z(l)}class pt{$destroy(){ft(this,1),this.$destroy=D}$on(e,n){if(!je(n))return D;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const i=r.indexOf(n);i!==-1&&r.splice(i,1)}}$set(e){this.$$set&&!Ze(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function mt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function pe(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),n.push.apply(n,r)}return n}function me(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?pe(Object(n),!0).forEach(function(r){mt(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):pe(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function gt(t,e){if(t==null)return{};var n={},r=Object.keys(t),i,o;for(o=0;o<r.length;o++)i=r[o],!(e.indexOf(i)>=0)&&(n[i]=t[i]);return n}function bt(t,e){if(t==null)return{};var n=gt(t,e),r,i;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(i=0;i<o.length;i++)r=o[i],!(e.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}function yt(t,e){return vt(t)||_t(t,e)||wt(t,e)||Ot()}function vt(t){if(Array.isArray(t))return t}function _t(t,e){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(t)))){var n=[],r=!0,i=!1,o=void 0;try{for(var s=t[Symbol.iterator](),h;!(r=(h=s.next()).done)&&(n.push(h.value),!(e&&n.length===e));r=!0);}catch(l){i=!0,o=l}finally{try{!r&&s.return!=null&&s.return()}finally{if(i)throw o}}return n}}function wt(t,e){if(t){if(typeof t=="string")return ge(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ge(t,e)}}function ge(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Ot(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Et(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function be(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),n.push.apply(n,r)}return n}function ye(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?be(Object(n),!0).forEach(function(r){Et(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):be(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function jt(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(r){return e.reduceRight(function(i,o){return o(i)},r)}}function C(t){return function e(){for(var n=this,r=arguments.length,i=new Array(r),o=0;o<r;o++)i[o]=arguments[o];return i.length>=t.length?t.apply(this,i):function(){for(var s=arguments.length,h=new Array(s),l=0;l<s;l++)h[l]=arguments[l];return e.apply(n,[].concat(i,h))}}}function V(t){return{}.toString.call(t).includes("Object")}function Mt(t){return!Object.keys(t).length}function N(t){return typeof t=="function"}function At(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Tt(t,e){return V(e)||T("changeType"),Object.keys(e).some(function(n){return!At(t,n)})&&T("changeField"),e}function Lt(t){N(t)||T("selectorType")}function St(t){N(t)||V(t)||T("handlerType"),V(t)&&Object.values(t).some(function(e){return!N(e)})&&T("handlersType")}function Pt(t){t||T("initialIsRequired"),V(t)||T("initialType"),Mt(t)&&T("initialContent")}function xt(t,e){throw new Error(t[e]||t.default)}var It={initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"},T=C(xt)(It),q={changes:Tt,selector:Lt,handler:St,initial:Pt};function Rt(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};q.initial(t),q.handler(e);var n={current:t},r=C(zt)(n,e),i=C(Ct)(n),o=C(q.changes)(t),s=C(kt)(n);function h(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(u){return u};return q.selector(a),a(n.current)}function l(a){jt(r,i,o,s)(a)}return[h,l]}function kt(t,e){return N(e)?e(t.current):e}function Ct(t,e){return t.current=ye(ye({},t.current),e),e}function zt(t,e,n){return N(e)?e(t.current):Object.keys(n).forEach(function(r){var i;return(i=e[r])===null||i===void 0?void 0:i.call(e,t.current[r])}),n}var Dt={create:Rt},Ft={paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs"}};function Nt(t){return function e(){for(var n=this,r=arguments.length,i=new Array(r),o=0;o<r;o++)i[o]=arguments[o];return i.length>=t.length?t.apply(this,i):function(){for(var s=arguments.length,h=new Array(s),l=0;l<s;l++)h[l]=arguments[l];return e.apply(n,[].concat(i,h))}}}function Bt(t){return{}.toString.call(t).includes("Object")}function Ht(t){return t||ve("configIsRequired"),Bt(t)||ve("configType"),t.urls?(Ut(),{paths:{vs:t.urls.monacoBase}}):t}function Ut(){console.warn(Le.deprecation)}function Wt(t,e){throw new Error(t[e]||t.default)}var Le={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},ve=Nt(Wt)(Le),qt={config:Ht},Gt=function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return function(i){return n.reduceRight(function(o,s){return s(o)},i)}};function Se(t,e){return Object.keys(e).forEach(function(n){e[n]instanceof Object&&t[n]&&Object.assign(e[n],Se(t[n],e[n]))}),me(me({},t),e)}var Kt={type:"cancelation",msg:"operation is manually canceled"};function Q(t){var e=!1,n=new Promise(function(r,i){t.then(function(o){return e?i(Kt):r(o)}),t.catch(i)});return n.cancel=function(){return e=!0},n}var Vt=Dt.create({config:Ft,isInitialized:!1,resolve:null,reject:null,monaco:null}),Pe=yt(Vt,2),H=Pe[0],Y=Pe[1];function Xt(t){var e=qt.config(t),n=e.monaco,r=bt(e,["monaco"]);Y(function(i){return{config:Se(i.config,r),monaco:n}})}function Yt(){var t=H(function(e){var n=e.monaco,r=e.isInitialized,i=e.resolve;return{monaco:n,isInitialized:r,resolve:i}});if(!t.isInitialized){if(Y({isInitialized:!0}),t.monaco)return t.resolve(t.monaco),Q($);if(window.monaco&&window.monaco.editor)return xe(window.monaco),t.resolve(window.monaco),Q($);Gt(Zt,Qt)($t)}return Q($)}function Zt(t){return document.body.appendChild(t)}function Jt(t){var e=document.createElement("script");return t&&(e.src=t),e}function Qt(t){var e=H(function(r){var i=r.config,o=r.reject;return{config:i,reject:o}}),n=Jt("".concat(e.config.paths.vs,"/loader.js"));return n.onload=function(){return t()},n.onerror=e.reject,n}function $t(){var t=H(function(n){var r=n.config,i=n.resolve,o=n.reject;return{config:r,resolve:i,reject:o}}),e=window.require;e.config(t.config),e(["vs/editor/editor.main"],function(n){xe(n),t.resolve(n)},function(n){t.reject(n)})}function xe(t){H().monaco||Y({monaco:t})}function en(){return H(function(t){var e=t.monaco;return e})}var $=new Promise(function(t,e){return Y({resolve:t,reject:e})}),_e={config:Xt,init:Yt,__getMonacoInstance:en},k=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function tn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var nn=function(e){return rn(e)&&!on(e)};function rn(t){return!!t&&typeof t=="object"}function on(t){var e=Object.prototype.toString.call(t);return e==="[object RegExp]"||e==="[object Date]"||cn(t)}var an=typeof Symbol=="function"&&Symbol.for,sn=an?Symbol.for("react.element"):60103;function cn(t){return t.$$typeof===sn}function un(t){return Array.isArray(t)?[]:{}}function B(t,e){return e.clone!==!1&&e.isMergeableObject(t)?R(un(t),t,e):t}function ln(t,e,n){return t.concat(e).map(function(r){return B(r,n)})}function fn(t,e){if(!e.customMerge)return R;var n=e.customMerge(t);return typeof n=="function"?n:R}function dn(t){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter(function(e){return Object.propertyIsEnumerable.call(t,e)}):[]}function we(t){return Object.keys(t).concat(dn(t))}function Ie(t,e){try{return e in t}catch{return!1}}function hn(t,e){return Ie(t,e)&&!(Object.hasOwnProperty.call(t,e)&&Object.propertyIsEnumerable.call(t,e))}function pn(t,e,n){var r={};return n.isMergeableObject(t)&&we(t).forEach(function(i){r[i]=B(t[i],n)}),we(e).forEach(function(i){hn(t,i)||(Ie(t,i)&&n.isMergeableObject(e[i])?r[i]=fn(i,n)(t[i],e[i],n):r[i]=B(e[i],n))}),r}function R(t,e,n){n=n||{},n.arrayMerge=n.arrayMerge||ln,n.isMergeableObject=n.isMergeableObject||nn,n.cloneUnlessOtherwiseSpecified=B;var r=Array.isArray(e),i=Array.isArray(t),o=r===i;return o?r?n.arrayMerge(t,e,n):pn(t,e,n):B(e,n)}R.all=function(e,n){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce(function(r,i){return R(r,i,n)},{})};var mn=R,gn=mn;const bn=tn(gn);function yn(...t){return bn.all(t)}var Re={exports:{}};(function(t,e){(function(n,r){r()})(k,function(){function n(a,u){return typeof u>"u"?u={autoBom:!1}:typeof u!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),u={autoBom:!u}),u.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function r(a,u,f){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){l(d.response,u,f)},d.onerror=function(){console.error("could not download file")},d.send()}function i(a){var u=new XMLHttpRequest;u.open("HEAD",a,!1);try{u.send()}catch{}return 200<=u.status&&299>=u.status}function o(a){try{a.dispatchEvent(new MouseEvent("click"))}catch{var u=document.createEvent("MouseEvents");u.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(u)}}var s=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof k=="object"&&k.global===k?k:void 0,h=s.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),l=s.saveAs||(typeof window!="object"||window!==s?function(){}:"download"in HTMLAnchorElement.prototype&&!h?function(a,u,f){var d=s.URL||s.webkitURL,b=document.createElement("a");u=u||a.name||"download",b.download=u,b.rel="noopener",typeof a=="string"?(b.href=a,b.origin===location.origin?o(b):i(b.href)?r(a,u,f):o(b,b.target="_blank")):(b.href=d.createObjectURL(a),setTimeout(function(){d.revokeObjectURL(b.href)},4e4),setTimeout(function(){o(b)},0))}:"msSaveOrOpenBlob"in navigator?function(a,u,f){if(u=u||a.name||"download",typeof a!="string")navigator.msSaveOrOpenBlob(n(a,f),u);else if(i(a))r(a,u,f);else{var d=document.createElement("a");d.href=a,d.target="_blank",setTimeout(function(){o(d)})}}:function(a,u,f,d){if(d=d||open("","_blank"),d&&(d.document.title=d.document.body.innerText="downloading..."),typeof a=="string")return r(a,u,f);var b=a.type==="application/octet-stream",j=/constructor/i.test(s.HTMLElement)||s.safari,S=/CriOS\/[\d]+/.test(navigator.userAgent);if((S||b&&j||h)&&typeof FileReader<"u"){var w=new FileReader;w.onloadend=function(){var g=w.result;g=S?g:g.replace(/^data:[^;]*;/,"data:attachment/file;"),d?d.location.href=g:location=g,d=null},w.readAsDataURL(a)}else{var p=s.URL||s.webkitURL,m=p.createObjectURL(a);d?d.location=m:location.href=m,d=null,setTimeout(function(){p.revokeObjectURL(m)},4e4)}});s.saveAs=l.saveAs=l,t.exports=l})})(Re);var G=Re.exports;function vn(t){if(t.filename){const e=new File([t.data],t.filename,{type:t.filetype,lastModified:t.lastModified});return G.saveAs(e,e.name),e}else switch(!0){case t.data instanceof File:{const e=t.data;return G.saveAs(e,e.name),e}case t.data instanceof Blob:{const e=t.data;return G.saveAs(e),e}default:{const e=new Blob([t.data],{type:t.filetype});return G.saveAs(e),e}}}function _n(t,e=[]){switch(t=t.replaceAll("_","-").toLowerCase(),!0){case t in e:break;case t.startsWith("zh-chs"):case t.startsWith("zh-cns"):t="zh-Hans";break;case t.startsWith("zh-cht"):case t.startsWith("zh-cnt"):t="zh-Hant";break;case t.startsWith("zh-hans"):case t.startsWith("zh-cn"):case t.startsWith("zh-sg"):t="zh-Hans";break;case t.startsWith("zh-hant"):case t.startsWith("zh-tw"):case t.startsWith("zh-hk"):case t.startsWith("zh-mo"):t="zh-Hant";break;case t.startsWith("zh"):t="zh-Hans";break;case t.startsWith("en"):t="en";break;case t.startsWith("es"):t="es";break;case t.startsWith("fr"):t="fr";break}return t}function wn(t){switch(_n(t)){case"zh-Hans":return"zh-cn";case"zh-Hant":return"zh-tw";case"de":return"de";case"es":return"es";case"fr":return"fr";case"it":return"it";case"ja":return"ja";case"ko":return"ko";case"ru":return"ru";case"en":default:return"en"}}const _={embed:!1,path:"",diff:!1,locale:"zh-Hans",savable:!1,changable:!1,original:{value:""},modified:{value:""},options:{},originalOptions:{},modifiedOptions:{},diffOptions:{}},A=class A{constructor(e,n,r){y(this,"_langs");y(this,"_set_id",new Set);y(this,"_map_alias_id",new Map);y(this,"_map_extension_id",new Map);y(this,"_map_mimetype_id",new Map);y(this,"_map_id_extension",new Map);y(this,"_map_id_mimetype",new Map);y(this,"siyuanHoverProvider",{provideHover:(e,n,r)=>{const i=e.getLineContent(n.lineNumber),s=A.getSiyuanTokens(i).find(l=>l.start<=n.column&&n.column<=l.end),h={contents:[]};return s?new Promise((l,a)=>{const u=setTimeout(()=>{this._dispatch("hover",{id:s.id}),l(h)},1e3);r.onCancellationRequested(f=>{clearTimeout(u),l(h)})}):h}});y(this,"siyuanLinkProvider",{provideLinks:(e,n)=>{const r=[],i=e.getLinesContent(),o=i.length;for(let s=0;s<o;++s){const h=A.getSiyuanTokens(i[s]);for(const l of h){const a={range:{startLineNumber:s+1,startColumn:l.start,endLineNumber:s+1,endColumn:l.end},id:l.id,type:l.type,token:l.token};switch(l.type){case 0:{a.tooltip=this.pluign.i18n.editor.tooltip.siyuanBlockHyperlink.label;break}case 1:{a.tooltip=this.pluign.i18n.editor.tooltip.siyuanBlockReference.label;break}case 2:{a.tooltip=this.pluign.i18n.editor.tooltip.siyuanBlockID.label;break}}a.tooltip=`${a.tooltip} → [${a.id}]`,r.push(a)}}return{links:r}},resolveLink:(e,n)=>{switch(e.type){case 0:{e.url=e.token;break}default:{e.url=`siyuan://blocks/${e.id}`;break}}const r=new URL(e.url);return this._dispatch("open",{id:e.id,focus:parseInt(r.searchParams.get("focus"))}),e.url=this._monaco.Uri.parse(e.url),e}});this.pluign=e,this._monaco=n,this._dispatch=r,this._langs=this._monaco.languages.getLanguages(),this._langs.forEach(i=>{const o=this.wash(i.id);this._set_id.add(o),this._monaco.languages.registerLinkProvider(o,this.siyuanLinkProvider),this._monaco.languages.registerHoverProvider(o,this.siyuanHoverProvider),i.aliases&&i.aliases.forEach(s=>{this._map_alias_id.set(this.wash(s),o)}),i.extensions&&(i.extensions.forEach(s=>{this._map_extension_id.set(this.wash(s),o)}),i.extensions.length>0&&this._map_id_extension.set(o,this.wash(i.extensions.at(0)))),i.mimetypes&&(i.mimetypes.forEach(s=>{this._map_mimetype_id.set(this.wash(s),o)}),i.mimetypes.length>0&&this._map_id_mimetype.set(o,this.wash(i.mimetypes.at(0))))}),this._map_extension_id.set(".sy","json"),this._map_extension_id.set(".ipynb","json"),this._map_extension_id.set(".drawio","xml")}static getSiyuanTokens(e){const n=[],r=e.matchAll(A.REGEXP.siyuan);for(const i of r){const o=i.at(0),s=i.index+1,h=s+o.length,{type:l,id:a}=(()=>{switch(!0){case i.at(1)!==void 0:return{type:0,id:o.match(A.REGEXP.id).at(0)};case i.at(2)!==void 0:return{type:1,id:o.match(A.REGEXP.id).at(0)};case i.at(3)!==void 0:return{type:2,id:o}}})();n.push({token:o,type:l,id:a,start:s,end:h})}return n}wash(e){return e.trim().toLowerCase()}getExtension(e){return e=this.wash(e),this._map_id_extension.get(e)??e}getMimeType(e){return e=this.wash(e),this._map_id_mimetype.get(e)??e}map(e){switch(e=this.wash(e),!0){case this._set_id.has(e):return e;case this._map_alias_id.has(e):return this._map_alias_id.get(e);case this._map_extension_id.has(e):return this._map_extension_id.get(e);case this._map_mimetype_id.has(e):return this._map_mimetype_id.get(e);default:return e}}};y(A,"REGEXP",{siyuan:/(siyuan:\/\/\S*\d{14}-[0-9a-z]{7}\S*)|(\(\(\d{14}-[0-9a-z]{7} ['"][^'"]*['"]\)\))|(\d{14}-[0-9a-z]{7})/g,id:/\d{14}-[0-9a-z]{7}/g});let ie=A;function On(t){let e;return{c(){e=Qe("div"),$e(e,"class","svelte-1nw0bsj"),W(e,"fn__flex-1",t[0]),W(e,"editor",!t[0])},m(n,r){Je(n,e,r),t[18](e)},p(n,r){r[0]&1&&W(e,"fn__flex-1",n[0]),r[0]&1&&W(e,"editor",!n[0])},i:D,o:D,d(n){n&&Me(e),t[18](null)}}}function En(t,e,n){let{plugin:r}=e,{embed:i=_.embed}=e,{path:o=_.path}=e,{diff:s=_.diff}=e,{locale:h=_.locale}=e,{savable:l=_.savable}=e,{changable:a=_.changable}=e,{original:u=_.original}=e,{modified:f=_.modified}=e,{options:d=_.options}=e,{originalOptions:b=_.originalOptions}=e,{modifiedOptions:j=_.modifiedOptions}=e,{diffOptions:S=_.diffOptions}=e,w;var p,m,g,M,v=!1;const U=r.i18n,Z=rt(),ae=(()=>{var c;return O=>{O?c||(c=m==null?void 0:m.addAction({id:"18730D32-5451-4102-B299-BE281BA929B9",label:U.editor.action.save.label,keybindings:[p.KeyMod.CtrlCmd|p.KeyCode.KeyS],contextMenuGroupId:"3_file",contextMenuOrder:1,run:()=>{Z("save",{value:m.getValue()})}})):c&&(c.dispose(),c=void 0)}})();function se(c){v&&c&&(ce(c),ue(c))}function ce(c){v&&c&&s&&(g==null||g.getOriginalEditor().updateOptions(c))}function ue(c){v&&c&&(s?g==null||g.getModifiedEditor().updateOptions(c):m==null||m.updateOptions(c))}function ke(c){v&&s&&(g==null||g.updateOptions(c))}function Ce(c){v&&(le(c),fe(c))}function le(c){v&&g&&(p==null||p.editor.setModelLanguage(g.getOriginalEditor().getModel(),c))}function fe(c){v&&(s?g&&(p==null||p.editor.setModelLanguage(g.getModifiedEditor().getModel(),c)):m&&(p==null||p.editor.setModelLanguage(m.getModel(),c)))}const ze=(()=>{switch(!0){case!1:return"node_modules/monaco-editor/min/vs";case!0:default:if(i)switch(!0){case K:return globalThis.require("path").resolve(globalThis.siyuan.config.system.workspaceDir,`./data/plugins/${r.name}/libs/monaco-editor/min/vs`);default:return new URL(`${globalThis.document.baseURI}plugins/${r.name}/libs/monaco-editor/min/vs`).pathname}else switch(!0){case K:return globalThis.require("path").resolve(o,`./data/plugins/${r.name}/libs/monaco-editor/min/vs`);case oe:default:return"./../libs/monaco-editor/min/vs"}}})();_e.config({paths:{vs:ze},"vs/nls":{availableLanguages:{"*":wn(h)}}});const De=_e.init();nt(()=>{De.then(c=>{p=c,n(16,M=new ie(r,p,Z)),s?(n(15,g=p.editor.createDiffEditor(w,d)),g.setModel({original:p.editor.createModel(u.value,M.map((u==null?void 0:u.language)??"")),modified:p.editor.createModel(f.value,M.map((f==null?void 0:f.language)??""))}),n(14,m=g.getModifiedEditor())):f?n(14,m=p.editor.create(w,yn(d,f,{language:M.map(f.language)}))):n(14,m=p.editor.create(w,d)),m.onDidChangeModelContent(O=>{a&&Z("changed",{value:m.getValue(),event:O})}),m.addAction({id:"F9E62A24-619E-49EA-A870-B31E6F9D284F",label:U.editor.action.toggleWordWrap.label,keybindings:[p.KeyMod.Alt|p.KeyCode.KeyZ],contextMenuGroupId:"2_view",contextMenuOrder:1,run:()=>{const O=m.getOption(128)==="off"?"on":"off";se({wordWrap:O})}}),ae(l),m.addAction({id:"D68588DD-8D0C-4435-8DC2-145B0F464FF8",label:U.editor.action.saveAs.label,keybindings:[p.KeyMod.CtrlCmd|p.KeyMod.Shift|p.KeyCode.KeyS],contextMenuGroupId:"3_file",contextMenuOrder:2,run:()=>{vn({data:m.getValue(),filetype:M.getMimeType(m.getModel().getLanguageId())})}}),p.languages.getLanguages().forEach(O=>{m.addAction({id:`set-model-language-${O.id}`,label:`${U.editor.action.setModelLanguage.label}: ${O.id}`,run:()=>{Ce(O.id)}})}),n(17,v=!0)}).catch(c=>{n(17,v=!1),r.logger.error(c)})});function Fe(c){te[c?"unshift":"push"](()=>{w=c,n(1,w)})}return t.$$set=c=>{"plugin"in c&&n(3,r=c.plugin),"embed"in c&&n(0,i=c.embed),"path"in c&&n(4,o=c.path),"diff"in c&&n(5,s=c.diff),"locale"in c&&n(6,h=c.locale),"savable"in c&&n(7,l=c.savable),"changable"in c&&n(2,a=c.changable),"original"in c&&n(8,u=c.original),"modified"in c&&n(9,f=c.modified),"options"in c&&n(10,d=c.options),"originalOptions"in c&&n(11,b=c.originalOptions),"modifiedOptions"in c&&n(12,j=c.modifiedOptions),"diffOptions"in c&&n(13,S=c.diffOptions)},t.$$.update=()=>{if(t.$$.dirty[0]&197376&&v&&(u&&le(M.map((u==null?void 0:u.language)??"")),f&&fe(M.map((f==null?void 0:f.language)??""))),t.$$.dirty[0]&181028){const c=a;v&&(n(2,a=!1),s?(u&&g.getOriginalEditor().setValue(u.value),f&&g.getModifiedEditor().setValue(f.value)):f&&m.setValue(f.value),n(2,a=c))}t.$$.dirty[0]&16512&&m&&ae(l),t.$$.dirty[0]&1024&&se(d),t.$$.dirty[0]&2048&&ce(b),t.$$.dirty[0]&4096&&ue(j),t.$$.dirty[0]&8192&&ke(S)},[i,w,a,r,o,s,h,l,u,f,d,b,j,S,m,g,M,v,Fe]}class jn extends pt{constructor(e){super(),ht(this,e,En,On,Ye,{plugin:3,embed:0,path:4,diff:5,locale:6,savable:7,changable:2,original:8,modified:9,options:10,originalOptions:11,modifiedOptions:12,diffOptions:13},null,[-1,-1])}}const ee={INIT_CHANNEL_NAME:"monaco-editor-init",MESSAGE_EVENT_NAME:"message",ID_PREFIX_MATERIAL:"#icon-monaco-editor-material",ID_PREFIX_MATERIAL_LIGHT:"#icon-monaco-editor-material-light"};class Mn{constructor(e=()=>{}){y(this,"port");y(this,"_listeners",new Map);y(this,"initEventListener",(e,n)=>{e instanceof MessageEvent&&(n=e.data),globalThis.document.documentElement.style.setProperty("--vscode-editor-background",n?"#1f1f1f":"#ffffff"),this.port=e.ports[0],this.port.start(),this.oninited()});switch(this.oninited=e,!0){case K:{const{ipcRenderer:n}=globalThis.require("electron");n.once(ee.INIT_CHANNEL_NAME,this.initEventListener);break}case oe:case Oe:default:globalThis.addEventListener("message",this.initEventListener,{once:!0});break}}ready(e={status:!0}){const n={channel:"editor-ready",data:e};this.port.postMessage(n)}changed(e){const n={channel:"editor-changed",data:e};this.port.postMessage(n)}save(e){const n={channel:"editor-save",data:e};this.port.postMessage(n)}hover(e){const n={channel:"editor-hover-siyuan",data:e};this.port.postMessage(n)}open(e){const n={channel:"editor-open-siyuan",data:e};this.port.postMessage(n)}addEventListener(e,n,r){if(this._listeners.has(n))return!1;{const i=o=>{var s;((s=o==null?void 0:o.data)==null?void 0:s.channel)===e&&(r!=null&&r.once&&this.removeEventListener(e,n),n(o))};return this._listeners.set(n,i),this.port.addEventListener(ee.MESSAGE_EVENT_NAME,i),!0}}removeEventListener(e,n){return this._listeners.has(n)?(this.port.removeEventListener(ee.MESSAGE_EVENT_NAME,this._listeners.get(n)),this._listeners.delete(n),!0):!1}}var E;const L=new Mn(()=>{L.addEventListener("editor-init",t=>{const{data:e}=t.data,n=new Xe(`${e.name}-${(()=>{switch(!0){case K:return"window";case oe:return"iframe";case Oe:return"popup";default:return"unknow"}})()}`);E&&E.$destroy(),E=new jn({target:globalThis.document.body,props:{plugin:{name:e.name,i18n:e.i18n,logger:n},path:e.path,diff:e.diff,locale:e.locale,savable:e.savable,changable:e.changable,original:e.original,modified:e.modified,options:e.options}}),E.$on("changed",r=>L.changed(r.detail)),E.$on("save",r=>L.save(r.detail)),E.$on("hover",r=>L.hover(r.detail)),E.$on("open",r=>L.open(r.detail))}),L.addEventListener("editor-set",t=>{const{data:e}=t.data;E&&E.$set(e)}),L.ready()});
