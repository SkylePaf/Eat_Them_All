const cells = document.getElementsByTagName("td");
const playerColorsList = ["orchid", "yellow", "chartreuse", "goldenrod", "lightskyblue", "deeppink", "seagreen", "paleturquoise"]
const enemyColorsList = ["red", "darkred", "orangered", "purple", "violet", "lemonchiffon", "grey", "springgreen", "rgb(48,140,84)"]
const bonusColorsList = ["blue", "fuchsia", "greenyellow", "white"]
const keyCodeToNumber = {
    'Digit1': '1',
    'Digit2': '2',
    'Digit3': '3',
    'Digit4': '4',
    'Digit5': '5',
    'Digit6': '6',
    'Digit7': '7',
    'Digit8': '8',
    'Digit9': '9',
    'Digit0': '0',
    'Backquote': '0',
    'Minus': '6',
    'Equal': '7',
    'BracketLeft': '5',
    'BracketRight': '6',
    'Backslash': '8',
    'Semicolon': '9',
    'Quote': '0',
    'Comma': '8',
    'Period': '9',
    'Slash': '0',
};

let abortControllers = [];
let clickTeleportationCount = 0;
let clickExplosionCount = 0;
let shootASnakeCount = 0;
let radius = null;
let won = false;
let gameRunning = false;
let lvlNmb = null;
let hazards = null;
let data = null;
let gameSize = null;
let keyDownListener = null;
let gameCanvas = null;
let cellsList = [];
let cubesRemaining = null;
let x = null;
let y = null;
let firstWorldLvl = false
let newWorld;

let maxWallLength = 0;
let settings = false;
let soundTrackVolume = localStorage.getItem("soundTrackVolume") ? parseFloat(localStorage.getItem("soundTrackVolume")) : 0.5;
let soundEffectsVolume = localStorage.getItem("soundEffectsVolume") ? parseFloat(localStorage.getItem("soundEffectsVolume")) : 0.5;
let sprintKey = localStorage.getItem("sprintKey") ? localStorage.getItem("sprintKey") : 'rmb';
let laserBonusKey = localStorage.getItem("laserBonusKey") ? localStorage.getItem("laserBonusKey") : 'control';;
let levelsStatus = false;
let launchGame = true;
let isEscapePressed = false;
let keyUpListener = null;
let mouseDownListener = null;
let mouseUpListener = null;
let contextMenuListener = null;
let asyncFunctions = [];    
let selectedBonus = 1;
let blinkingIntervals = [];
let numBuffer = "";
let lvlCount = 0;
let colorNMB = 0;
let enableDiagonal = true;
let currentSoundTrack = new Audio();
let clickWallCount = 0;

let currentWorld = 1;
let currentMusic = null;

function createGameUI() {
    const uiContainer = document.createElement("div");
    uiContainer.classList.add("UI");
    uiContainer.id = "UI"

    function createUIElement(tag, labelText, valueId, valueText, divId) {
        const element = document.createElement("div");
        element.id = divId

        const label = document.createElement("span");
        label.classList.add("UItext");
        label.style.color = playerColorsList[playerColor]
        label.style.textShadow = `0px 0px 10px ${playerColorsList[playerColor]}`
        if (labelText === "Bonus : ") {
            if (valueId === "laserBonusValue") {
                label.style.color = bonusColorsList[0]
                label.style.textShadow = `0px 0px 10px ${bonusColorsList[0]}`
            } else if (valueId === "teleportationBonusValue") {
                label.style.color = bonusColorsList[2]
                label.style.textShadow = `0px 0px 10px ${bonusColorsList[2]}`
            } else if (valueId === "explosionBonusValue") {
                label.style.color = bonusColorsList[1]
                label.style.textShadow = `0px 0px 10px ${bonusColorsList[1]}`
            } else if (valueId === "wallBonusValue") {
                label.style.color = bonusColorsList[3]
                label.style.textShadow = `0px 0px 10px ${bonusColorsList[3]}`
            }
        } else {
            label.style.color = playerColorsList[playerColor]
            label.style.textShadow = `0px 0px 10px ${playerColorsList[playerColor]}`
        }
        label.textContent = labelText;

        const value = document.createElement("span");
        value.id = valueId;
        value.textContent = valueText;
        if (labelText === "") {
            value.style.color = enemyColorsList[Object.values(data["worldsData"]).find(world => world.levels.some(level => level.id === lvlCount)).color]
            value.style.textShadow = `0px 0px 10px ${enemyColorsList[Object.values(data["worldsData"]).find(world => world.levels.some(level => level.id === lvlCount)).color]}`
            value.style.borderBottom = `2px solid ${enemyColorsList[Object.values(data["worldsData"]).find(world => world.levels.some(level => level.id === lvlCount)).color]}`
        }

        element.appendChild(label);
        element.appendChild(value);
        return element;
    }

    if (localStorage.getItem("totalCubesCollectedValue")){
        uiContainer.appendChild(createUIElement("div", "Total : ", "totalCubesCollectedValue", localStorage.getItem("totalCubesCollectedValue"), "totalCollected"));
    } else {
        uiContainer.appendChild(createUIElement("div", "Total : ", "totalCubesCollectedValue", "0", "totalCollected"));
    }
    uiContainer.appendChild(createUIElement("div", "Cubes collected : ", "cubesCollectedValue", "0", "cubesCollected"));
    uiContainer.appendChild(createUIElement("div", "Cubes remaining : ", "cubesRemainingValue", "0", "cubesRemaining"));
    uiContainer.appendChild(createUIElement("div", "Current selected bonus : ", "selectedBonusValue", "------", "selectedBonus"));
    uiContainer.appendChild(createUIElement("div", "Bonus : ", "laserBonusValue", "0", "laserBonus"));
    uiContainer.appendChild(createUIElement("div", "Bonus : ", "teleportationBonusValue", "0", "teleportationBonus"));
    uiContainer.appendChild(createUIElement("div", "Bonus : ", "explosionBonusValue", "0", "explosionBonus"));
    uiContainer.appendChild(createUIElement("div", "Bonus : ", "wallBonusValue", "0", "wallBonus"));
    uiContainer.appendChild(createUIElement("div", "", "lvlCountValue", "------", "lvlCount"));
    uiContainer.appendChild(createUIElement("div", "Best perf : ", "bestPerfValue", "------", "bestPerf"));

    document.querySelector(".box").appendChild(uiContainer);
    document.querySelector(".gameSection").appendChild(uiContainer);
}

