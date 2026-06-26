"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

export type Language = "en" | "zh";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  tx: (text: string) => string;
};

const storageKey = "vce-pathway-language";

const I18nContext = createContext<I18nContextValue | null>(null);

const zhExact: Record<string, string> = {
  "Home": "首页",
  "Start": "开始",
  "Compare": "专业对比",
  "ROI Calculator": "投资回报计算器",
  "Payback Calculator": "回本计算器",
  "Consultation": "咨询",
  "Language": "语言",
  "简体中文": "简体中文",
  "VCE Pathway Compass": "VCE Pathway Compass",

  "Practical pathway decision tool": "实用升学路径决策工具",
  "Compare Australian university pathways by prerequisites, risk, salary, and career reality.": "从入学要求、风险、薪资和职业现实角度，对比澳大利亚大学专业路径。",
  "Built for VCE students, international students, and Chinese-speaking families who need a calmer, more analytical way to narrow major choices before applications, tuition commitments, or advice sessions.": "面向 VCE 学生、国际学生和中文家庭，帮助你在申请、支付学费或寻求咨询前，用更冷静、分析性的方式缩小专业选择范围。",
  "Compare Majors": "对比专业",
  "What it helps with": "它能帮助你什么",
  "Designed for difficult education decisions": "为高成本升学选择而设计",
  "Use the questionnaire to build a shortlist, then compare pathways against the evidence families actually care about: entry barriers, employment, workload, risk, and lifestyle trade-offs.": "先用问卷生成候选专业，再围绕家庭真正关心的证据进行对比：入学门槛、就业、工作量、风险和生活方式取舍。",
  "Compare prerequisites and ATAR signals": "对比先修要求与 ATAR 信号",
  "Review university-specific Go8 entries instead of treating one course rule as universal.": "查看 Go8 大学的具体课程信息，而不是把某一个课程规则当成所有大学通用。",
  "Understand salary, employment, workload, and risks": "理解薪资、就业、工作量和风险",
  "See sourced graduate outcomes, work settings, hours, and practical downside before committing.": "在做决定前，查看有来源支持的毕业生就业结果、工作场景、工作时间和现实风险。",
  "See trade-offs for international students and families": "看清国际学生和家庭需要考虑的取舍",
  "Spot pathways where registration, placements, or competitive hiring deserve extra caution.": "识别那些需要特别注意注册、实习或激烈招聘竞争的路径。",
  "Generate a practical pathway shortlist": "生成实用的专业候选清单",
  "Start with fit, then compare evidence side by side before spending more time or tuition dollars.": "先看匹配度，再并排比较证据，避免过早投入大量时间或学费。",
  "Estimate payback time": "估算回本时间",
  "Estimate study cost, tax-adjusted income, free cash flow, and payback time under different scenarios.": "在不同情景下估算学习成本、税后收入、自由现金流和回本时间。",
  "How to use this tool": "如何使用这个工具",
  "A simple workflow for a high-stakes choice": "高成本选择的简单流程",
  "The goal is not to promise a perfect answer. The goal is to help you compare realistic options with clearer evidence and fewer blind spots.": "目标不是给出完美答案，而是帮助你用更清晰的证据比较现实选项，减少盲区。",
  "Fill in your subjects, strengths, and preferences": "填写你的科目、优势和偏好",
  "Get a pathway profile and recommendations": "获得路径画像和推荐结果",
  "Compare majors side by side with source-backed evidence": "用有来源支持的证据并排对比专业",
  "Source-backed guidance only. This tool does not provide admission, migration, salary, financial, or career advice.": "本工具只提供有来源支持的规划参考，不提供录取、移民、薪资、财务或职业建议。",

  "Questionnaire": "问卷",
  "Methodology": "方法说明",
  "How the ROI model works": "ROI 模型如何计算",
  "How the payback model works": "回本模型如何计算",
  "The calculator is a planning model, not financial advice. These assumptions make the comparison explicit so families can edit inputs instead of treating outputs as predictions.": "这个计算器是规划模型，不是财务建议。这些假设会被明确展示，方便家庭修改输入，而不是把结果当成预测。",
  "Opportunity Cost Rate": "机会成本率",
  "Opportunity cost rate": "机会成本率",
  "Tuition Fee Escalation": "学费上涨",
  "Tuition escalation": "学费上涨率",
  "Living Costs": "生活费",
  "Living cost escalation": "生活费上涨率",
  "Salary Data": "薪资数据",
  "Working life modelled": "建模工作年限",
  "This model uses a 7% real annual return as the opportunity cost baseline, representing the S&P 500 inflation-adjusted historical return (1928-2024, including dividend reinvestment). A real rate is used because Australian graduate real wage growth has been approximately zero in recent years, making a nominal-vs-nominal comparison misleading. Using the nominal rate (~10%) instead would improve all ROI figures by approximately 2-3 percentage points per year.": "本模型使用 7% 的实际年化收益率作为机会成本基准，代表标普 500 在扣除通胀后的历史回报（1928-2024，包含股息再投资）。使用实际收益率，是因为近年澳大利亚毕业生实际工资增长大致接近 0%；如果用名义收益率与名义工资直接比较，容易产生误导。若改用约 10% 的名义收益率，所有 ROI 结果大约会每年改善 2-3 个百分点。",
  "This model uses a 7% real annual return as the opportunity cost baseline, representing the S&P 500 inflation-adjusted historical return (1928-2024, including dividend reinvestment). A real rate is used because Australian graduate real wage growth has been approximately zero in recent years, making a nominal-vs-nominal comparison misleading. Using the nominal rate (~10%) instead would improve payback outputs by approximately 2-3 percentage points per year.": "本模型使用 7% 的实际年化收益率作为机会成本基准，代表标普 500 在扣除通胀后的历史回报（1928-2024，包含股息再投资）。使用实际收益率，是因为近年澳大利亚毕业生实际工资增长大致接近 0%；如果用名义收益率与名义工资直接比较，容易产生误导。若改用约 10% 的名义收益率，回本结果大约会每年改善 2-3 个百分点。",
  "International student tuition fees at Australian universities have risen at an average of ~5.1% per annum between 2018 and 2025 (Studymove, 2025), representing a real escalation of approximately 2% above CPI. This model applies 5% annual tuition escalation for the full duration of the degree.": "根据 Studymove 2025 的数据，2018 到 2025 年间，澳大利亚大学国际学生学费平均每年上涨约 5.1%，大约比 CPI 高出 2 个百分点。本模型在整个学位期间使用 5% 的年度学费上涨率。",
  "Living costs represent the full opportunity cost of funds remitted to Australia, not an incremental cost above domestic alternatives. The comparison in this model is studying abroad versus investing the same capital; therefore all Australian living expenditure is included. The default figure of AUD 40,000 reflects typical international student expenditure in Melbourne (shared housing, self-catering). The visa financial requirement of AUD 29,710 is a government administrative threshold and does not reflect realistic student expenditure.": "生活费代表汇入澳大利亚资金的完整机会成本，而不是相对于国内生活的额外差额。本模型比较的是出国学习与把同样资金用于投资，因此澳大利亚期间的生活支出全部计入。默认值 AUD 40,000 代表墨尔本较典型的国际学生支出（合租住房、自己做饭）。AUD 29,710 的签证资金要求是政府行政门槛，不代表现实生活成本。",
  "Graduate salary figures are sourced from QILT (Quality Indicators for Learning and Teaching) median salary data. Occupational salary benchmarks are drawn from JSA (Jobs and Skills Australia) occupational median earnings. Employment probability is adjusted using QILT full-time employment rates by field of study.": "毕业生薪资来自 QILT（Quality Indicators for Learning and Teaching）的中位薪资数据。职业薪资基准来自 JSA（Jobs and Skills Australia）的职业中位收入。就业概率使用 QILT 按学习领域划分的全职就业率进行调整。",
  "1. This model assumes zero real wage growth for graduates, consistent with recent Australian labour market conditions. If real wage growth resumes, ROI figures will improve. 2. Exchange rate risk (AUD/CNY) is not modeled. 3. Non-financial returns (network, immigration pathways, credential signalling) are excluded by design. 4. All figures are in real (inflation-adjusted) AUD unless otherwise stated.": "1. 本模型假设毕业生实际工资增长为 0，与近年澳大利亚劳动力市场情况一致。如果实际工资增长恢复，ROI 会改善。2. 未建模汇率风险（AUD/CNY）。3. 人脉、移民路径、学历信号等非财务回报被刻意排除。4. 除非另有说明，所有金额均以实际（扣除通胀后的）澳元表示。",
  "1. This model assumes zero real wage growth for graduates, consistent with recent Australian labour market conditions. If real wage growth resumes, payback outputs will improve. 2. Exchange rate risk (AUD/CNY) is not modeled. 3. Non-financial returns (network, immigration pathways, credential signalling) are excluded by design. 4. All figures are in real (inflation-adjusted) AUD unless otherwise stated.": "1. 本模型假设毕业生实际工资增长为 0，与近年澳大利亚劳动力市场情况一致。如果实际工资增长恢复，回本结果会改善。2. 未建模汇率风险（AUD/CNY）。3. 人脉、移民路径、学历信号等非财务回报被刻意排除。4. 除非另有说明，所有金额均以实际（扣除通胀后的）澳元表示。",
  "Living cost tier": "生活费档位",
  "Choose a quick living-cost assumption. You can still edit the amount manually below.": "选择一个快速生活费假设。下面仍然可以手动修改具体金额。",
  "Visa minimum (unrealistic for most students)": "签证最低要求（对大多数学生不现实）",
  "Typical student lifestyle (shared housing, self-catering)": "典型学生生活方式（合租、自己做饭）",
  "Comfortable (based on ASFA single renter benchmark)": "较舒适生活（参考 ASFA 单身租房者基准）",
  "year": "年",
  "Compounded study cost": "复利后的学习成本",
  "Not available": "不可用",
  "Tuition and study-period living costs are compounded to graduation using the model return rate.": "学费和学习期间生活费会按模型收益率复利计算到毕业时点。",
  "The study-cost balance keeps compounding each year, then risk-adjusted free cash flow is used to reduce it until recovered.": "学习成本余额每年继续复利增长，然后用风险调整后的自由现金流抵扣，直到回本。",
  "QILT full-time employment rate": "QILT 全职就业率",
  "Less than 60% of graduates secure full-time employment (QILT). This significantly extends the real payback period.": "低于 60% 的毕业生获得全职工作（QILT）。这会显著拉长真实回本时间。",
  "Shown separately because employment risk is one of the biggest drivers of payback time.": "单独显示这一项，因为就业风险是影响回本时间的最大因素之一。",
  "Cumulative employed free cash flow invested at the model return rate. Salary rises linearly to occupation median salary by year 5.": "就业情景下的累计自由现金流按模型收益率滚动累积；收入在第 5 年线性达到职业中位薪资。",
  "Tuition compounded to graduation at the model return rate.": "学费按模型收益率复利计算到毕业时点。",
  "Tuition and study-period living costs compounded to graduation.": "学费和学习期间生活费复利计算到毕业时点。",
  "Each scenario compounds study costs and saved free cash flow at the model return rate. These are sensitivity tests, not forecasts.": "每个情景都会让学习成本和存下来的自由现金流按模型收益率复利计算。这些是敏感性测试，不是预测。",
  "Build a pathway profile before you compare": "先建立路径画像，再进行专业对比",
  "Use this short questionnaire to combine subjects, strengths, work preferences, and risk tolerance. No account is required.": "用这份简短问卷整合你的科目、优势、工作偏好和风险承受度。不需要注册账号。",
  "Your answers are processed locally in your browser. Some selections may appear in the page URL so results can be shared or refreshed.": "你的答案会在浏览器本地处理。部分选择可能出现在页面 URL 中，方便刷新或分享结果。",
  "Student background": "学生背景",
  "Start with your study stage and application context.": "先填写你的学习阶段和申请背景。",
  "Current stage": "当前阶段",
  "Studying in Australia?": "是否在澳大利亚学习？",
  "Student type": "学生身份",
  "Subjects and academic signals": "科目与学术信号",
  "Select the subjects you are taking, then mark where you currently feel strongest and weakest.": "选择你正在学习的科目，并标出你目前最强和最弱的科目。",
  "VCE subjects": "VCE 科目",
  "Strongest subjects": "最强科目",
  "Weakest subjects": "最弱科目",
  "Work preferences and trade-offs": "工作偏好与取舍",
  "Tell the tool what kind of work pressure, location, and lifestyle trade-off you can accept.": "告诉工具你可以接受怎样的工作压力、地点和生活方式取舍。",
  "Comfortable with competitive graduate paths?": "能接受竞争激烈的毕业生路径吗？",
  "Can accept regional, remote, or FIFO work?": "能接受偏远地区、远程或 FIFO 工作吗？",
  "Preferred salary level": "期望薪资水平",
  "Preferred work-life balance": "期望工作生活平衡",
  "Preferred work style": "偏好的工作方式",
  "Main priority": "最重要的优先事项",
  "Interest levels": "兴趣程度",
  "Use 1 for low interest and 5 for strong interest.": "1 表示兴趣较低，5 表示兴趣很强。",
  "Generate decision report": "生成决策报告",
  "Skip to comparison": "跳到专业对比",
  "What the report will do": "报告会做什么",
  "Rank pathways using transparent, rule-based scoring.": "用透明的规则评分对路径排序。",
  "Highlight likely upsides, workload, and risk trade-offs.": "突出潜在优势、工作量和风险取舍。",
  "Show Go8 course evidence and occupation sources for deeper comparison.": "展示 Go8 课程证据和职业来源，便于深入对比。",
  "Year 10 or below": "10 年级或以下",
  "Year 11": "11 年级",
  "Year 12": "12 年级",
  "Finished high school": "已高中毕业",
  "Parent or guardian researching": "家长或监护人正在了解",
  "Yes": "是",
  "No": "否",
  "Planning to": "计划去",
  "Domestic": "本地学生",
  "International": "国际学生",
  "Unsure": "不确定",
  "Maybe": "可能",
  "Flexible": "灵活",
  "Moderate is fine": "中等即可",
  "High": "高",
  "Very high": "很高",
  "ATAR": "ATAR",
  "Not usually": "通常不是",
  "years": "年",
  "Very important": "非常重要",
  "Balanced": "平衡",
  "Career growth first": "优先职业发展",
  "Mostly technical work": "以技术工作为主",
  "Mostly people-facing work": "以面对人的工作为主",
  "A mix of both": "两者结合",
  "Income": "收入",
  "Lifestyle": "生活方式",
  "Stability": "稳定性",
  "Flexibility": "灵活性",
  "Low": "低",
  "Medium": "中",
  "Maths": "数学",
  "Physics": "物理",
  "Chemistry": "化学",
  "Coding": "编程",
  "Business": "商科",
  "English": "英语",
  "Biology": "生物",
  "Psychology": "心理学",
  "Specialist Mathematics": "高阶数学",
  "Mathematical Methods": "数学方法",
  "Legal Studies": "法律研究",
  "Accounting": "会计",
  "Economics": "经济学",

  "Your pathway profile": "你的路径画像",
  "Quantitative / technical": "偏量化 / 技术型",
  "People-facing preference": "偏好与人沟通的工作",
  "High income priority": "重视高收入",
  "Stability-focused": "重视稳定性",
  "Lifestyle-focused": "重视生活方式",
  "International-risk sensitive": "需要关注国际学生相关风险",
  "Not tolerant of remote / FIFO work": "不太能接受偏远 / FIFO 工作",
  "Remote / FIFO tolerant": "可以接受偏远 / FIFO 工作",
  "Comfortable with competition": "可以接受竞争",
  "Comfortable with competitive pathways": "可以接受竞争激烈的路径",
  "Lower tolerance for high competition": "不太能接受高竞争",
  "Balanced preference profile": "偏好较均衡",

  "Decision report": "决策报告",
  "Pathway recommendations and risk signals": "专业路径推荐与风险信号",
  "This report combines your answers with sourced Go8 entry information, graduate outcome evidence, and occupation data. Use it to narrow options, then verify details before making a final decision.": "本报告会结合你的答案、Go8 入学信息、毕业生就业结果和职业数据。请用它缩小选择范围，并在最终决定前核实细节。",
  "Change answers": "修改答案",
  "Compare shortlist": "对比候选清单",
  "Open ROI calculator": "打开投资回报计算器",
  "Open payback calculator": "打开回本计算器",
  "Important reminder": "重要提醒",
  "This is a transparent rules-based tool. It does not provide admission, migration, salary, financial, or career advice, and it should not be treated as a guarantee of course entry or job outcome.": "这是一个透明的规则型工具，不提供录取、移民、薪资、财务或职业建议，也不应被视为课程录取或就业结果的保证。",
  "Top recommended pathways": "最推荐的专业路径",
  "These pathways currently look most aligned with your subjects, priorities, and work preferences.": "这些路径目前与你的科目、优先事项和工作偏好最匹配。",
  "Good options, but with caution": "可考虑，但需要谨慎",
  "These pathways still have upside, but one or more trade-offs deserve closer attention.": "这些路径仍有优势，但其中一个或多个取舍需要重点关注。",
  "Probably not first-choice options": "可能不应作为第一选择",
  "These pathways may still be viable, but the current fit signals are weaker than your top shortlist.": "这些路径仍可能可行，但当前匹配度弱于你的主要候选清单。",
  "Main risks to think about": "需要重点思考的风险",
  "These risks appeared repeatedly across the pathways in your shortlist.": "这些风险在你的候选路径中反复出现。",
  "Risk to pressure-test": "需要压力测试的风险",
  "How to use this report well": "如何更好使用这份报告",
  "Use fit scores to narrow the field, not to choose blindly.": "用匹配分缩小范围，而不是盲目做决定。",
  "Compare the top shortlist against ATAR signals, workload, and risk notes.": "把主要候选路径与 ATAR 信号、工作量和风险说明进行对比。",
  "Open the Go8 and occupation sources before making a high-cost education decision.": "在做出高成本教育决定前，请打开 Go8 和职业来源核实。",
  "Summary": "总结",
  "Step": "步骤",
  "Fit score": "匹配分",
  "Main upside": "主要优势",
  "Main risk": "主要风险",
  "Best suited for": "最适合",
  "Not ideal if": "不适合的情况",
  "Why it fits": "为什么匹配",
  "Key evidence from existing data": "现有数据中的关键证据",
  "Risk": "风险",
  "Competition": "竞争",
  "Salary": "薪资",
  "Maths / physics fit": "数学 / 物理匹配度",
  "Math / physics fit": "数学 / 物理匹配度",
  "Coding intensity": "编程强度",
  "Work-life balance": "工作生活平衡",
  "Go8 snapshot": "Go8 概览",
  "ATAR signal": "ATAR 信号",
  "Requirement type": "要求类型",
  "Default financial snapshot": "默认财务概览",
  "Uses the calculator's current source-backed and editable default inputs. Treat this as a rough planning signal.": "使用计算器当前有来源支持且可编辑的默认输入。请把它当作粗略规划信号。",
  "Open advanced ROI calculator": "打开高级投资回报计算器",
  "Open advanced payback calculator": "打开高级回本计算器",
  "Edit assumptions in ROI calculator": "在投资回报计算器中编辑假设",
  "Edit assumptions in payback calculator": "在回本计算器中编辑假设",
  "Uses AUD 45,000 per year as a conservative Sydney living-cost model assumption.": "使用每年 AUD 45,000 作为悉尼生活成本的保守模型假设。",
  "Uses AUD 45,000 per year as the Sydney living-cost model assumption. Employed salary rises linearly to the occupation median by year 5.": "使用每年 AUD 45,000 作为悉尼生活成本模型假设；找到工作后，薪资会在第 5 年线性增长至职业中位薪资。",
  "Sydney living-cost model assumption. Actual living costs vary by housing, lifestyle, location, and personal circumstances.": "悉尼生活成本模型假设。实际生活费会因住房、生活方式、地点和个人情况而不同。",
  "Uses 90.4% employment probability and fallback income. Employed salary rises linearly from graduate salary to occupation median salary by year 5.": "使用 90.4% 就业概率和备用收入；找到工作后，薪资会从毕业生起薪线性增长，并在第 5 年达到职业中位薪资。",
  "Cumulative employed free cash flow. Salary rises linearly from graduate salary to occupation median salary by year 5, then remains at the median.": "就业情景下的累计自由现金流。薪资从毕业生起薪线性增长，在第 5 年达到职业中位薪资，此后保持该中位薪资。",
  "Each scenario starts from the graduate salary input and rises linearly to the mapped occupation median salary by year 5. These are sensitivity tests, not forecasts.": "每个情景都从毕业生起薪开始，并在第 5 年线性增长至映射的职业中位薪资。这些是敏感性测试，不是预测。",
  "Study years": "学习年限",
  "Duration assumption needed": "需要填写学习年限假设",
  "Graduate salary": "毕业生薪资",
  "Occupation median": "职业中位薪资",
  "Occupation salary needed": "需要填写职业薪资",
  "Employment rate": "就业率",
  "Employment assumption needed": "需要填写就业假设",
  "University study cost": "大学学习成本",
  "Total tuition": "总学费",
  "Tuition per year multiplied by study years. Living costs are excluded.": "每年学费乘以学习年限，不包含生活费。",
  "Includes tuition and AUD 45,000 per study year for living costs.": "包含学费，以及学习期间每年 AUD 45,000 的生活费。",
  "Includes tuition, study-period living costs, other study costs, and opportunity cost.": "包含学费、学习期间生活费、其他学习成本和机会成本。",
  "After-tax income": "税后收入",
  "Free cash flow": "自由现金流",
  "Payback status": "回本状态",
  "Salary basis": "薪资依据",
  "Later-career reference": "中后期职业参考",
  "Later-career salary reference": "中后期职业薪资参考",
  "Registration/training warning": "注册 / 培训提醒",
  "Warnings you should not ignore": "不应忽略的提醒",
  "Go8 entry sources": "Go8 入学来源",
  "Graduate and occupation sources": "毕业生与职业来源",
  "Not recovered under current assumptions.": "在当前假设下无法回本。",
  "Not recovered after risk adjustment.": "风险调整后无法回本。",
  "20+ years under current assumptions.": "在当前假设下需要 20 年以上。",

  "Comparison": "对比",
  "Compare shortlisted pathways at two levels": "从两个层级对比候选路径",
  "Use the summary layer first for quick judgement, then open the detailed evidence table when you want to pressure-test the shortlist.": "先用摘要层快速判断；需要进一步压力测试候选清单时，再打开详细证据表。",
  "Choose majors": "选择专业",
  "Fewer columns are easier to read on mobile and make trade-offs clearer.": "列数越少，手机端越容易阅读，也更容易看清取舍。",
  "Update comparison": "更新对比",
  "Quick comparison summary": "快速对比摘要",
  "Use this layer to see whether a major is technically demanding, lifestyle-heavy, high-risk, or attractive mainly for income.": "用这一层判断某个专业是否技术要求高、生活方式压力大、风险高，或主要因为收入吸引人。",
  "Detailed comparison table": "详细对比表",
  "This layer keeps the raw evidence visible when you need depth. On small screens, scroll horizontally and focus on two or three majors at a time.": "这一层保留原始证据，方便深入查看。小屏幕上可横向滚动，一次重点看两三个专业。",
  "Criteria": "对比项",
  "Go8 entries": "Go8 课程条目",
  "Graduate roles": "毕业生常见角色",
  "Graduate salary evidence": "毕业生薪资证据",
  "ROI calculator defaults": "投资回报计算器默认值",
  "Payback calculator defaults": "回本计算器默认值",
  "Employment outlook": "就业前景",
  "Further study common?": "是否常见继续深造？",
  "Related occupations": "相关职业",
  "Work style": "工作方式",
  "Working hours": "工作时间",
  "Job environment": "工作环境",
  "Typical tasks": "典型工作内容",
  "Trade-offs": "取舍",
  "Risk notes": "风险说明",
  "Main trade-off": "主要取舍",
  "Main warning": "主要提醒",
  "Financial defaults": "财务默认值",
  "Go8 course rows": "Go8 课程行",
  "Source metadata": "来源元数据",
  "Go8 course sources": "Go8 课程来源",

  "Coming soon": "即将推出",
  "Guided pathway reviews may be added later": "未来可能加入人工路径复盘",
  "For now, the questionnaire and comparison tool are the main way to evaluate majors, prerequisites, workload, ROI, and career trade-offs.": "目前，问卷和对比工具是评估专业、入学要求、工作量、投资回报和职业取舍的主要方式。",
  "For now, the questionnaire and comparison tool are the main way to evaluate majors, prerequisites, workload, payback time, and career trade-offs.": "目前，问卷和对比工具是评估专业、入学要求、工作量、回本时间和职业取舍的主要方式。",
  "What a future review could cover": "未来复盘可能覆盖的内容",
  "Shortlist review across majors and universities": "跨专业和大学的候选清单复盘",
  "Subject strategy for VCE students who are still deciding": "为仍在犹豫的 VCE 学生规划选科策略",
  "Trade-off discussion for international families": "与国际学生家庭讨论现实取舍",
  "Workload, salary, and risk comparison before applications": "申请前对比工作量、薪资和风险",
  "Current status": "当前状态",
  "No booking system or contact channel is active on this page yet. Use the questionnaire to generate a report, then compare a small shortlist in more detail.": "本页目前没有开放预约系统或联系方式。请先使用问卷生成报告，再对少量候选专业做更深入对比。",
  "Best next step today": "今天最好的下一步",
  "Start with your current subjects, strengths, and priorities, then use the comparison page to pressure-test the shortlist against sourced evidence.": "先从你的当前科目、优势和优先事项开始，再用对比页面根据有来源的证据压力测试候选清单。",
  "Start questionnaire": "开始问卷",
  "Open comparison": "打开对比",

  "Financial planning model": "财务规划模型",
  "Education ROI Calculator": "教育投资回报计算器",
  "Education Payback Calculator": "教育回本计算器",
  "Estimate study cost, after-tax income, free cash flow, and payback time using source-backed data and editable assumptions.": "使用有来源支持的数据和可编辑假设，估算学习成本、税后收入、自由现金流和回本时间。",
  "Compare this pathway": "对比这个路径",
  "Pathway selector": "路径选择",
  "Defaults use pathway-specific salary evidence where available, representative Monash course fee or duration data where sourced, and clearly labelled assumptions or missing states where no reliable pathway-specific salary default is available.": "默认值会优先使用该路径对应的薪资证据；在有来源时使用代表性的课程学费或时长数据；没有可靠路径薪资默认值时，会清楚标注为假设或缺失。",
  "Training and registration warning": "培训与注册提醒",
  "This version calculates high-school direct-entry pathways only. Graduate-entry pathways are not modelled.": "本版本只计算高中直入路径，不建模本科后/研究生入学路径。",
  "This version models high-school direct-entry pathways only, not graduate-entry pathways.": "本版本只建模高中直入路径，不建模本科后/研究生入学路径。",
  "This version calculates university study cost separately from time to registration or full professional practice. Graduate-entry pathways are not modelled.": "本版本会把大学学习成本与取得注册或完整执业资格的时间分开显示。本版本不建模本科后/研究生入学路径。",
  "University study cost period": "大学学习成本计算年限",
  "Professional pathway": "专业执业路径",
  "Time to general registration": "取得一般注册所需时间",
  "Registration": "注册",
  "Required for practice": "执业需要注册",
  "Check pathway requirements": "请核实路径要求",
  "Total study cost": "总学习成本",
  "Tuition assumption needed": "需要填写学费假设",
  "Estimated after-tax income": "估算税后收入",
  "Salary assumption needed": "需要填写薪资假设",
  "Enter a pathway-specific salary before using income, free cash flow, or payback outputs.": "请先输入该路径对应的薪资，再使用收入、自由现金流或回本结果。",
  "Annual free cash flow": "年度自由现金流",
  "Payback unavailable — tuition assumption needed.": "无法计算回本——需要填写学费假设。",
  "Risk-adjusted payback": "风险调整后回本周期",
  "10-year free cash flow": "10 年自由现金流",
  "This tool is for education planning only. It is not financial, tax, migration, admissions, or career advice. Outcomes vary by individual, visa status, labour market conditions, and location.": "本工具仅用于教育规划，不构成财务、税务、移民、录取或职业建议。结果会因个人情况、签证状态、劳动力市场和地点而变化。",
  "Scenario comparison needs more inputs": "情景对比需要更多输入",
  "Enter a salary in the income panel. ": "请在收入面板输入薪资。 ",
  "Payback unavailable — tuition assumption needed. Enter annual tuition before using study cost, payback, and scenario outputs. ": "无法计算回本——需要填写学费假设。请先输入年度学费，再使用学习成本、回本和情景输出。 ",
  "Salary default audit": "薪资默认值审计",
  "No duplicate numeric salary defaults are currently active across pathways.": "当前没有多个路径共用同一个数值薪资默认值。",
  "Pathway": "路径",
  "Later-career": "中后期职业",
  "JSA occupation median": "JSA 职业中位收入",
  "No source attached": "未附来源",
  "Salary input": "薪资输入",
  "Employment": "就业",
  "Later-career / occupation": "中后期职业 / 职业",
  "Quality": "数据质量",
  "Source / note": "来源 / 说明",

  "Study cost inputs": "学习成本输入",
  "Full-time equivalent years used in the cost model.": "成本模型使用的全日制等效学习年限。",
  "Tuition per year": "每年学费",
  "Annual tuition or student contribution. Replace this with your offer/course page if needed.": "年度学费或学生贡献金额。如有需要，请用你的录取通知或课程页面替换。",
  "Living cost while studying": "学习期间生活费",
  "Annual living-cost planning baseline while studying.": "学习期间年度生活费规划基线。",
  "Other study costs": "其他学习成本",
  "Books, equipment, placement checks, visa, OSHC, relocation, flights, or exam costs.": "书本、设备、实习检查、签证、OSHC、搬迁、机票或考试费用。",
  "Opportunity cost per year": "每年机会成本",
  "Income you give up by studying instead of working full time.": "因选择学习而不是全职工作放弃的收入。",
  "Income and employment inputs": "收入与就业输入",
  "Starting salary": "起薪",
  "Graduate full-time salary signal used as first-year gross income.": "用作第一年税前收入的毕业生全职薪资信号。",
  "Employment probability": "就业概率",
  "Probability used in the risk-adjusted free cash flow model.": "风险调整自由现金流模型使用的概率。",
  "Salary growth rate": "薪资增长率",
  "Annual salary growth after graduation.": "毕业后的年度薪资增长率。",
  "Fallback income if not employed": "未就业时的备用收入",
  "Annual income used in the not-employed branch of the risk-adjusted model.": "风险调整模型中未就业情景使用的年度收入。",
  "Tax settings": "税务设置",
  "Tax estimate only. It excludes Medicare levy, offsets, deductions, HELP/HECS, superannuation, and individual circumstances.": "仅为税务估算，不包括 Medicare levy、抵免、扣除、HELP/HECS、养老金和个人具体情况。",
  "Tax residency model": "税务居民模型",
  "Australian resident tax brackets": "澳大利亚税务居民税率档",
  "Australian resident brackets": "澳大利亚税务居民税率档",
  "Foreign resident tax brackets": "非税务居民税率档",
  "foreign resident brackets": "非税务居民税率档",
  "Simple effective tax rate": "简单有效税率",
  "simple effective rate": "简单有效税率",
  "not labelled": "未标注",
  "Use this only if bracket-based tax is not appropriate for your situation.": "仅当按税率档估算不适合你的情况时使用。",
  "After-graduation cost inputs": "毕业后成本输入",
  "Living cost after graduation": "毕业后生活费",
  "Annual cost baseline after graduation.": "毕业后的年度成本基线。",
  "Other annual costs after graduation": "毕业后其他年度成本",
  "Transport, insurance, family support, visa costs, debt repayment, or other personal costs.": "交通、保险、家庭支持、签证成本、还债或其他个人支出。",
  "Assumption warning": "假设提醒",
  "Some values are assumptions, so this result should be treated as a rough model, not a prediction.": "部分数值是假设，因此结果应视为粗略模型，而不是预测。",
  "Scenario comparison": "情景对比",
  "Conservative": "保守",
  "Base": "基础",
  "Optimistic": "乐观",
  "Base uses the QILT graduate salary input. Optimistic uses the mapped later-career reference where available, usually JSA occupation median earnings before tax. These are sensitivity tests, not forecasts.": "基础情景使用 QILT 毕业生薪资输入；乐观情景在有映射数据时使用中后期职业参考，通常是 JSA 税前职业中位收入。这些是敏感性测试，不是预测。",
  "Metric": "指标",
  "Gross salary used": "使用的税前薪资",
  "5-year cumulative free cash flow": "5 年累计自由现金流",
  "10-year cumulative free cash flow": "10 年累计自由现金流",
  "Source evidence and assumptions": "来源证据与假设",
  "This panel separates sourced values from assumptions. Replace course fees, living costs, and tax settings with the student's own official offer or advice before relying on the model.": "此面板区分有来源数据和假设。在依赖模型前，请用学生自己的正式 offer、课程页面或专业建议替换课程费用、生活费和税务设置。",
  "Later-career scenario salary": "中后期职业情景薪资",
  "JSA occupation median reference": "JSA 职业中位收入参考",
  "Training and registration scope": "培训与注册范围",
  "Sources used": "使用的来源",
  "Source": "来源",
  "Scope": "范围",
  "Date": "日期",
  "Limit": "限制",
  "Missing": "缺失",
  "Not specified": "未注明",
  "Source-backed": "有来源支持",
  "Existing project data": "项目已有数据",
  "User assumption": "用户假设",
  "source-backed": "有来源支持",
  "existing-project-data": "项目已有数据",
  "user-assumption": "用户假设",
  "missing": "缺失",
  "specific occupation data": "具体职业数据",
  "specific graduate data": "具体毕业生数据",
  "broad field graduate outcome": "宽领域毕业生就业结果",

  "Computer Science": "计算机科学",
  "Software Engineering": "软件工程",
  "Electrical Engineering": "电气工程",
  "Mechanical Engineering": "机械工程",
  "Civil Engineering": "土木工程",
  "Mining Engineering": "采矿工程",
  "Commerce": "商科",
  "Finance": "金融",
  "Mathematics": "数学",
  "Statistics / Data Science": "统计 / 数据科学",
  "Biotechnology / Life Science": "生物技术 / 生命科学",
  "Biomedical Science / Medical Laboratory Science": "生物医学科学 / 医学检验科学",
  "Biomedical Engineering": "生物医学工程",
  "Medicine / Doctor": "医学 / 医生",
  "Dentistry": "牙科",
  "Pharmacy": "药学",
  "Physiotherapy / Rehabilitation": "物理治疗 / 康复",
  "Occupational Therapy": "职业治疗",
  "Teaching": "教育",
  "Law": "法律",

  "Your stronger subjects line up with this pathway.": "你的优势科目与这条路径比较匹配。",
  "This option uses a lot of coding, which may feel frustrating if coding interest is low.": "这个选项需要较多编程；如果你对编程兴趣较低，可能会比较吃力。",
  "This pathway is maths-heavy, so low maths interest is a real warning sign.": "这条路径数学要求较高；如果你对数学兴趣较低，这是一个需要认真考虑的风险信号。",
  "Your biology, chemistry, psychology, or health-science signals line up with this pathway.": "你的生物、化学、心理学或健康科学相关信号与这条路径比较匹配。",
  "Your people-facing work preference fits clinical or care-oriented work.": "你偏好与人沟通的工作，这与临床或照护类工作比较匹配。",
  "Biomedical engineering benefits from strong maths, physics, or technical problem solving.": "生物医学工程通常更适合数学、物理或技术问题解决能力较强的学生。",
  "Salary potential may be lower than your preferred level based on the sourced outcome profile.": "根据有来源支持的结果画像，这条路径的薪资潜力可能低于你的期望。",
  "Work-life balance may be difficult in this pathway.": "这条路径的工作生活平衡可能较有挑战。",
  "Competition can be high for internships or early-career roles.": "实习和职业早期岗位竞争可能较激烈。",
  "This pathway may involve regional, remote, or FIFO work.": "这条路径可能涉及偏远地区、远程或 FIFO 工作。",
  "International students should check registration, placement, and visa implications early.": "国际学生应尽早核对注册、实习和签证相关影响。",
  "The salary potential score aligns with your income priority.": "这条路径的薪资潜力评分与你重视收入的优先级比较一致。",
  "The work-life balance score is stronger than many alternatives.": "这条路径的工作生活平衡评分相对不少其他选项更强。",
  "This pathway scores well for stability based on the sourced profile.": "根据有来源支持的画像，这条路径的稳定性评分较好。",
  "This pathway may offer stronger flexibility than more site-based options.": "相比更依赖固定现场工作的选项，这条路径可能有更强的灵活性。",
  "This option has a balanced match across your answers.": "从你的回答来看，这个选项整体匹配度较均衡。",
  "No major red flag from these rules, but verify prerequisites and job outcomes before making decisions.": "按当前规则没有明显重大风险，但做决定前仍应核对入学要求和就业结果。",
  "Students who are comfortable with technical depth and structured problem solving.": "适合能接受较强技术深度、并喜欢结构化解决问题的学生。",
  "Students who are comfortable with people-facing responsibility and communication-heavy work.": "适合能接受面对人、承担责任，并适应高沟通量工作的学生。",
  "Students who prefer communication-heavy work and direct responsibility for people or clients.": "适合偏好高沟通量工作，并愿意直接对人或客户负责的学生。",
  "Students whose subjects, priorities, and work preferences broadly align with this pathway.": "适合科目、优先事项和工作偏好大体与这条路径一致的学生。",
  "Students who want a balanced path without relying on just one strength area.": "适合希望选择较均衡路径，而不是只依赖单一优势的学生。",
  "You want to avoid regional, remote, or FIFO-style work conditions.": "你希望避免偏远地区、远程或 FIFO 类型的工作条件。",
  "You have low tolerance for sustained coding practice.": "你不太能接受长期持续的编程训练。",
  "Lifestyle and predictable hours matter more than upside or intensity.": "相比职业上限或工作强度，你更重视生活方式和可预测的工作时间。",
  "You want a lower-pressure path with less internship and graduate role competition.": "你希望选择压力较低、实习和毕业生岗位竞争较少的路径。",
  "You want a lower-pressure graduate path with less competition risk.": "你希望选择毕业后竞争风险较低、压力较小的路径。",
  "You care more about predictable hours than ceiling or pressure.": "相比收入上限或职业压力，你更重视可预测的工作时间。",
  "The main risks and work conditions feel out of step with your preferences.": "这条路径的主要风险和工作条件与你的偏好不太一致。",
  "The practical downside or workload profile is not a good fit for your preferences.": "这条路径的现实问题或工作负荷画像与你的偏好不太匹配。",

  "Computer Science may suit you because the sourced outcome profile supports a relatively strong income score.": "计算机科学可能适合你，因为有来源支持的结果画像显示其收入评分相对较强。",
  "Software Engineering may suit you because the sourced outcome profile supports a relatively strong income score.": "软件工程可能适合你，因为有来源支持的结果画像显示其收入评分相对较强。",
  "Finance may suit you because the sourced outcome profile supports a relatively strong income score.": "金融可能适合你，因为有来源支持的结果画像显示其收入评分相对较强。",
  "Mining Engineering may suit you because the sourced outcome profile supports a relatively strong income score.": "采矿工程可能适合你，因为有来源支持的结果画像显示其收入评分相对较强。",
  "Nursing may suit you because it has a stronger stability signal in the sourced profile.": "护理可能适合你，因为有来源支持的画像显示其稳定性信号较强。",
  "Teaching may suit you because it has a stronger stability signal in the sourced profile.": "教育可能适合你，因为有来源支持的画像显示其稳定性信号较强。",
  "Physiotherapy / Rehabilitation may suit you because it has a stronger stability signal in the sourced profile.": "物理治疗 / 康复可能适合你，因为有来源支持的画像显示其稳定性信号较强。",
  "Occupational Therapy may suit you because it has a stronger stability signal in the sourced profile.": "职业治疗可能适合你，因为有来源支持的画像显示其稳定性信号较强。",

  "Computing and information systems": "计算机与信息系统",
  "Engineering": "工程",
  "Engineering / JSA HEO specific": "工程 / JSA 高等教育结果特定数据",
  "Business and management": "商业与管理",
  "Humanities, culture and social sciences": "人文、文化与社会科学",
  "Science and mathematics": "科学与数学",
  "Nursing": "护理",
  "Teacher education": "教师教育",
  "Law and paralegal studies": "法律与辅助法律研究",
  "Health services and support": "医疗服务与支持",
  "Medicine": "医学",
  "Rehabilitation": "康复",
  "Software and Applications Programmers": "软件和应用程序开发人员",
  "Electrical Engineers": "电气工程师",
  "Industrial, Mechanical and Production Engineers": "工业、机械和生产工程师",
  "Civil Engineering Professionals": "土木工程专业人员",
  "Mining Engineers": "采矿工程师",
  "Accountants": "会计师",
  "Financial Dealers": "金融交易员",
  "Economists": "经济学家",
  "Actuaries, Mathematicians and Statisticians": "精算师、数学家和统计学家",
  "Other Natural and Physical Science Professionals": "其他自然与物理科学专业人员",
  "Registered Nurses": "注册护士",
  "Secondary School Teachers": "中学教师",
  "Solicitors": "律师",
  "Life Scientists": "生命科学家",
  "Medical Laboratory Scientists": "医学检验科学家",
  "Other Engineering Professionals, includes Biomedical Engineers": "其他工程专业人员，包括生物医学工程师",
  "General Practitioners and Resident Medical Officers": "全科医生和住院医师",
  "Specialist Physicians": "专科医师",
  "Dental Practitioners": "牙科执业人员",
  "Pharmacists": "药剂师",
  "Physiotherapists": "物理治疗师",
  "Occupational Therapists": "职业治疗师",
  "Psychologists and Psychotherapists": "心理学家和心理治疗师",

  "VCE Pathway Compass scenario stress-test settings": "VCE Pathway Compass 情景压力测试设置",
  "International student financial capacity planning": "国际学生资金能力规划",
  "User-editable scenario assumptions": "用户可编辑情景假设",
  "Representative international tuition model input": "代表性国际学生学费模型输入",
  "Occupation median weekly earnings before tax": "职业每周税前中位收入",
  "Representative model estimate only, not a universal fee. Exact tuition differs by university, course structure, campus, student type, annual indexation, and official offer.": "仅为代表性模型估算，不是通用学费。实际学费会因大学、课程结构、校区、学生身份、年度调整和正式 offer 而不同。",
  "Representative international tuition model estimate, not a universal fee. Verify against the official university course page or offer.": "代表性国际学生学费模型估算，不是通用学费。请以大学官方课程页面或正式 offer 核对。",
  "User-editable assumption - not sourced.": "用户可编辑假设 - 未提供来源。",
  "Professional pathway / registration time": "专业路径 / 注册所需时间",
  "This check lists the salary input status for every pathway and flags duplicate salary defaults. Missing rows require a user-entered salary before income and payback outputs are meaningful.": "此检查列出每条路径的薪资输入状态，并标记重复的薪资默认值。缺失行需要用户先输入薪资，收入和回本结果才有意义。",
  "Course entry rows have not been added for this pathway yet; verify prerequisites on official university pages.": "这条路径的课程入学行暂未添加；请到大学官方页面核对入学要求。",
  "National domestic undergraduate outcomes by study area, surveyed about 4-6 months after course completion. Not institution-specific.": "按学习领域统计的澳大利亚本地本科毕业生结果，调查时间约为课程完成后 4-6 个月。不是具体大学的数据。",
  "High salary and strong professional pathway, but entry barriers, clinical training cost and registration requirements are major constraints.": "薪资较高、职业路径清晰，但入学门槛、临床训练成本和注册要求是主要限制。",
  "Very strong employment pathway, but long training time, high entry difficulty, registration requirements and delayed earnings make ROI more complex than the salary alone suggests.": "就业路径很强，但培养时间长、入学难度高、注册要求严格且收入兑现较晚，因此投资回报不能只看薪资数字。",
  "High employment rate but weaker graduate salary than many students expect; ROI depends on whether the pathway leads to hospital, industrial, ownership or advanced clinical roles.": "就业率较高，但毕业生薪资可能低于许多学生预期；投资回报取决于后续是否进入医院、工业、药房所有权或高级临床方向。",
  "Very strong employment pathway, but long training time, high entry difficulty, registration requirements and delayed earnings make payback more complex than the salary alone suggests.": "就业路径很强，但培养时间长、入学难度高、注册要求严格且收入兑现较晚，因此回本不能只看薪资数字。",
  "High employment rate but weaker graduate salary than many students expect; payback depends on whether the pathway leads to hospital, industrial, ownership or advanced clinical roles.": "就业率较高，但毕业生薪资可能低于许多学生预期；回本取决于后续是否进入医院、工业、药房所有权或高级临床方向。",
  "Registration, internship, weekend work, retail exposure, and ownership or hospital pathway competition can affect outcomes.": "注册、实习、周末工作、零售药房环境，以及药房所有权或医院路径竞争都会影响结果。",
  "Clinical training costs, manual dexterity, patient-facing work, registration requirements, and private-practice economics should be checked early.": "应尽早核对临床训练成本、手部操作能力要求、面对患者的工作、注册要求和私人执业经济性。",
  "Entry is highly competitive and the path includes long study, placement, internship, registration, exams, stress, and delayed full earnings.": "入学竞争非常激烈，这条路径包含长期学习、实习/临床实习、实习期、注册、考试、压力，以及较晚实现完整收入的问题。",
  "This model assumes high-school direct-entry dentistry. Registration is required before practice.": "本模型假设为高中直入牙科路径。执业前必须完成注册。",
  "Direct-entry medicine is modelled as 5 years of university study plus about 1 year PGY1/internship before general registration. Full specialist practice can take 10-15+ years.": "直入医学按 5 年大学学习加约 1 年 PGY1/实习期建模，之后才进入一般注册阶段。完整专科执业通常可能需要 10-15 年以上。",
  "Model as about 5 years to registered pharmacist pathway.": "本模型按约 5 年进入注册药剂师路径计算。",
  "Often needs honours, master's, PhD, lab experience, or industry experience for stronger outcomes.": "通常需要荣誉学位、硕士、博士、实验室经验或行业经验，结果才更强。",
  "Often used as a pre-med, research, lab, or postgraduate pathway. Do not present it as a guaranteed clinical job pathway.": "常被用作医学预备、研究、实验室或研究生阶段路径；不要把它理解为保证进入临床工作的路径。",
  "Engineering-style pathway connected to health technology. Outcomes depend on accreditation, technical portfolio, and the health-tech market.": "这是连接健康科技的工程类路径；结果取决于认证、技术作品集和健康科技市场。",
  "Four-year professional health degree with direct clinical pathway.": "四年制专业健康学位，通常有较直接的临床路径。",
  "Four-year professional health degree with strong employability but moderate income ceiling.": "四年制专业健康学位，就业能力较强，但收入上限通常较温和。",
  "Undergraduate psychology alone is not the full professional pathway; professional registration usually requires further accredited study and supervised practice.": "心理学本科本身不是完整的专业执业路径；专业注册通常还需要进一步认可课程和受监督实践。"
  ,
  "Research-oriented biology pathway with lower early-career certainty than regulated health degrees; usually stronger with postgraduate study or industry experience.": "偏研究型的生物路径，职业早期确定性通常低于受监管的健康类学位；读研或积累行业经验后结果通常更强。",
  "Research-oriented biology pathway; stronger outcomes often require honours, master’s, PhD, lab experience, or industry experience.": "偏研究型的生物路径；更好的结果通常需要荣誉学位、硕士、博士、实验室经验或行业经验。",
  "More practical than general biology if it leads toward laboratory, diagnostic or health-science roles, but career outcomes depend heavily on accreditation and further training.": "如果能通向实验室、诊断或健康科学岗位，它通常比普通生物更实用；但职业结果很大程度取决于认证和后续训练。",
  "Biomedical Science alone is often a pre-med, research, lab, or postgraduate pathway. Do not present it as a guaranteed clinical job pathway.": "生物医学科学本身通常是医学预备、研究、实验室或研究生阶段路径；不要把它理解为保证进入临床工作的路径。",
  "A technical engineering pathway connected to health technology, but the Australian biomedical engineering market is smaller than mainstream engineering fields.": "这是连接健康科技的技术型工程路径，但澳大利亚生物医学工程市场通常小于主流工程领域。",
  "Engineering-style pathway connected to health technology; outcomes depend on accreditation, technical portfolio, and the health-tech market.": "连接健康科技的工程类路径；结果取决于认证、技术作品集和健康科技市场。",
  "Very strong employment pathway with practical clinical work, but income ceiling is usually lower than medicine, dentistry or high-end finance/technology.": "就业路径很强，并且工作具有明确临床实践性；但收入上限通常低于医学、牙科或高端金融/科技路径。",
  "Four-year professional health degree with direct clinical pathway; strong employment but lower income ceiling than medicine/dentistry.": "四年制专业健康学位，临床路径较直接；就业较强，但收入上限通常低于医学/牙科。",
  "Stable health-care pathway with strong employability, but often less scalable financially than high-income quantitative or engineering careers.": "稳定的健康照护路径，就业能力较强；但从收入扩展性看，通常不如高收入量化或工程类职业。",
  "Can become valuable after full registration, but undergraduate psychology alone is not the full professional pathway and usually requires postgraduate training.": "完成完整注册后可能很有价值，但心理学本科本身不是完整专业路径，通常还需要研究生阶段训练。"
  ,
  "Physical workload, patient volume, private clinic economics, registration, and placement demands should be checked.": "应核对体力负荷、患者数量、私人诊所经济性、注册要求和实习/临床实习要求。",
  "Emotional labour, documentation, travel, NDIS/provider settings, registration, and placement requirements can shape work conditions.": "情绪劳动、文书记录、出行、NDIS/服务提供方环境、注册要求和实习要求都会影响工作条件。",
  "Psychology can be competitive after undergraduate study; full professional practice usually requires accredited postgraduate study and supervised practice.": "心理学本科之后竞争可能较强；完整专业执业通常需要认可的研究生课程和受监督实践。"
  ,
  "Professional health pathway focused on diagnosis, treatment, clinical reasoning, patient care, hospital systems, and long regulated training.": "专业健康路径，重点涉及诊断、治疗、临床推理、患者照护、医院系统和长期受监管培训。",
  "Professional health pathway focused on oral health, clinical procedures, diagnostics, patient communication, and regulated dental practice.": "专业健康路径，重点涉及口腔健康、临床操作、诊断、患者沟通和受监管的牙科执业。",
  "Health pathway focused on patient care, clinical judgement, communication, documentation, safety, and healthcare teamwork.": "健康路径，重点涉及患者照护、临床判断、沟通、文书记录、安全和医疗团队协作。",
  "University study cost only: tuition, study-period living costs, other study costs, and opportunity cost.": "仅指大学学习成本：学费、学习期间生活费、其他学习成本和机会成本。",
  "After-tax income minus annual living costs and other annual costs.": "税后收入减去年度生活费和其他年度成本。",
  "Total study cost divided by annual free cash flow.": "总学习成本除以年度自由现金流。",
  "Cumulative employed free cash flow after graduation using the salary growth input.": "使用薪资增长输入计算的毕业后在就业情景下累计自由现金流。",
  "Opportunity cost": "机会成本",
  "Salary growth": "薪资增长",
  "Other annual costs": "其他年度成本",
  "Fallback income": "备用收入",
  "studyYears": "学习年限",
  "tuitionPerYear": "每年学费",
  "livingCostPerYearWhileStudying": "学习期间每年生活费",
  "otherStudyCosts": "其他学习成本",
  "opportunityCostPerYear": "每年机会成本",
  "startingSalary": "起薪",
  "salaryGrowthRate": "薪资增长率",
  "employmentProbability": "就业概率",
  "annualLivingCostAfterGraduation": "毕业后年度生活费",
  "otherAnnualCostsAfterGraduation": "毕业后其他年度成本",
  "fallbackIncomeIfNotEmployed": "未就业时备用收入",
  "simpleEffectiveTaxRate": "简单有效税率",
  "Set this if studying replaces paid full-time work or another income path.": "如果学习会替代全职有薪工作或另一条收入路径，请在这里填写。",
  "No official pathway-specific graduate salary growth default is included yet.": "目前没有加入官方的路径特定毕业生薪资增长默认值。",
  "Conservative placeholder for the not-employed outcome in risk-adjusted payback.": "风险调整回本模型中“未就业”情景的保守占位值。",
  "No default for transport, insurance, family support, visa costs, debt repayment, or other personal costs.": "交通、保险、家庭支持、签证成本、还债或其他个人成本暂无默认值。",
  "Fallback tax setting for users who do not want to use resident or foreign resident bracket estimates.": "当用户不想使用税务居民或非税务居民税率档估算时，可使用此备用税率设置。",
  "Scenario adjustments are not official forecasts. They are simple stress-test assumptions used to compare sensitivity.": "情景调整不是官方预测，而是用于比较敏感性的简单压力测试假设。"
  ,
  "Australian individual income tax brackets": "澳大利亚个人所得税税率档"
  ,
  "Intern doctor, Resident medical officer, Medical graduate": "实习医生、住院医师、医学毕业生",
  "Intern doctor": "实习医生",
  "Resident medical officer": "住院医师",
  "Medical graduate": "医学毕业生",
  "Dental graduate, Dentist pathway, Oral health clinician pathway": "牙科毕业生、牙医路径、口腔健康临床人员路径",
  "Dental graduate": "牙科毕业生",
  "Dentist pathway": "牙医路径",
  "Oral health clinician pathway": "口腔健康临床人员路径",
  "Graduate physiotherapist, Rehabilitation assistant, Sports clinic graduate": "物理治疗毕业生、康复助理、运动诊所毕业生",
  "Graduate physiotherapist": "物理治疗毕业生",
  "Rehabilitation assistant": "康复助理",
  "Sports clinic graduate": "运动诊所毕业生",
  "General practitioner, Resident medical officer, Specialist physician pathway": "全科医生、住院医师、专科医师路径",
  "General practitioner": "全科医生",
  "Specialist physician pathway": "专科医师路径",
  "Dental practitioner, Dentist, Dental specialist pathway": "牙科执业人员、牙医、牙科专科路径",
  "Dental practitioner": "牙科执业人员",
  "Dentist": "牙医",
  "Dental specialist pathway": "牙科专科路径",
  "Physiotherapist, Rehabilitation clinician, Sports physiotherapy pathway": "物理治疗师、康复临床人员、运动物理治疗路径",
  "Physiotherapist": "物理治疗师",
  "Rehabilitation clinician": "康复临床人员",
  "Sports physiotherapy pathway": "运动物理治疗路径",
  "Highly responsible clinical work involving patient assessment, diagnosis, treatment planning, documentation, communication, and multidisciplinary teamwork.": "高度负责的临床工作，涉及患者评估、诊断、治疗计划、文书记录、沟通和多学科团队协作。",
  "Hands-on clinical work involving oral examination, procedures, treatment planning, patient education, and practice management.": "实践性临床工作，涉及口腔检查、操作治疗、治疗计划、患者教育和诊所管理。",
  "Hands-on clinical work involving assessment, treatment planning, exercise prescription, patient coaching, and rehabilitation progress tracking.": "实践性临床工作，涉及评估、治疗计划、运动处方、患者指导和康复进展跟踪。",
  "Hospitals, clinics, emergency departments, general practice, regional health services, specialist settings, and public or private health systems.": "医院、诊所、急诊科、全科医疗、地区医疗服务、专科场景以及公立或私立医疗系统。",
  "Dental clinics, hospitals, community health, regional services, specialist practices, and private practice settings.": "牙科诊所、医院、社区健康服务、地区服务、专科诊所和私人执业场景。",
  "Hospitals, private clinics, sports settings, aged care, disability services, community health, and rehabilitation centres.": "医院、私人诊所、运动场景、养老护理、残障服务、社区健康和康复中心。",
  "Taking histories, examining patients, ordering tests, interpreting results, prescribing treatment, documenting care, and coordinating with health teams.": "采集病史、检查患者、开具检查、解读结果、制定治疗、记录照护过程，并与医疗团队协调。",
  "Diagnosing oral health conditions, performing procedures, interpreting imaging, planning treatment, educating patients, and maintaining clinical records.": "诊断口腔健康状况、进行临床操作、解读影像、制定治疗计划、教育患者并维护临床记录。",
  "Assessing movement, planning rehabilitation, prescribing exercises, treating injuries, educating patients, and documenting progress.": "评估动作功能、规划康复、开具运动处方、治疗损伤、教育患者并记录进展。"
};

