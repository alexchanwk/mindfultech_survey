var sheetName = 'Sheet1'
var scriptProp = PropertiesService.getScriptProperties()

const reports = {
  a: {
    category: "高風險，高度焦慮，需要關懷開解",
    comments: [
      "你極需要尋求情緒支援及舒緩治療；「壓力」，「焦慮」，「憤怒」是你目前的精神狀態。標註你的情緒會產生迅速使你平靜的效果。為什麼呢？ 因為把情緒轉化為一些語言，會把你大腦活動從情緒區域轉移到大腦的思維區域。",
      "請聯絡SMART心專案經理轉介你的個案給合適的臨床心理治療師及社工跟進，不用擔心，也不需要害怕，我們可以幫你做到最合適的配對，走出第一步。",
      "在你得到合適的專業幫助前，SMART心特意獻上可以短時間內舒緩的「正念」小短片，請欣賞。"
    ],
    indices: {
      anxiety: 80,
      memory: 70,
      insomnia: 60,
      confidence: 10,
      loneliness: 50,
      depression: 70,
      active: 20,
      pressure: 70
    }
  },
  b: {
    category: "中風險，中度焦慮，需要有意識訓練感知態度",
    comments: [
      "給自己一些自我同情： 如果你注意到你的大腦正在想出讓你焦慮或憤怒的場景，給自己一些安慰。隻要一點點的自我同情，在很大程度上就會讓你心平氣和。「在艱難的時刻，我需要善待自己」是一個簡短和撫慰性的自我對話的例子。",
      "把你的想法當做「隻是想法」：當你回顧你的一天，你會注意到，你的心裏經常會有一些令人不安的故事和情景。當這些奇怪的或令人不安的想法出現時，告訴自己，「這隻是想法，不是事實」來中和它們，然後深呼吸去面對任何產生的壓力，並活在當下。",
      "進入SMART心社區及小課堂，在交流中. 練習「察覺5樣東西」：",
      "觀察周圍的環境，嘗試發現五個有趣的東西，你可以看到、聽到、感覺、或者聞到。這個簡單的練習將使你的日常行為活動，例如散步，不再單調枯燥，會使你觀察到獨特的，新的或以前看不見的東西。它實際上可以讓你大開眼界。"
    ],
    indices: {
      anxiety: 80,
      memory: 50,
      insomnia: 50,
      confidence: 50,
      loneliness: 30,
      depression: 40,
      active: 30,
      pressure: 60
    }
  },
  c: {
    category: "正常，輕度焦慮，需要改進睡眠質素",
    comments: [
      "要多啲同老友傾傾， 可以「SMART心」社區揾同路人。",
      "知多啲關於心理健康的資訊。  用正念（mindfulness）課程解碼潛意識先,  積極能量治療,  讓音樂成為你的專屬療愈師：",
      "「SMART心」音樂療法積極能量治療，提升深度睡眠頻率，大腦修復負能量100分鐘. 積極能量治療每個互動課程半小時，進行身心SPA， 隨時觀看，隨時聆聽， 療愈智慧觸手可及。"
    ],
    indices: {
      anxiety: 50,
      memory: 70,
      insomnia: 80,
      confidence: 10,
      loneliness: 70,
      depression: 50,
      active: 70,
      pressure: 60
    }
  },
  d: {
    category: "正常，心靈壓抑，需要「靜觀認知療法」及娛樂性科普",
    comments: [
      "微笑一下，微笑可以神奇地放鬆你的心靈和身體。人身心疲累，種種壓力下，我們難免會跌入不快的漩渦中。漸漸，我們開始忽略了自己的情緒，抑壓自己，變得機械式地過日子。其實這樣做不僅不能有效地處理問題，反而導致內心積壓越來越多的情緒，引發各種身心問題。",
      "回顧你過去的想法， 通過目睹你的想法和情感，你可以更多地發現你自己 — — 你的關注、需要、憂慮和價值觀等等。一些主題會一再出現。你還會注意到，你的情緒和想法會隨著時間的推移而變化和消散。「這也會過去的」是實際描述我們心理活動的座右銘。實際上，你不必加入到思想的遊行中，去思考它們；你可以選擇你想關注的。採取「一種觀察態度」。",
      "集中注意力在感恩/開心上 當你有壓力時，用30秒時間去想一些讓你感激/開心的事情。關注你生命中積極的事情，同時配合幾次深呼吸，這是平靜身心非常完美的祕訣。",
      "快啲「SMART心」社區揾同路人， 聽多啲知識講座，幫人幫到自己 ， 與「人」 互動， 你，不再是一個人面對，有朋友，有知識。"
    ],
    indices: {
      anxiety: 50,
      memory: 30,
      insomnia: 70,
      confidence: 10,
      loneliness: 70,
      depression: 10,
      active: 30,
      pressure: 20
    }
  }
}

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1
    var uuid = Utilities.getUuid()
    var score = 0

    if (e) {
      for(var key in e.parameter) {
        if (key.match(/^q[0-9]+$/g)) {
          switch(e.parameter[key]) {
            case 'a':
              score += 5;
              break;
            case 'b':
              score += 3;
              break;
            case 'c':
              score += 2;
              break;
            case 'd':
              score += 0;
              break;
          }
        }
      }
    }

    var newRow = headers.map(function(header) {
      if (header === 'timestamp')
        return new Date();

      if (header === 'uuid')
        return uuid;

      if (header === 'score')
        return score;

      return (e) ? e.parameter[header] : header;
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'id': uuid }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': err }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}

function doGet (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)
    var data = sheet.getDataRange().getValues()
    var report;
    var uuid;
    var score = 70;

    if (e) {
      uuid = e.parameter.id
    }

    if (uuid) {
      var uuid_col;
      var score_col;

      if (data[0].length > 0) {
        for (var i=0; i<data[0].length; i++) {
          if (data[0][i] === 'uuid') {
            uuid_col = i
          }
          if (data[0][i] === 'score') {
            score_col = i
          }
        }
      }

      if (uuid_col !== null) {
        for (var i=1; i<data.length; i++) {
          if (data[i][uuid_col] === uuid) {
            score = data[i][score_col]
            break
          }
        }
      }

      if (score) {
        if (score > 75) {
          report = reports.d;
        } else if (score > 50) {
          report = reports.c;
        } else if (score > 25) {
          report = reports.b;
        } else {
          report = reports.a;
        }
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'report': report }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': err }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}