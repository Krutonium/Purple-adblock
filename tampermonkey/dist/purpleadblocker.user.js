// ==UserScript==
// @name         Purple Adblocker
// @source       https://github.com/arthurbolsoni/Purple-adblock
// @version      2.5.0
// @description  Per aspera ad astra
// @author       ArthurBolzoni
// @downloadURL  https://raw.githubusercontent.com/arthurbolsoni/Purple-adblock/main/tampermonkey/dist/purpleadblocker.user.js
// @updateURL    https://raw.githubusercontent.com/arthurbolsoni/Purple-adblock/main/tampermonkey/dist/purpleadblocker.user.js
// @match        *://*.twitch.tv/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  "use strict";
  !(function () {
    let e;
    window.postMessage({ type: "init" }),
      (window.Worker = class extends Worker {
        constructor(t) {
          console.log("new worker intance " + t), "" == t && super(t), console.log("[Purple]: init " + t);
          const n = `(()=>{"use strict";var e={};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}();class t{constructor(){this._header=["#EXTM3U","#EXT-X-VERSION:3","#EXT-X-TARGETDURATION:6","#EXT-X-MEDIA-SEQUENCE:"],this._playlist=[],this._sequence=0}addPlaylistTest(e){}addPlaylist(e,t=!1){if(null===e)return!1;let n=!1;const i=e.toString().split(/[\\r\\n]/);this._header[4]=i[4],this._header[5]=i[5];for(const e in i)if(i[e].includes("#EXTINF")){if(!t&&!i[e].includes(",live"))continue;const s=Math.floor(new Date(i[parseInt(e)-1].slice(i[parseInt(e)-1].length-24,i[parseInt(e)-1].length)).getTime()/1e3);for(this._playlist.filter((e=>e.timestamp>=s)).length||(this._sequence=this._sequence+1,this._playlist.push({time:i[parseInt(e)-1],timestamp:s,info:i[parseInt(e)],url:i[parseInt(e)+1]}),n=!0);this._playlist.length>15;)this._playlist.shift()}return n}getPlaylist(){let e="";return this._playlist.forEach((t=>e=e+t.time+"\\n"+t.info+"\\n"+t.url+"\\n")),this._header[0]+"\\n"+this._header[1]+"\\n"+this._header[2]+"\\n"+this._header[3]+this._sequence+"\\n"+this._header[4]+"\\n"+this._header[5]+"\\n"+e}}const n={playerType:"thunderdome",name:"lower"},i={playerType:"embed",name:"normal"},s={name:"external"};class a{constructor(e){this.bestQuality=()=>this.urlList[0],this.findByQuality=e=>this.urlList.find((t=>t.quality==e)),Object.assign(this,e)}}var r=function(e,t,n,i){return new(n||(n=Promise))((function(s,a){function r(e){try{o(i.next(e))}catch(e){a(e)}}function l(e){try{o(i.throw(e))}catch(e){a(e)}}function o(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,l)}o((i=i.apply(e,t||[])).next())}))};class l{constructor(e,n=""){this.serverList=[],this.hls=new t,this.channelName="",this.tunnel=["https://eu1.jupter.ga/channel/{channelname}","https://eu2.jupter.ga/channel/{channelname}"],this.currentTunnel=this.tunnel[0],this.getStreamServerByStreamType=e=>this.serverList.filter((t=>t.type==e.name)),this.tryExternalPlayer=()=>r(this,void 0,void 0,(function*(){(yield this.streamAccess(s))||this.externalPlayer(!0)})),this.channelName=e,n&&(this.currentTunnel=n)}addStreamLink(e,t="local",n=!0){return r(this,void 0,void 0,(function*(){const i=[];let s;const r=/NAME="((?:\\S+\\s+\\S+|\\S+))",AUTO(?:^|\\S+\\s+)(?:^|\\S+\\s+)(https:\\/\\/video(\\S+).m3u8)/g;for(;null!==(s=r.exec(e));)i.push({quality:s[1],url:s[2]});const l=new a({type:t,urlList:i,sig:n});return this.serverList.push(l),n||(yield this.signature()),!0}))}signature(){return r(this,void 0,void 0,(function*(){const e=/video-weaver.(.*).hls.ttvnw.net\\/v1\\/playlist\\/(.*).m3u8$/gm;yield new Promise((t=>{this.serverList.filter((e=>0==e.sig)).forEach((n=>r(this,void 0,void 0,(function*(){const i=e.exec(n.urlList[0].url);if(i)try{yield fetch("https://jupter.ga/hls/v2/sig/"+i[2]+"/"+i[1]),n.sig=!0,t(!0)}catch(e){t(!1)}else t(!1)})))),t(!1)}))}))}externalPlayer(t=!1){return r(this,void 0,void 0,(function*(){t&&(this.currentTunnel=this.tunnel[0]);try{e.g.LogPrint("External Server: Loading");const t=yield e.g.realFetch(this.currentTunnel.replace("{channelname}",this.channelName));if(!t.ok)throw new Error("server proxy return error or not found");const n=yield t.text();return e.g.LogPrint("External Server: OK"),this.addStreamLink(n,s.name),!0}catch(t){return e.g.LogPrint("server proxy return error or not found "+this.currentTunnel),e.g.LogPrint(t),!1}}))}streamAccess(t){return r(this,void 0,void 0,(function*(){if(t.name==s.name)return yield this.externalPlayer();try{const n={operationName:"PlaybackAccessToken_Template",query:'query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isVod) {    value    signature    __typename  }}',variables:{isLive:!0,login:this.channelName,isVod:!1,vodID:"",playerType:t.playerType}},i=yield e.g.realFetch("https://gql.twitch.tv/gql",{method:"POST",headers:{"Client-ID":"kimne78kx3ncx6brgo4mv6wki5h1ko"},body:JSON.stringify(n)}),s=yield i.json(),a="https://usher.ttvnw.net/api/channel/hls/"+this.channelName+".m3u8?allow_source=true&fast_bread=true&p="+Math.floor(1e7*Math.random())+"&player_backend=mediaplayer&playlist_include_framerate=true&reassignments_supported=false&sig="+s.data.streamPlaybackAccessToken.signature+"&supported_codecs=avc1&token="+s.data.streamPlaybackAccessToken.value,r=yield(yield e.g.realFetch(a)).text();return e.g.LogPrint("Server loaded "+t.name),this.addStreamLink(r,t.name),!0}catch(e){return console.log(e),!1}}))}}class o{constructor(){this.getQuality=()=>e.g.postMessage({type:"getQuality"}),this.init=()=>e.g.postMessage({type:"init"}),this.pause=()=>e.g.postMessage({type:"pause"}),this.play=()=>e.g.postMessage({type:"play"}),this.pauseAndPlay=()=>{this.pause(),this.play()},this.isLoaded=!1,this.quality="",e.g.onEventMessage=e=>{switch(e.data.funcName){case"Buffering":case"onClientSinkPlaying":case"onClientSinkUpdate":case"pause":case"play":case"Ready":case"Playing":default:break;case"setQuality":e.data.args&&(this.quality=e.data.args[0].name),e.data.value&&(this.quality=e.data.value);break;case"setSetting":this.setting=e.data.value}}}}var h=function(e,t,n,i){return new(n||(n=Promise))((function(s,a){function r(e){try{o(i.next(e))}catch(e){a(e)}}function l(e){try{o(i.throw(e))}catch(e){a(e)}}function o(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,l)}o((i=i.apply(e,t||[])).next())}))};class c{constructor(){this.streamList=[],this.actualChannel="",this.playingAds=!1,this.quality="",this.LogPrint=e.g.LogPrint,this.message=new o,this.onStartAds=()=>{},this.onEndAds=()=>{},this.isAds=(e,t=!1)=>{const n=e.toString().includes("stitched");return t?(this.playingAds!=n&&n&&this.onStartAds(),this.playingAds==n||n||this.onEndAds(),this.playingAds=n,this.playingAds):n},this.currentStream=(e=this.actualChannel)=>this.streamList.find((t=>t.channelName===e)),this.message.init()}onfetch(e,t){return h(this,void 0,void 0,(function*(){const e=yield this.currentStream();if(e.hls.addPlaylist(t),!this.isAds(t,!0))return!0;try{const t=yield this.fetchm3u8ByStreamType(i);if(t&&e.hls.addPlaylist(t),t||e.streamAccess(i),t)return!0;const a=yield this.fetchm3u8ByStreamType(n);if(a&&e.hls.addPlaylist(a),a)return!0;const r=yield this.fetchm3u8ByStreamType(s);return r&&e.hls.addPlaylist(r),r||(console.log("fail"),e.hls.addPlaylist(t,!0)),!0}catch(e){console.log(e.message)}}))}fetchm3u8ByStreamType(t){return h(this,void 0,void 0,(function*(){this.LogPrint("Stream Type: "+t.name);const n=this.currentStream().getStreamServerByStreamType(t);if(!n)return"";var i=n.map((e=>e.findByQuality(this.message.quality))).filter((e=>void 0!==e));i.length||(i=n.map((e=>e.bestQuality())));for(const t of i){const n=yield(yield e.g.realFetch(null==t?void 0:t.url)).text();if(!this.isAds(n))return n}return""}))}onStartChannel(e,t){return h(this,void 0,void 0,(function*(){const n=/hls\\/(.*).m3u8/gm.exec(e)||[];let s,a=!1,r=[];if(!n[1])return!1;if(this.actualChannel=n[1],this.LogPrint("Channel "+n[1]),null==!this.message.setting&&null==!this.message.setting.whitelist&&(r=this.message.setting.whitelist),r.includes(n[1]))return!1;if(this.streamList.find((e=>e.channelName===n[1])))this.LogPrint("Exist: "+n[1]),a=!0;else{let e="";this.message.setting&&(e=this.message.setting.proxyUrl?this.message.setting.proxyUrl:""),this.streamList.push(new l(n[1],e))}s=this.currentStream(),this.LogPrint("Local Server: Loading"),yield s.addStreamLink(t,"local",!0),this.LogPrint("Local Server: OK"),s.streamAccess(i),a||this.message.setting&&0==this.message.setting.toggleProxy||s.tryExternalPlayer()}))}inflateFetch(){e.g.fetch=function(t,n){return h(this,arguments,void 0,(function*(){if("string"==typeof t){if(t.endsWith("m3u8")&&t.includes("ttvnw.net"))return new Promise(((i,s)=>h(this,void 0,void 0,(function*(){try{yield e.g.realFetch(t,n).then((e=>h(this,void 0,void 0,(function*(){return e.text()})))).then((n=>h(this,void 0,void 0,(function*(){yield e.g.player.onfetch(t,n);var s=e.g.player.currentStream().hls.getPlaylist();console.log(s),i(new Response(s))}))))}catch(e){i(new Response)}}))));if(t.includes("usher.ttvnw.net/api/channel/hls/")&&!t.includes("picture-by-picture"))return new Promise(((i,s)=>h(this,void 0,void 0,(function*(){try{const s=yield e.g.realFetch(t,n);s.ok||i(s),s.text().then((n=>h(this,void 0,void 0,(function*(){yield e.g.player.onStartChannel(t,n),i(new Response(n))}))))}catch(e){i(new Response)}}))));if(t.includes("picture-by-picture"))return this.LogPrint("picture-by-picture"),new Response}return e.g.realFetch.apply(this,arguments)}))}}}!function(){e.g.LogPrint=e=>console.log("[Purple]: ",e),e.g.addEventListener("message",(t=>{e.g.onEventMessage(t)}));const t=new c;e.g.realFetch=e.g.fetch,e.g.player=t,t.inflateFetch(),e.g.LogPrint("Script running")}()})();\n      importScripts('${t}');`;
          super(URL.createObjectURL(new Blob([n], { type: "text/javascript" }))),
            (e = this),
            e.declareEventWorker(),
            e.declareEventWindow();
        }
        declareEventWorker() {
          this.addEventListener("message", (t) => {
            switch (t.data.type) {
              case "init":
                window.postMessage({ type: "getSetting", value: null });
                break;
              case "PlayerQualityChanged":
                e.postMessage({ funcName: "setQuality", value: t.data.arg.name });
                break;
              case "pause":
                e.postMessage({ funcName: "pause", args: void 0, id: 1 });
                break;
              case "play":
                e.postMessage({ funcName: "play", args: void 0, id: 1 });
            }
            if (t.data.arg) {
              switch (t.data.arg.key) {
                case "quality":
                  if (!t.data.arg.value.name) break;
                  console.log("Changed quality by player: " + t.data.arg.value.name),
                    e.postMessage({ funcName: "setQuality", value: t.data.arg.value.name });
                  break;
                case "state":
                  e.postMessage({ funcName: t.data.arg.value });
              }
              t.data.arg.name;
            }
          });
        }
        declareEventWindow() {
          window.addEventListener("message", (t) => {
            "setSetting" === t.data.type && e.postMessage({ funcName: "setSetting", value: t.data.value });
          });
        }
      });
  })();
})();
