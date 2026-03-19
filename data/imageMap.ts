// Maps knowledge point tags to image paths
// _a = with text label (for teaching/study)
// _b = icon only (for exam/test)

export interface ImageMapping {
  src: string;
  srcExam?: string; // optional B variant for exams
  alt: string;
  caption?: string;
  captionZh?: string;
}

// Helper to build regulatory sign entries
function reg(name: string, alt: string, caption: string, captionZh: string): ImageMapping[] {
  return [{
    src: `/visuals/regulatory_signs/${name}_a.png`,
    srcExam: `/visuals/regulatory_signs/${name}_b.png`,
    alt, caption, captionZh,
  }];
}

// Helper to build traffic/warning sign entries
function warn(name: string, alt: string, caption: string, captionZh: string): ImageMapping[] {
  return [{
    src: `/visuals/traffic_signs/${name}_a.png`,
    srcExam: `/visuals/traffic_signs/${name}_b.png`,
    alt, caption, captionZh,
  }];
}

export const tagImages: Record<string, ImageMapping[]> = {
  // ── Traffic Signals ──
  "red-light": [{ src: "/visuals/signals/red-light.gif", alt: "Solid Red Light", caption: "Solid Red Light", captionZh: "红灯" }],
  "red-arrow": [{ src: "/visuals/signals/red-arrow.gif", alt: "Red Arrow Signal", caption: "Red Arrow", captionZh: "红色箭头信号" }],
  "yellow-light": [{ src: "/visuals/signals/yellow-light.gif", alt: "Solid Yellow Light", caption: "Yellow Light", captionZh: "黄灯" }],
  "yellow-arrow": [{ src: "/visuals/signals/yellow-arrow.gif", alt: "Yellow Arrow Signal", caption: "Yellow Arrow", captionZh: "黄色箭头信号" }],
  "green-light": [{ src: "/visuals/signals/green-light.gif", alt: "Solid Green Light", caption: "Green Light", captionZh: "绿灯" }],
  "green-arrow": [{ src: "/visuals/signals/green-arrow.gif", alt: "Green Arrow Signal", caption: "Green Arrow", captionZh: "绿色箭头信号" }],
  "flashing-red": [{ src: "/visuals/signals/red-flashing.png", alt: "Flashing Red Light", caption: "Flashing Red", captionZh: "闪烁红灯" }],
  "flashing-yellow": [{ src: "/visuals/signals/yellow-flashing.gif", alt: "Flashing Yellow Light", caption: "Flashing Yellow", captionZh: "闪烁黄灯" }],
  "pedestrian-signal": [
    { src: "/visuals/signals/walk.png", alt: "Walk Signal", caption: "Walk", captionZh: "行人通行信号" },
    { src: "/visuals/signals/dont-walk.png", alt: "Don't Walk Signal", caption: "Don't Walk", captionZh: "行人禁行信号" },
  ],
  "diagonal-crossing": [{ src: "/visuals/signals/diagonal-crossing.png", alt: "Diagonal Crossing", caption: "Diagonal Pedestrian Crossing", captionZh: "对角线行人过街" }],

  // ── Hand-and-Arm Signals ──
  "hand-signal-left": [{ src: "/visuals/hand-signals/left-turn.png", alt: "Hand Signal: Left Turn", caption: "Left Turn – arm straight out", captionZh: "左转手势 – 左臂伸直" }],
  "hand-signal-right": [{ src: "/visuals/hand-signals/right-turn.png", alt: "Hand Signal: Right Turn", caption: "Right Turn – arm bent up", captionZh: "右转手势 – 左臂弯曲向上" }],
  "hand-signal-stop": [{ src: "/visuals/hand-signals/slow-stop.png", alt: "Hand Signal: Slow or Stop", caption: "Slow / Stop – arm bent down", captionZh: "减速/停车手势 – 左臂弯曲向下" }],
  "hand-signal": [
    { src: "/visuals/hand-signals/left-turn.png", alt: "Hand Signal: Left Turn", caption: "Left Turn", captionZh: "左转" },
    { src: "/visuals/hand-signals/right-turn.png", alt: "Hand Signal: Right Turn", caption: "Right Turn", captionZh: "右转" },
    { src: "/visuals/hand-signals/slow-stop.png", alt: "Hand Signal: Slow or Stop", caption: "Slow / Stop", captionZh: "减速/停车" },
  ],

  // ── Regulatory Signs (new individual images) ──
  "stop-sign": [{ src: "/visuals/signs/stop.gif", alt: "Stop Sign", caption: "STOP Sign", captionZh: "停车标志" }],
  "yield-sign": [{ src: "/visuals/signs/yield.gif", alt: "Yield Sign", caption: "YIELD Sign", captionZh: "让行标志" }],
  "do-not-enter": [{ src: "/visuals/signs/do-not-enter.png", alt: "Do Not Enter", caption: "DO NOT ENTER", captionZh: "禁止驶入" }],
  "wrong-way": [{ src: "/visuals/signs/wrong-way.gif", alt: "Wrong Way", caption: "WRONG WAY", captionZh: "逆行标志" }],
  "railroad": [{ src: "/visuals/signs/railroad.png", alt: "Railroad Crossing", caption: "Railroad Crossing", captionZh: "铁路道口" }],
  "school-zone": [{ src: "/visuals/signs/school-zone.png", alt: "School Zone", caption: "School Zone", captionZh: "学校区域" }],

  // Regulatory — from new split images
  "no-u-turn": reg("no-u-turn", "No U-Turn", "No U-Turn", "禁止掉头"),
  "no-left-turn": reg("no-left-turn", "No Left Turn", "No Left Turn", "禁止左转"),
  "no-right-turn": reg("no-right-turn", "No Right Turn", "No Right Turn", "禁止右转"),
  "no-turns": reg("no-turns", "No Turns", "No Turns", "禁止转弯"),
  "do-not-pass": reg("do-not-pass", "Do Not Pass", "Do Not Pass", "禁止超车"),
  "do-not-block": reg("do-not-block-intersection", "Do Not Block Intersection", "Do Not Block Intersection", "禁止堵塞路口"),
  "one-way": reg("one-way", "One Way", "One Way", "单行道"),
  "one-way-arrow": reg("one-way-arrow", "One Way Arrow", "One Way Arrow", "单行道箭头"),
  "keep-right": reg("keep-right", "Keep Right", "Keep Right", "靠右行驶"),
  "slower-traffic-keep-right": reg("slower-traffic-keep-right", "Slower Traffic Keep Right", "Slower Traffic Keep Right", "慢车靠右"),
  "left-turn-only": reg("left-turn-only", "Left Turn Only", "Left Turn Only", "仅限左转"),
  "u-turn-only": reg("u-turn-only", "U-Turn Only", "U-Turn Only", "仅限掉头"),
  "left-turn-yield-green": reg("left-turn-yield-on-green", "Left Turn Yield on Green", "Left Turn Yield on Green", "绿灯左转让行"),
  "no-parking": reg("no-parking-any-time", "No Parking Any Time", "No Parking Any Time", "任何时候禁止停车"),
  "emergency-parking": reg("emergency-parking-only", "Emergency Parking Only", "Emergency Parking Only", "仅限紧急停车"),
  "two-way-traffic-ahead": reg("two-way-traffic-ahead", "Two Way Traffic Ahead", "Two Way Traffic Ahead", "前方双向行车"),
  "yield-to-uphill": reg("yield-to-uphill-traffic", "Yield to Uphill Traffic", "Yield to Uphill Traffic", "让行上坡车辆"),
  "thru-traffic-merge-left": reg("thru-traffic-merge-left", "Thru Traffic Merge Left", "Thru Traffic Merge Left", "直行车辆向左汇入"),
  "3-tracks": reg("3-tracks", "3 Tracks Railroad", "3 Tracks", "三条铁轨"),

  // Construction Signs
  "road-closed": reg("road-closed-ahead", "Road Closed Ahead", "Road Closed Ahead", "前方道路封闭"),
  "road-machinery": reg("road-machinery-ahead", "Road Machinery Ahead", "Road Machinery Ahead", "前方有施工机械"),
  "shoulder-work": reg("shoulder-work-ahead", "Shoulder Work Ahead", "Shoulder Work Ahead", "前方路肩施工"),
  "worker-symbol": reg("worker-symbol", "Worker Symbol", "Construction Zone", "施工区域"),

  // Hazmat Placards
  "flammable": reg("flammable", "Flammable", "Flammable", "易燃物"),
  "explosives": reg("explosives", "Explosives", "Explosives", "爆炸物"),
  "radioactive": reg("radioactive", "Radioactive", "Radioactive", "放射性物质"),
  "oxidizer": reg("oxidizer", "Oxidizer", "Oxidizer", "氧化剂"),

  // Guide / Info Signs
  "slow-moving-vehicle": reg("slow-moving-vehicle", "Slow Moving Vehicle", "Slow Moving Vehicle", "慢速车辆"),
  "rest-area": reg("rest-area", "Rest Area", "Rest Area", "休息区"),
  "airport": reg("airport", "Airport", "Airport", "机场"),
  "hiking-skiing": reg("hiking_skiing", "Hiking / Skiing", "Recreation Area", "休闲区域"),

  // ── Warning / Traffic Signs (yellow diamond) ──
  "curve-ahead": warn("curve-ahead", "Curve Ahead", "Curve Ahead", "前方弯道"),
  "winding-road": warn("winding-road", "Winding Road", "Winding Road", "蜿蜒道路"),
  "slippery-when-wet": warn("slippery-when-wet", "Slippery When Wet", "Slippery When Wet", "路面湿滑"),
  "stop-ahead": warn("stop-ahead", "Stop Ahead", "Stop Ahead", "前方停车"),
  "yield-ahead": warn("yield-ahead", "Yield Ahead", "Yield Ahead", "前方让行"),
  "traffic-signal-ahead": warn("traffic-signal-ahead", "Traffic Signal Ahead", "Traffic Signal Ahead", "前方有信号灯"),
  "pedestrian-crossing": warn("pedestrian-crossing", "Pedestrian Crossing", "Pedestrian Crossing", "行人过街"),
  "crossroad": warn("crossroad", "Crossroad", "Crossroad Ahead", "前方十字路口"),
  "t-intersection-sign": warn("t-intersection", "T Intersection", "T Intersection Ahead", "前方T型路口"),
  "two-way-traffic": warn("two-way-traffic", "Two Way Traffic", "Two Way Traffic", "双向交通"),
  "divided-highway": warn("divided-highway", "Divided Highway", "Divided Highway Begins", "分隔公路开始"),
  "end-divided-highway": warn("end-divided-highway", "End Divided Highway", "Divided Highway Ends", "分隔公路结束"),
  "added-lane": warn("added-lane", "Added Lane", "Added Lane", "新增车道"),
  "lane-ends": warn("lane-ends", "Lane Ends", "Lane Ends", "车道结束"),
  "merging-traffic": warn("merging-traffic", "Merging Traffic", "Merging Traffic", "汇入交通"),
  "directional-arrow": warn("directional-arrow", "Directional Arrow", "Directional Arrow", "方向箭头"),

  // ── Lane Markings ──
  "double-yellow": [{ src: "/visuals/lanes/double-yellow.png", alt: "Double Solid Yellow Lines", caption: "Double Solid Yellow Lines", captionZh: "双实黄线" }],
  "lane-numbers": [{ src: "/visuals/lanes/multi-lane.png", alt: "Multi-lane Highway", caption: "Numbered Traffic Lanes", captionZh: "多车道高速公路" }],
  "end-of-lane": [{ src: "/visuals/lanes/end-of-lane.png", alt: "End of Lane Markings", caption: "End of Lane Markings", captionZh: "车道结束标线" }],
  "yield-line": [{ src: "/visuals/lanes/yield-line.png", alt: "Yield Line", caption: "Yield Line", captionZh: "让行线" }],
  "carpool": [{ src: "/visuals/lanes/carpool.png", alt: "Carpool/HOV Lane", caption: "Carpool (HOV) Lane", captionZh: "合乘车道" }],
  "hov": [{ src: "/visuals/lanes/hov.jpg", alt: "HOV Lane Sign", caption: "HOV 2+ Occupancy", captionZh: "HOV车道需2人以上" }],
  "bicycle-lane": [{ src: "/visuals/lanes/bicycle-lane.png", alt: "Bicycle Lane", caption: "Bicycle Lane", captionZh: "自行车道" }],
  "center-left-turn": [{ src: "/visuals/lanes/center-left-turn.png", alt: "Center Left Turn Lane", caption: "Center Left Turn Lane", captionZh: "中央左转车道" }],
  "turnout": [{ src: "/visuals/lanes/turnout.png", alt: "Turnout Sign", caption: "Slower Traffic Use Turnouts", captionZh: "慢车使用让车道" }],

  // ── Turns ──
  "right-turn": [{ src: "/visuals/turns/right-turn.png", alt: "Right Turn", caption: "Right Turn", captionZh: "右转" }],
  "left-turn": [{ src: "/visuals/turns/left-turn.png", alt: "Left Turn", caption: "Left Turn", captionZh: "左转" }],
  "turn-diagrams": [
    { src: "/visuals/turns/left-two-way.png", alt: "Left Turn Two-Way", caption: "Left Turn: Two-Way to Two-Way", captionZh: "左转：双向道转双向道" },
    { src: "/visuals/turns/left-two-to-one.png", alt: "Left Turn Two-to-One", caption: "Left Turn: Two-Way to One-Way", captionZh: "左转：双向道转单向道" },
  ],
  "right-turn-dedicated": [{ src: "/visuals/turns/right-dedicated.png", alt: "Right Turn Dedicated Lane", caption: "Right Turn from Dedicated Lane", captionZh: "从专用车道右转" }],
  "t-intersection": [{ src: "/visuals/turns/t-intersection.png", alt: "T-Intersection", caption: "T-Intersection Turn", captionZh: "T型路口转弯" }],

  // ── Roundabouts ──
  "roundabout": [
    { src: "/visuals/roundabouts/roundabout-right.png", alt: "Roundabout Right", caption: "Roundabout: Right Turn", captionZh: "环形路口：右转" },
    { src: "/visuals/roundabouts/roundabout-straight.png", alt: "Roundabout Straight", caption: "Roundabout: Straight", captionZh: "环形路口：直行" },
    { src: "/visuals/roundabouts/roundabout-left.png", alt: "Roundabout Left", caption: "Roundabout: Left/U-Turn", captionZh: "环形路口：左转/掉头" },
  ],

  // ── Parking ──
  "parallel-parking": [{ src: "/visuals/parking/parallel-parking.png", alt: "Parallel Parking", caption: "Parallel Parking Steps", captionZh: "侧方位停车步骤" }],
  "parking-hill": [{ src: "/visuals/parking/parking-on-hill.jpg", alt: "Parking on a Hill", caption: "Parking on a Hill", captionZh: "坡道停车" }],
  "colored-curbs": [{ src: "/visuals/parking/colored-curbs.png", alt: "Colored Curbs", caption: "Colored Curb Zones", captionZh: "彩色路缘区域" }],
  "disabled-parking": [{ src: "/visuals/parking/disabled-parking-sign.png", alt: "Disabled Parking", caption: "Disabled Person Parking", captionZh: "残疾人停车位" }],

  // ── Sharing the Road ──
  "school-bus": [{ src: "/visuals/sharing/school-bus-stop.png", alt: "School Bus Stop", caption: "School Bus Stop Rules", captionZh: "校车停车规则" }],
  "emergency-vehicle": [{ src: "/visuals/sharing/firetruck-pullover.png", alt: "Pull Over for Emergency", caption: "Pull Over for Emergency Vehicles", captionZh: "为紧急车辆让行" }],
  "truck-blind-spots": [{ src: "/visuals/sharing/truck-blind-spots.png", alt: "Truck Blind Spots", caption: "Truck/Bus Blind Spots", captionZh: "大型车辆盲区" }],
  "bicycle-safety": [
    { src: "/visuals/sharing/bike-passing-right.png", alt: "Correct Passing", caption: "Correct: 3ft+ gap", captionZh: "正确：3英尺以上间距" },
    { src: "/visuals/sharing/bike-passing-wrong.png", alt: "Wrong Passing", caption: "Wrong: Too close", captionZh: "错误：太近" },
  ],
  "bicycle-intersection": [{ src: "/visuals/sharing/bike-intersection.png", alt: "Bicycle at Intersection", caption: "Watch for Bikes", captionZh: "路口注意自行车" }],
  "light-rail": [{ src: "/visuals/sharing/light-rail.png", alt: "Light Rail", caption: "Light Rail Safety", captionZh: "轻轨安全" }],
  "hazard-placards": [{ src: "/visuals/sharing/hazard-placards.png", alt: "Hazard Placards", caption: "Hazardous Materials", captionZh: "危险品标识" }],

  // ── Safety ──
  "blind-spots": [{ src: "/visuals/safety/blind-spots.png", alt: "Blind Spots", caption: "Blind Spots Diagram", captionZh: "车辆盲区" }],
  "awareness": [{ src: "/visuals/safety/awareness.png", alt: "Awareness Zones", caption: "Driver Awareness", captionZh: "驾驶员视野" }],
  "collision-impact": [{ src: "/visuals/safety/collision-impact.png", alt: "Collision Impact", caption: "Collision Impact at Speed", captionZh: "碰撞冲击力" }],

  // ── Alcohol & Drugs ──
  "bac": [{ src: "/visuals/alcohol/bac-chart.png", alt: "BAC Chart", caption: "BAC Reference Chart", captionZh: "血液酒精浓度表" }],

  // ── Reference Charts (keep for section headers) ──
  "sign-chart": [
    { src: "/visuals/signs/sign-chart-1.png", alt: "Sign Chart 1", caption: "Regulatory & Warning Signs", captionZh: "管制和警告标志" },
    { src: "/visuals/signs/sign-chart-2.png", alt: "Sign Chart 2", caption: "Warning Signs (Continued)", captionZh: "警告标志（续）" },
  ],
};

