/**
 * Created by pekko915 on 2017/07/15.
 */

var dummnyLines = {
    "中段":[
        [0,0,0],
        [1,1,1],
        [0,0,0]
    ],
    "上段":[
        [1,1,1],
        [0,0,0],
        [0,0,0]
    ],
    "下段":[
        [0,0,0],
        [0,0,0],
        [1,1,1]
    ],
    "右下がり":[
        [1,0,0],
        [0,1,0],
        [0,0,1]
    ],
    "右上がり":[
        [0,0,1],
        [0,1,0],
        [1,0,0]
    ],
    "なし":[
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]
}

var YakuData = [
    {
        name: "はずれ",
        pay: [0, 0, 0]
    },
    {
        name: "リプレイ",
        pay: [0, 0, 0],
        flashLine:dummnyLines["右下がり"]
    },
    {
        name: "9枚ベル",
        pay: [9, 9, 9],
        flashLine:dummnyLines["右上がり"]
    },
    {
        name: "9枚ベル",
        pay: [9, 9, 9],
        flashLine:dummnyLines["右下がり"]
    },
    {
        name: "9枚ベル",
        pay: [9, 9, 9],
        flashLine:dummnyLines["右下がり"]
    },
    {
        name: "9枚ベル",
        pay: [9, 9, 9],
        flashLine:dummnyLines["右下がり"]
    },
    {
        name: "9枚ベル",
        pay: [9, 9, 9],
        flashLine:dummnyLines["右下がり"]
    },
    {
        name: "5枚ベル",
        pay: [5, 5, 5],
        flashLine:dummnyLines["中段"]
    },
    {
        name: "1枚",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "1枚",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "1枚",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "1枚",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "1枚",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "5枚",
        pay: [5, 5, 5],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "5枚",
        pay: [5, 5, 5],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "1枚",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "1枚",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "BB",
        pay: [0, 0, 0],
        flashLine:dummnyLines["右上がり"]
    },
    {
        name: "BB",
        pay: [0, 0, 0],
        flashLine:dummnyLines["中段"]
    },
    {
        name: "BB",
        pay: [0, 0, 0],
        flashLine:dummnyLines["中段"]
    },
    {
        name: "BB",
        pay: [0, 0, 0],
        flashLine:dummnyLines["中段"]
    },
    {
        name: "BB",
        pay: [0, 0, 0],
        flashLine:dummnyLines["中段"]
    },
    {
        name: "チェリー",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "チェリー",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "チェリー",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "チェリー",
        pay: [1, 1, 1],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "MB",
        pay: [0, 0, 0],
        flashLine:dummnyLines["中段"]
    },
    {
        name: "RTリプレイ1",
        pay: [0, 0, 0],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "RTリプレイ2",
        pay: [0, 0, 0],
        flashLine:dummnyLines["中段"]
    },
    {
        name: "RTリプレイ2",
        pay: [0, 0, 0],
        flashLine:dummnyLines["右上がり"]
    },
    {
        name: "MB小役1",
        pay: [0, 0, 9],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "MB小役2",
        pay: [0, 0, 15],
        flashLine:dummnyLines["なし"]
    },
    {
        name: "MB小役2",
        pay: [0, 0, 15],
        flashLine:dummnyLines["なし"]
    },
]