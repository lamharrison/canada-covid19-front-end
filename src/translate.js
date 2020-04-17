// Translate wording dict

const wording = [
    ["Update", "最近更新"],
    ["Regions", "地域"],
    ["Data", "数据"],
    ["Case", "确诊"],
    ["Death", "死亡"],
    ["Data might be incompleted", "数据有可能不完整"],

    // Charts
    ["C&D", "确诊/死亡"],
    ["Daily Increase", "日增长"],
    ["Growth Rate", "增长率"],
    ["Death Increase", "死亡增量"],
    ["Mortality Rate", "死亡率"],
    ["Tested Number", "测试数"],
    ["Positive Rate", "确诊率"],
    ["Confirmed", "确诊"],
    ["Full Chart", "全屏查看"],
    

    // HI
    ["Herd Immunity", "群体免疫"],
    ["UK Population", "英国总人口"],
    ["Immunity Point", "生效人口比例"],
    ["Million", "百万"],
    ["Progress", "进度"],

    ["Test", "测试"],
    ["Unknown Locations", "位置未知"],
    ["At least 1 day in arrears", "相比确诊数据有至少一天的延迟"],
    ["Location", "位置"],
    ["Cases", "数量"],
    ["References", "数据参考"],
    ["Support Us", "支持我们"],
    ["SUPPORT", "捐赠资助"],
    
    [
        "We promise free access, however, maintaining this server has costs and it's not cheap.", 
        "本网站是免费的，但维护和运营均产生高昂费用。如果你觉得不错，请帮助我们做的更好。"
    ],
    ["Map", "地图"],
    ["List", "列表"],
    ["Postcode", "邮编"],
    ["Your Postcode", "输入你的邮编"],
    ["Cases Near", "案例临近"],
    
    
    // World
    ["Analysis", "数据解析"],
    ["Europe", "欧洲主要"],
    ["UK Prediction", "英国预测"],
    [
        "Prediction model based on ANN machine learning algorithm trained with Italy, Germany and France's data.", 
        "预测模型基于ANN机器学习算法，参考意大利，德国和法国数据。"
    ],
    [
        "Constantly Optimising by @Big-Tree, @Jimmy.",
        "由 @林大树 和 @陆嘉铭 同学持续开发和优化"
    ],

    // Full Chart
    ["BACK", "返回"],
    ["Built for PC", "使用PC查看以获得最佳体验"],

    // Figures
    ["confirmed", "确诊"],
    ["death", "死亡"],
    ["cured", "治愈"],
    ["negative", "阴性"],
    ["tested", "测试"],
    ["D. Posi.", "日检出"],
    ["Posi. Rate", "检出率"],
    ["mortality", "死亡率"],
    ["serious", "危重"],
    ["suspected", "疑似"],

    // Cases Map
    ["Cases Map", "周边疫情"],
    ["Data Source", "数据来源"],

    // Area
    ["Timeline", "时间轴"],
    ["All", "全部"],
    ["BACK", "返回"],


    // Key data
    ["Key Data", "关键数据"],
    ["Global data has 1 Day Delay", "全球数据有1天延迟"],
    ["Global Cases", "全球感染"],
    ["Global Death", "全球死亡"],
    ["Cases to go until herd immunity(UK)", "英国距群体免疫还需"],


    // Group Up
    ["Group Up", "群组讨论"],
    ["By", "通过"],

    // Donation
    ["THANK YOU", "谢谢支持"],
    [
        "Donation will be use for server maintenance, pay for data services(eg. Map), and team members health protection.", 
        "捐赠将会被用于服务维护，支付第三方数据服务(如地图等)，和团队成员的自我卫生保护。"
    ],
    ["CLOSE", "关闭"],

    // Heatmap
    ["Data Release", "数据更新时间"],
    ["when gov.uk website was edited (some might not updating figures)", "显示官方信息何时被编辑过(部分行为可能不是更新数据)"],

    ["Author", "作者"],
    ["Contributor", "团队贡献"],
    ["Others", "其他国家"]
    
]

const alert = {
    en: "<br>This is a data visualisation for <b>COVID-19</b> in the UK, but just <b>as a reference</b>. <br><br> You need to understand: <br><br> 1. These data might <b>NOT</b> be completely accurate or updated. <br> 2. All marker on the map represent an area, <b>NOT building or street</b>. <br> 3. The developer takes <b>NO responsibility</b> for data accuracy and service stability. <br><br> Please double check with <b>official channel</b> before act on it. Cookie in used for statistical purposes.",
    cn: "<br>本页面展示<b>COVID-19</b>英国疫情实时数据可视化, 所有数据及内容<b>仅供参考</b>。 <br><br> 你必须了解以下条款: <br><br> 1. 这些数据可能 <b>不是</b> 最新的或者精确的。 <br> 2. 区域数据中的标记<b>表示区域，不代表街道或建筑</b>。 <br> 3. 开发者<b>没有义务</b>去保证数据的精确及服务的稳定性。 <br><br> 在您基于本数据采取任何行动之前，请参考 <b>官方渠道和指引</b>。 因统计原因浏览器Cookie将被使用。"
}


export function putCN(str){
    for(let i=0;i<wording.length;i++){
        if(str == wording[i][0]){
            return wording[i][1]
        }
    }

    return str
}

export function getAlert(lang){
    if(lang == "zh-CN"){
        return alert.cn
    } else {
        return alert.en
    }
    
}