function createMenu(worlds) {
    menu = true;
    const box = document.querySelector(".box");
    const fragment = document.createDocumentFragment();
    const colorsList = Object.values(data.worldsData).map(world => world.color);

    const title = document.createElement("h1");
    title.textContent = "Welcome to Eat them All !";
    fragment.appendChild(title);

    Object.entries(worlds).forEach(([worldKey, world], worldIndex) => {
        const worldDiv = createWorldSection(worldKey, world, worldIndex, colorsList);
        fragment.appendChild(worldDiv);
    });

    box.appendChild(fragment);
}

function createWorldSection(worldKey, world, worldIndex, colorsList) {
    const worldDiv = document.createElement("div");
    worldDiv.id = `world${worldIndex + 1}`;
    worldDiv.classList.add("worlds");

    const worldTitle = createWorldTitle(worldKey, worldIndex);
    const levelList = createLevelList(world.levels, worldIndex, colorsList);

    worldDiv.appendChild(worldTitle);
    worldDiv.appendChild(levelList);
    return worldDiv;
}

function createWorldTitle(worldKey, worldIndex) {
    const worldTitle = document.createElement("h2");
    worldTitle.textContent = `${worldKey} :`;

    if (worldIndex >= 0) {
        const worldColorKey = data["worldsData"]?.[`World ${worldIndex + 1}`]?.color;
        const color = enemyColorsList[worldColorKey];

        worldTitle.addEventListener("mouseenter", () => {
            worldTitle.style.webkitTextStroke = `0.01px ${color}`;
            worldTitle.style.textShadow = `0 0 30px ${color}`;
        });

        worldTitle.addEventListener("mouseleave", () => {
            worldTitle.style.textShadow = "none";
            worldTitle.style.webkitTextStroke = "#ffffff 0.01px";
        });
    }

    return worldTitle;
}

function createLevelList(levels, worldIndex, colorsList) {
    const levelList = document.createElement("ul");

    levels.forEach((level, levelIndex) => {
        const listItem = createLevelItem(level, levelIndex, worldIndex, colorsList);
        levelList.appendChild(listItem);
    });

    return levelList;
}

function createLevelItem(level, levelIndex, worldIndex, colorsList) {
    const listItem = document.createElement("li");
    listItem.id = `lvl${level.id}`;

    const label = createLevelLabel(level, levelIndex, worldIndex, colorsList);
    const button = createLevelButton(level);

    listItem.appendChild(label);
    listItem.appendChild(button);
    return listItem;
}

function createLevelLabel(level, levelIndex, worldIndex, colorsList) {
    const label = document.createElement("label");
    label.id = "labelLvl";
    label.textContent = `Level ${levelIndex + 1} - `;

    if (levelsStatus[`lvl${level.id}`]) {
        const color = enemyColorsList[colorsList[worldIndex]];
        label.style.color = color;

        label.addEventListener("mouseenter", () => {
            label.style.textShadow = `0 0 10px ${color}`;
        });

        label.addEventListener("mouseleave", () => {
            label.style.textShadow = "0 0 0";
        });
    }

    return label;
}

function createLevelButton(level) {
    const button = document.createElement("input");
    button.type = "button";
    button.id = `LvlBtn${level.id}`;
    button.classList.add("LvlBtn");

    button.addEventListener("click", () => handleLevelSelection(level.id));
    return button;
}

function handleLevelSelection(levelId) {
    launchGame = true;
    menu = false;
    clearMenu();
    
    const uiContainer = document.createElement("div");
    uiContainer.classList.add("gameSection");
    document.querySelector(".box").appendChild(uiContainer);
    
    lvlCount = levelId;
    newWorld = Math.floor((levelId - 1) / 5) + 1;
    
    if (menu || currentMusic !== `soundTrack_0${newWorld}`) {
        playAudio(`assets/audio/soundTrack/soundTrack_0${newWorld}.mp3`, soundTrackVolume, currentSoundTrack, true, 1, 0);
        currentWorld = newWorld;
        currentMusic = `soundTrack_0${newWorld}`;
    }
    
    return init();
}

function clearMenu() {
    const box = document.querySelector(".box");
    box.innerHTML = '';
}
function clearSettings() {
    const box = document.querySelector(".box");
    box.innerHTML = '';
}

function selectOption(button, containerId, value) {
    document.querySelectorAll(`#${containerId} button`).forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    if (containerId === 'button-container01') {
        if (value) {
            localStorage.setItem("lightMod", value)
            document.documentElement.style.backgroundColor = 'rgb(227, 227, 227)';
        } else {
            localStorage.setItem("lightMod", value)
            document.documentElement.style.backgroundColor = 'black';
        }
    } else if (containerId === 'button-container02') {
        sprintKey = value;
        if (sprintKey === 'shift') {
            laserBonusKey = 'control';
            document.querySelectorAll('#button-container03 button').forEach(btn => btn.classList.remove('selected'));
            document.querySelector(`#button-container03 button[onclick="selectOption(this, 'button-container03', 'control')"]`)?.classList.add('selected');
        }
        localStorage.setItem("sprintKey", sprintKey)
        localStorage.setItem("laserBonusKey", laserBonusKey)
        
    } else if (containerId === 'button-container03') {
        laserBonusKey = value;
        if (laserBonusKey === 'shift' && sprintKey === 'shift') {
            sprintKey = 'rmb';
            document.querySelectorAll('#button-container02 button').forEach(btn => btn.classList.remove('selected'));
            document.querySelector(`#button-container02 button[onclick="selectOption(this, 'button-container02', 'rmb')"]`)?.classList.add('selected');
        }
        localStorage.setItem("sprintKey", sprintKey)
        localStorage.setItem("laserBonusKey", laserBonusKey)
    }
}

