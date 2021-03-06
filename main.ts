namespace SpriteKind {
    export const Guess = SpriteKind.create()
    export const UI = SpriteKind.create()
}
// Formats the guess squares showing if they match. (green, yellow backgrounds)
function attemptValidateSymbols () {
    for (let index = 0; index <= 5; index++) {
        if (answer.indexOf(guessesCurrent[index]) >= 0) {
            if (guessesCurrent[index] == answer[index]) {
                tiles.setTileAt(tiles.getTileLocation(index + 2, guessesAttempt), assets.tile`squaregreygreen`)
                changeBackgroundColorForNewNumberBar(guessesCurrent[index], 7)
            } else {
                tiles.setTileAt(tiles.getTileLocation(index + 2, guessesAttempt), assets.tile`squaregreyyellow`)
                changeBackgroundColorForNewNumberBar(guessesCurrent[index], 5)
            }
        } else {
            tiles.setTileAt(tiles.getTileLocation(index + 2, guessesAttempt), assets.tile`squaregrey`)
            changeBackgroundColorForNewNumberBar(guessesCurrent[index], 11)
        }
    }
    updateNewNumberBar()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    updateNewNumberBarSelector(-1)
})
// temporary for testing
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    game.splash(answer)
})
function setupAnswer () {
    generateAnswer()
    while (!(validTargetAnswer())) {
        generateAnswer()
    }
    targetAnswerUI = textsprite.create("Target: " + answerTarget, 0, 15)
    targetAnswerUI.x = scene.screenWidth() / 2
    targetAnswerUI.y = 8
}
function setupUI () {
    selector = sprites.create(assets.image`squareSelection`, SpriteKind.Player)
    for (let index2 = 0; index2 <= 5; index2++) {
        tiles.setTileAt(tiles.getTileLocation(index2 + 2, guessesAttempt), assets.tile`squareblack`)
    }
    textEnter = sprites.create(assets.image`textEnd`, SpriteKind.UI)
    grid.place(textEnter, tiles.getTileLocation(8, guessesAttempt))
}
function selectorUpdatePosition (col: number) {
    selectorColCurrent = Math.constrain(col, selectorColMin, selectorColMax)
    grid.place(selector, tiles.getTileLocation(selectorColCurrent, guessesAttempt))
}
function attemptValidateMath () {
    return eval.evalArrayMath(guessesCurrent) == answerTarget
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (grid.spriteCol(selector) == grid.spriteCol(textEnter)) {
        attemptSubmitted()
    } else {
        guessesCurrent[grid.spriteCol(selector) - 2] = numberBarItems[numberBarCurrentIndex]
        for (let sprite of grid.getSprites(grid.getLocation(selector))) {
            if (sprite.kind() == SpriteKind.Text) {
                sprite.destroy()
                createGuessSprite(grid.spriteCol(selector) - 2, numberBarItems[numberBarCurrentIndex])
            }
        }
        selectorUpdatePosition(selectorColCurrent + 1)
    }
})
function startNextAttempt () {
    guessesAttempt += 1
    grid.place(textEnter, tiles.getTileLocation(8, guessesAttempt))
    selectorUpdatePosition(selectorColMin)
    for (let index3 = 0; index3 <= 5; index3++) {
        tiles.setTileAt(tiles.getTileLocation(index3 + 2, guessesAttempt), assets.tile`squareblack`)
    }
    setupGuesses()
}
function validTargetAnswer () {
    answerTargetMin = 0
    answerTargetMax = 200
    if (answerTarget < answerTargetMin || answerTarget > answerTargetMax) {
        return false
    } else if (answerTarget != Math.trunc(answerTarget)) {
        return false
    } else if (answer.indexOf("0") >= 0 && (answer.indexOf("0") == 0 || [
    "/",
    "*",
    "-",
    "+"
    ].indexOf(answer[answer.indexOf("0") - 1]) >= 0)) {
        return false
    } else {
        return true
    }
}
function setupGuesses () {
    if (guessesAttempt > 1) {
        for (let index = 0; index <= guessesCurrent.length - 1; index++) {
            if (!(guessesCurrent[index] == answer[index])) {
                guessesCurrent[index] = " "
            }
        }
    } else {
        guessesCurrent = [
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
        ]
    }
    for (let col = 0; col <= 5; col++) {
        guessSpriteTemp = textsprite.create(" ", 0, 15)
        sprites.setDataNumber(guessSpriteTemp, "attempt", guessesAttempt)
        sprites.setDataNumber(guessSpriteTemp, "position", col)
        guessSpriteTemp.setText(guessesCurrent[col])
        grid.place(guessSpriteTemp, tiles.getTileLocation(col + 2, guessesAttempt))
    }
    attemptValidateSymbols()
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    selectorUpdatePosition(selectorColCurrent - 1)
})
function attemptSubmitted () {
    if (!(attemptValidateMath())) {
        game.splash("Guess must equal  " + answerTarget)
    } else {
        attemptValidateSymbols()
        if (attemptValidateAnswer()) {
            game.splash("You win!")
        } else {
            if (guessesAttempt < 6) {
                startNextAttempt()
            } else {
                game.splash("You didn't win. Try again.")
            }
        }
    }
}
function setupNumberBar () {
    numberBarItems = [
    " ",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "*",
    "/"
    ]
    numberBarCurrentIndex = 2
    numberBarSpriteCurrent = textsprite.create(numberBarItems[numberBarCurrentIndex], 0, 8)
    numberBarSpritePrev1 = textsprite.create(numberBarItems[numberBarGetItemIndex(-1)], 0, 11)
    numberBarSpritePrev2 = textsprite.create(numberBarItems[numberBarGetItemIndex(-2)], 0, 12)
    numberBarSpriteNext1 = textsprite.create(numberBarItems[numberBarGetItemIndex(1)], 0, 11)
    numberBarSpriteNext2 = textsprite.create(numberBarItems[numberBarGetItemIndex(2)], 0, 12)
    if (guessesAttempt <= 1) {
        numberBarSpritePrev2.setFlag(SpriteFlag.Ghost, true)
    } else {
        numberBarSpritePrev2.setFlag(SpriteFlag.Ghost, false)
    }
    if (guessesAttempt >= 6) {
        numberBarSpriteNext2.setFlag(SpriteFlag.Ghost, true)
    } else {
        numberBarSpriteNext2.setFlag(SpriteFlag.Ghost, false)
    }
    grid.place(numberBarSpriteCurrent, tiles.getTileLocation(0, guessesAttempt))
    grid.place(numberBarSpritePrev1, tiles.getTileLocation(0, guessesAttempt - 1))
    grid.place(numberBarSpritePrev2, tiles.getTileLocation(0, guessesAttempt - 2))
    grid.place(numberBarSpriteNext1, tiles.getTileLocation(0, guessesAttempt + 1))
    grid.place(numberBarSpriteNext2, tiles.getTileLocation(0, guessesAttempt + 2))
    numberBarUpdate()
}
function setupNewNumberBar () {
    numberBarItems = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "*",
    "/"
    ]
    numberBarSpriteBackground = []
    for (let index = 0; index < numberBarItems.length; index++) {
        numberBarSpriteBackground.push(0)
    }
    numberBarSprites = []
    updateNewNumberBar()
    setupNewNumberBarSelector()
}
function numberBarGetItemIndex (offset: number) {
    index_temp = numberBarCurrentIndex + offset
    if (index_temp < 0) {
        return index_temp + numberBarItems.length
    } else if (index_temp >= numberBarItems.length) {
        return index_temp - numberBarItems.length
    } else {
        return index_temp
    }
}
function updateNewNumberBarSelector (change: number) {
    numberBarCurrentIndex = (numberBarCurrentIndex + change) % (numberBarItems.length - 1)
    if (numberBarCurrentIndex < 0) {
        numberBarCurrentIndex = numberBarItems.length + numberBarCurrentIndex
    }
    numberBarSelector.y = getNewNumberBarYValueFromIndex(numberBarCurrentIndex)
}
function changeBackgroundColorForNewNumberBar (value: string, color2: number) {
    numberBarSpriteBackground[numberBarItems.indexOf(value)] = color2
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    selectorUpdatePosition(selectorColCurrent + 1)
})
function setupConfiguration () {
    guessesAttempt = 1
    selectorColMin = 2
    selectorColMax = 8
    selectorColCurrent = selectorColMin
    color.setColor(11, color.rgb(140, 140, 140))
    color.setColor(12, color.rgb(210, 210, 210))
}
function updateNewNumberBar () {
    for (let value2 of numberBarSprites) {
        value2.destroy()
    }
    for (let value of numberBarItems) {
        tempNumberBarSprite = textsprite.create(value, numberBarSpriteBackground[numberBarItems.indexOf(value)], 15)
        grid.place(tempNumberBarSprite, tiles.getTileLocation(0, 0))
        tempNumberBarSprite.y = getNewNumberBarYValueFromIndex(numberBarItems.indexOf(value))
        numberBarSprites.push(tempNumberBarSprite)
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    updateNewNumberBarSelector(1)
})
function getNewNumberBarYValueFromIndex (index: number) {
    return index / numberBarItems.length * (scene.screenHeight() - 7) + 8
}
function numberBarUpdate () {
    numberBarSpriteCurrent.setText(numberBarItems[numberBarCurrentIndex])
    numberBarSpritePrev1.setText(numberBarItems[numberBarGetItemIndex(-1)])
    numberBarSpritePrev2.setText(numberBarItems[numberBarGetItemIndex(-2)])
    numberBarSpriteNext1.setText(numberBarItems[numberBarGetItemIndex(1)])
    numberBarSpriteNext2.setText(numberBarItems[numberBarGetItemIndex(2)])
}
// Check if the guess is exactly the same as the answer.
function attemptValidateAnswer () {
    for (let col2 = 0; col2 <= 5; col2++) {
        if (guessesCurrent[col2] != answer[col2]) {
            return false
        }
    }
    return true
}
function updateGuesses () {
	
}
function random_index_from_array (array: any[]) {
    return randint(0, array.length - 1)
}
function generateAnswer () {
    answerPotentialDigits = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
    ]
    answerPotentialSymbols = [
    "/",
    "*",
    "-",
    "+"
    ]
    answer = [
    "",
    "",
    "",
    "",
    "",
    ""
    ]
    diceRoll = randint(0, 4)
    if (diceRoll == 0) {
        answer[2] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
    } else if (diceRoll == 1) {
        answer[3] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
    } else if (diceRoll == 2) {
        answer[1] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
        answer[3] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
    } else if (diceRoll == 3) {
        answer[1] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
        answer[4] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
    } else {
        answer[2] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
        answer[4] = answerPotentialSymbols.removeAt(random_index_from_array(answerPotentialSymbols))
    }
    for (let index = 0; index <= answer.length - 1; index++) {
        if (answer[index].isEmpty()) {
            answer[index] = answerPotentialDigits.removeAt(random_index_from_array(answerPotentialDigits))
        }
    }
    answerTarget = eval.evalArrayMath(answer)
    console.logValue("generated target answer", answerTarget)
}
function createGuessSprite (position: number, text: string) {
    guessSpriteTemp = textsprite.create(text, 0, 15)
    sprites.setDataNumber(guessSpriteTemp, "attempt", guessesAttempt)
    sprites.setDataNumber(guessSpriteTemp, "position", position)
    guessSpriteTemp.setText(guessesCurrent[position])
    grid.place(guessSpriteTemp, tiles.getTileLocation(position + 2, guessesAttempt))
}
function setupNewNumberBarSelector () {
    numberBarCurrentIndex = 0
    numberBarSelector = sprites.create(assets.image`Number Bar Selector`, SpriteKind.Player)
    grid.place(numberBarSelector, tiles.getTileLocation(0, 0))
    numberBarSelector.z += 3
    updateNewNumberBarSelector(0)
}
let diceRoll = 0
let answerPotentialSymbols: string[] = []
let answerPotentialDigits: string[] = []
let tempNumberBarSprite: TextSprite = null
let numberBarSelector: Sprite = null
let index_temp = 0
let numberBarSprites: TextSprite[] = []
let numberBarSpriteBackground: number[] = []
let numberBarSpriteNext2: TextSprite = null
let numberBarSpriteNext1: TextSprite = null
let numberBarSpritePrev2: TextSprite = null
let numberBarSpritePrev1: TextSprite = null
let numberBarSpriteCurrent: TextSprite = null
let guessSpriteTemp: TextSprite = null
let answerTargetMax = 0
let answerTargetMin = 0
let numberBarCurrentIndex = 0
let numberBarItems: string[] = []
let selectorColMax = 0
let selectorColMin = 0
let selectorColCurrent = 0
let textEnter: Sprite = null
let selector: Sprite = null
let answerTarget = 0
let targetAnswerUI: TextSprite = null
let guessesAttempt = 0
let guessesCurrent: string[] = []
let answer: string[] = []
setupConfiguration()
scene.setBackgroundColor(1)
tiles.setTilemap(tilemap`level1`)
tiles.setTilemap(tilemap`level1`)
setupAnswer()
setupGuesses()
setupNewNumberBar()
setupUI()
selectorUpdatePosition(1)
