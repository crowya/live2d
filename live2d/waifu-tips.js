function ap_init() {
    $(".aplayer-body").addClass("my-hide");
    ap.lrc.hide();  //初始化时隐藏歌词
    ap.on('play', () => ap.lrc.show());
    ap.on('pause', () => ap.lrc.hide());
}

var music_flag=false;
function aplayer_panel_toggle(){
	if(music_flag){
		$(".aplayer.aplayer-fixed .aplayer-body").addClass("my-hide");
		$(".aplayer.aplayer-fixed .aplayer-list").addClass("my-hide zero-margin-bottom");
		music_flag=false;
	}
	else{
		$(".aplayer.aplayer-fixed .aplayer-body").removeClass("my-hide");
		$(".aplayer.aplayer-fixed .aplayer-list").removeClass("my-hide zero-margin-bottom");
		music_flag=true;
	}
}

function loadWidget() {
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="800" height="800"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-music"></span>
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);
	setTimeout(() => {
		document.getElementById("waifu").style.bottom = 0;
	}, 0);

	function registerEventListener(result) {
		document.querySelector("#waifu-tool .fa-music").addEventListener("click", () => {
			ap.toggle();
		});
		document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
		document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadNextModel);
		document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
			showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
			Live2D.captureName = "photo.png";
			Live2D.captureFrame = true;
		});
		document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
			localStorage.setItem("waifu-display", Date.now());
			showMessage("人生海海，祝你有帆也有岸。", 2000, 11);
			document.getElementById("waifu").style.bottom = "-500px";
			setTimeout(() => {
				document.getElementById("waifu").style.display = "none";
				document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
			}, 3000);
		});
		// 检测用户活动状态，并在空闲时显示消息
        let userAction = false,
            userActionTimer,
            messageArray = result.message.default,
            lastHoverElement;
        window.addEventListener("mousemove", () => userAction = true);
        window.addEventListener("keydown", () => userAction = true);
        setInterval(() => {
            if (userAction) {
                userAction = false;
                clearInterval(userActionTimer);
                userActionTimer = null;
            } else if (!userActionTimer) {
                userActionTimer = setInterval(() => {
                    showMessage(messageArray, 6000, 9);
                }, 20000);
            }
        }, 1000);
		showMessage(welcomeMessage(result.time), 7000, 11);
        window.addEventListener("mouseover", event => {
    		for (let tips of result.mouseover) {
    			if (!event.target.matches(tips.selector)) continue;
    			let text = randomSelection(tips.text);
    			text = text.replace("{text}", event.target.innerText);
    			showMessage(text, 4000, 8);
    			return;
    		}
    	});
    	window.addEventListener("click", event => {
    		for (let tips of result.click) {
    			if (!event.target.matches(tips.selector)) continue;
    			let text = randomSelection(tips.text);
    			text = text.replace("{text}", event.target.innerText);
    			showMessage(text, 4000, 8);
    			return;
    		}
    	});
    	$("#live2d").mousedown(function(e) {
	        if(e.which==3){
	            showMessage(result.message.secret_path,4000,12);
			}
    	});
    	$("#live2d").bind("contextmenu", function(e) {
    	    return false;
    	});
    	result.seasons.forEach(({ date, text }) => {
            const now = new Date(),
                after = date.split("-")[0],
                before = date.split("-")[1] || after;
            if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
                text = randomSelection(text);
                text = text.replace("{year}", now.getFullYear());
                messageArray.push(text);
            }
        });
        const devtools = () => { };
        console.log("%c" + result.message.console, devtools);
        devtools.toString = () => {
            showMessage(result.message.console, 6000, 9);
        };
        window.addEventListener("copy", () => {
            showMessage(result.message.copy, 6000, 9);
        });
        window.addEventListener("visibilitychange", () => {
            if (!document.hidden) showMessage(result.message.visibilitychange, 6000, 9);
        });
	}

    function welcomeMessage(time) {
        if (location.pathname === "/") { // 如果是主页
            for (let { hour, text } of time) {
                const now = new Date(),
                    after = hour.split("-")[0],
                    before = hour.split("-")[1] || after;
                if (after <= now.getHours() && now.getHours() <= before) {
                    return text;
                }
            }
        }
        const text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
        let from;
        if (document.referrer !== "") {
            const referrer = new URL(document.referrer),
                domain = referrer.hostname.split(".")[1];
            const domains = {
                "baidu": "百度",
                "so": "360搜索",
                "google": "谷歌搜索"
            };
            if (location.hostname === referrer.hostname) return text;
            if (domain in domains) from = domains[domain];
            else from = referrer.hostname;
            return `Hello！来自 <span>${from}</span> 的朋友<br>${text}`;
        }
        return text;
    }
    
    let messageTimer;
    function showMessage(text, timeout, priority) {
    	if (!text || (sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority)) return;
    	if (messageTimer) {
    		clearTimeout(messageTimer);
    		messageTimer = null;
    	}
    	text = randomSelection(text);
    	sessionStorage.setItem("waifu-text", priority);
    	let tips = document.getElementById("waifu-tips");
    	tips.innerHTML = text;
    	tips.classList.add("waifu-tips-active");
    	messageTimer = setTimeout(() => {
    		sessionStorage.removeItem("waifu-text");
    		tips.classList.remove("waifu-tips-active");
    	}, timeout);
    }
    
	function showHitokoto() {
		fetch("https://v1.hitokoto.cn")
			.then(response => response.json())
			.then(result => {
				showMessage(result.hitokoto, 6000, 9);
			});
	}
	
	function randomSelection(obj) {
    	return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
    }

	let modelList;
	(function initModel() {
		let modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (modelId === null) {
			// 首次访问加载 指定模型 的 指定材质
			const hour = new Date().getHours();
			if(hour>=20 || hour<8){
				modelId = 1; // 夜间模型ID
			}else{
				modelId = 0; // 白天模型ID
			}
			modelTexturesId = 0; // 材质ID
		}
		loadModel(modelId, modelTexturesId);
		fetch(`${live2d_path}waifu-tips.json`)
			.then(response => response.json())
			.then(registerEventListener);
	})();

	async function loadModelList() {
		let response = await fetch(`${live2d_path}model_list.json`);
		let result = await response.json();
		modelList = result;
	}

	async function loadModel(modelId, modelTexturesId, message) {
		localStorage.setItem("modelId", modelId);
		localStorage.setItem("modelTexturesId", modelTexturesId);
		showMessage(message, 4000, 10);
		if (!modelList) await loadModelList();
		let target = modelList.models[modelId];
		loadlive2d("live2d", `${live2d_path}model/${target}/index.json`);
		console.log(`Live2D 模型 ${modelId}-${target} 加载完成`);
	}

	async function loadNextModel() {
		let modelId = localStorage.getItem("modelId");
		if (!modelList) await loadModelList();
		let index = (++modelId >= modelList.models.length) ? 0 : modelId;
		loadModel(index, 0, modelList.messages[index]);
	}
}

function initWidget() {
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
			<span>猫 咪</span>
		</div>`);
	let toggle = document.getElementById("waifu-toggle");
	toggle.addEventListener("click", () => {
		toggle.classList.remove("waifu-toggle-active");
		if (toggle.getAttribute("first-time")) {
			loadWidget();
			toggle.removeAttribute("first-time");
		} else {
			localStorage.removeItem("waifu-display");
			document.getElementById("waifu").style.display = "";
			setTimeout(() => {
				document.getElementById("waifu").style.bottom = 0;
			}, 0);
		}
	});
	if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
		toggle.setAttribute("first-time", true);
		setTimeout(() => {
			toggle.classList.add("waifu-toggle-active");
		}, 0);
	} else {
		loadWidget();
	}
}

console.log('\n' + ' %c Live2D with Music Player' + ' %c https://github.com/crowya/live2d ' + '\n', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');