function initializeSelections() {
    if (localStorage.getItem("lightMod")) {
        document.querySelector(`#button-container01 button[onclick="selectOption(this, 'button-container01', ${localStorage.getItem("lightMod")})"]`)?.classList.add('selected');
    } else {
        document.querySelector(`#button-container01 button[onclick="selectOption(this, 'button-container01', ${false})"]`)?.classList.add('selected');
    }
    document.querySelector(`#button-container02 button[onclick="selectOption(this, 'button-container02', '${sprintKey}')"]`)?.classList.add('selected');
    document.querySelector(`#button-container03 button[onclick="selectOption(this, 'button-container03', '${laserBonusKey}')"]`)?.classList.add('selected');

    document.getElementById('volume-slider').value = soundTrackVolume;
    document.getElementById('soundEffect-slider').value = soundEffectsVolume;
}

function updateVolume(type, value) {
    value = parseFloat(value);
    if (type === 'music') {
        soundTrackVolume = value;
        currentSoundTrack.volume = value;
        localStorage.setItem("soundTrackVolume", value)
    } else if (type === 'soundEffect') {
        soundEffectsVolume = value;
        localStorage.setItem("soundEffectsVolume", value)
    }
}

function createSettingsSection() {
    const body = document.body;
    body.setAttribute('multiselect-disabled', 'true');

    const boxDiv = document.querySelector(".box");
    const container = document.createElement('div');
    container.classList.add('settingsContainer');

    const gameSectionDiv = document.createElement('div');
    gameSectionDiv.className = 'gameSection';

    const title01 = document.createElement('h1');
    title01.id = 'Title01';
    title01.textContent = 'Accessibility';

    const label01 = document.createElement('label');
    label01.setAttribute('for', 'button-container01');
    label01.id = 'settingsLabels01';
    label01.className = 'settingsLabels';
    label01.textContent = 'Light mod :';

    const buttonContainer01 = document.createElement('div');
    buttonContainer01.id = 'button-container01';

    const buttonYes = document.createElement('button');
    buttonYes.className = 'settingsButtons';
    buttonYes.setAttribute('role', 'button');
    buttonYes.setAttribute('onclick', "selectOption(this, 'button-container01', true)");
    buttonYes.textContent = 'YES';

    const buttonNo = document.createElement('button');
    buttonNo.className = 'settingsButtons';
    buttonNo.setAttribute('role', 'button');
    buttonNo.setAttribute('onclick', "selectOption(this, 'button-container01', false)");
    buttonNo.textContent = 'NO';

    const title02 = document.createElement('h1');
    title02.id = 'Title02';
    title02.textContent = 'Controls';

    const label02 = document.createElement('label');
    label02.setAttribute('for', 'button-container02');
    label02.id = 'settingsLabels02';
    label02.className = 'settingsLabels';
    label02.textContent = 'Sprint :';

    const buttonContainer02 = document.createElement('div');
    buttonContainer02.id = 'button-container02';

    const buttonShift = document.createElement('button');
    buttonShift.className = 'settingsButtons';
    buttonShift.setAttribute('role', 'button');
    buttonShift.setAttribute('onclick', "selectOption(this, 'button-container02', 'shift')");
    buttonShift.textContent = 'Shift';

    const buttonRmb = document.createElement('button');
    buttonRmb.className = 'settingsButtons';
    buttonRmb.setAttribute('role', 'button');
    buttonRmb.setAttribute('onclick', "selectOption(this, 'button-container02', 'rmb')");
    buttonRmb.textContent = 'Right click';

    const label03 = document.createElement('label');
    label03.setAttribute('for', 'button-container03');
    label03.id = 'settingsLabels03';
    label03.className = 'settingsLabels';
    label03.textContent = 'Laser bonus :';

    const buttonContainer03 = document.createElement('div');
    buttonContainer03.id = 'button-container03';

    const buttonShift2 = document.createElement('button');
    buttonShift2.className = 'settingsButtons';
    buttonShift2.setAttribute('role', 'button');
    buttonShift2.setAttribute('onclick', "selectOption(this, 'button-container03', 'shift')");
    buttonShift2.textContent = 'Shift';

    const buttonControl = document.createElement('button');
    buttonControl.className = 'settingsButtons';
    buttonControl.setAttribute('role', 'button');
    buttonControl.setAttribute('onclick', "selectOption(this, 'button-container03', 'control')");
    buttonControl.textContent = 'Control';

    const label04 = document.createElement('label');
    label04.setAttribute('for', 'button-container04');
    label04.id = 'settingsLabels04';
    label04.className = 'settingsLabels';
    label04.textContent = 'Music volume :';

    const buttonContainer04 = document.createElement('div');
    buttonContainer04.id = 'button-container04';

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.id = 'volume-slider';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.className = 'slider';
    volumeSlider.setAttribute('oninput', "updateVolume('music', this.value)");

    const label05 = document.createElement('label');
    label05.setAttribute('for', 'button-container05');
    label05.id = 'settingsLabels05';
    label05.className = 'settingsLabels';
    label05.textContent = 'Sound effects volume :';

    const buttonContainer05 = document.createElement('div');
    buttonContainer05.id = 'button-container05';

    const soundEffectSlider = document.createElement('input');
    soundEffectSlider.type = 'range';
    soundEffectSlider.id = 'soundEffect-slider';
    soundEffectSlider.min = '0';
    soundEffectSlider.max = '1';
    soundEffectSlider.step = '0.01';
    soundEffectSlider.className = 'slider';
    soundEffectSlider.setAttribute('oninput', "updateVolume('soundEffect', this.value)");

    buttonContainer01.appendChild(buttonYes);
    buttonContainer01.appendChild(buttonNo);

    buttonContainer02.appendChild(buttonShift);
    buttonContainer02.appendChild(buttonRmb);

    buttonContainer03.appendChild(buttonShift2);
    buttonContainer03.appendChild(buttonControl);

    buttonContainer04.appendChild(volumeSlider);

    buttonContainer05.appendChild(soundEffectSlider);
    
    container.appendChild(gameSectionDiv);
    container.appendChild(title01);
    container.appendChild(label01);
    container.appendChild(buttonContainer01);
    container.appendChild(title02);
    container.appendChild(label02);
    container.appendChild(buttonContainer02);
    container.appendChild(label03);
    container.appendChild(buttonContainer03);
    container.appendChild(label04);
    container.appendChild(buttonContainer04);
    container.appendChild(label05);
    container.appendChild(buttonContainer05);

    boxDiv.appendChild(container);
}

