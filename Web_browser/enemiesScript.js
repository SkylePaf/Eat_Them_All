async function launchSnakeEnemy(SnakeLengthRAND_NMBS = 5, SnakeWidthRAND_NMBS = 1, SnakeSpeedRAND_NMBS = 1, direction = "right", delaybetweenRAND_NMBS = 1000, color = 0){
    const controller = new AbortController();
    abortControllers.push(controller);

    while (gameRunning) {
        let SnakeLength = randint(SnakeLengthRAND_NMBS?.min, SnakeLengthRAND_NMBS?.max); 
        let SnakeWidth = randint(SnakeWidthRAND_NMBS?.min, SnakeWidthRAND_NMBS?.max); 
        let SnakeSpeed = randint(SnakeSpeedRAND_NMBS?.min, SnakeSpeedRAND_NMBS?.max, 0.1); 
        let delaybetween = randint(delaybetweenRAND_NMBS?.min, delaybetweenRAND_NMBS?.max, 100);

        try {
            await delay(delaybetween, controller.signal);
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            throw e;
        }

        if (!gameRunning) return;
        movingElement(SnakeLength, SnakeWidth, SnakeSpeed, direction, color, "snake");
    }
}

async function launchWallEnemy(WallLengthRAND_NMBS = 5, WallWidthRAND_NMBS = 1, WallSpeedRAND_NMBS = 1, direction = "right", delaybetweenRAND_NMBS = 1000, color = 0){
    const controller = new AbortController();
    abortControllers.push(controller);

    while (gameRunning) {
        let WallLength = randint(WallLengthRAND_NMBS?.min, WallLengthRAND_NMBS?.max); 
        let WallWidth = randint(WallWidthRAND_NMBS?.min, WallWidthRAND_NMBS?.max); 
        let WallSpeed = randint(WallSpeedRAND_NMBS?.min, WallSpeedRAND_NMBS?.max, 0.1); 
        let delaybetween = randint(delaybetweenRAND_NMBS?.min, delaybetweenRAND_NMBS?.max, 100);

        try {
            await delay(delaybetween, controller.signal);
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            throw e;
        }

        if (!gameRunning) return;
        movingElement(WallLength, WallWidth, WallSpeed, direction, color, "wall");
    }
}

async function launchSquareEnemy(SquareLengthRAND_NMBS = 5, SquareWidthRAND_NMBS = 1, SquareSpeedRAND_NMBS = 1, direction = "right", delaybetweenRAND_NMBS = 1000, color = 0) {
    const controller = new AbortController();
    abortControllers.push(controller);

    while (gameRunning) {
        let SquareLength = randint(SquareLengthRAND_NMBS?.min, SquareLengthRAND_NMBS?.max);
        let SquareWidth = randint(SquareWidthRAND_NMBS?.min, SquareWidthRAND_NMBS?.max);
        let SquareSpeed = randint(SquareSpeedRAND_NMBS?.min, SquareSpeedRAND_NMBS?.max, 0.1);
        let delaybetween = randint(delaybetweenRAND_NMBS?.min, delaybetweenRAND_NMBS?.max, 100);

        try {
            await delay(delaybetween, controller.signal);
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            throw e;
        }

        if (!gameRunning) return;
        movingElement(SquareLength, SquareWidth, SquareSpeed, direction, color, "square");
    }
}

async function launchAntiPlayerEnemy(AntiPlayerLengthRAND_NMBS = 5, AntiPlayerWidthRAND_NMBS = 1, AntiPlayerSpeedRAND_NMBS = 1, direction = "right", delaybetweenRAND_NMBS = 1000, color = 0) {
    const controller = new AbortController();
    abortControllers.push(controller);

    while (gameRunning) {
        let AntiPlayerLength = randint(AntiPlayerLengthRAND_NMBS?.min, AntiPlayerLengthRAND_NMBS?.max);
        let AntiPlayerWidth = randint(AntiPlayerWidthRAND_NMBS?.min, AntiPlayerWidthRAND_NMBS?.max);
        let AntiPlayerSpeed = randint(AntiPlayerSpeedRAND_NMBS?.min, AntiPlayerSpeedRAND_NMBS?.max, 0.1);
        let delaybetween = randint(delaybetweenRAND_NMBS?.min, delaybetweenRAND_NMBS?.max, 100);

        try {
            await delay(delaybetween, controller.signal);
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            throw e;
        }

        if (!gameRunning) return;
        movingElement(AntiPlayerLength, AntiPlayerWidth, AntiPlayerSpeed, direction, color, "antiPlayer");
    }
}

