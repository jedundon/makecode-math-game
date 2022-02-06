namespace SpriteKind {
    export const Guess = SpriteKind.create()
    export const UI = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    numberBarCurrentIndex = numberBarGetItemIndex(-1)
    numberBarUpdate()
})
function setupAnswer () {
    answer = [
    "2",
    "3",
    "+",
    "7",
    "-",
    "3"
    ]
    answerTarget = 27
}
function setupUI () {
    selector = sprites.create(assets.image`squareSelection`, SpriteKind.Player)
    for (let index = 0; index <= 5; index++) {
        tiles.setTileAt(tiles.getTileLocation(index + 2, guessesAttempt), assets.tile`squareblack`)
    }
    textEnter = sprites.create(assets.image`textEnd`, SpriteKind.UI)
    grid.place(textEnter, tiles.getTileLocation(8, guessesAttempt))
}
function selectorUpdatePosition () {
    grid.place(selector, tiles.getTileLocation(selectorColCurrent, selectorRowCurrent))
}
function setupGuesses () {
    guessesCurrent = [
    "2",
    "3",
    "*",
    "7",
    " ",
    " "
    ]
    for (let col = 0; col <= 5; col++) {
        guessSpriteTemp = textsprite.create("0", 0, 15)
        sprites.setDataNumber(guessSpriteTemp, "attempt", guessesAttempt)
        sprites.setDataNumber(guessSpriteTemp, "position", col)
        guessSpriteTemp.setText(guessesCurrent[col])
        grid.place(guessSpriteTemp, tiles.getTileLocation(col + 2, guessesAttempt))
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    selectorColCurrent = Math.constrain(selectorColCurrent - 1, selectorColMin, selectorColMax)
    selectorUpdatePosition()
})
function setupNumberBar () {
    numberBarItems = [
    "_",
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
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    selectorColCurrent = Math.constrain(selectorColCurrent + 1, selectorColMin, selectorColMax)
    selectorUpdatePosition()
})
function setupConfiguration () {
    guessesAttempt = 2
    selectorColMin = 2
    selectorColMax = 8
    selectorColCurrent = selectorColMin
    selectorRowCurrent = guessesAttempt
    color.setColor(11, color.rgb(140, 140, 140))
    color.setColor(12, color.rgb(210, 210, 210))
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    numberBarCurrentIndex = numberBarGetItemIndex(1)
    numberBarUpdate()
})
function numberBarUpdate () {
    numberBarSpriteCurrent.setText(numberBarItems[numberBarCurrentIndex])
    numberBarSpritePrev1.setText(numberBarItems[numberBarGetItemIndex(-1)])
    numberBarSpritePrev2.setText(numberBarItems[numberBarGetItemIndex(-2)])
    numberBarSpriteNext1.setText(numberBarItems[numberBarGetItemIndex(1)])
    numberBarSpriteNext2.setText(numberBarItems[numberBarGetItemIndex(2)])
}
let index_temp = 0
let numberBarSpriteNext2: TextSprite = null
let numberBarSpriteNext1: TextSprite = null
let numberBarSpritePrev2: TextSprite = null
let numberBarSpritePrev1: TextSprite = null
let numberBarSpriteCurrent: TextSprite = null
let numberBarItems: string[] = []
let selectorColMax = 0
let selectorColMin = 0
let guessSpriteTemp: TextSprite = null
let guessesCurrent: string[] = []
let selectorRowCurrent = 0
let selectorColCurrent = 0
let textEnter: Sprite = null
let guessesAttempt = 0
let selector: Sprite = null
let answerTarget = 0
let answer: string[] = []
let numberBarCurrentIndex = 0
setupConfiguration()
scene.setBackgroundColor(1)
tiles.setTilemap(tilemap`level1`)
setupAnswer()
setupGuesses()
setupNumberBar()
setupUI()
selectorUpdatePosition()