document.addEventListener("DOMContentLoaded", async () => {
    launchGame = false
    await loadJSON()
    const worldsData = data["worldsData"]
    playAudio("assets/audio/soundTrack/soundTrack___.mp3", soundTrackVolume, currentSoundTrack, true, 1, 0);
    currentMusic = "soundTrack___";
    firstWorldLvl = false
    createMenu(worldsData);
    if (JSON.parse(localStorage.getItem("lightMod"))){
        document.documentElement.style.backgroundColor = 'rgb(227, 227, 227)';
    } else {
        document.documentElement.style.backgroundColor = 'black';
    }
    startUp()
});

async function delay(ms, signal) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });
    
}
const throttle = (fn, delay) => {
    let lastCall = 0;
    return (...args) => {
        if (Date.now() - lastCall < delay) return;
        lastCall = Date.now();
        fn(...args);
    };
};
const randint = (min, max, step = 1) => min + Math.floor(Math.random() * (Math.floor((max - min) / step) + 1)) * step;

async function init() {
    await loadJSON();
    loadLvl(lvlCount)
    startGame();
}

async function loadJSON() {
    const response = await fetch("data/levelsData.json");
    data = await response.json();
    if (localStorage.getItem("levelsStatus")) {
        levelsStatus = JSON.parse(localStorage.getItem("levelsStatus"));
    } else {
        levelsStatus = Object.fromEntries([...Array(30)].map((_, i) => [`lvl${i + 1}`, false]))
        window.localStorage.setItem("levelsStatus", JSON.stringify(levelsStatus))
    }

}

function loadLvl(lvlIndex) {
    lvlNmb = lvlIndex
    gameScale = data[`lvl${lvlNmb}`]?.gameMap?.gameScale;
    x = data[`lvl${lvlNmb}`]?.player?.pos?.x;
    y = data[`lvl${lvlNmb}`]?.player?.pos?.y;
    playerSize = data[`lvl${lvlNmb}`]?.player?.size;
    playerColor = data[`lvl${lvlNmb}`]?.player?.color;
    cubesRemaining = (data[`lvl${lvlNmb}`]?.gameMap?.size * data[`lvl${lvlNmb}`]?.gameMap?.size) - ((data[`lvl${lvlNmb}`]?.gameMap?.size - 3) * 12);
    gameSize = data[`lvl${lvlNmb}`]?.gameMap?.size;
    hazards = data[`lvl${lvlNmb}`]?.gameMapHazards;
    bonus = data[`lvl${lvlNmb}`]?.bonus;
}


function playAudio(source, vol, audioType, isLoop = false, speed = 1.0, time = 0, fadeTime = 2) {
    audioType.src = source;
    audioType.currentTime = time;
    audioType.loop = isLoop;
    audioType.playbackRate = Math.max(0.5, Math.min(speed, 3.0));
    audioType.volume = vol;

    if (audioType === currentSoundTrack && !isLoop) {
        audioType.volume = 0;
        let step = vol / (fadeTime * 10);
        let fadeIn = setInterval(() => {
            if (audioType.volume < vol) {
                audioType.volume = Math.min(audioType.volume + step, vol);
            } else {
                clearInterval(fadeIn);
            }
        }, 100);
    }

    audioType.play();

    if (isLoop) {
        audioType.addEventListener('ended', function() {
            audioType.currentTime = 0;
            audioType.volume = vol;
            audioType.play();
        }, { once: false });
    }

    function setupFadeOut() {
        let duration = audioType.duration;
        if (!isNaN(duration) && duration > fadeTime && !isLoop) {
            audioType.ontimeupdate = () => {
                if (audioType.currentTime >= (duration - fadeTime)) {
                    fadeOut(audioType, fadeTime, vol, isLoop);
                    audioType.ontimeupdate = null;
                }
            };
        }
    }

    if (audioType.readyState >= 1) {
        setupFadeOut();
    } else {
        audioType.onloadedmetadata = setupFadeOut;
    }
}

function fadeOut(audio, fadeTime, vol, isLoop) {
    let step = audio.volume / (fadeTime * 10);
    let fadeOut = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - step, 0);
        } else {
            clearInterval(fadeOut);
            if (isLoop) {
                audio.currentTime = 0;
                audio.volume = vol;
                audio.play();
            } else {
                audio.pause();  
            }
        }
    }, 100);
}