// Section-level images: show at the top of a section
export const sectionImages: Record<string, ImageMapping[]> = {
  "M02-S01": [{ src: "/visuals/signs/sign-chart-1.png", alt: "Regulatory Signs Chart", caption: "Common Regulatory & Warning Signs", captionZh: "常见管制和警告标志" }],
  "M02-S02": [{ src: "/visuals/signs/sign-chart-2.png", alt: "Warning Signs Chart", caption: "Warning Signs Reference", captionZh: "警告标志一览" }],
  "M02-S04": [{ src: "/visuals/lanes/double-yellow.png", alt: "Lane Markings", caption: "Pavement Markings", captionZh: "路面标线" }],
  "M05-S01": [{ src: "/visuals/lanes/multi-lane.png", alt: "Multi-lane Highway", caption: "Lane Numbering", captionZh: "车道编号" }],
  "M05-S02": [{ src: "/visuals/turns/left-two-way.png", alt: "Turn Diagrams", caption: "Turn Diagrams", captionZh: "转弯图示" }],
  "M05-S04": [{ src: "/visuals/roundabouts/roundabout-right.png", alt: "Roundabout", caption: "Roundabout Navigation", captionZh: "环形路口导航" }],
  "M06-S01": [{ src: "/visuals/parking/parallel-parking.png", alt: "Parallel Parking", caption: "Parallel Parking Steps", captionZh: "侧方位停车步骤" }],
  "M06-S02": [{ src: "/visuals/parking/parking-on-hill.jpg", alt: "Hill Parking", caption: "Parking on Hills", captionZh: "坡道停车" }],
  "M06-S03": [{ src: "/visuals/parking/colored-curbs.png", alt: "Colored Curbs", caption: "Colored Curb Zones", captionZh: "彩色路缘含义" }],
  "M08-S01": [{ src: "/visuals/sharing/school-bus-stop.png", alt: "School Bus", caption: "School Bus Stop Rules", captionZh: "校车停车规则" }],
  "M08-S02": [{ src: "/visuals/sharing/bike-passing-right.png", alt: "Bicycle Safety", caption: "Safely Passing Bicyclists", captionZh: "安全超越骑车人" }],
  "M08-S03": [{ src: "/visuals/sharing/truck-blind-spots.png", alt: "Truck Blind Spots", caption: "Truck & Bus Blind Spots", captionZh: "大型车辆盲区" }],
  "M09-S01": [{ src: "/visuals/safety/awareness.png", alt: "Awareness", caption: "Be Aware of Surroundings", captionZh: "注意周围环境" }],
  "M09-S02": [{ src: "/visuals/safety/blind-spots.png", alt: "Blind Spots", caption: "Check Blind Spots", captionZh: "检查盲区" }],
  "M10-S01": [{ src: "/visuals/alcohol/bac-chart.png", alt: "BAC Chart", caption: "BAC Reference", captionZh: "血液酒精浓度表" }],
};
