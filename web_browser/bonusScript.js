async function clickExplosion(event) {
    if (clickExplosionCount > 0 && gameRunning) {

        const clickX = event.clientX;
        const clickY = event.clientY;

        const cells = gameCanvas.getElementsByTagName('td');
        let closestCell = null;
        let minDistance = Infinity;

        Array.from(cells).forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const cellCenterX = rect.left + rect.width / 2;
            const cellCenterY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(cellCenterX - clickX, 2) + Math.pow(cellCenterY - clickY, 2));
            
            if (distance < minDistance) {
                minDistance = distance;
                closestCell = cell;
            }
        });

        if (!closestCell || !closestCell.parentElement) return;

        const rowIndex = closestCell.parentElement.rowIndex;
        const colIndex = closestCell.cellIndex;
        if (cellsList[rowIndex][colIndex]["type"] !== "cubes" || cellsList[rowIndex][colIndex]["corrupt"] !== false) return;

        let cellsToClear = [];

        let soundEffect = new Audio(); playAudio(data["SoundEffects"]?.clickExplosion[randint(0, data["SoundEffects"]?.clickExplosion.length - 1)], soundEffectsVolume, soundEffect)

        for (let i = -bonus?.clickExplosion?.radius; i <= bonus?.clickExplosion?.radius; i++) {
            for (let j = -bonus?.clickExplosion?.radius; j <= bonus?.clickExplosion?.radius; j++) {
                if (gameRunning) {
                    let newRow = rowIndex + i, newCol = colIndex + j;
                    let dist = Math.hypot(i, j);
                    if (
                        dist <= bonus?.clickExplosion?.radius && 
                        newRow >= 0 && newCol >= 0 && 
                        newRow < gameSize && newCol < gameSize &&
                        cellsList[newRow][newCol]["type"] === "cubes" &&
                        !isEnemyTexture(cells[newRow * gameSize + newCol].style.backgroundImage) &&
                        cellsList[newRow][newCol]["corrupt"] === false &&
                        !Object.values(data[`textures_scale_${gameScale[0]}`].player).some(playerTexture => cells[newRow * gameSize + newCol].style.backgroundImage === `url("${playerTexture}")`)
                    ) {
                        cellsToClear.push({ row: newRow, col: newCol, delay: dist * 10 });
                    }
                }
            }
        }


        clickExplosionCount--;
        document.getElementById("explosionBonusValue").textContent = clickExplosionCount;
        if (clickExplosionCount === 0) { gameCanvas.style.cursor = "not-allowed"; }

        for (const { row, col, delay } of cellsToClear.sort((a, b) => a.delay - b.delay)) {
            if (gameRunning) {
                await new Promise(res => setTimeout(res, delay));
                if (cellsList[row][col]["type"] === "cubes") {
                    cubesRemaining--; 
                    document.getElementById("cubesRemainingValue").textContent = parseInt(document.getElementById("cubesRemainingValue").textContent) - 1;
                    document.getElementById("cubesCollectedValue").textContent = parseInt(document.getElementById("cubesCollectedValue").textContent) + 1;
                    document.getElementById("totalCubesCollectedValue").textContent = parseInt(document.getElementById("totalCubesCollectedValue").textContent) + 1;
                }
                cellsList[row][col] = { type: "empty", color: 10, corrupt: false};
                if (!isEnemyTexture(cells[row * gameSize + col].style.backgroundImage) && !Object.values(data[`textures_scale_${gameScale[0]}`].player).some(playerTexture => cells[row * gameSize + col].style.backgroundImage === `url("${playerTexture}")`)) {
                    Object.assign(cells[row * gameSize + col].style, {
                        backgroundImage: "none",
                        filter: "none",
                    });
                }
            }
        }
        checkWIn();
    }
}


