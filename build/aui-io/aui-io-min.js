AUI.add("aui-io-request",function(O){var G=O.Lang,d=G.isBoolean,Q=G.isFunction,H=G.isString,f=YUI.AUI.namespace("defaults.io"),h=function(A){return function(){return f[A];};},W="active",C="arguments",X="autoLoad",T="cache",g="cfg",S="complete",m="content-type",Y="context",N="data",F="dataType",J="",l="end",b="failure",B="form",U="get",K="headers",k="IORequest",E="json",Z="method",V="responseData",a="start",M="success",c="sync",R="timeout",P="transaction",e="uri",j="xdr",n="xml",i="Parser error: IO dataType is not correctly parsing",D={all:"*/*",html:"text/html",json:"application/json, text/javascript",text:"text/plain",xml:"application/xml, text/xml"};var I=O.Component.create({NAME:k,ATTRS:{autoLoad:{value:true,validator:d},cache:{value:true,validator:d},dataType:{setter:function(A){return(A||J).toLowerCase();},value:null,validator:H},responseData:{setter:function(A){return this._setResponseData(A);},value:null},uri:{setter:function(A){return this._parseURL(A);},value:null,validator:H},active:{value:false,validator:d},cfg:{getter:function(){var A=this;return{arguments:A.get(C),context:A.get(Y),data:A.get(N),form:A.get(B),headers:A.get(K),method:A.get(Z),on:{complete:O.bind(A.fire,A,S),end:O.bind(A._end,A),failure:O.bind(A.fire,A,b),start:O.bind(A.fire,A,a),success:O.bind(A._success,A)},sync:A.get(c),timeout:A.get(R),xdr:A.get(j)};},readOnly:true},transaction:{value:null},arguments:{valueFn:h(C)},context:{valueFn:h(Y)},data:{valueFn:h(N),setter:"_setIOData"},form:{valueFn:h(B)},headers:{getter:function(o){var p=[];var A=this;var L=A.get(F);if(L){p.push(D[L]);}p.push(D.all);return O.merge(o,{Accept:p.join(", ")});},valueFn:h(K)},method:{valueFn:h(Z)},sync:{valueFn:h(c)},timeout:{valueFn:h(R)},xdr:{valueFn:h(j)}},EXTENDS:O.Plugin.Base,prototype:{init:function(L){var A=this;I.superclass.init.apply(this,arguments);A._autoStart();},destructor:function(){var A=this;A.stop();A.set(P,null);},start:function(){var A=this;A.destructor();A.set(W,true);var L=O.io(A.get(e),A.get(g));A.set(P,L);},stop:function(){var A=this;var L=A.get(P);if(L){L.abort();}},_autoStart:function(){var A=this;if(A.get(X)){A.start();}},_parseURL:function(p){var A=this;var L=A.get(T);var s=A.get(Z);if((L===false)&&(s==U)){var r=+new Date;var o=p.replace(/(\?|&)_=.*?(&|$)/,"$1_="+r+"$2");p=o+((o==p)?(p.match(/\?/)?"&":"?")+"_="+r:"");}var q=f.uriFormatter;if(Q(q)){p=q.apply(A,[p]);}return p;},_end:function(L){var A=this;A.set(W,false);A.set(P,null);A.fire(l,L);},_success:function(o,L){var A=this;A.set(V,L);A.fire(M,o,L);},_setIOData:function(o){var A=this;var L=f.dataFormatter;if(Q(L)){o=L.call(A,o);}return o;},_setResponseData:function(q){var o=null;var A=this;if(q){var L=A.get(F);var r=q.getResponseHeader(m);if((L==n)||(!L&&r.indexOf(n)>=0)){o=q.responseXML;if(o.documentElement.tagName=="parsererror"){throw i;}}else{o=q.responseText;}if(o===J){o=null;}if(L==E){try{o=O.JSON.parse(o);}catch(p){}}}return o;}}});O.IORequest=I;O.io.request=function(L,A){return new O.IORequest(O.merge(A,{uri:L}));};},"@VERSION@",{requires:["aui-base","io-base","json","plugin","querystring-stringify"]});AUI.add("aui-io-plugin",function(T){var P=T.Lang,Q=P.isBoolean,R=P.isString,U=function(A){return(A instanceof T.Node);},V=T.WidgetStdMod,D="Node",N="Widget",e="",E="failure",H="failureMessage",X="host",I="icon",J="io",F="IOPlugin",W="loading",G="loadingMask",d="node",a="parseContent",M="queue",C="rendered",O="section",c="showLoading",Z="success",S="type",B="where",Y=T.ClassNameManager.getClassName,K=Y(I,W);var b=T.Component.create({NAME:F,NS:J,ATTRS:{node:{value:null,getter:function(g){var A=this;if(!g){var f=A.get(X);var L=A.get(S);if(L==D){g=f;}else{if(L==N){var h=A.get(O);if(!f.getStdModNode(h)){f.setStdModContent(h,e);}g=f.getStdModNode(h);}}}return T.one(g);},validator:U},failureMessage:{value:"Failed to retrieve content",validator:R},loadingMask:{value:{}},parseContent:{value:true,validator:Q},showLoading:{value:true,validator:Q},section:{value:V.BODY,validator:function(A){return(!A||A==V.BODY||A==V.HEADER||A==V.FOOTER);}},type:{readOnly:true,valueFn:function(){var A=this;var L=D;if(A.get(X) instanceof T.Widget){L=N;}return L;},validator:R},where:{value:V.REPLACE,validator:function(A){return(!A||A==V.AFTER||A==V.BEFORE||A==V.REPLACE);}}},EXTENDS:T.IORequest,prototype:{bindUI:function(){var A=this;A.on("activeChange",A._onActiveChange);A.on(Z,A._successHandler);A.on(E,A._failureHandler);if((A.get(S)==N)&&A.get(c)){var L=A.get(X);L.after("heightChange",A._syncLoadingMaskUI,A);L.after("widthChange",A._syncLoadingMaskUI,A);}},_autoStart:function(){var A=this;A.bindUI();b.superclass._autoStart.apply(this,arguments);},_bindParseContent:function(){var A=this;var L=A.get(d);if(L&&!L.ParseContent&&A.get(a)){L.plug(T.Plugin.ParseContent);}},hideLoading:function(){var A=this;var L=A.get(d);if(L.loadingmask){L.loadingmask.hide();}},setContent:function(L){var A=this;A._bindParseContent();if(A.overlayMaskBoundingBox){A.overlayMaskBoundingBox.remove();}A._getContentSetterByType().apply(A,[L]);},showLoading:function(){var A=this;var L=A.get(d);if(L.loadingmask){if(A.overlayMaskBoundingBox){L.append(A.overlayMaskBoundingBox);}}else{L.plug(T.LoadingMask,A.get(G));A.overlayMaskBoundingBox=L.loadingmask.overlayMask.get("boundingBox");}L.loadingmask.show();},start:function(){var A=this;var L=A.get(X);if(!L.get(C)){L.after("render",function(){A._setLoadingUI(true);});}b.superclass.start.apply(A,arguments);},_getContentSetterByType:function(){var A=this;var L={Node:function(h){var f=this;var g=f.get(d);g.setContent.apply(g,[h]);},Widget:function(h){var f=this;var g=f.get(X);g.setStdModContent.apply(g,[f.get(O),h,f.get(B)]);}};return L[this.get(S)];},_setLoadingUI:function(L){var A=this;if(A.get(c)){if(L){A.showLoading();}else{A.hideLoading();}}},_syncLoadingMaskUI:function(){var A=this;A.get(d).loadingmask.refreshMask();},_successHandler:function(L,g,f){var A=this;A.setContent(f.responseText);},_failureHandler:function(L,g,f){var A=this;A.setContent(A.get(H));},_onActiveChange:function(f){var A=this;
var L=A.get(X);var g=A.get(S)==N;if(!g||(g&&L&&L.get(C))){A._setLoadingUI(f.newVal);}}}});T.namespace("Plugin").IO=b;},"@VERSION@",{requires:["aui-overlay-base","aui-parse-content","aui-io-request","aui-loading-mask"]});AUI.add("aui-io",function(B){},"@VERSION@",{skinnable:false,use:["aui-io-request","aui-io-plugin"]});