 /**
  * @author huotui < 3001399706@qq.com >
  */
 function chart(echarts) {
    return {
        chartK: {
            chart: undefined,
            init: function (selector, json, full) {
                if (!json || !json.records)
                    return false;
                if (this.chart) {
                    this.chart.clear();
                    this.chart.dispose();
                    this.chart = undefined;
                }
                var myChart = echarts.init(document.querySelector(selector));
                var xdata = [],
                    ydata = [];
                //var kmin = json.records[0][3], kmax = json.records[0][2];
                //var count = 0;
                var records = json.records;
                var len = records.length,
                    item;
                // 取最后100个
                var kmin = json.records[len - 60][3],
                    kmax = json.records[len - 60][2];

                    
                for (var i = 0; i < 60; i++) {
                    item = records[len - 60 + i];
                    xdata.push(item[0]);
                    //开盘，收盘，最低，最高
                    var yarry = [item[1], item[4], item[3], item[2]];
                    ydata.push(yarry);

                    kmin = Math.min(kmin, item[3]);
                    kmax = Math.max(kmax, item[2]);
                }
                full = full || 60;
                for (var i = 0; i < full - xdata.length; i++) {
                    xdata.push("-");
                    ydata.push(["-", "-", "-", "-"]);
                }
                var kminv = kmin - ((kmax - kmin)),
                    kmaxv = kmax + ((kmax - kmin));
                var config = {
                    title: {
                        show: false
                    },
                    grid: {
                        x: 0,
                        x2: 5,
                        y: 0,
                        y2: 5,
                        borderColor: "#ccc"
                    },
                    tooltip: {
                        trigger: 'axis',
                        borderColor: "#ccc",
                        showDelay: 10,
                        hideDelay: 10,
                        transitionDuration: 0.1,
                        borderWidth: 1,
                        backgroundColor: "#ffffff",
                        textStyle: {
                            color: "#666",
                            fontSize: 11,
                            fontFamily: "微软雅黑"
                        },
                        padding: 10,
                        formatter: function (data) {
                            var date = new Date(data[0].name);
                            if (data[0].data[0] == "-")
                                date = new Date();
                            var dom = date.format("yyyy年MM月dd日");
                                //开盘，收盘，最低，最高
                            dom += "<br/>开盘：<span style='color:#F96900;'>" + data[0].data[4] + "</span>";                            
                            dom += "<br/>最高：<span style='color:#DD2200;'>" + data[0].data[3] + "</span>";
                            dom += "<br/>最低：<span style='color:#00A800;'>" + data[0].data[2] + "</span>";
                            dom += "<br/>收盘：<span style='color:#F96900;'>" + data[0].data[1] + "</span>";
                            return dom;
                        },
                        axisPointer: {
                            type: 'line',
                            lineStyle: {
                                color: '#ccc',
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    legend: {
                        show: false,
                        data: ['-']
                    },
                    toolbox: {
                        show: false
                    },
                    calculable: false,
                    dataZoom: {
                        show: false,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: [{
                        show: true,
                        type: 'category',
                        boundaryGap: true,
                        data: xdata,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitNumber: 2,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['#ccc'],
                                width: 1,
                                type: 'dashed'
                            }
                        }
                    }],
                    yAxis: [{
                            position: "left",
                            scale: true,
                            boundaryGap: [0.01, 0.01],
                            show: true,
                            type: 'value',
                            axisLabel: {
                                show: false,
                                formatter: function (data) {
                                    return data.toFixed(2);
                                },
                                textStyle: {
                                    color: '#c8c8c8'
                                }
                            },
                            //min: kminv,//kmin - ((kmax - kmin) / 5),//kmin * 0.93,
                            //max: kmaxv,//kmax + ((kmax - kmin) / 5),//kmax * 1.16,
                            splitNumber: 4,
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: ['#ccc'],
                                    width: 1,
                                    type: 'dashed'
                                }
                            }
                        },
                        {
                            type: 'value',
                            position: "right",
                            scale: true,
                            boundaryGap: [0.01, 0.01],
                            show: true,
                            axisLabel: {
                                show: false,
                                formatter: function (data) {
                                    return data.toFixed(2);
                                },
                                textStyle: {
                                    color: '#c8c8c8'
                                }
                            },
                            splitNumber: 4,
                            axisLine: {
                                show: false
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(150,150,150,0.1)',
                                    width: 1,
                                    type: 'solid'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'rgba(150,150,150,0.1)',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        }
                    ],
                    series: [{
                        name: '上证指数',
                        type: 'k',
                        smooth: false,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default',
                                    color: "#C4E1FF"
                                },
                                color: "#DD2200",
                                color0: "#00A800",
                                lineStyle: {
                                    width: 2,
                                    color: '#DD2200', // 阳线边框颜色
                                    color0: '#00A800' // 阴线边框颜色
                                }
                            },
                            emphasis: {
                                color: 'black', // 阳线填充颜色
                                color0: 'white' // 阴线填充颜色
                            }
                        },
                        //data: ydata,// 开盘，收盘，最低，最高
                        symbol: "none"
                    }]
                };
                config.yAxis[0].min = kmin - ((kmax - kmin) / 5); //* 0.93;
                config.yAxis[0].max = kmax + ((kmax - kmin) / 5); //* 1.16;
                config.yAxis[1].min = kmin - ((kmax - kmin) / 5);
                config.yAxis[1].max = kmax + ((kmax - kmin) / 5);
                config.series[0].data = ydata;
                myChart.setOption(config);
                // $(selector).css("background", "none");
                this.chart = myChart;
            }
        },
        chartLine: {
            chart: undefined,
            init: function (selector, json, full) {
                if (!json || !json.records)
                    return false;
                if (this.chart) {
                    this.chart.clear();
                    this.chart.dispose();
                    this.chart = undefined;
                }
                var myChart = echarts.init(document.querySelector(selector));
                
                var xdata = [],
                    ydata = [];
                var ymin, ymax;
                json.records.forEach(function (n, i) {
                    // console.log(i);
                    
                    if (i == 0) {
                        ymin = ymax = n[1];
                    }
                    xdata.push(n[0])
                    ymin = ymin > n[1] ? n[1] : ymin;
                    ymax = ymax < n[1] ? n[1] : ymax;
                    ydata.push(n[1]);
                });
                var a = ymin,
                    b = json.y_close,
                    c = ymax;
                var ab = Math.abs(b - a);
                var cb = Math.abs(c - b);

                var speed = ab > cb ? ab : cb; //中心线
                //console.log(speed, b);
                var min = a > b ? (b > c ? c : b) : a;

                if (a >= b && c >= b)
                    min = min - speed;
                //ymin = 0;
                //ymax = speed * 2;
                ymin = json.y_close - speed * 1.2;
                ymax = (+json.y_close) + speed * 1.2;
                for (var i = 0; i < ydata.length; i++) {
                    //ydata[i] = ydata[i] - min
                }
                full = full || 242;
                for (var i = 0; i < full - xdata.length; i++) {
                    xdata.push("-");
                    ydata.push("-");
                }
                var markLineData = [
                    [{
                            name: '',
                            xAxis: 0,
                            yAxis: json.y_close
                        },
                        {
                            name: '',
                            xAxis: xdata.length - 1,
                            yAxis: json.y_close
                        }
                    ]
                ];
                //ymax = ymax * 1.01;
                //ymin = ymin * 0.99;
                //var markLineData = [
                //     [
                //          { name: '昨日收盘', xAxis: 0, yAxis: json.y_close },
                //          { name: json.y_close, xAxis: xdata.length - 1, yAxis: json.y_close }
                //     ]
                //];
                var config = {
                    animation: false,
                    title: {
                        show: false
                    },
                    grid: {
                        x: 40,
                        x2: 45,
                        y: 5,
                        y2: 5,
                        borderColor: "#eee"
                    },
                    tooltip: {
                        trigger: 'axis',
                        borderColor: "#ccc",
                        showDelay: 10,
                        hideDelay: 10,
                        transitionDuration: 0.1,
                        borderWidth: 1,
                        backgroundColor: "#ffffff",
                        textStyle: {
                            color: "#666",
                            fontSize: 11,
                            fontFamily: "微软雅黑"
                        },
                        padding: 10,
                        formatter: function (data) {
                            var date = new Date(+data[0].name);
                                                        
                            var price = data[0].data;
                            var dom = date.format("yyyy年MM月dd日");
                            if (price == "-") {
                                dom = new Date().format("yyyy年MM月dd日")
                                dom += "<br/>时间：-";
                                dom += "<br/>价格：-";
                                dom += "<br/>涨跌：-";
                                dom += "<br/>涨跌幅：-";
                            } else {
                                price = parseFloat(price);
                                var p = (price - json.y_close).toFixed(2);
                                var pr = (p / json.y_close * 100).toFixed(2) + "%";
                                dom += "<br/>时间：" + date.format("hh:mm:ss");
                                dom += "<br/>价格：<span style='color:" + (p > 0 ? "red" : "green") + ";'>" + price.toFixed(
                                    2) + "</span>";
                                dom += "<br/>涨跌：<span style='color:" + (p > 0 ? "red" : "green") + ";'>" + p +
                                    "</span>";
                                dom += "<br/>涨跌幅：<span style='color:" + (p > 0 ? "red" : "green") + ";'>" + pr +
                                    "</span>";
                            }
                            return dom;
                        },
                        axisPointer: {
                            lineStyle: {
                                color: '#ccc',
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    legend: {
                        show: false,
                        data: ['-']
                    },
                    toolbox: {
                        show: false
                    },
                    calculable: false,
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: xdata,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitNumber: 0,
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: ['#ccc'],
                                width: 1,
                                type: 'dashed'
                            }
                        }
                    }],
                    yAxis: [{
                            show: true,
                            type: 'value',
                            position: 'left',
                            min: ymin,
                            max: ymax,
                            boundaryGap: false,
                            splitNumber: 4,
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                formatter: function (data) {
                                    return data.toFixed(2);
                                },
                                textStyle: {
                                    color: function (data) {
                                        var d = 1 * (+data).toFixed(2);
                                        if (d > json.y_close) return '#dd2200';
                                        if (d < json.y_close) return '#33aa60';
                                        if (json.y_close == "--") return '#c8c8c8';
                                        return '#c8c8c8';
                                    }
                                }
                            },
                            splitLine: { //zheli
                                show: false,
                                lineStyle: {
                                    color: ['#ccc'],
                                    width: 1,
                                    type: 'dashed'
                                }
                            }
                        },
                        {
                            type: 'value',
                            position: 'right',
                            min: (ymin - json.y_close) / json.y_close * 100,
                            max: (ymax - json.y_close) / json.y_close * 100,
                            boundaryGap: false,
                            splitLine: {
                                lineStyle: {
                                    color: '#f1f1f1',
                                    width: 1,
                                    type: 'solid'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#f1f1f1',
                                    width: 0,
                                    type: 'solid'
                                }
                            },
                            splitNumber: 4,
                            axisLabel: {
                                formatter: function (data) {
                                    return Math.abs(data).toFixed(2) + "%";
                                },
                                textStyle: {
                                    color: function (data) {
                                        if (json.y_close == "--") return '#c8c8c8';
                                        var d = 1 * parseFloat(data).toFixed(3);
                                        if (d >= 0.001) return '#dd2200';
                                        if (d < 0) return '#33aa60';
                                        return '#c8c8c8';
                                    }
                                }
                            }
                        }
                    ],
                    series: [{
                        name: '-',
                        type: 'line',
                        smooth: false,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                color: "#d5e1f2",
                                borderColor: "#3b98d3",
                                lineStyle: {
                                    width: 1,
                                    color: ['#3b98d3']
                                },
                            }
                        },
                        data: ydata,
                        symbol: "circle",
                        symbolSize: 1,
                        markLine: {
                            symbol: "none",
                            clickable: false,
                            large: true,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: ['#F96900'],
                                        width: 1,
                                        type: 'dashed'
                                    }
                                }
                            },
                            data: markLineData
                        }
                    }]
                };
                myChart.setOption(config);
                
                // $(selector).css("background", "none");
                this.chart = myChart;
                // console.log(this.chart);
            },
            push: function (json, full) {
                //console.log(this.chart);
                if (!this.chart) return;
                if (!json || !json.records)
                    return false;
                var option = this.chart.getOption();
                var xdata = [],
                    ydata = [];
                var ymin, ymax;
                json.records.forEach(function (i, n) {
                    if (i == 0) {
                        ymin = ymax = n[1];
                    }
                    xdata.push(n[0])
                    ymin = ymin > n[1] ? n[1] : ymin;
                    ymax = ymax < n[1] ? n[1] : ymax;
                    ydata.push(n[1]);
                });

                var a = ymin,
                    b = json.y_close,
                    c = ymax;
                var ab = Math.abs(b - a);
                var cb = Math.abs(c - b);

                var speed = ab > cb ? ab : cb; //中心线
                console.log(speed, b);
                var min = a > b ? (b > c ? c : b) : a;

                if (a >= b && c >= b)
                    min = min - speed;
                ymin = 0;
                ymax = speed * 2;

                for (var i = 0; i < ydata.length; i++) {
                    ydata[i] = ydata[i] - min;
                }

                full = full || 270;
                for (var i = 0; i < full - xdata.length; i++) {
                    xdata.push("-");
                    ydata.push("-");
                }
                var markLineData = [
                    [{
                            name: '',
                            xAxis: 0,
                            yAxis: speed
                        },
                        {
                            name: '',
                            xAxis: xdata.length - 1,
                            yAxis: speed
                        }
                    ]
                ];
                //ymax = ymax * 1.01;
                //ymin = ymin * 0.99;
                option.yAxis[0].min = ymin;
                option.yAxis[0].max = ymax;
                option.xAxis[0].data = xdata;
                option.series[0].data = ydata;
                option.series[0].markLine.data = markLineData;
                this.chart.setOption(option);
            }
        }
    }
};
let transformTool= {
    s0: function (t) {
        t = parseInt(Number(t));
        if (t < 0) return "";
        if (t < 10) return "0" + String(t);
        return String(t);
    },
    tIWS: function (t, e) {
        var i = [];
        for (var s = t; s <= e; s++) {
            i.push(this.s0(s / 60) + ":" + this.s0(s % 60));
        }
        return i;
    },
    gtr: function (t) {
        var e = [];
        for (var i, s, n, r, a, l, o, h = 0, f = t.length; h < f; h++) {
            n = t[h][0];
            r = t[h][1];
            a = Number(n.split(":")[0]) * 60 + Number(n.split(":")[1]);
            l = Number(r.split(":")[0]) * 60 + Number(r.split(":")[1]);
            o = this.tIWS(a, l);
            e = e.concat(o);
        }
        return e;
    },
    tradingA: [],
    gta: function () {
        if (!this.tradingA.length)
            this.tradingA = this.gtr([
                ["9:30", "11:30"],
                ["13:00", "15:00"]
            ]);
        return this.tradingA;
    },
    tradingUs: [],
    gtus: function () {
        if (!this.tradingUs.length)
            this.tradingUs = this.gtr([
                ["9:30", "16:00"]
            ]);
        return this.tradingUs;
    },
    tradingHk: [],
    gthk: function () {
        if (!this.tradingHk.length)
            this.tradingHk = this.gtr([
                ["09:30", "12:00"],
                ["13:00", "16:00"]
            ]);
        return this.tradingHk;
    },
    gata: function (t) {
        var e;
        switch (t) {
            case "US":
                e = this.gtus();
                break;
            case "HK":
                e = this.gthk();
                break;
            default:
            case "CN":
                e = this.gta();
                break;
        }
        return e;
    },
    ist: function (t, e) {
        t = t.toUpperCase();
        var i = this.gata(t);
        var s = NaN;
        if (i.indexOf) {
            s = i.indexOf(e);
        } else {
            for (var n = i.length; n--;) {
                if (i[n] == e) {
                    s = n;
                    break;
                }
            }
        }
        return s >= 0;
    },
    gltbt: function (t, e, i, s) {
        var n = [];
        var r = this.gata(s);
        var a = r.length;
        for (var l = 0, o = t * a; l < o; l++) {
            n.push({
                time: r[l % a],
                price: 0,
                percent: 0,
                avg_price: 0,
                volume: 0
            });
            if (!i) n[l].price = n[l].avg_price = e;
        }
        n[0].price = n[0].avg_price = n[0].prevclose = e;
        n[0].volume = n[0].totalVolume = n[0].totalAmount = 0;
        return n;
    },
    azft: function (t, e) {
        if (!t) return t;
        var i = this.gata(e);
        for (var s = 0, n = t.length; s < n; s++) t[s].time = i[s];
        t[0].date.setHours(0);
        return t;
    },
    c2b: function (t) {
        t = t.replace(" ", "+");
        var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
            t
        );
        return e >= 0 ? e : 0;
    },
    db: function (t) {
        if (!t) return [];
        var e = [];
        for (var i, s, n = 0, r = 0, a = 0, l = t.length; a < l; a++) {
            i = this.c2b(t.charAt(a));
            s = r & 6 ? (r & 7) ^ 7 : 5;
            n |= (i >> (5 - s)) << ((r ^ 7) - s);
            n == 64767 && i == 63 && (n = 65535);
            if (r > 25) {
                r -= 32;
                e[e.length] = n;
                n = 0;
            }
            n |= (i & ((1 << (5 - s)) - 1)) << ((r | 7) + 4 + s);
            r += 6;
        }
        return e;
    },
    fB: function (t, e, i) {
        var s = [];
        var n = this.gata(i),
            r = n.length * 3;
        var a = 0,
            l = 0,
            o;
        for (var h = 0, f = 0; f < r; f += 3) {
            h = Math.floor(f / 3);
            if (e) {
                s[s.length] = {
                    time: n[h],
                    price: t[f + 1] / 1e3
                };
            } else {
                s[s.length] = {
                    time: n[h],
                    avg_price: t[f] / 1e3,
                    price: t[f + 1] / 1e3,
                    volume: t[f + 2] / 100
                };
                if (s[h].volume > 0) l += s[h].volume;
                if (s[h].avg_price > 0) o = s[h].avg_price;
            }
        }
        if (s[0].price < 0) s[0].price = s[0].avg_price = l = a = 0;
        if (!e) {
            s[0].totalVolume = l;
            s[0].totalAmount = l * o;
        }
        return s;
    }
}

export {chart, transformTool};
