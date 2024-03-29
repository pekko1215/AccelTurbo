/**
 * Created by pekko1215 on 2017/07/16.
 */
var colordata = {
    DEFAULT_B:{
        color:0xFFFFFF,
        alpha:0.5
    },
    DEFAULT_F: {
        color:0xffffff,
        alpha:0.5
    },
    RED_B:{
        color:0xff0000,
        alpha:0.3
    },
    LINE_F:{
        color:0xcccccc,
        alpha:0.5
    },
    SYOTO_B:{
        color:0x0,
        alpha:0.5
    },
    SYOTO_F:{
        color:0x1c1c1c,
        alpha:0.9
    }
}

var flashdata = {
    default:{
        back:Array(3).fill(Array(3).fill(colordata.DEFAULT_B)),
        front:Array(3).fill(Array(3).fill(colordata.DEFAULT_F))
    },
    red:{
        back:Array(3).fill(Array(3).fill(colordata.RED_B)),
        front:Array(3).fill(Array(3).fill(colordata.RED_B))
    },
    syoto:{
        back:Array(3).fill(Array(3).fill(colordata.DEFAULT_B)),
        front:Array(3).fill(Array(3).fill(colordata.SYOTO_F))
    }
}