async function clickTeleportation(event) {
    if (clickTeleportationCount > 0 && gameRunning) {
        
        const clickX = event.clientX;
        const clickY = event.clientY;
        
        const cells = gameCanvas.getElementsByTagName('td');
        let closestCell = null;
        let minDistance = Infinity;

        Array.from(cells).forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const cellCenterX = rect.left + rect.width / 2;
            const cellCenterY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(cellCenterX - clickX, 2) + Math.pow(cellCenterY - clickY, 2));
            
            if (distance < minDistance) {
                minDistance = distance;
                closestCell = cell;
            }
        });

        if (!closestCell || !closestCell.parentElement) return;

        const rowIndex = closestCell.parentElement.rowIndex;
        const colIndex = closestCell.cellIndex;


        if ((rowIndex >= 3 && rowIndex <= gameSize - (3 + playerSize)) && (colIndex >= 3 && colIndex <= gameSize - (3 + playerSize))) {
            if (cellsList[rowIndex][colIndex]["type"] !== "cubes" && cellsList[rowIndex][colIndex]["type"] !== "empty") return;
            for (let i = 0; i < playerSize; i++) {
                for (let j = 0; j < playerSize; j++) {
                    if (cellsList[rowIndex + i][colIndex + j]["type"] === "enemy" || isEnemyTexture(cells[(rowIndex + i) * gameSize + (colIndex + j)].style.backgroundImage)) {
                        return;
                    }
                }
            }
            let soundEffect = new Audio(); playAudio(data["SoundEffects"]?.teleportation[randint(0, data["SoundEffects"]?.teleportation.length - 1)], soundEffectsVolume, soundEffect)
            removePlayer(playerSize, x, y);
            x = rowIndex;
            y = colIndex;
            drawPlayer(playerColor, playerSize, x, y);
            clickTeleportationCount--;
            document.getElementById("teleportationBonusValue").textContent = clickTeleportationCount;
            if (clickTeleportationCount === 0) {
                gameCanvas.style.cursor = "not-allowed";
            }
        }
    }
}


function spawnBonusCubes(bonusCount, bonusColor, type) {
    let generatedBonusCount = 0;
    
    for (let i = 0; i < bonusCount; i++) {
        let bonusX, bonusY, attempts = 0;

        while (attempts < 50) {
            bonusX = randint(3, gameSize - 3);
            bonusY = randint(3, gameSize - 3);
            attempts++;

            let spaceClear = true;
            const minDistance = 2;
            for (let dx = -minDistance; dx <= minDistance; dx++) {
                for (let dy = -minDistance; dy <= minDistance; dy++) {
                    const checkX = bonusX + dx;
                    const checkY = bonusY + dy;

                    if (
                        checkX >= 0 && checkX < gameSize &&
                        checkY >= 0 && checkY < gameSize &&
                        (cellsList[checkX][checkY]["type"] === type || cellsList[checkX][checkY]["type"] === "player")
                    ) {
                        spaceClear = false;
                        break;
                    }
                }
                if (!spaceClear) break;
            }

            if (cellsList[bonusX][bonusY]["type"] === "cubes" && spaceClear) {
                cellsList[bonusX][bonusY] = { "type": type, "color": bonusColor, "opacity": 1, "typeSecondary": "bonus"};
                Object.assign(cells[bonusX * gameSize + bonusY].style, {
                    backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`]["bonuses"]["lootable"][type]})`,
                    filter: `drop-shadow(0px 0px 10px ${bonusColorsList[bonusColor]})`,
                    opacity: 1
                });
                generatedBonusCount++;
                break;
            }
        }

        if (attempts >= 50) {
            break;
        }
    }
}

let firstClickPos = null;

const WALL_CELL_STYLE = {
    backgroundImage: null,
    opacity: 1,
    transition: "all 0.2s"
};

const RESET_CELL_STYLE = {
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    transition: 'none'
};

function resetCell(row, col, cells, cellsList, gameSize, data, gameScale) {
    if (!cellsList[row]?.[col]?.preView) return;

    cellsList[row][col]["preView"] = false;
    const cell = cells[row * gameSize + col];
    const isCorrupt = cellsList[row][col]["corrupt"];
    const textureScale = `textures_scale_${gameScale[0]}`;
    const textureType = isCorrupt ? "cubesCorrupted" : "cubes";
    const textureUrl = data[textureScale]?.["decors"]?.[textureType]?.[cellsList[row][col]["color"]];
    
    Object.assign(cell.style, {
        ...RESET_CELL_STYLE,
        backgroundImage: textureUrl ? `url("${textureUrl}")` : 'none',
        opacity: cellsList[row][col]["opacity"] || 1
    });
}