async function launchCircleEnemy(circleSpeedRAND_NMBS = 1, delaybetweenRAND_NMBS = 5000, color = 0) {
    const controller = new AbortController();
    abortControllers.push(controller);

    while (gameRunning) {
        let circleSpeed = randint(circleSpeedRAND_NMBS?.min, circleSpeedRAND_NMBS?.max);
        let delaybetween = randint(delaybetweenRAND_NMBS?.min, delaybetweenRAND_NMBS?.max);

        try {
            await delay(delaybetween, controller.signal);
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            throw e;
        }

        if (!gameRunning) return;
        expandingCircle(color, circleSpeed);
    }
}

function crossEnemy(size, count = 1, color = 1) {
    let positions = [], maxAttempts = 100;
    
    for (let i = 0; i < count; i++) {
        let x, y, attempts = 0;
        
        do {
            x = randint(4, gameSize - 4 - size);
            y = randint(4, gameSize - 4 - size);
            attempts++;
        } while (positions.some(([px, py]) => Math.abs(px - x) <= size + 1 && Math.abs(py - y) <= size + 1) && attempts < maxAttempts);
        
        if (attempts >= maxAttempts) {console.log("Cannot generate more crosses"); return };
        positions.push([x, y]);
        
        for (let j = 0; j < size; j++) {
            [[x + j, y + j], [x + j, y + size - j - 1]].forEach(([xi, yi]) => {
                if (xi >= 0 && xi < gameSize && yi >= 0 && yi < gameSize) {
                    cellsList[xi][yi]["color"] = color; cellsList[xi][yi]["type"] = "enemy"; cellsList[xi][yi]["opacity"] = 1;
                    Object.assign(cells[xi * gameSize + yi].style, {
                        backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].enemies.staticEnemy})`,
                        filter: `drop-shadow(0px 0px 10px ${enemyColorsList[color]})`,
                        opacity: cellsList[xi][yi]["opacity"]
                    });
                }
            });
        }
    }
}

function plusEnemy(size, count = 1, color = 1) {
    let positions = [], maxAttempts = 100;

    for (let i = 0; i < count; i++) {
        let x, y, attempts = 0;

        do {
            x = randint(4 + playerSize + size - 3, gameSize - (playerSize + 2 + size - 3) - size);
            y = randint(4 + playerSize + size - 3, gameSize - (playerSize + 2 + size - 3) - size);
            attempts++;
        } while (positions.some(([px, py]) => Math.abs(px - x) <= size + playerSize && Math.abs(py - y) <= size + playerSize) && attempts < maxAttempts);
        
        if (attempts >= maxAttempts) {console.log("Cannot generate more pluses"); return };

        positions.push([x, y]);

        for (let j = -Math.floor(size / 2); j <= Math.floor(size / 2); j++) {
            [[x + j, y], [x, y + j]].forEach(([xi, yi]) => {
                if (xi >= 0 && xi < gameSize && yi >= 0 && yi < gameSize) {
                    cellsList[xi][yi]["color"] = color; cellsList[xi][yi]["type"] = "enemy"; cellsList[xi][yi]["opacity"] = 1;
                    Object.assign(cells[xi * gameSize + yi].style, {
                        backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].enemies.staticEnemy})`,
                        filter: `drop-shadow(0px 0px 10px ${enemyColorsList[color]})`,
                        opacity: cellsList[xi][yi]["opacity"]
                    });
                }
            });
        }
    }
}

