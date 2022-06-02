var whiteList = [];
document.getElementById('adblockbutton').onclick = inputChange;

document.getElementsByClassName('buttonlog')[0].onclick = function(e) {
  var x = document.getElementsByClassName("log")[0];
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};

var isActive = true;
var channel = "";
function inputChange(e) {
    if(isActive){
        document.getElementById("adblocktext").classList.add("disable");
        document.getElementById("watching").textContent = "Disabled on : " + channel;
        
        if(!whiteList.includes(channel)){
            whiteList.push(channel);
        }
        
        browser.storage.local.set({["whiteList"]: whiteList});
        isActive = false;

    }else{
        document.getElementById("adblocktext").classList.remove("disable");
        document.getElementById("watching").textContent = "Enabled on : " + channel;
        for( var i = 0; i < whiteList.length; i++){
            if ( whiteList[i] === channel) { 
                whiteList.splice(i, 1); 
                i--; 
            }
        }

        browser.storage.local.set({["whiteList"]: whiteList});
        isActive = true;
    }
}

browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function 
(tabs) {
    var url = tabs[0].url;
    if(url.includes("https://www.twitch.tv/")){
        channel = url.replace("https://www.twitch.tv/","").split('/')[0].split('?')[0];
        
        browser.storage.local.get(/* String or Array */["whiteList"], function(items){
            if(items.whiteList !== undefined){
              whiteList = items.whiteList;
              
              console.log(channel);
              console.log(whiteList);
        
              if(whiteList.includes(channel)){
                  isActive = false;
                }
              if(isActive){
                  document.getElementById("adblocktext").classList.remove("disable");
                  document.getElementById("watching").textContent = "Enabled on : " + channel;
                  return;
              }else{
                  document.getElementById("adblocktext").classList.add("disable");
                  document.getElementById("watching").textContent = "Disabled on : " + channel;
                  return;
              }
            }
        });

        document.getElementById("watching").textContent = "Enabled on : " + channel;
    }else{
        document.getElementById('adblockbutton').onclick = null;
        document.getElementById("adblocktext").classList.add("disable");
        document.getElementById("watching").textContent = "Awaiting channel";
    }
});


browser.runtime.sendMessage(
    "log",
    function (response) {
        text = (""+ response);
        document.getElementsByClassName("textarea")[0].value = response.join("\n");
    }
  );