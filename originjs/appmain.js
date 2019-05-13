controlRerquest("data/control.smr", main)

// big1 big2
// jac1
// reg1 reg2

function main() {
    window.scrollTo(0, 0);
    var sbig;
    var notplaypaysound = false;
    var hyperzone = 0;
    var hypergame = 0;
    var lastPay = 0;
    var renCount = 0;
    var lastBonusCount = 0;

    window.RT = {
        mode: 'RT1',
        game: 32
    }

    slotmodule.on("allreelstop", async function (e) {
        if (e.hits != 0) {
            if (e.hityaku.length == 0) return
            var matrix = e.hityaku[0].flashLine || e.hityaku[0].matrix;
            var count = 0;
            var { name } = e.hityaku[0];
            slotmodule.once("bet", function () {
                slotmodule.clearFlashReservation()
            })
            notplaypaysound = false;
            switch (name) {
                case 'JACIN':
                    slotmodule.setFlash(
                        replaceMatrix(
                            flashdata.syoto,
                            matrix,
                            colordata.LINE_F,
                            null
                        ), 1000, function () {
                            slotmodule.clearFlashReservation()
                        });
                    break
                case 'チャンス目':
                    var count = 10;
                    slotmodule.freeze();
                    slotmodule.setFlash(null, 0, function (e) {
                        slotmodule.setFlash(flashdata.default, 1)
                        var mat = [[rand(2), rand(2), rand(2)], [rand(2), rand(2), rand(2)], [rand(2), rand(2), rand(2)]];
                        if (count--) {
                            slotmodule.setFlash(replaceMatrix(flashdata.default, mat, colordata.LINE_F, null), 2, arguments.callee)
                        } else {
                            slotmodule.resume();
                        }
                    })
                    break
                case 'BIG1':
                    slotmodule.setFlash(null, 0, function (e) {
                        slotmodule.setFlash(flashdata.default, 3)
                        slotmodule.setFlash(replaceMatrix(flashdata.syoto, matrix, colordata.RED_B, null), 3, arguments.callee)
                    })
                    break
                case 'JACIN2':
                case 'REG1':
                case 'JACIN':
                    slotmodule.setFlash(replaceMatrix(flashdata.syoto, matrix, colordata.LINE_F, null), 1000, function () {
                        slotmodule.clearFlashReservation()
                    });
                    break
                default:
                    slotmodule.setFlash(null, 0, function (e) {
                        slotmodule.setFlash(flashdata.default, 20)
                        slotmodule.setFlash(replaceMatrix(flashdata.default, matrix, colordata.LINE_F, null), 20, arguments.callee)
                    })
            }
        }
        replayFlag = false;
        var nexter = true;
        var changeBonusFlag = false;
        for (var i = 0; i < e.hityaku.length; i++) {
            var d = e.hityaku[i];
            // var matrix = d.matrix;
            switch (d.name) {
                case 'リプレイ':
                    replayFlag = true;
                    break
                case 'RTリプレイ1':
                    if (!bonusFlag) {
                        RT.mode = 'RT1'
                        RT.game = 32;
                        replayFlag = true;
                    }
                    break
                case 'RTリプレイ2':
                    if (!bonusFlag) {
                        RT.mode = 'RT2'
                        RT.game = 32;
                        replayFlag = true;
                    }
                    break
                case "BB":
                    renCount++;
                    bonusFlag = null;
                    sounder.stopSound('bgm');
                    playcount = 0;

                    setGamemode('BB');
                    if (renCount == 1) lastBonusCount = 0;
                    var count = lastBonusCount;
                    if (renCount == 1) {
                        lastBonusCount = 0;
                        await sounder.playSound('fan1');
                    } else {
                        await sounder.playSound('fan2');
                    }
                    $('.colorBar.show').removeClass('show')
                    upVoltage(0,2);
                    ATLevel = 2;
                    RT.mode = null;
                    RT.game = -1;
                    // sounder.playSound("big1", true, () => { }, 14.276);
                    bonusData = new BonusData.RegularBonus5("BB", 8,8);
                    isEffected = false;
                    $('#disk').removeClass('show');
                    break
                case "MB":
                    setGamemode('MB');
                    bonusData = new BonusData.RegularBonus5("MB", 1, 1);
                    bonusFlag = null;
                    isEffected = false;
                    $('#disk').removeClass('show');
                    break
            }
        }

        if (nexter) {
            e.stopend()
        }
    })
    slotmodule.on("bonusend", () => {
        sounder.stopSound("bgm")
        setGamemode("normal")
    });
    slotmodule.on("payend", function (e) {
        // console.log(e)
        if (gameMode != "normal") {
            bonusData.onNextGame(e.pay)
            // console.log(bonusData,e.pay,bonusData.getGameMode())
            setGamemode(bonusData.getGameMode());
            if (bonusData.isEnd == true && bonusData.name == 'BIG1') {
                sounder.stopSound("bgm");
                bonusData = null;
            }
            changeBonusSeg();
        }
    })
    slotmodule.on("leveron", function () { })
    slotmodule.on("bet", function (e) {
        sounder.playSound("3bet")
        if ("coin" in e) {
            (function (e) {
                var thisf = arguments.callee;
                if (e.coin > 0) {
                    coin--;
                    e.coin--;
                    incoin++;
                    changeCredit(-1);
                    setTimeout(function () {
                        thisf(e)
                    }, 70)
                } else {
                    e.betend();
                }
            })(e)
        }
        if (gameMode == "jac") {
            segments.payseg.setSegments(bonusData.jacgamecount)
        } else {
            segments.payseg.reset();
        }
    })
    slotmodule.on("pay", async (e) => {
        var pays = e.hityaku.pay;
        var loopPaySound = null;
        var payCount = 0;
        if (pays >= 2 && !notplaypaysound) sounder.playSound(loopPaySound = 'pay', true);
        if (replayFlag) {
            if (!notplaypaysound) {
                await sounder.playSound('replay');
            }
            e.replay();
            slotmodule.emit("bet", e.playingStatus);
            return
        }
        while (pays--) {
            coin++;
            payCount++;
            outcoin++;
            if (bonusData != null) {
                bonusData.onPay(1);
                changeBonusSeg();
            }
            changeCredit(1);
            segments.payseg.setSegments(payCount)
            await delay(50);
        }
        if (replayFlag) {
            e.replay();
            slotmodule.clearFlashReservation()
        } else {
            e.payend()
            if (loopPaySound) {
                sounder.stopSound(loopPaySound);
                loopPaySound = null;
            }
        }
    })
    var jacFlag = false;
    slotmodule.on("lot", function (e) {
        var ret = -1;
        if(bonusFlag != 'BB'){
            if(RT.mode && RT.game > 0){
                RT.game--;
                if(RT.game == 0){
                    RT.mode = null;
                    RT.game = -1;
                }
            }
        }
        switch (gameMode) {
            case 'normal':
                var lot = normalLotter.lot().name
                lot = window.power || lot;
                window.power = undefined
                switch (lot) {
                    case 'リプレイ':
                        ret = 'リプレイ'
                        if (!bonusFlag && !rand(2) && !RT.mode) {
                            ret = 'RTリプレイ1'
                        }
                        break
                    case '1枚役':
                        if(bonusFlag == 'BB'){
                            ret = '1枚役'
                        }else{
                            if(bonusFlag == 'MB'){
                                ret = bonusFlag
                            }else{
                                ret = '押し順ベル' + (4 + rand(3));
                            }
                        }
                        break
                    case 'ベル':
                        if (bonusFlag == 'BB') {
                            if(!rand(2)){
                                ret = '押し順ベル' + (4 + rand(3));
                            }else{
                                ret = '1枚役'
                            }
                        } else {
                            ret = '押し順ベル' + (1 + rand(3));
                        }
                        break
                    case 'MB':
                        if (!bonusFlag) {
                            bonusFlag = 'MB';
                            if(!rand(6)){
                                ret = 'リプレイ'
                            }else{
                                ret = bonusFlag
                            }
                        }else{
                            ret = 'リプレイ';
                            if(!rand(4)) ret = '1枚役'
                        }
                        break
                    case 'BB':
                        if (!bonusFlag) {
                            bonusFlag = 'BB';
                        }
                        ret = 'リプレイ'
                        break
                    case 'チェリー':
                        if (bonusFlag == 'BB') {
                            ret = 'チェリー' + (1 + rand(4));
                        } else {
                            ret = '共通チェリー'
                        }
                        break
                    default:
                        ret = bonusFlag || 'はずれ';
                        switch (RT.mode) {
                            case 'RT1':
                                ret = 'リプレイ'
                                break
                            case 'RT2':
                                break
                            default:
                                if (rand(4)) ret = 'リプレイ'
                        }
                }
                break;
            case 'MB':
            case 'BB':
                ret = 'MB小役1'
                if (RT.mode != 'RT2' && !rand(16)) {
                    ret = 'RTリプレイ2'
                }
                if (RT.mode == 'RT2' || !rand(4)) {
                    ret = 'MB小役2'
                }
        }
        if(ret == '1枚役' && !rand(2)) ret = '1枚役こぼし'
        effect(ret);
        console.log(ret)
        return ret;
    })
    slotmodule.on("reelstop", function () {
        if(isNabi){
            sounder.playSound("nabistop")
        }else{
            sounder.playSound("stop")
        }
    })
    $("#saveimg").click(function () {
        SaveDataToImage();
    })
    $("#cleardata").click(function () {
        if (confirm("データをリセットします。よろしいですか？")) {
            ClearData();
        }
    })
    $("#loadimg").click(function () {
        $("#dummyfiler").click();
    })
    $("#dummyfiler").change(function (e) {
        var file = this.files[0];
        var image = new Image();
        var reader = new FileReader();
        reader.onload = function (evt) {
            image.onload = function () {
                var canvas = $("<canvas></canvas>")
                canvas[0].width = image.width;
                canvas[0].height = image.height;
                var ctx = canvas[0].getContext('2d');
                ctx.drawImage(image, 0, 0)
                var imageData = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height)
                var loadeddata = SlotCodeOutputer.load(imageData.data);
                if (loadeddata) {
                    parseSaveData(loadeddata)
                    alert("読み込みに成功しました")
                } else {
                    alert("データファイルの読み取りに失敗しました")
                }
            }
            image.src = evt.target.result;
        }
        reader.onerror = function (e) {
            alert("error " + e.target.error.code + " \n\niPhone iOS8 Permissions Error.");
        }
        reader.readAsDataURL(file)
    })
    slotmodule.on("reelstart", function () {
        if (okure) {
            setTimeout(function () {
                sounder.playSound("start")
            }, 100)
        } else {
            sounder.playSound("start")
        }
        okure = false;
    })
    var okure = false;
    var sounder = new Sounder();
    sounder.addFile("sound/stop.wav", "stop").addTag("se");
    sounder.addFile("sound/start.wav", "start").addTag("se").setVolume(0.5);
    sounder.addFile("sound/bet.wav", "3bet").addTag("se").setVolume(0.5);
    sounder.addFile("sound/yokoku_low.mp3", "yokoku_low").addTag("se");
    sounder.addFile("sound/yokoku_high.mp3", "yokoku_high").addTag("se");
    sounder.addFile("sound/pay.wav", "pay").addTag("se");
    sounder.addFile("sound/replay.wav", "replay").addTag("se");
    sounder.addFile("sound/NormalBIG.wav", "NBIG").addTag("bgm").setVolume(0.2);
    sounder.addFile("sound/big15.wav", "pay15")
    sounder.addFile("sound/SBIG.mp3", "SBIG").addTag("bgm").setVolume(0.2);
    sounder.addFile("sound/JACNABI.wav", "jacnabi").addTag("se");
    sounder.addFile("sound/big1hit.wav", "big1hit").addTag("se");
    sounder.addFile("sound/moonsuccess.mp3", "moonsuccess").addTag("se");
    sounder.addFile("sound/moonfailed.mp3", "moonfailed").addTag("se");
    sounder.addFile("sound/bell2.wav", "bell2").addTag("se");
    sounder.addFile("sound/nabi.wav", "nabi").addTag("voice").addTag("se");
    sounder.addFile("sound/reg.wav", "reg").addTag("bgm");
    sounder.addFile("sound/big1.mp3", "big1").addTag("bgm").setVolume(0.2);
    sounder.addFile("sound/moonstart.mp3", "moonstart").addTag("se").setVolume(0.2);
    sounder.addFile("sound/bigselect.mp3", "bigselect").addTag("se")
    sounder.addFile("sound/syoto.mp3", "syoto").addTag("se")
    sounder.addFile("sound/cherrypay.wav", "cherrypay").addTag("se");
    sounder.addFile("sound/bonuspay.wav", "bonuspay").addTag("voice").addTag("se");
    sounder.addFile("sound/bpay.wav", "bpay").addTag("se").setVolume(0.5);
    sounder.addFile("sound/chance.mp3", "chance").addTag("se").setVolume(0.5);
    sounder.addFile("sound/hitchance.mp3", "hitchance").addTag("se").setVolume(0.5);
    sounder.addFile("sound/fan1.mp3", "fan1").addTag("se").setVolume(0.5);
    sounder.addFile("sound/fan2.mp3", "fan2").addTag("se").setVolume(0.5);
    sounder.addFile("sound/chancezone.mp3", "chancezone").addTag("bgm").setVolume(0.2);
    sounder.addFile("sound/chancezoneend.mp3", "chancezoneend").addTag("se")
    sounder.addFile("sound/voltageup.mp3", "voltageup").addTag("se")
    sounder.addFile("sound/leverstart.mp3", "leverstart").addTag("se")
    sounder.addFile("sound/leverpush.mp3", "leverpush").addTag("se")
    sounder.addFile("sound/win.mp3", "win").addTag("se")
    sounder.addFile("sound/lose.mp3", "lose").addTag("se")
    sounder.addFile("sound/geki.mp3", "geki").addTag("se")
    sounder.addFile("sound/title.mp3", "title").addTag("se")
    sounder.addFile("sound/type.mp3", "type").addTag("se")

    sounder.addFile("sound/yokoku.mp3", "yokoku").addTag("se")
    sounder.addFile("sound/nabistop.mp3", "nabistop").addTag("se")
    sounder.addFile("sound/tempai.mp3", "tempai").addTag("se")
    sounder.addFile("sound/danger.mp3", "danger").addTag("se")

    sounder.addFile("sound/AT1.mp3", "AT1").addTag("bgm")
    sounder.addFile("sound/AT2.mp3", "AT2").addTag("bgm")
    sounder.addFile("sound/AT3.mp3", "AT3").addTag("bgm")
    // sounder.setVolume("se", 0.2)
    // sounder.setVolume("bgm", 0.2)
    sounder.loadFile(function () {
        window.sounder = sounder
        console.log(sounder)
    })
    var normalLotter = new Lotter(lotdata.normal);
    var bigLotter = new Lotter(lotdata.big);
    var jacLotter = new Lotter(lotdata.jac);
    window.gameMode = "normal";
    var bonusFlag = 'BB'
    var coin = 0;
    window.bonusData = new BonusData.BigBonus5("BIG2", 300);
    var replayFlag;
    var isCT = false;
    var CTBIG = false;
    var isSBIG;
    var ctdata = {};
    var regstart;
    var afterNotice;
    var bonusSelectIndex;
    var ctNoticed;
    var playcount = 0;
    var allplaycount = 0;
    var incoin = 0;
    var outcoin = 0;
    var bonuscounter = {
        count: {},
        history: []
    };
    slotmodule.on("leveron", function () {
        if (gameMode != "BIG1") {
            playcount++;
            allplaycount++;
        } else {
            if (playcount != 0) {
                bonuscounter.history.push({
                    bonus: gameMode,
                    game: playcount
                })
                playcount = 0;
            }
        }
        changeCredit(0)
    })

    function stringifySaveData() {
        return {
            coin: coin,
            playcontroldata: slotmodule.getPlayControlData(),
            bonuscounter: bonuscounter,
            incoin: incoin,
            outcoin: outcoin,
            playcount: playcount,
            allplaycount: allplaycount,
            name: "ゲッター7",
            id: "getter7"
        }
    }

    function parseSaveData(data) {
        coin = data.coin;
        // slotmodule.setPlayControlData(data.playcontroldata)
        bonuscounter = data.bonuscounter
        incoin = data.incoin;
        outcoin = data.outcoin;
        playcount = data.playcount;
        allplaycount = data.allplaycount
        changeCredit(0)
    }
    window.SaveDataToImage = function () {
        SlotCodeOutputer.save(stringifySaveData())
    }
    window.SaveData = function () {
        var savedata = stringifySaveData()
        localStorage.setItem("savedata", JSON.stringify(savedata))
        return true;
    }
    window.LoadData = function () {
        var savedata = localStorage.getItem("savedata")
        try {
            var data = JSON.parse(savedata)
            parseSaveData(data)
            changeCredit(0)
        } catch (e) {
            return false;
        }
        return true;
    }
    window.ClearData = function () {
        coin = 0;
        bonuscounter = {
            count: {},
            history: []
        };
        incoin = 0;
        outcoin = 0;
        playcount = 0;
        allplaycount = 0;
        SaveData();
        changeCredit(0)
    }
    function setGamemode(mode) {
        // console.log(`${gameMode} -> ${mode}`)
        switch (mode) {
            case 'normal':
                gameMode = 'normal'
                slotmodule.setLotMode(0)
                slotmodule.setMaxbet(3);
                break
            case 'BB':
                gameMode = 'BB';
                slotmodule.setLotMode(2)
                slotmodule.setMaxbet(2);
                break
            case 'MB':
                gameMode = 'MB';
                slotmodule.setLotMode(2)
                slotmodule.setMaxbet(2);
                break
        }
    }
    var segments = {
        creditseg: segInit("#creditSegment", 2),
        payseg: segInit("#paySegment", 2),
        effectseg: segInit("#effectSegment", 4)
    }
    var credit = 50;
    segments.creditseg.setSegments(50);
    segments.creditseg.setOffColor(80, 30, 30);
    segments.payseg.setOffColor(80, 30, 30);
    segments.effectseg.setOffColor(5, 5, 5);
    segments.creditseg.reset();
    segments.payseg.reset();
    segments.effectseg.reset();
    var lotgame;

    function changeCredit(delta) {
        credit += delta;
        if (credit < 0) {
            credit = 0;
        }
        if (credit > 50) {
            credit = 50;
        }
        $(".GameData").text("差枚数:" + coin + "枚  ゲーム数:" + playcount + "G  総ゲーム数:" + allplaycount + "G")
        segments.creditseg.setSegments(credit)
    }

    function changeBonusSeg() {
        if (!this.bonusData) return segments.effectseg.setSegments("");
        if (this.bonusData instanceof BonusData.RegularBonus5) return;
        segments.effectseg.setSegments(bonusData.getBonusSeg());
        if (bonusData.isJacin && bonusData.jacName == 'JAC') {
            segments.payseg.setSegments("" + bonusData.payCount)
        }
    }
    const VoltageMap = {
        CZ: {
            low: [
                [50, 49, 1, 0, 0,],
                [0, 50, 49, 1, 0,],
                [0, 0, 60, 40, 0,],
                [0, 0, 0, 99, 1,],
                [0, 0, 0, 0, 100],
            ],
            high: [
                [30, 62, 7, 1, 0],
                [0, 30, 62, 7, 1],
                [0, 0, 59, 40, 1],
                [0, 0, 0, 80, 15],
                [0, 0, 0, 0, 100],
            ],
        },
        normal: {
            'はずれ': [979, 20, 1, 0, 0],
            'リプレイ': [68, 30, 2, 0, 0],
            'ベル': [20, 0, 70, 10, 0],
            'チェリー': [20, 0, 70, 10, 0],
            'チャンス目1': [10, 5, 1, 70, 14],
            'チャンス目2': [5, 5, 1, 60, 29],
            'JACIN2': [15, 1, 60, 20, 4],
            'REG1': [15, 1, 30, 40, 14],
            'REG2': [15, 1, 0, 30, 54]
        }
    }
    function ArrayLot(list) {
        var sum = list.reduce((a, b) => a + b);
        var r = rand(sum);
        return list.findIndex(n => {
            return (r -= n) < 0;
        })
    }

    const voltageElements = [...$('.colorBar')].map($);

    async function upVoltage(from, to) {
        var BGMLoopInfo = [0,12.885,4.885];
        if(from != to){
            sounder.stopSound('bgm');
            sounder.playSound('AT'+to,true,null,BGMLoopInfo[to-1]);
        }
        if(from < to){
            while (from < to) {
                voltageElements[from].addClass('show');
                await sounder.playSound('voltageup')
                from++;
            }
        }else{
            while (from > to) {
                console.log({from,to,voltageElements})
                voltageElements[from-1].removeClass('show');
                await sounder.playSound('voltageup')
                from--;
            }
        }
    }

    function voltageReset() {
        $('.colorBar').removeClass('show');
    }

    async function bonusKokuti(isGet) {
        if (isEffected) return;
        isEffected = true;
        var typewritter = false;
        $('#renda').removeClass('show');
        $('#geki').removeClass('show');
        $('#itigeki').removeClass('show');
        if (!rand(32) && isGet) {
            typewritter = true;
            isGet = false;
            slotmodule.once('reelstop', () => {
                slotmodule.freeze();
                Typewriter("ボーナス確定!!", {
                    speed: 150,
                    delay: 5000,
                }).change((t) => {
                    t != "\n" && sounder.playSound('type');
                }).title(() => {
                    sounder.playSound('title');
                }).finish((e) => {
                    e.parentNode.removeChild(e);
                    setTimeout(() => {
                        $('#disk').addClass('show');
                        slotmodule.resume();
                    }, 1000)
                });
            })
        }
        if (isGet) {
            $('#disk').addClass('show');
            await sounder.playSound('win');
        } else {
            $('#disk').removeClass('show');
            await sounder.playSound('lose');
        }
        slotmodule.resume();
    }

    async function leverChance(isGet) {
        const typeTable = { true: [20, 80], false: [80, 20] }[isGet];
        var downEvent;
        var fn;
        const gekiFlag = !!ArrayLot({ true: [95, 5], false: [99, 1] }[isGet]);
        window.addEventListener('keydown', downEvent = (e) => {
            if (fn) {
                fn();
            }
        })
        $('canvas')[0].addEventListener('touchstart', downEvent);
        const $disk = $('#disk');
        slotmodule.freeze();
        if (gekiFlag) {
            sounder.playSound('geki');
            $('#geki').addClass('show')
        }
        await sounder.playSound('leverstart');
        if (ArrayLot(typeTable) == 0) {
            $('#renda').addClass('show');
            var pushCount = isGet ? 1 + rand(15) : -1;
            fn = async () => {
                pushCount--;
                sounder.playSound('leverpush');
                if (!$disk.hasClass('show')) {
                    $disk.addClass('show');
                    setTimeout(() => {
                        if (!isEffected) $disk.removeClass('show');
                    }, 100)
                }
                if (pushCount != 0) return;
                window.removeEventListener('keydown', downEvent);
                $('canvas')[0].removeEventListener('touchstart', downEvent);
                await bonusKokuti(isGet);
            }
            if (!isEffected) {
                setTimeout(async () => {
                    window.removeEventListener('keydown', downEvent);
                    $('canvas')[0].removeEventListener('touchstart', downEvent);
                    await bonusKokuti(isGet);
                }, 3000)
            }
        } else {
            $('#itigeki').addClass('show');
            fn = async () => {
                sounder.playSound('leverpush')
                window.removeEventListener('keydown', downEvent);
                $('canvas')[0].removeEventListener('touchstart', downEvent);
                await bonusKokuti(isGet);
            }
        }
    }

    var voltageIndex;
    var isEffected = false;
    var isGekiLamp;

    function Nabi(idx){
        isNabi = true;
        const NabiFlashs = [[
            [2,0,1],
            [2,1,0],
            [1,0,0]
        ],[
            [0,2,1],
            [0,1,0],
            [1,2,0]
        ],[
            [0,0,1],
            [0,1,2],
            [1,0,2]
        ]].map(arr=>{
            return arr.map(arr=>{
                return arr.map(d=>{
                    if(d == 0) return colordata.DEFAULT_F;
                    if(d == 1) return colordata.DEFAULT_F;
                    if(d == 2) return {
                        color:0x0000ff,
                        alpha:0.5
                    }
                })
            })
        });
        var o;
        slotmodule.setFlash(o = {
            back:Array(3).fill(Array(3).fill(colordata.DEFAULT_B)),
            front:NabiFlashs[idx]
        });
        slotmodule.once('reelstop',()=>{
            slotmodule.clearFlashReservation();
        })
    }
    var ATLevel = 0;

    async function Yokoku(){
        slotmodule.freeze();
        await sounder.playSound('yokoku');
        slotmodule.resume();
    }
    var isNabi = false;
    async function effect(lot) {
        isNabi = false;
        var isAT = !(RT.mode == 'RT1' && bonusFlag == 'BB');

        var NewATLevel = 0;
        if(isAT) NewATLevel = 1;
        if(!RT.mode) NewATLevel = 2;
        if(RT.mode == 'RT2') NewATLevel = 3;

        if(NewATLevel != 0) upVoltage(ATLevel,NewATLevel);
        
        switch (gameMode) {
            case 'normal':
                if(ATLevel == 1 && lot == 'リプレイ'){
                    var flag = false;
                    if(!rand(4) && NewATLevel != 0) flag = true;
                    if(NewATLevel == 0) flag = true;
                    var volumes = [0.7,0.3,0];
                    if(flag){
                        sounder.playSound('danger');
                        var stopCount = NewATLevel == 0 ? 3 : 1 + rand(2);
                        var c = 0;
                        var fn = ()=>{
                            slotmodule.once('reelstop',()=>{
                                console.log({c,stopCount})
                                sounder.setVolume('bgm',volumes[c++]);
                                if(c < stopCount) return fn();
                                if(c == 3) {
                                    sounder.stopSound('bgm');
                                    upVoltage(ATLevel,NewATLevel);
                                }
                                sounder.setVolume('bgm',1);
                            });
                        }
                        fn();
                    }
                }
                if(isAT){
                    switch (lot) {
                        case '押し順ベル1':
                        case '押し順ベル4':
                            Nabi(0);
                        break
                        case '押し順ベル2':
                        case '押し順ベル5':
                            Nabi(1);
                        break
                        case '押し順ベル3':
                        case '押し順ベル6':
                            Nabi(2);
                        break

                    }
                }else{
                    if(lot.includes('チェリー')) await Yokoku();
                }
                break
            case 'BB':
            case 'MB':
                switch(lot){
                    case 'RTリプレイ2':
                        if(!rand(2)) await Yokoku();;
                    break
                    default:
                        if(!rand(8)) await Yokoku();;
                }
        }
        ATLevel = NewATLevel;
    }
    $(window).bind("unload", function () {
        SaveData();
    });
    LoadData();
}

function and() {
    return Array.prototype.slice.call(arguments).every(function (f) {
        return f
    })
}

function or() {
    return Array.prototype.slice.call(arguments).some(function (f) {
        return f
    })
}

function rand(m, n = 0) {
    return Math.floor(Math.random() * m) + n;
}

function replaceMatrix(base, matrix, front, back) {
    var out = JSON.parse(JSON.stringify(base));
    matrix.forEach(function (m, i) {
        m.forEach(function (g, j) {
            if (g == 1) {
                front && (out.front[i][j] = front);
                back && (out.back[i][j] = back);
            }
        })
    })
    return out
}

function flipMatrix(base) {
    var out = JSON.parse(JSON.stringify(base));
    return out.map(function (m) {
        return m.map(function (p) {
            return 1 - p;
        })
    })
}

function segInit(selector, size) {
    var cangvas = $(selector)[0];
    var sc = new SegmentControler(cangvas, size, 0, -3, 50, 30);
    sc.setOffColor(120, 120, 120)
    sc.setOnColor(230, 0, 0)
    sc.reset();
    return sc;
}

function delay(ms) {
    return new Promise(r => {
        setTimeout(r, ms);
    })
}