async function expandingCircle(color, speed = 1) {
    let x, y, attempts = 50;
    while (attempts > 0 && gameRunning) {
        x = randint(3 + playerSize * 2, gameSize - (4 + playerSize * 2));
        y = randint(3 + playerSize * 2, gameSize - (4 + playerSize * 2));
        if (cellsList[y][x]["type"] === "cubes" || cellsList[y][x]["type"] === "empty") break;
        attempts--;
    }
    
    const halfSize = gameSize / 2;
    const side = getSide(x, y, halfSize);
    
    const alertCell = cells[y * gameSize + x];
    const initialStyle = {
        filter: 'none',
        backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].enemies.circles.alert[1]})`,
        opacity: 1
    };
    Object.assign(alertCell.style, initialStyle);
    
    await handleBlinkEffect(x, y, initialStyle);
    
    restoreCellStyle(y, x);

    if (!gameRunning) return;

    let soundEffect = new Audio();
    playAudio(data["SoundEffects"]?.circleExplosion[randint(0, data["SoundEffects"]?.circleExplosion.length - 1)], soundEffectsVolume, soundEffect);

    let radius = 1;
    while (radius < gameSize && gameRunning) {
        await expandCircleOneStep(radius, x, y, side, color, speed);
        radius++;
    }
}

function getSide(x, y, halfSize) {
    if (x < halfSize && y < halfSize) {
        return (x < y) ? "right" : "down";
    } else if (x > halfSize && y > halfSize) {
        return (x < y) ? "left" : "up";
    }
    return (x > halfSize) ? "left" : (y > halfSize ? "up" : "right");
}

async function handleBlinkEffect(x, y, initialStyle) {
    let blinkDuration = 3000;
    let intervalTime = 300;
    let elapsed = 0;
    
    while (elapsed < blinkDuration && gameRunning) {
        let soundEffect = new Audio();
        playAudio(data["SoundEffects"]?.alertExplosion[randint(0, data["SoundEffects"]?.alertExplosion.length - 1)], soundEffectsVolume * 0.7, soundEffect);
        
        const cell = cells[y * gameSize + x];
        const isAlternate = cell.style.filter === initialStyle.filter;
        
        Object.assign(cell.style, {
            filter: isAlternate ? "drop-shadow(0px 0px 10px red)" : initialStyle.filter,
            backgroundImage: isAlternate ? 
                `url(${data[`textures_scale_${gameScale[0]}`].enemies.circles.alert[0]})` : 
                initialStyle.backgroundImage,
            opacity: initialStyle.opacity
        });

        await delay(intervalTime);
        elapsed += intervalTime;
        intervalTime = Math.max(50, intervalTime * 0.9);
    }
}

async function expandCircleOneStep(radius, centerX, centerY, side, color, speed) {
    for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
            const distance = Math.sqrt(i * i + j * j);
            const drawY = centerY + i;
            const drawX = centerX + j;
            
            if (!isValidPosition(drawY, drawX, distance, radius)) continue;
            
            const isValidSide = checkValidSide(i, j, side);
            if (!isValidSide) continue;

            if (distance >= radius - 0.5 && distance <= radius + 0.5) {
                drawCircleEdge(drawY, drawX, color);
            } else if (distance >= radius - 1.5 && distance < radius - 0.5) {
                restoreCell(drawY, drawX);
            }
        }
    }
    await delay(250 / speed);
}

function isValidPosition(y, x, distance, radius) {
    return y >= 0 && y < gameSize && 
           x >= 0 && x < gameSize && 
           cellsList[y][x]["type"] !== null && 
           cellsList[y][x]["type"] !== "border";
}

function checkValidSide(i, j, side) {
    const isOnRight = i > 0;
    const isOnLeft = i < 0;
    const isOnUp = j < 0;
    const isOnDown = j > 0;
    
    return side === "all" ||
           (side === "down" && isOnRight) ||
           (side === "up" && isOnLeft) ||
           (side === "left" && isOnUp) ||
           (side === "right" && isOnDown);
}

function drawCircleEdge(y, x, color) {
    checkLost(y, x, true);
    Object.assign(cells[y * gameSize + x].style, {
        backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].enemies.circles.enemy})`,
        filter: `drop-shadow(0px 0px 10px ${enemyColorsList[color]})`,
        opacity: 1
    });
}