function setWallPreview(row, col, cells, cellsList, gameSize, data, gameScale) {
    if (!cellsList[row]?.[col] || 
        (cellsList[row][col]["type"] !== "cubes" && 
         cellsList[row][col]["type"] !== "empty")) return;

    cellsList[row][col]["preView"] = true;
    const previewUrl = data[`textures_scale_${gameScale[0]}`]?.["bonuses"]?.["uses"]?.["wallBonus"]?.["wallPreview"];
    
    Object.assign(cells[row * gameSize + col].style, {
        ...WALL_CELL_STYLE,
        backgroundImage: previewUrl ? `url("${previewUrl}")` : 'none'
    });
}

function updatePreviewCells(baseRow, baseCol, maxLength, operation, cells, cellsList, gameSize, data, gameScale) {
    for (let dx = -maxLength; dx <= maxLength; dx++) {
        for (let dy = -maxLength; dy <= maxLength; dy++) {
            const isOnMainLine = dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy);
            
            const distance = Math.hypot(dx, dy);
            if (isOnMainLine && distance < maxLength) {
                const newRow = baseRow + dx;
                const newCol = baseCol + dy;
                operation(newRow, newCol, cells, cellsList, gameSize, data, gameScale);
            }
        }
    }
}

async function clickWall(event) {
    if (!gameRunning || clickWallCount <= 0) return;
    
    const maxWallLength = data[`lvl${lvlNmb}`]?.bonus?.clickWall?.size;
    const cells = gameCanvas.getElementsByTagName('td');
    
    const clickX = event.clientX;
    const clickY = event.clientY;
    const closestCell = Array.from(cells).reduce((closest, cell) => {
        const rect = cell.getBoundingClientRect();
        const distance = Math.hypot(
            rect.left + rect.width/2 - clickX,
            rect.top + rect.height/2 - clickY
        );
        return distance < closest.distance ? {cell, distance} : closest;
    }, {cell: null, distance: Infinity}).cell;

    if (!closestCell?.parentElement) return;

    const rowIndex = closestCell.parentElement.rowIndex;
    const colIndex = closestCell.cellIndex;

    if ((cellsList[rowIndex][colIndex]["type"] !== "cubes" && 
         cellsList[rowIndex][colIndex]["type"] !== "empty") || 
        (cellsList[rowIndex][colIndex]["type"] === "cubes" && 
         cellsList[rowIndex][colIndex]["corrupt"] !== false)) return;

    if (!firstClickPos) {
        firstClickPos = { row: rowIndex, col: colIndex };
        Object.assign(cells[rowIndex * gameSize + colIndex].style, {
            backgroundColor: "#FFFFFF",
            opacity: "1",
            transition: "all 0.2s"
        });

        updatePreviewCells(rowIndex, colIndex, maxWallLength, setWallPreview, cells, cellsList, gameSize, data, gameScale);

        let soundEffect = new Audio();
        playAudio(data["SoundEffects"]?.wallFirstClick[randint(0, data["SoundEffects"]?.wallFirstClick.length - 1)], soundEffectsVolume, soundEffect);
        return;
    }

    const resetFirstClickAndPreviews = () => {
        const firstCell = cells[firstClickPos.row * gameSize + firstClickPos.col];
        Object.assign(firstCell.style, {
            backgroundColor: "transparent",
            boxShadow: "0 0 0",
            opacity: cellsList[firstClickPos.row][firstClickPos.col]["opacity"] || 1,
            transition: "none",
            border: "none",
            backgroundImage: cellsList[firstClickPos.row][firstClickPos.col]["type"] !== "empty" ? 
                `url("${data[`textures_scale_${gameScale[0]}`]["decors"]["cubes"][cellsList[firstClickPos.row][firstClickPos.col]["color"]]}")` : 
                'none'
        });
        updatePreviewCells(firstClickPos.row, firstClickPos.col, maxWallLength, resetCell, cells, cellsList, gameSize, data, gameScale);
        firstClickPos = null;
    };

    if (firstClickPos.row === rowIndex && firstClickPos.col === colIndex) {
        resetFirstClickAndPreviews();
        return;
    }

    const distance = Math.hypot(rowIndex - firstClickPos.row, colIndex - firstClickPos.col);
    if (distance > maxWallLength) {
        resetFirstClickAndPreviews();
        return;
    }

    const steps = Math.max(Math.abs(rowIndex - firstClickPos.row), Math.abs(colIndex - firstClickPos.col));
    const deltaRow = (rowIndex - firstClickPos.row) / steps;
    const deltaCol = (colIndex - firstClickPos.col) / steps;

    for (let i = 0; i <= steps; i++) {
        const currentRow = Math.round(firstClickPos.row + deltaRow * i);
        const currentCol = Math.round(firstClickPos.col + deltaCol * i);
        
        if (currentRow >= 0 && currentRow < gameSize && currentCol >= 0 && currentCol < gameSize) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const checkRow = currentRow + dr;
                    const checkCol = currentCol + dc;
                    
                    if (checkRow >= 0 && checkRow < gameSize && checkCol >= 0 && checkCol < gameSize) {
                        const cell = cells[checkRow * gameSize + checkCol];
                        if (cellsList[checkRow][checkCol]["type"] === "enemy" || 
                            isEnemyTexture(cell.style.backgroundImage) ||
                            Object.values(data[`textures_scale_${gameScale[0]}`].player)
                                  .some(playerTexture => cell.style.backgroundImage === `url("${playerTexture}")`)) {
                            resetFirstClickAndPreviews();
                            return;
                        }
                    }
                }
            }
        }
    }

    let soundEffect = new Audio();
    playAudio(data["SoundEffects"]?.wallSecondClick[randint(0, data["SoundEffects"]?.wallSecondClick.length - 1)], soundEffectsVolume, soundEffect);

    for (let i = 0; i <= steps; i++) {
        const currentRow = Math.round(firstClickPos.row + deltaRow * i);
        const currentCol = Math.round(firstClickPos.col + deltaCol * i);
        
        if (currentRow >= 0 && currentRow < gameSize && currentCol >= 0 && currentCol < gameSize) {
            const currentCell = cells[currentRow * gameSize + currentCol];
            
            if (cellsList[currentRow][currentCol]["type"] === "cubes" || 
                cellsList[currentRow][currentCol]["typeSecondary"] === "bonus") {
                cubesRemaining--;
                updateCubesCounters();
            }

            updatePreviewCells(currentRow, currentCol, maxWallLength, resetCell, cells, cellsList, gameSize, data, gameScale);

            currentCell.style.transition = "all 0.2s";
            currentCell.style.backgroundColor = "#FFFFFF";

            if (i === 0) {
                let wallSound = new Audio();
                playAudio(data["SoundEffects"]?.creatingWall[randint(0, data["SoundEffects"]?.creatingWall.length - 1)], 
                         soundEffectsVolume * 0.7, wallSound);
            }

            setTimeout(() => {
                cellsList[currentRow][currentCol] = { 
                    type: "border",
                    color: 0,
                    corrupt: false,
                    wall: true 
                };
                
                Object.assign(currentCell.style, {
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    backgroundImage: `url(${data[`textures_scale_${gameScale[0]}`]["bonuses"]["uses"]["wallBonus"]["wall"]})`,
                    filter: "drop-shadow(0px 0px 10px white)",
                    opacity: 1
                });
            }, 200);
        }
    }

    firstClickPos = null;
    clickWallCount--;
    document.getElementById("wallBonusValue").textContent = clickWallCount;
    if (clickWallCount === 0) {
        gameCanvas.style.cursor = "not-allowed";
    }
}

function updateCubesCounters() {
    document.getElementById("cubesRemainingValue").textContent = cubesRemaining;
    document.getElementById("cubesCollectedValue").textContent = 
        parseInt(document.getElementById("cubesCollectedValue").textContent) + 1;
    document.getElementById("totalCubesCollectedValue").textContent = 
        parseInt(document.getElementById("totalCubesCollectedValue").textContent) + 1;
}