function genGame(id, gameSize) {
    gameCanvas = document.createElement("table");
    gameCanvas.id = id;
    gameCanvas.style.borderSpacing = `${data[`lvl${lvlNmb}`]?.gameMap?.gameScale[1]}px`;
    gameCanvas.oncontextmenu = () => false;
    gameCanvas.innerHTML = Array.from({ length: gameSize }, () =>
        `<tr>${"<td></td>".repeat(gameSize)}</tr>`
    ).join("");

    document.querySelector(".box")?.appendChild(gameCanvas);
    document.querySelector(".gameSection")?.appendChild(gameCanvas)

    cellsList = generateCellsList(gameSize, gameSize);

    for (let i = 3; i < gameSize - 3; i++) {
        for (let j = 3; j < gameSize - 3; j++) {
            cellsList[i][j]["color"] = colorNMB % 3 === 0 ? randint(0, 9, 1) : colorNMB++; cellsList[i][j]["type"] = "cubes"; cellsList[i][j]["opacity"] = 0.3; 
            gameCanvas.rows[i].cells[j].style.backgroundImage = `url(${data[`textures_scale_${gameScale[0]}`]["decors"]["cubes"][cellsList[i][j]["color"]]})`;
            gameCanvas.rows[i].cells[j].style.opacity = cellsList[i][j]["opacity"]
        }
    }
    for (let i = 2; i < gameSize - 2; i++) {
        for (let j = 2; j < gameSize - 2; j++) {
            if (i === 2 || i === gameSize - 3 || j === 2 || j === gameSize - 3) {
                cellsList[i][j]["color"] = 0; cellsList[i][j]["type"] = "border"; cellsList[i][j]["opacity"] = 1; 
                gameCanvas.rows[i].cells[j].style.backgroundImage = `url(${data[`textures_scale_${gameScale[0]}`]["decors"]["border"]})`
                gameCanvas.rows[i].cells[j].style.filter = `drop-shadow(0px 0px 10px white)`
            }
        }
    }
    if (hazards?.pluses) {
        const { size, count, color } = hazards.pluses;
        plusEnemy(size, count, color);
    }
    if (hazards?.crosses) {
        const { size, count, color } = hazards.crosses;
        crossEnemy(size, count, color);
    }

    createGameUI()
    document.getElementById("lvlCountValue").textContent = `${Object.values(data["worldsData"]).flatMap(world => world.levels).find(level => level.id === lvlCount)?.name} | ${Object.keys(data["worldsData"]).find(world => data["worldsData"][world].levels.some(level => level.id === lvlCount))}`
    drawPlayer(playerColor, playerSize, x, y);

    if (bonus?.clickExplosion){
        const { count, color } = bonus?.clickExplosion;
        spawnBonusCubes(count, color, "clickExplosionBonus")
    }
    if (bonus?.clickTeleportation){
        const { count, color } = bonus?.clickTeleportation;
        spawnBonusCubes(count, color, "clickTeleportation" )
    }
    if (bonus?.shootASnake){
        const { count, color } = bonus?.shootASnake;
        spawnBonusCubes(count, color, "shootASnakeBonus")
    }
    if (bonus?.clickWall){
        const { count, color } = bonus?.clickWall;
        spawnBonusCubes(count, color, "clickWall")
    }

    for (let i = 3; i < gameSize - 3; i++) {
        for (let j = 3; j < gameSize - 3; j++) {
            if ( cellsList[i][j]["type"] === "enemy" ) { cubesRemaining-- }
        }
    }
    document.getElementById("cubesRemainingValue").textContent = cubesRemaining
    if (localStorage.getItem("bestPerfValue " + lvlCount)){
        document.getElementById("bestPerfValue").textContent = `${localStorage.getItem("bestPerfValue " + lvlCount)} / ${cubesRemaining + playerSize * playerSize}`
    } else {
        document.getElementById("bestPerfValue").textContent = `${0} / ${cubesRemaining + playerSize * playerSize}`
    }
}

function generateCellsList(rows, cols) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ "type": null, "color": null, "opacity": 1, "corrupt": false})));;
}

function drawPlayer(color, playerSize, Px, Py, isCheckLost = true) {
    let isBonus = false;
    let isCube = false;
    let isEmpty = false;
    blinkingIntervals.forEach(interval => clearInterval(interval));
    blinkingIntervals = [];

    for (let i = 0; i < playerSize; i++) {
        for (let j = 0; j < playerSize; j++) {
            if (Px + i < gameSize && Py + j < gameSize) {
                if (isCheckLost) {checkLost(Px + i, Py + j)}
                if (cellsList[Px + i][Py + j]["type"] === "cubes" || cellsList[Px + i][Py + j]["type"] === "clickExplosionBonus" || cellsList[Px + i][Py + j]["type"] === "shootASnakeBonus" || cellsList[Px + i][Py + j]["type"] === "clickTeleportation" || cellsList[Px + i][Py + j]["type"] === "clickWall") {
                    cubesRemaining--;
                    document.getElementById("cubesRemainingValue").textContent = parseInt(document.getElementById("cubesRemainingValue").textContent) - 1;
                    document.getElementById("cubesCollectedValue").textContent = parseInt(document.getElementById("cubesCollectedValue").textContent) + 1;
                    document.getElementById("totalCubesCollectedValue").textContent = parseInt(document.getElementById("totalCubesCollectedValue").textContent) + 1;
                    if (cellsList[Px + i][Py + j]["type"] === "clickExplosionBonus" || cellsList[Px + i][Py + j]["type"] === "shootASnakeBonus" || cellsList[Px + i][Py + j]["type"] === "clickTeleportation" || cellsList[Px + i][Py + j]["type"] === "clickWall") {
                        isEmpty = false
                        isBonus = true
                    }
                    if (cellsList[Px + i][Py + j]["type"] === "cubes") {
                        isEmpty = false
                        isCube = true
                    }
                } else if (cellsList[Px + i][Py + j]["type"] === "empty" && !isCube && !isBonus) {
                    isEmpty = true
                }

                if (cellsList[Px + i][Py + j]["type"] === "clickExplosionBonus") {
                    clickExplosionCount++;
                    selectedBonus = 1
                    document.getElementById("explosionBonusValue").textContent = clickExplosionCount;
                    document.getElementById("selectedBonusValue").textContent = "Click Explosion";
                    gameCanvas.style.cursor = "crosshair";
                }

                if (cellsList[Px + i][Py + j]["type"] === "clickTeleportation") {
                    clickTeleportationCount++;
                    selectedBonus = 2
                    document.getElementById("teleportationBonusValue").textContent = clickTeleportationCount;
                    document.getElementById("selectedBonusValue").textContent = "Click Teleportation"
                    gameCanvas.style.cursor = "pointer";
                }
                if (cellsList[Px + i][Py + j]["type"] === "clickWall") {
                    clickWallCount++;
                    selectedBonus = 3
                    document.getElementById("wallBonusValue").textContent = clickWallCount;
                    document.getElementById("selectedBonusValue").textContent = "Click Wall"
                    gameCanvas.style.cursor = "cell";
                }

                if (cellsList[Px + i][Py + j]["type"] === "shootASnakeBonus") {
                    shootASnakeCount++
                    document.getElementById("laserBonusValue").textContent = shootASnakeCount;
                }

                cellsList[Px + i][Py + j]["color"] = color;
                cellsList[Px + i][Py + j]["type"] = "player";
                cellsList[Px + i][Py + j]["opacity"] = 1;

                let filter = `drop-shadow(${playerColorsList[cellsList[Px + i][Py + j]["color"]]} 0px 0px 10px)`;

                if (shootASnakeCount >= 1 && (i === 0 || i === playerSize - 1 || j === 0 || j === playerSize - 1)) {
                    const interval = setInterval(() => {
                        if (!gameRunning) {return}
                        if (i === 0 && j === 0) {let soundEffect = new Audio(); playAudio(data["SoundEffects"]?.shootASnakeAlert[randint(0, data["SoundEffects"]?.shootASnakeAlert.length - 1)], soundEffectsVolume, soundEffect)}
                        const currentFilter = cells[(Px + i) * gameSize + (Py + j)].style.filter;
                        const newFilter = (currentFilter === filter) ? "drop-shadow(0px 0px 10px blue)" : filter;
                        cells[(Px + i) * gameSize + (Py + j)].style.filter = newFilter;
                    }, 440);

                    blinkingIntervals.push(interval);
                }

                Object.assign(cells[(Px + i) * gameSize + (Py + j)].style, {
                    backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`]["player"][`world${playerColor + 1}`]})`,
                    filter: filter,
                    opacity: 1
                });
            }
        }
    }
    checkWIn();
    if (isCube) {let soundEffect = new Audio(); playAudio(data["SoundEffects"]?.eating[randint(0, data["SoundEffects"]?.eating.length - 1)], soundEffectsVolume, soundEffect)}
    if (isEmpty) {let soundEffect = new Audio(); playAudio(data["SoundEffects"]?.stepping[randint(0, data["SoundEffects"]?.stepping.length - 1)], soundEffectsVolume, soundEffect)}
    if (isBonus) {let soundEffect = new Audio(); playAudio(data["SoundEffects"]?.bonusCollected[randint(0, data["SoundEffects"]?.bonusCollected.length - 1)], soundEffectsVolume, soundEffect)}
}