function restoreCell(y, x) {
    const cell = cellsList[y][x];
    const cellStyle = cells[y * gameSize + x].style;
    
    if (cell["type"] === "enemy") {
        Object.assign(cellStyle, {
            backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].enemies.staticEnemy})`,
            filter: `drop-shadow(0px 0px 10px ${enemyColorsList[cell["color"]]})`,
            opacity: cell["opacity"]
        });
    } else if (cell["preView"]) {
        Object.assign(cellStyle, {
            backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].bonuses.uses.wallBonus.wallPreview})`,
            filter: 'none',
            opacity: 1
        });
    } else if (cell["corrupt"] === true) {
        Object.assign(cellStyle, {
            backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].decors.cubesCorrupted[cell["color"]]})`,
            filter: 'none',
            opacity: cell["opacity"]
        });
    } else if (cell["type"] === "cubes") {
        const textureUrl = cell["corrupt"] ? 
            data[`textures_scale_${gameScale[0]}`].decors.cubesCorrupted[cell["color"]] :
            data[`textures_scale_${gameScale[0]}`].decors.cubes[cell["color"]];
        Object.assign(cellStyle, {
            backgroundImage: `url(${textureUrl})`,
            filter: 'none',
            opacity: cell["opacity"]
        });
    } else if (isBonusCell(cell["type"])) {
        Object.assign(cellStyle, {
            backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].bonuses.lootable[cell["type"]]})`,
            filter: `drop-shadow(0px 0px 10px ${bonusColorsList[cell["color"]]})`,
            opacity: cell["opacity"]
        });
    } else if (cell["type"] === "border") {
        Object.assign(cellStyle, {
            backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].decors.border})`,
            filter: 'drop-shadow(0px 0px 10px white)',
            opacity: cell["opacity"]
        });
    } else {
        Object.assign(cellStyle, {
            backgroundImage: 'none',
            filter: 'none',
            opacity: cell["opacity"]
        });
    }
}

async function movingElementDiagonal(elementLength = 5, elementWidth = 1, speed = 1, direction = "upright", color = 0, type = "enemy") {
    const minMargin = Math.floor(gameSize * 0.1);
    const maxMargin = Math.floor(gameSize * 0.9);
    
    const getInitialPosition = (direction) => {
        switch (direction) {
            case 'upright': return { x: gameSize + randint(minMargin, maxMargin), y: -randint(minMargin, maxMargin) };
            case 'upleft': return { x: gameSize + randint(minMargin, maxMargin), y: gameSize + randint(minMargin, maxMargin) };
            case 'downright': return { x: -randint(minMargin, maxMargin), y: -randint(minMargin, maxMargin) };
            case 'downleft': return { x: -randint(minMargin, maxMargin), y: gameSize + randint(minMargin, maxMargin) };
        }
    };

    const moveElement = (pos, direction) => {
        switch (direction) {
            case 'upright': return { x: pos.x - 1, y: pos.y + 1 };
            case 'upleft': return { x: pos.x - 1, y: pos.y - 1 };
            case 'downright': return { x: pos.x + 1, y: pos.y + 1 };
            case 'downleft': return { x: pos.x + 1, y: pos.y - 1 };
        }
    };

    let position = getInitialPosition(direction);

    while (gameRunning) {
        let nextPos = moveElement(position, direction);

        for (let i = 0; i < elementLength; i++) {
            clearCell(position.x, position.y, i, direction);
        }
        position = nextPos;

        for (let i = 0; i < elementLength; i++) {
            drawCell(position.x, position.y, i, direction, type, color);
        }

        await delay(250 / speed);
    }
}

function clearCell(x, y, offset, direction) {
    let clearX = x + (direction.includes('up') ? -offset : offset);
    let clearY = y + (direction.includes('left') ? -offset : offset);
    
    if (clearX >= 0 && clearX < gameSize && clearY >= 0 && clearY < gameSize) {
        restoreCellStyle(clearX, clearY);
    }
}

function drawCell(x, y, offset, direction, type, color) {
    let drawX = x + (direction.includes('up') ? -offset : offset);
    let drawY = y + (direction.includes('left') ? -offset : offset);
    if (direction === "upright") textureUrl = data[`textures_scale_${gameScale[0]}`].enemies.diagonalSnakes.upright;
    else if (direction === "upleft") textureUrl = data[`textures_scale_${gameScale[0]}`].enemies.diagonalSnakes.upleft;
    else if (direction === "downright") textureUrl = data[`textures_scale_${gameScale[0]}`].enemies.diagonalSnakes.downright;
    else if (direction === "downleft") textureUrl = data[`textures_scale_${gameScale[0]}`].enemies.diagonalSnakes.downleft;
    if (drawX >= 0 && drawX < gameSize && drawY >= 0 && drawY < gameSize) {
        if (type === "enemy") {
            checkLost(drawX, drawY, true);
            Object.assign(cells[drawX * gameSize + drawY].style, {
                backgroundImage:`url(${textureUrl})`,
                filter: `drop-shadow(0px 0px 10px ${enemyColorsList[color]})`,
                opacity: 1
            });
        }
    }
}

function isBonusCell(type) {
    return type === "clickExplosionBonus" || 
           type === "shootASnakeBonus" || 
           type === "clickTeleportation" ||
           type === "clickWall";
}

function getEnemyStyle(cellData) {
    return {
        backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].enemies.staticEnemy})`,
        filter: `drop-shadow(0px 0px 10px ${enemyColorsList[cellData.color]})`,
        opacity: cellData.opacity
    };
}