const zhPhrases: Array<[string, string]> = [
  // TODO: Keep official university/source titles in English unless a verified Chinese label is available.
  ["domestic undergraduates", "本地本科毕业生"],
  ["domestic undergraduate", "本地本科"],
  ["undergraduate outcomes", "本科毕业生结果"],
  ["undergraduates", "本科毕业生"],
  ["undergraduate", "本科"],
  ["short-term outcomes", "短期结果"],
  ["study area", "学习领域"],
  ["graduate outcomes", "毕业生就业结果"],
  ["Graduate outcomes", "毕业生就业结果"],
  ["major", "专业"],
  ["Major", "专业"],
  ["pathway", "路径"],
  ["Pathway", "路径"],
  ["employment rate", "就业率"],
  ["Employment rate", "就业率"],
  ["median salary", "中位薪资"],
  ["Median salary", "中位薪资"],
  ["prerequisite", "先修要求"],
  ["Prerequisite", "先修要求"],
  ["requirement type", "要求类型"],
  ["Requirement type", "要求类型"],
  ["formal prerequisite", "正式先修要求"],
  ["assumed knowledge", "建议知识基础"],
  ["career pathway", "职业路径"],
  ["Career pathway", "职业路径"],
  ["return on investment", "投资回报"],
  ["Return on investment", "投资回报"],
  ["tuition", "学费"],
  ["Tuition", "学费"],
  ["salary", "薪资"],
  ["Salary", "薪资"],
  ["risk", "风险"],
  ["Risk", "风险"],
  ["source-backed", "有来源支持"],
  ["Source-backed", "有来源支持"],
  ["user-editable assumption", "用户可编辑假设"],
  ["User-editable assumption", "用户可编辑假设"],
  ["not sourced", "未提供来源"],
  ["Not sourced", "未提供来源"],
  ["not international-student-specific", "不是专门针对国际学生的数据"],
  ["full-time employment", "全职就业"],
  ["full-time salary", "全职薪资"],
  ["graduate salary", "毕业生薪资"],
  ["Graduate salary", "毕业生薪资"],
  ["starting salary", "起薪"],
  ["Starting salary", "起薪"],
  ["later-career", "中后期职业"],
  ["Later-career", "中后期职业"],
  ["before tax", "税前"],
  ["after tax", "税后"],
  ["gross salary", "税前薪资"],
  ["Gross salary", "税前薪资"],
  ["international fee", "国际学生学费"],
  ["representative", "代表性"],
  ["Representative", "代表性"],
  ["not a universal fee", "不是通用费用"],
  ["course page", "课程页面"],
  ["course fee", "课程学费"],
  ["study cost", "学习成本"],
  ["work settings", "工作场景"],
  ["work setting", "工作场景"],
  ["working hours", "工作时间"],
  ["Working hours", "工作时间"],
  ["job environment", "工作环境"],
  ["Job environment", "工作环境"],
  ["typical tasks", "典型工作内容"],
  ["Typical tasks", "典型工作内容"],
  ["trade-offs", "取舍"],
  ["Trade-offs", "取舍"],
  ["risk notes", "风险说明"],
  ["Risk notes", "风险说明"],
  ["downside", "潜在问题"],
  ["placements", "实习/临床实习"],
  ["placement", "实习/临床实习"],
  ["internship", "实习"],
  ["internships", "实习"],
  ["registration requirements", "注册要求"],
  ["registration requirement", "注册要求"],
  ["registration", "注册"],
  ["lab experience", "实验室经验"],
  ["industry experience", "行业经验"],
  ["postgraduate study", "研究生阶段学习"],
  ["further study", "继续深造"],
  ["honours", "荣誉学位"],
  ["PhD", "博士"],
  ["living cost", "生活费"],
  ["payback", "回本"],
  ["free cash flow", "自由现金流"],
  ["occupation median", "职业中位数"],
  ["Occupation median", "职业中位数"],
  ["occupation proxy", "职业代理指标"],
  ["Occupation proxy", "职业代理指标"],
  ["annualised", "按年折算"],
  ["Annualised", "按年折算"],
  ["work-life balance", "工作生活平衡"],
  ["Work-life balance", "工作生活平衡"],
  ["technical", "技术型"],
  ["people-facing", "面对人沟通"],
  ["stability", "稳定性"],
  ["flexibility", "灵活性"],
  ["competition", "竞争"],
  ["Competition", "竞争"],
  ["regional, remote, or FIFO", "偏远地区、远程或 FIFO"],
  ["high-school direct-entry", "高中直入"],
  ["graduate-entry", "本科后 / 研究生入学"]
];

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = readSavedLanguage();
    if (savedLanguage === "zh" || savedLanguage === "en") {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    saveLanguage(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      tx: (text: string) => translateText(text, language)
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}

export function translateText(text: string, language: Language): string {
  if (language === "en" || text.trim().length === 0) {
    return text;
  }

  if (zhExact[text]) {
    return zhExact[text];
  }

  const yearsMatch = text.match(/^(.+) years$/);
  if (yearsMatch) {
    return `${yearsMatch[1]} 年`;
  }

  const checkedMatch = text.match(/^Checked (.+)$/);
  if (checkedMatch) {
    return `核对日期 ${checkedMatch[1]}`;
  }

  const sourceCheckedMatch = text.match(/^Source checked (.+)$/);
  if (sourceCheckedMatch) {
    return `来源核对日期 ${sourceCheckedMatch[1]}`;
  }

  const scoreMatch = text.match(/^(.+): ([1-5])\/5$/);
  if (scoreMatch) {
    return `${translateText(scoreMatch[1], language)}：${scoreMatch[2]}/5`;
  }

  const vceStudyScoreMatch = text.match(/^(.+) Units 3&4 study score at least ([0-9]+)(.*)$/);
  if (vceStudyScoreMatch) {
    return `${translateText(vceStudyScoreMatch[1], language)} 3/4 单元学习分数至少 ${vceStudyScoreMatch[2]}${translateText(
      vceStudyScoreMatch[3],
      language
    )}`;
  }

  const checkPrereqMatch = text.match(/^Check formal prerequisite carefully: (.+)\.?$/);
  if (checkPrereqMatch) {
    return `请仔细核对正式先修要求：${translateText(checkPrereqMatch[1], language)}。`;
  }

  const assumedKnowledgeMatch = text.match(/^Your subjects align with assumed knowledge: (.+)\.$/);
  if (assumedKnowledgeMatch) {
    return `你的科目与建议知识基础相符：${translateText(assumedKnowledgeMatch[1], language)}。`;
  }

  const weakSubjectsMatch = text.match(/^Some weaker subjects are important here: (.+)\.$/);
  if (weakSubjectsMatch) {
    return `你标记为较弱的部分科目在这里很重要：${translateText(weakSubjectsMatch[1], language)}。`;
  }

  const qiltSalaryMatch = text.match(/^(\$[\d,]+) median annual full-time salary for domestic undergraduates in QILT (.+), 2024\.$/);
  if (qiltSalaryMatch) {
    return `QILT 2024 ${translateText(qiltSalaryMatch[2], language)}：本地本科毕业生全职年薪中位数为 ${qiltSalaryMatch[1]}。`;
  }

  const qiltOutcomeMatch = text.match(/^QILT 2024 (.+): ([\d.]+)% full-time employment, (\$[\d,]+) median full-time salary for domestic undergraduates\.$/);
  if (qiltOutcomeMatch) {
    return `QILT 2024 ${translateText(qiltOutcomeMatch[1], language)}：全职就业率 ${qiltOutcomeMatch[2]}%，本地本科毕业生全职薪资中位数 ${qiltOutcomeMatch[3]}。`;
  }

  const occupationProfileMatch = text.match(/^Occupation profile using ABS\/JSA data supplied for this project: median full-time earnings (\$[\d,]+)\/week\.$/);
  if (occupationProfileMatch) {
    return `使用本项目提供的 ABS/JSA 职业画像数据：全职每周收入中位数 ${occupationProfileMatch[1]}。`;
  }

  const broadGraduateSalaryMatch = text.match(/^(.+): broad graduate field estimate from QILT domestic undergraduate short-term outcomes by study area, surveyed about 4-6 months after completion\. This is not discipline-specific and should not be read as a (.+)-specific graduate salary\.$/);
  if (broadGraduateSalaryMatch) {
    return `${translateText(broadGraduateSalaryMatch[1], language)}：这是 QILT 本地本科毕业生按学习领域统计的宽领域短期结果估计，调查时间约为完成课程后 4-6 个月。它不是具体专业数据，不应解读为 ${translateText(
      broadGraduateSalaryMatch[2],
      language
    )} 的专业特定毕业生薪资。`;
  }

  const jsaOccupationMedianMatch = text.match(/^JSA occupation median earnings for (.+), annualised from AUD ([\d,]+)\/week\. This is before tax and is not a graduate starting salary\.(.*)$/);
  if (jsaOccupationMedianMatch) {
    return `JSA ${translateText(jsaOccupationMedianMatch[1], language)}职业中位收入：由每周 AUD ${jsaOccupationMedianMatch[2]} 按年折算。该数据为税前收入，不是毕业生起薪。${translateText(
      jsaOccupationMedianMatch[3],
      language
    )}`;
  }

  const jsaLaterCareerMatch = text.match(/^JSA later-career occupation proxy: (.+), annualised from AUD ([\d,]+)\/week to AUD ([\d,]+)\. This is before tax and is not a graduate starting salary\.$/);
  if (jsaLaterCareerMatch) {
    return `JSA 中后期职业代理指标：${translateText(jsaLaterCareerMatch[1], language)}，由每周 AUD ${jsaLaterCareerMatch[2]} 按年折算为 AUD ${jsaLaterCareerMatch[3]}。该数据为税前收入，不是毕业生起薪。`;
  }

  const suppliedJsaProxyMatch = text.match(/^Supplied JSA proxy for this pathway\. Median weekly earnings: AUD ([\d,]+); annualised gross: AUD ([\d,]+)\.$/);
  if (suppliedJsaProxyMatch) {
    return `本路径使用指定的 JSA 职业代理指标。每周收入中位数：AUD ${suppliedJsaProxyMatch[1]}；按年折算税前收入：AUD ${suppliedJsaProxyMatch[2]}。`;
  }

  const assumptionPrefixMatch = text.match(/^User-editable assumption - not sourced\. (.+)$/);
  if (assumptionPrefixMatch) {
    return `用户可编辑假设 - 未提供来源。${translateText(assumptionPrefixMatch[1], language)}`;
  }

  const taxModelMatch = text.match(/^Tax model: (.+)\. Salary data label: (.+)\.$/);
  if (taxModelMatch) {
    return `税务模型：${translateText(taxModelMatch[1], language)}。薪资数据标签：${translateText(taxModelMatch[2], language)}。`;
  }

  const riskAdjustedUseMatch = text.match(/^Uses ([\d.]+%) employment probability and fallback income\.$/);
  if (riskAdjustedUseMatch) {
    return `使用 ${riskAdjustedUseMatch[1]} 就业概率和备用收入。`;
  }

  const dynamicRiskAdjustedUseMatch = text.match(
    /^Uses ([\d.]+%) employment probability and fallback income\. Employed salary rises linearly from graduate salary to occupation median salary by year 5\.$/
  );
  if (dynamicRiskAdjustedUseMatch) {
    return `使用 ${dynamicRiskAdjustedUseMatch[1]} 就业概率和备用收入；找到工作后，薪资会从毕业生起薪线性增长，并在第 5 年达到职业中位薪资。`;
  }

  const majorInterestMatch = text.match(/^(.+) may suit you because it connects with your interest in (.+)\.$/);
  if (majorInterestMatch) {
    return `${translateText(majorInterestMatch[1], language)}可能适合你，因为它与你对${translateText(
      majorInterestMatch[2],
      language
    )}的兴趣相关。`;
  }

  const incomeFitMatch = text.match(/^(.+) may suit you because the sourced outcome profile supports a relatively strong income score\.$/);
  if (incomeFitMatch) {
    return `${translateText(incomeFitMatch[1], language)}可能适合你，因为有来源支持的结果画像显示其收入评分相对较强。`;
  }

  const stabilityFitMatch = text.match(/^(.+) may suit you because it has a stronger stability signal in the sourced profile\.$/);
  if (stabilityFitMatch) {
    return `${translateText(stabilityFitMatch[1], language)}可能适合你，因为有来源支持的画像显示其稳定性信号较强。`;
  }

  const reasonableFitMatch = text.match(/^(.+) is worth exploring because it has a reasonable overall fit across your answers\.$/);
  if (reasonableFitMatch) {
    return `${translateText(reasonableFitMatch[1], language)}值得进一步了解，因为它与你的回答有较合理的整体匹配度。`;
  }

  const strongFitMatch = text.match(/^(.+) looks like a strong fit, but the main risk is still worth checking before you commit\.$/);
  if (strongFitMatch) {
    return `${translateText(strongFitMatch[1], language)}看起来匹配度较高，但在做决定前仍要认真核对主要风险。`;
  }

  const plausibleMatch = text.match(/^(.+) is plausible, but it should be compared carefully against stronger-fit options\.$/);
  if (plausibleMatch) {
    return `${translateText(plausibleMatch[1], language)}是可考虑的选择，但应与匹配度更强的选项仔细对比。`;
  }

  const lowerMatch = text.match(/^(.+) may be worth reading about, but it probably should not be your first shortlist option yet\.$/);
  if (lowerMatch) {
    return `${translateText(lowerMatch[1], language)}值得了解，但目前可能不应作为第一候选。`;
  }

  const duplicateSalaryMatch = text.match(/^Duplicate salary default (.+) is used by (.+)\. Verify this is intentional and source-specific\.$/);
  if (duplicateSalaryMatch) {
    return `重复薪资默认值 ${duplicateSalaryMatch[1]} 被用于 ${translateText(
      duplicateSalaryMatch[2],
      language
    )}。请确认这是有意设置且有具体来源支持的。`;
  }

  const colonMatch = text.match(/^([^:：]{2,80}): (.+)$/);
  if (colonMatch) {
    return `${translateText(colonMatch[1], language)}：${translateText(colonMatch[2], language)}`;
  }

  return applyPhraseTranslations(text);
}

function applyPhraseTranslations(text: string) {
  return zhPhrases.reduce(
    (translated, [english, chinese]) => translated.split(english).join(chinese),
    text
  );
}

function readSavedLanguage() {
  try {
    return window.localStorage?.getItem(storageKey);
  } catch {
    return null;
  }
}

function saveLanguage(language: Language) {
  try {
    window.localStorage?.setItem(storageKey, language);
  } catch {
    // Some embedded browsers block localStorage. The in-memory language switch still works.
  }
}