function removePlayer(playerSize, Px, Py) {
    for (let i = 0; i < playerSize; i++) {
        for (let j = 0; j < playerSize; j++) {
            cellsList[Px + i][Py + j]["type"] = "empty"; cellsList[Px + i][Py + j]["color"] = 10;
            Object.assign(cells[(Px + i) * gameSize + (Py + j)].style, {
                filter: "none",
                backgroundImage: "none",
                opacity: cellsList[Px + i][Py + j]["opacity"]
            });
        }
    }
}

async function Game(playerSize) {
    gameRunning = true;
    const state = {
        moving: false,
        dx: 0, 
        dy: 0,
        lastMoveTime: 0,
        baseMoveInterval: 150,
        moveInterval: 150,
        laserBonusKeyPressed: false,
        asyncFunctions: [],
        keys: { 
            'z': false, 'q': false, 's': false, 'd': false, 
            'arrowup': false, 'arrowleft': false, 'arrowdown': false, 'arrowright': false 
        }
    };

    const trackAsyncFunction = (promise) => {
        state.asyncFunctions.push(promise);
        promise.finally(() => {
            state.asyncFunctions.splice(state.asyncFunctions.indexOf(promise), 1);
        });
    };

    function movePlayer(timestamp = 0) {
        if (!state.moving || !gameRunning || state.laserBonusKeyPressed) return;

        if (timestamp - state.lastMoveTime > state.moveInterval) {
            state.lastMoveTime = timestamp;
            oldX = x;
            oldY = y;
            if (enableDiagonal || (state.dx === 0 || state.dy === 0)) {
                if ((state.dx || state.dy) &&
                    x + state.dx >= 3 && x + state.dx + playerSize <= gameSize - 3 &&
                    y + state.dy >= 3 && y + state.dy + playerSize <= gameSize - 3) {
                    for (let i = 0; i < playerSize; i++) {
                        for (let j = 0; j < playerSize; j++) {
                            if (cellsList[x + state.dx + i][y + state.dy + j]["type"] === "border") {return}
                        }
                    }
                    removePlayer(playerSize, oldX, oldY);
                    x += state.dx;
                    y += state.dy;
                    drawPlayer(playerColor, playerSize, x, y);
                }
            }
        }

        requestAnimationFrame(movePlayer);
    }

    keyDownListener = async (e) => {
        const key = e.key.toLowerCase();
        const mappedKey = keyCodeToNumber[e.code] || null;

        if (key === laserBonusKey) {
            state.laserBonusKeyPressed = true;
        }

        if (state.keys.hasOwnProperty(key)) state.keys[key] = true;

        state.dx = state.keys['z'] || state.keys['arrowup'] ? -1 : state.keys['s'] || state.keys['arrowdown'] ? 1 : 0;
        state.dy = state.keys['q'] || state.keys['arrowleft'] ? -1 : state.keys['d'] || state.keys['arrowright'] ? 1 : 0;

        if (handleLaserShot(key)) return;

        if (!state.moving) {
            state.moving = true;
            movePlayer();
        }

        if (key === sprintKey) {
            isSpintKeyPressed = true;
            state.moveInterval = state.baseMoveInterval / 4;
        }

        if (key === "escape" && gameRunning) {
            handleEscape();
        }

        handleBonusSelection(mappedKey);
    };

    keyUpListener = (e) => {
        const key = e.key.toLowerCase();

        if (key === sprintKey) {
            isSpintKeyPressed = false;
            state.moveInterval = state.baseMoveInterval;
        }

        if (state.keys.hasOwnProperty(key)) state.keys[key] = false;
        if (key === laserBonusKey) {
            state.laserBonusKeyPressed = false;
        }

        state.dx = state.keys['z'] || state.keys['arrowup'] ? -1 : state.keys['s'] || state.keys['arrowdown'] ? 1 : 0;
        state.dy = state.keys['q'] || state.keys['arrowleft'] ? -1 : state.keys['d'] || state.keys['arrowright'] ? 1 : 0;

        if (state.dx === 0 && state.dy === 0) state.moving = false;
    };

    mouseDownListener = (e) => {
        if (e.button === 2 && sprintKey === "rmb") {
            isSpintKeyPressed = true;
            state.moveInterval = state.baseMoveInterval / 4;
        }
    };

    mouseUpListener = (e) => {
        if (e.button === 2 && sprintKey === "rmb") {
            isSpintKeyPressed = false;
            state.moveInterval = state.baseMoveInterval;
        }
    };

    contextMenuListener = (e) => e.preventDefault();

    function handleLaserShot(key) {
        if (shootASnakeCount > 0 && state.laserBonusKeyPressed) {
            if (key === "z" || key === "arrowup") {
                movingElement(playerSize * 2, playerSize, 2, "up", 0, "player", y, x - playerSize * 2);
            } else if (key === "q" || key === "arrowleft") {
                movingElement(playerSize * 2, playerSize, 2, "left", 0, "player", y - playerSize * 2, x);
            } else if (key === "s" || key === "arrowdown") {
                movingElement(playerSize * 2, playerSize, 2, "down", 0, "player", y, x + playerSize);
            } else if (key === "d" || key === "arrowright") {
                movingElement(playerSize * 2, playerSize, 2, "right", 0, "player", y + playerSize, x);
            } else {
                return false;
            }
            shootASnakeCount--;
            document.getElementById("laserBonusValue").textContent = shootASnakeCount;
            drawPlayer(playerColor, playerSize, x, y, false);
            return true;
        }
        return false;
    }

    function handleEscape() {
        stopGame();
        gameCanvas.style.opacity = 0.3;
        document.querySelector(".UI").style.opacity = 0.3;
    }

    function handleBonusSelection(mappedKey) {
        if (mappedKey !== null && mappedKey >= "0" && mappedKey <= "9") {
            selectedBonus = Math.min(Math.max(parseInt(mappedKey), 1), 3);
            updateBonusCursor();
            numBuffer += mappedKey;
        }
    }

    function updateBonusCursor() {
        if (selectedBonus === 1) {
            gameCanvas.style.cursor = clickExplosionCount > 0 ? "crosshair" : "not-allowed";
            document.getElementById("selectedBonusValue").textContent = clickExplosionCount > 0 ? "Click Explosion" : "------";
        } else if (selectedBonus === 2) {
            gameCanvas.style.cursor = clickTeleportationCount > 0 ? "pointer" : "not-allowed";
            document.getElementById("selectedBonusValue").textContent = clickTeleportationCount > 0 ? "Click Teleportation" : "------";
        } else if (selectedBonus === 3) {
            gameCanvas.style.cursor = clickWallCount > 0 ? "cell" : "not-allowed";
            document.getElementById("selectedBonusValue").textContent = clickWallCount > 0 ? "Click Wall" : "------";
        }
    }

    document.addEventListener('keydown', keyDownListener);
    document.addEventListener('keyup', keyUpListener);
    document.addEventListener('mousedown', mouseDownListener);
    document.addEventListener('mouseup', mouseUpListener);
    document.addEventListener('contextmenu', contextMenuListener);

    if (hazards?.snakes) {
        const { length, width, speed, direction, delay, color } = hazards.snakes;
        trackAsyncFunction(launchSnakeEnemy(length, width, speed, direction, delay, color));
    }
    if (hazards?.squares) {
        const { length, width, speed, direction, delay, color } = hazards.squares;
        trackAsyncFunction(launchSquareEnemy(length, width, speed, direction, delay, color));
    }
    if (hazards?.walls) {
        const { length, width, speed, direction, delay, color } = hazards.walls;
        trackAsyncFunction(launchWallEnemy(length, width, speed, direction, delay, color));
    }
    if (hazards?.circles) {
        const { speed, delay, color } = hazards.circles;
        trackAsyncFunction(launchCircleEnemy(speed, delay, color));
    }
    if (hazards?.antiPlayer) {
        const { length, width, speed, direction, delay, color } = hazards.antiPlayer;
        trackAsyncFunction(launchAntiPlayerEnemy(length, width, speed, direction, delay, color));
    }
    if (hazards?.diagonalSnakes) {
        const { length, width, speed, direction, delay, color } = hazards.diagonalSnakes;
        trackAsyncFunction(launchDiagonalSnakeEnemy(length, width, speed, direction, delay, color));
    }

    gameCanvas.addEventListener("click", (event) => {
        if (selectedBonus === 1) {
            clickExplosion(event);
        } else if (selectedBonus === 2) {
            clickTeleportation(event, x, y);
        } else if (selectedBonus === 3) {
            clickWall(event);
        }
    });

    return Promise.all(state.asyncFunctions);
}