function getBonusStyle(cellData) {
    return {
        backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].bonuses.lootable[cellData.type]})`,
        filter: `drop-shadow(0px 0px 10px ${bonusColorsList[cellData.color]})`,
        opacity: cellData.opacity
    };
}

function getDefaultStyle(cellData) {
    if (!data || !gameScale || !data[`textures_scale_${gameScale[0]}`]) {
        console.warn(`Textures non disponibles pour l'échelle ${gameScale?.[0]}`);
        return {
            filter: "none",
            backgroundImage: "none",
            opacity: cellData.opacity
        };
    }

    const textures = data[`textures_scale_${gameScale[0]}`];

    if (cellData.wall === true) {
        return {
            filter: "drop-shadow(0px 0px 10px white)",
            backgroundImage: `url(${textures.bonuses.uses.wallBonus.wall})`,
            opacity: cellData.opacity
        };
    } else if (cellData.preView === true) {
        return {
            filter: "none",
            backgroundImage: `url(${textures.bonuses.uses.wallBonus.wallPreview})`,
            opacity: 1
        };
    } else if (cellData.type === "border") {
        return {
            filter: `drop-shadow(0px 0px 10px white)`,
            backgroundImage: `url(${textures.decors.border})`,
            opacity: cellData.opacity
        };
    } else if (cellData.type === "cubes" && cellData.corrupt !== true) {
        return {
            filter: `none`,
            backgroundImage: `url(${textures.decors.cubes[cellData.color]})`,
            opacity: cellData.opacity
        };
    } else if (cellData.type === "cubes" && cellData.corrupt === true && cellData.preView !== true) {
        return {
            filter: `none`,
            backgroundImage: `url(${textures.decors.cubesCorrupted[cellData.color]})`,
            opacity: cellData.opacity
        };
    } else if (cellData.type === "enemy") {
        return {
            filter: `drop-shadow(0px 0px 10px ${enemyColorsList[cellData.color]})`,
            backgroundImage: `url(${textures.enemies.staticEnemy})`,
            opacity: cellData.opacity
        };
    } else {
        return {
            filter: "none",
            backgroundImage: "none",
            opacity: cellData.opacity
        };
    }
}

function restoreCellStyle(x, y) {
    const cell = cells[x * gameSize + y];
    const cellData = cellsList[x][y];
    
    if (cellData.type === "enemy") {
        Object.assign(cell.style, getEnemyStyle(cellData));
    } else if (isBonusCell(cellData.type)) {
        Object.assign(cell.style, getBonusStyle(cellData));
    } else {
        Object.assign(cell.style, getDefaultStyle(cellData));
    }
}