function isEnemyTexture(backgroundImage) {
    return Object.values(data[`textures_scale_${gameScale[0]}`].enemies).some(texture => {
        if (typeof texture === 'string') {
            return backgroundImage === `url("${texture}")`;
        } else if (Array.isArray(texture)) {
            return texture.some(t => backgroundImage === `url("${t}")`);
        } else if (typeof texture === 'object') {
            return Object.values(texture).some(t => {
                if (Array.isArray(t)) {
                    return t.some(subT => backgroundImage === `url("${subT}")`);
                }
                return backgroundImage === `url("${t}")`;
            });
        }
        return false;
    });
}

function checkLost(eltX, eltY, enemy = false){
    if (!gameRunning){return}
    if ( !enemy && (isEnemyTexture(cells[eltX * gameSize + eltY].style.backgroundImage) && (!data[`textures_scale_${gameScale[0]}`]?.enemies?.circles?.alert.includes(cells[eltX * gameSize + eltY].style.backgroundImage.replace(/url\("(.+)"\)/, '$1')) ) || cellsList[eltX][eltY]["type"] === "enemy" ) || (Object.values(data[`textures_scale_${gameScale[0]}`].player).some(playerTexture => cells[eltX * gameSize + eltY].style.backgroundImage === `url("${playerTexture}")`) ) ) {
        localStorage.setItem("totalCubesCollectedValue", parseInt(document.getElementById("totalCubesCollectedValue").textContent))
        if (localStorage.getItem("bestPerfValue " + lvlCount) <= parseInt(document.getElementById("cubesCollectedValue").textContent)) {
            localStorage.setItem("bestPerfValue " + lvlCount, parseInt(document.getElementById("cubesCollectedValue").textContent))
        }
        gameRunning = false
        currentSoundTrack.volume = soundTrackVolume * 0.5;
        lvlCount--
        let soundEffect = new Audio(); playAudio(data["SoundEffects"]?.dying[randint(0, data["SoundEffects"]?.dying.length - 1)], soundEffectsVolume, soundEffect)
        console.log("The player lost!");
        return startUp();
    }
}