async function launchDiagonalSnakeEnemy(SnakeLengthRAND_NMBS = 5, SnakeWidthRAND_NMBS = 1, SnakeSpeedRAND_NMBS = 1, direction = ["upright", "upleft", "downright", "downleft"], delaybetweenRAND_NMBS = 1000, color = 0) {
    const controller = new AbortController();
    abortControllers.push(controller);

    while (gameRunning) {
        let SnakeLength = randint(SnakeLengthRAND_NMBS?.min, SnakeLengthRAND_NMBS?.max); 
        let SnakeWidth = randint(SnakeWidthRAND_NMBS?.min, SnakeWidthRAND_NMBS?.max); 
        let SnakeSpeed = randint(SnakeSpeedRAND_NMBS?.min, SnakeSpeedRAND_NMBS?.max, 0.1); 
        let delaybetween = randint(delaybetweenRAND_NMBS?.min, delaybetweenRAND_NMBS?.max, 100);
        let randomDirection = direction[Math.floor(Math.random() * direction.length)];

        try {
            await delay(delaybetween, controller.signal);
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            throw e;
        }

        if (!gameRunning) return;
        movingElementDiagonal(SnakeLength, SnakeWidth, SnakeSpeed, randomDirection, color);
    }
}

async function movingElement(elementLength, elementWidth, speed, direction, color, type = "enemy", elementY = null, elementX = null) {
    if (!["snake", "wall", "square", "antiPlayer"].includes(type)) {
        let soundEffect = new Audio();
        playAudio(data["SoundEffects"]?.shootALaser[randint(0, data["SoundEffects"]?.shootALaser.length - 1)], soundEffectsVolume, soundEffect);
    }

    direction = Array.isArray(direction) ? direction[randint(0, direction.length - 1, 1)] : direction;
    
    if (elementX === null || elementY === null) {
        const isVertical = direction === 'up' || direction === 'down';
        elementY = isVertical ? randint(3, gameSize - elementWidth - 3, 1) : (direction === 'left' ? gameSize : -elementLength);
        elementX = isVertical ? (direction === 'up' ? gameSize : -elementLength) : randint(3, gameSize - elementWidth - 3, 1);
    }

    const isInBounds = (x, y) => x >= 0 && x < gameSize && y >= 0 && y < gameSize;
    const getCoordinates = (baseX, baseY, w, i, isVertical) => ({
        x: isVertical ? baseX + i : baseX + w,
        y: isVertical ? baseY + w : baseY + i
    });
    const updatePosition = () => {
        if (direction === 'up') elementX--;
        else if (direction === 'down') elementX++;
        else if (direction === 'left') elementY--;
        else if (direction === 'right') elementY++;
    };

    const getTextureUrl = (direction, type) => {
        if (type === "antiPlayer") return data[`textures_scale_${gameScale[0]}`].enemies.antiPlayer[`world${playerColor + 1}`];
        if (type === "snake") return data[`textures_scale_${gameScale[0]}`].enemies.snakes[direction];
        if (type === "wall") return data[`textures_scale_${gameScale[0]}`].enemies.walls[direction];
        if (type === "square") return data[`textures_scale_${gameScale[0]}`].enemies.squares;
        return null;
    };

    while (gameRunning && (
        (direction === 'up' && elementX + elementLength > 0) ||
        (direction === 'down' && elementX < gameSize) ||
        (direction === 'left' && elementY + elementLength > 0) ||
        (direction === 'right' && elementY < gameSize)
    )) {
        const isVertical = direction === 'up' || direction === 'down';
        let nextX = elementX + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);
        let nextY = elementY + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);
        let willHitWall = false;
        let eat = false;

        for (let w = 0; w < elementWidth; w++) {
            for (let i = 0; i < elementLength; i++) {
                const {x: clearX, y: clearY} = getCoordinates(elementX, elementY, w, i, isVertical);
                if (isInBounds(clearX, clearY)) {
                    restoreCellStyle(clearX, clearY);
                    if (type === "antiPlayer" && cellsList[clearX][clearY]["type"] === "cubes") {
                        cellsList[clearX][clearY]["corrupt"] = true;
                        Object.assign(cells[clearX * gameSize + clearY].style, {
                            backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`].decors.cubesCorrupted[cellsList[clearX][clearY]["color"]]})`,
                            filter: `none`,
                            opacity: cellsList[clearX][clearY]["opacity"]
                        });
                    } else if (!["enemy", "snake", "wall", "square", "antiPlayer"].includes(type) && cellsList[clearX][clearY]["type"] === "cubes") {
                        cubesRemaining--;
                        document.getElementById("cubesRemainingValue").textContent = parseInt(document.getElementById("cubesRemainingValue").textContent) - 1;
                        document.getElementById("cubesCollectedValue").textContent = parseInt(document.getElementById("cubesCollectedValue").textContent) + 1;
                        document.getElementById("totalCubesCollectedValue").textContent = parseInt(document.getElementById("totalCubesCollectedValue").textContent) + 1;
                        cellsList[clearX][clearY]["type"] = "empty";
                        cellsList[clearX][clearY]["color"] = 10;
                        Object.assign(cells[clearX * gameSize + clearY].style, {
                            backgroundImage: "none",
                            filter: "none",
                            opacity: cellsList[clearX][clearY]["opacity"]
                        });
                    }
                }
            }
        }

        for (let w = 0; w < elementWidth && !willHitWall; w++) {
            for (let i = 0; i < elementLength; i++) {
                const {x: checkX, y: checkY} = getCoordinates(nextX, nextY, w, i, isVertical);
                if (isInBounds(checkX, checkY) && 
                    cellsList[checkX][checkY]["type"] === "border" && 
                    cellsList[checkX][checkY]["wall"] === true && 
                    ["snake", "wall", "circle", "antiPlayer"].includes(type)) {
                    willHitWall = true;
                    for (let w2 = 0; w2 < elementWidth; w2++) {
                        for (let i2 = 0; i2 < elementLength; i2++) {
                            const {x: currentX, y: currentY} = getCoordinates(elementX, elementY, w2, i2, isVertical);
                            if (isInBounds(currentX, currentY)) {
                                const cell = cells[currentX * gameSize + currentY];
                                cell.style.transition = "all 0.3s";
                                cell.style.opacity = "0";
                                setTimeout(() => {
                                    cell.style.transition = "none";
                                    restoreCellStyle(currentX, currentY);
                                }, 300);
                            }
                        }
                    }
                    break;
                }
            }
        }

        if (willHitWall) {
            let soundEffect = new Audio();
            playAudio(data["SoundEffects"]?.enemyDies[randint(0, data["SoundEffects"]?.enemyDies.length - 1)], soundEffectsVolume * 0.7, soundEffect);
            return;
        }

        updatePosition();

        for (let w = 0; w < elementWidth; w++) {
            for (let i = 0; i < elementLength; i++) {
                const {x: drawX, y: drawY} = getCoordinates(elementX, elementY, w, i, isVertical);
                if (!isInBounds(drawX, drawY)) continue;

                if (cellsList[drawX][drawY]["type"] === "cubes" && 
                    !cellsList[drawX][drawY]["corrupt"] && 
                    type === "antiPlayer") {
                    eat = true;
                }

                if (["enemy", "snake", "wall", "square", "antiPlayer"].includes(type)) {
                    checkLost(drawX, drawY, true);
                    const textureUrl = getTextureUrl(direction, type);
                    Object.assign(cells[drawX * gameSize + drawY].style, {
                        backgroundImage: `url(${textureUrl})`,
                        filter: `drop-shadow(0px 0px 10px ${type === "antiPlayer" ? "purple" : enemyColorsList[color]})`,
                        opacity: 1
                    });
                } else if (cellsList[drawX][drawY]["type"] !== "player") {
                    const bonusTextureUrl = data[`textures_scale_${gameScale[0]}`].bonuses.uses.laserBonus[isVertical ? "up_or_down" : "left_or_right"];
                    Object.assign(cells[drawX * gameSize + drawY].style, {
                        backgroundImage: `url(${bonusTextureUrl})`,
                        filter: `drop-shadow(0px 0px 10px ${bonusColorsList[0]})`,
                        opacity: 1
                    });
                }
            }
        }

        if (eat) {
            let soundEffect = new Audio();
            playAudio(data["SoundEffects"]?.eatingCube[randint(0, data["SoundEffects"]?.eatingCube.length - 1)], soundEffectsVolume, soundEffect);
        }

        await delay(250 / speed);
    }
}