function checkWIn(){
    if (cubesRemaining === 0 && gameRunning) {
        localStorage.setItem("totalCubesCollectedValue", parseInt(document.getElementById("totalCubesCollectedValue").textContent))
        localStorage.setItem("bestPerfValue " + lvlCount, parseInt(document.getElementById("cubesCollectedValue").textContent))
        console.log("The Player won !"); 
        levelsStatus[`lvl${lvlCount}`] = true;
        window.localStorage.setItem("levelsStatus", JSON.stringify(levelsStatus))
        won = true; let soundEffect = new Audio(); 
        playAudio(data["SoundEffects"]?.win[randint(0, data["SoundEffects"]?.win.length - 1)], soundEffectsVolume, soundEffect); 
        return startUp()
    }
}

function startGame(){
    genGame("game", gameSize, gameSize);
    setTimeout(() => {gameCanvas.style.opacity = 1; document.getElementById("UI").style.opacity = 1}, 100);
    Game(playerSize, x, y)
}

async function stopGame() {
    let replay = false;
    gameRunning = false;
    currentSoundTrack.volume = soundTrackVolume * 0.5;
    document.removeEventListener('keydown', keyDownListener);
    menuBtn = document.createElement("button");
    menuBtn.style.opacity = 1
    menuBtn.id = "menuBtn";
    menuBtn.classList.add("escapeBtns");
    document.querySelector(".box")?.appendChild(menuBtn);
    menuBtn.textContent = "Main menu ?"
    settingsBtn = document.createElement("button");
    settingsBtn.style.opacity = 1
    settingsBtn.id = "settingsBtn";
    settingsBtn.classList.add("escapeBtns");
    document.querySelector(".box")?.appendChild(settingsBtn);
    settingsBtn.textContent = "Settings"
    lvlCount--
    const removeBtn = async () => {
        await delay(300)
        menuBtn.remove()
        settingsBtn.remove()
    }
    const escapeListener = async (e) => {
        if (menu) {document.removeEventListener("keydown", escapeListener); return}
        if (e.key === "Escape" && !settings) {
            replay = true
            document.removeEventListener("keydown", escapeListener);
            document.getElementById("UI").style.opacity = 1
            gameCanvas.style.opacity = 1;
            menuBtn.style.opacity = 1
            settingsBtn.style.opacity = 1
            startUp();
            menuBtn.style.opacity = 0
            settingsBtn.style.opacity = 0
            removeBtn()
        } else if (e.key === "Escape" && document.querySelector(".settingsContainer")){
            document.removeEventListener("keydown", escapeListener);
            lvlCount--
            settings = false
            launchGame = true
            clearSettings()
            const uiContainer = document.createElement("div");
            uiContainer.classList.add("gameSection");
            document.querySelector(".box").appendChild(uiContainer);
            startUp();
        }
    };
    if (replay === true) {return}
    document.addEventListener("keydown", escapeListener);
    menuBtn.onclick = async function(){ 
        document.removeEventListener("keydown", escapeListener);
        launchGame = false;
        menuBtn.style.opacity = 0
        settingsBtn.style.opacity = 0
        await delay(300)
        document.getElementById("menuBtn").remove()
        document.getElementById("settingsBtn").remove()
        startUp()
        await loadJSON()
        const worldsData = data["worldsData"]
        playAudio("assets/audio/soundTrack/soundTrack___.mp3", soundTrackVolume, currentSoundTrack, true, 1, 0);
        currentMusic = "soundTrack___";
        firstWorldLvl = false
        createMenu(worldsData);
    }
    settingsBtn.onclick = async function(){ 
        launchGame = false;
        settings = true;
        menuBtn.style.opacity = 0
        settingsBtn.style.opacity = 0
        await delay(300)
        document.getElementById("menuBtn").remove()
        document.getElementById("settingsBtn").remove()
        startUp()
    }
    
}

async function startUp() {
    lvlCount++;
    gameRunning = false;
    newWorld = Math.floor((lvlCount - 1) / 5) + 1;

    console.log(newWorld, currentWorld)

    abortControllers.forEach(controller => controller.abort());
    abortControllers = [];

    await Promise.all(asyncFunctions);
    asyncFunctions = [];

    firstClickPos = null;
    won = false;
    shootASnakeCount = 0;
    clickTeleportationCount = 0;
    clickExplosionCount = 0;
    clickWallCount = 0;
    lvlNmb = null;
    hazards = null;
    data = null;
    gameSize = null;
    cubesRemaining = null;
    x = null;
    y = null;
    keys = {};
    dx = 0;
    dy = 0;
    moving = false;
    laserBonusKeyPressed = false;

    if (lvlCount < 41 && launchGame && newWorld !== currentWorld && !menu && !settings) {
        fadeOut(currentSoundTrack, 2, soundTrackVolume, false);
    }

    document.removeEventListener('keydown', keyDownListener);
    document.removeEventListener('keyup', keyUpListener);
    document.removeEventListener('mousedown', mouseDownListener);
    document.removeEventListener('mouseup', mouseUpListener);
    document.removeEventListener('contextmenu', contextMenuListener);

    if (document.getElementById("game")) {
        document.getElementById("UI").style.opacity = 0
        document.getElementById("game").style.opacity = 0;
        if (launchGame) {await delay(3000)}
        document.getElementById("UI").remove();
        document.getElementById("game").remove();
        currentSoundTrack.volume = soundTrackVolume;
    }

    if (lvlCount < 41 && launchGame && newWorld !== currentWorld && !menu && !settings) {
        playAudio(`assets/audio/soundTrack/soundTrack_0${newWorld}.mp3`, soundTrackVolume, currentSoundTrack, true, 1, 0);
        currentMusic = `soundTrack_0${newWorld}`;
        currentWorld = newWorld;
    }

    if (lvlCount < 41 && launchGame) {
        await init();
    } else if (lvlCount > 40 && !settings) {
        await loadJSON()
        const worldsData = data["worldsData"]
        playAudio("assets/audio/soundTrack/soundTrack___.mp3", soundTrackVolume, currentSoundTrack, true, 1, 0);
        currentMusic = "soundTrack___";
        firstWorldLvl = false;
        createMenu(worldsData);
    } else if (settings){
        createSettingsSection()
        initializeSelections();
        document.getElementById('volume-slider').value = soundTrackVolume;
        document.getElementById('soundEffect-slider').value = soundEffectsVolume;
    }
}

console.log("app launched")