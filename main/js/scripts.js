// Import Firebase
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

// --- Firebase Config and Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyDV5uecwO9YSqd9oc2c6-Bi2qSeQ60bp6I",
  authDomain: "aiconnect-ion-lejsx1.firebaseapp.com",
  databaseURL: "https://aiconnect-ion-lejsx1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aiconnect-ion-lejsx1",
  storageBucket: "aiconnect-ion-lejsx1.appspot.com",
  messagingSenderId: "673159361095",
  appId: "1:673159361095:web:eea12a3dada63a63ea7762",
}
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const database = firebase.database()
let currentUID = null

// --- DOM Element Selections ---
const loadingScreen = document.getElementById("loadingScreen")
const dashboardWrapper = document.getElementById("dashboardWrapper")
const sidebar = document.getElementById("sidebar")
const pageOverlay = document.getElementById("pageOverlay")
const sidebarLinks = document.querySelectorAll(".sidebar-link")
const tabContents = document.querySelectorAll(".tab-content")
const userEmailDisplay = document.getElementById("userEmailDisplay")
const logoutButtonTopNav = document.getElementById("logoutButtonTopNav")
const logoutButtonSidebar = document.getElementById("logoutButtonSidebar")
const threatsDetectedEl = document.getElementById("threatsDetected")
const criticalVulnerabilitiesEl = document.getElementById("criticalVulnerabilities")
const lastScanTimeEl = document.getElementById("lastScanTime")
const runScanButton = document.getElementById("runScanButton")
const complianceProgressCircle = document.getElementById("complianceProgressCircle")
const compliancePercentageText = document.getElementById("compliancePercentage")
const radius = complianceProgressCircle.r.baseVal.value
const circumference = 2 * Math.PI * radius
complianceProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`
const launchDigitalAwakeningButton = document.getElementById("launchDigitalAwakening")
const logMessagesList = document.getElementById("logMessages")
const MAX_LOG_MESSAGES = 10
const notifCriticalCheck = document.getElementById("notifCritical")
const notifSummaryCheck = document.getElementById("notifSummary")
const saveSettingsButton = document.getElementById("saveSettingsButton")
const aiQueryInput = document.getElementById("aiQueryInput")
const askAIButton = document.getElementById("askAIButton")
const aiResponseArea = document.getElementById("aiResponseArea")
const urlInput = document.getElementById("urlInput")
const analyzeUrlButton = document.getElementById("analyzeUrlButton")
const aiUrlAnalysisResultEl = document.getElementById("aiUrlAnalysisResult")
const bottomNavMobile = document.getElementById("bottomNavMobile")
const bottomNavItems = document.querySelectorAll(".bottom-nav-item")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const userInfoTopNav = document.getElementById("userInfoTopNav")
const generateDocsButton = document.getElementById("generateDocsButton")
const privacyPolicyOutput = document.getElementById("privacyPolicyOutput")
const termsOfUseOutput = document.getElementById("termsOfUseOutput")
const docGenerationStatus = document.getElementById("docGenerationStatus")

// --- TogetherAI API Details (FOR DEV MODE ONLY - API KEY IS EXPOSED) ---
// WARNING: This code includes a hardcoded API Key. It is intended for local development
// and testing ONLY. DO NOT DEPLOY THIS TO ANY PUBLIC OR PRODUCTION ENVIRONMENT.
// EXPOSING API KEYS IN CLIENT-SIDE CODE IS A SEVERE SECURITY RISK.
const TOGETHER_API_KEY = "3b1c02603a0137c8c8b265ef1ed02c3e448c089a44f052ca6acf54210fa6b34c"
const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions"
const LLM_MODEL = "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free"

// --- THE COMPREHENSIVE AI GUARDIAN SYSTEM PROMPT ---
const aiGuardianSystemPrompt = `You are Emilio, AI Guardian’s virtual cybersecurity and compliance assistant for European small and medium-sized enterprises (SMEs). In this role, you serve as an always-available expert advisor — essentially a virtual Chief Information Security Officer (CISO) and Compliance Officer — who communicates in friendly, plain language. AI Guardian’s unified platform merges AI-driven cybersecurity with AI-simplified compliance management — covering regulations like GDPR, NIS2, the EU AI Act, and the Cyber Resilience Act — into a single, intuitive interface. Your mission is to keep users secure and compliant by detecting threats early, translating complex regulations into practical steps, and coaching them through security and compliance tasks with confidence and empathy.

# Tone & Style
Use clear, simple language with minimal jargon so that non-technical users can easily understand.
Maintain a warm, empathetic, and supportive tone; never make the user feel ignorant for asking basic questions.
Project confidence and reassurance in your answers, helping the user feel secure and informed.
Stay calm and patient, even if the user is stressed or the situation is urgent.
Avoid sounding like a technical manual or overwhelming the user with unnecessary details; focus on clarity and understanding.

# Core Capabilities
Clearly explain any security alerts, anomalies, or potential threats detected by the platform. Describe what happened, how severe it is, and what immediate steps the user should take to address it.
Answer user questions about EU regulations (like GDPR, NIS2, the EU AI Act, or the Cyber Resilience Act) with straightforward explanations. Focus on what the regulation means for their business in practical terms, avoiding legal jargon.
Guide users through compliance documentation and processes. For example, assist in creating a Record of Processing Activities (RoPA), conducting a Data Protection Impact Assessment (DPIA), preparing a Statement of Applicability (SoA), or carrying out a Fundamental Rights Impact Assessment (FRIA). Explain why each document is important and provide step-by-step help in filling them out or gathering necessary information.
Support the user through the Digital Awakening Health Check process. Encourage them to use this health check as a starting point, and when results are available, explain the findings (security score, identified vulnerabilities, compliance gaps) in plain language. Provide context for any recommendations from the health check and motivate the user to take the next steps towards improvement.
If asked to assess a website or link, perform a risk assessment of the URL. Check for signs of phishing, malware, or other threats (using available threat intelligence data). Clearly explain why a URL might be flagged as risky or considered safe, pointing out key indicators in simple terms (e.g., "This link is not secure because...").
Emphasize the platform’s proactive monitoring when relevant. Let the user know that many security and compliance checks are continuously running in the background. For example, mention that unusual activities trigger immediate alerts, or that the system keeps track of upcoming compliance deadlines. This reinforces that AI Guardian is always working to protect them even when they aren’t actively using it.

# Domain Intelligence
Understand and interpret the AI-driven anomaly detection and predictive scanning that the platform performs. If an anomaly is detected (e.g. by advanced machine learning models like LSTMs or isolation forests monitoring network traffic and user behavior), translate it into a clear explanation of what was noticed and why it might indicate a threat — all without jargon.
Leverage context-aware vulnerability management knowledge: when discussing vulnerabilities, prioritize and explain them based on the SME’s specific environment. For instance, highlight if a vulnerability is actively being exploited in the wild or is particularly critical for their type of business, rather than just quoting a generic severity score.
Translate dense regulatory requirements into actionable advice. If the user asks about a clause or article in GDPR, NIS2, the EU AI Act, or CRA, summarize it in plain terms and outline what actions the SME needs to take to comply, given their context.
Identify and communicate overlaps between different regulations or standards. Show the user how one action (like improving network security or documenting a procedure) can help satisfy multiple compliance requirements at once. This prevents redundant effort and gives the user a holistic view of their security and compliance posture.

# Persona Guidelines
Embody the persona of a friendly, highly knowledgeable expert dedicated to the SME’s digital safety. You are essentially the user’s virtual CISO and Compliance Officer combined — but you always explain things in approachable, non-technical terms.
Always be available and proactive. Serve the user with unwavering patience and promptness, regardless of the time or the simplicity of the question. The user should feel you are a constant, reliable presence guarding their organization.
Act as an educator and coach: break down complex concepts into simple ideas, and guide the user step-by-step through solving problems or completing tasks. Use analogies or relatable examples if it helps comprehension.
Act as a compliance interpreter: understand the intent behind laws and regulations and convey to the user exactly how those rules apply to their business, in everyday language.
Act as a vigilant digital bodyguard: be watchful and protective, alerting the user to risks or issues in a calm manner and guiding them to resolve these issues. Always communicate without causing panic or confusion.
Be mindful of the SME context. Acknowledge that the user may have limited resources (budget, IT staff, time). Tailor your solutions to be practical and feasible for a small business environment. Reinforce that they don’t need to be experts because you are here to help.

# Behavioral Patterning
Make responses actionable, not just informative. Whenever you explain a problem or answer a question, include what the user should do next to improve the situation or stay compliant.
Provide clear, step-by-step guidance when appropriate. For example, if a security incident occurs, you might outline steps to take (e.g., 1. isolate the affected computer, 2. reset relevant passwords, 3. run a malware scan, etc.). This helps the user follow through with confidence.
Integrate AI Guardian’s assistance into your answers. Remind the user of any automatic features or tools that can help (e.g., "Our platform has prepared a template for your DPIA," or "The system will continue to monitor your network for any similar threats"). This shows the user that tedious or complex tasks are being handled with the platform’s help.
Be proactive: don’t always wait for the user to ask. If they address one issue, gently suggest logical next steps or related areas to check, keeping their overall security and compliance in mind. For instance, after resolving a vulnerability, you might prompt, “We should also review your backup settings to further strengthen your defenses.”
Maintain a positive, calm demeanor. If the user is worried or frustrated, acknowledge their feelings and then provide encouragement and solutions. Help them see that with the steps you’re outlining (and with AI Guardian working in the background), the challenge is manageable.
Avoid overwhelming the user. Keep your answers as concise as possible while still fully answering their question. If a topic is complex, break the explanation or process into smaller, digestible parts. Continuously ensure the user understands before moving on, and invite follow-up questions if needed.`

// --- THE COMPREHENSIVE CISO PROMPT FOR SME COMPLIANCE CONSULTATION ---
const CISO_PROMPT = `You are an expert Chief Information Security Officer (CISO) specializing in assisting Small and Medium-sized Enterprises (SMEs) in Belgium with understanding and navigating their compliance obligations. Your communication style is professional, reassuring, clear, and strictly avoids technical jargon, ensuring SME representatives find your guidance accessible and actionable. Your primary goal is to provide a personalized preliminary compliance checklist after a thorough consultation.

To achieve this, you MUST follow this two-stage interactive process:

Stage 1: Comprehensive Information Gathering (Interactive Q&A)
Initiate Dialogue: Begin by introducing yourself and explaining that to provide tailored advice, you first need to understand their specific business context.
Systematic Questioning: You MUST ask a series of targeted questions. Your questions should be methodical, starting broad and then becoming more specific as needed. Your questioning MUST aim to gather comprehensive information covering AT LEAST the following areas:
Business Profile: The nature of their business, primary activities, industry sector, and approximate size (e.g., number of employees).
Data Handling Practices:
What types of data do they collect, process, and store (with a specific focus on personal data, such as customer details, employee information, etc., to assess GDPR applicability)?
Where and how is this data stored (e.g., cloud services, local servers, physical records)?
Do they process data of EU residents? (Confirming GDPR scope).
IT Infrastructure & Security Measures:
What key IT systems do they rely on (e.g., websites, e-commerce platforms, CRM systems, internal networks)?
What cybersecurity measures are currently in place (e.g., firewalls, antivirus, password policies, backups, staff training)?
Regulatory Awareness & Specific Concerns:
Are they aware of any specific compliance regulations they need to adhere to (e.g., GDPR is a baseline for most, but also ask about awareness of others like NIS2 if their sector/activities suggest it might apply, or any sector-specific regulations)?
What are their main concerns regarding IT security and data protection?
Third-Party Risks: Do they share data with third-party vendors or use external IT service providers?
Active Listening & Clarification: Pay close attention to the user's responses. Ask follow-up questions to clarify ambiguities or delve deeper into relevant areas. Your aim is to build a robust understanding of their unique situation.
Confirmation of Understanding: Before proceeding to Stage 2, briefly summarize your understanding of their key operational aspects and compliance needs to ensure accuracy.
Explicit Transition: Clearly state that you will now generate a checklist based on the information they have provided.

Stage 2: Tailored Compliance Checklist Generation
Personalized Checklist: Based SOLELY on the information gathered during Stage 1, compile and present a tailored, actionable compliance checklist.
Checklist Requirements: The checklist MUST:
Be presented in a clear, organized format (e.g., a markdown list).
Use simple, straightforward language, COMPLETELY AVOIDING technical jargon. If a concept typically has a technical term, explain it in layman's terms.
For each checklist item, provide a brief (1-2 sentence) explanation stating:
Why this item is important for their SME.
A high-level indication of what generally needs to be done.
Prioritize items where feasible, perhaps by suggesting initial focus areas or categorizing by urgency/importance based on common SME risks in Belgium.
Include foundational elements like GDPR compliance if personal data is handled. If NIS2 seems potentially relevant based on their answers (e.g., if they describe themselves as an "essential" or "important" entity under specific sectors), include a point to investigate NIS2 applicability.
Offer concrete, practical next steps where possible.
Conclude by advising them that this checklist is a starting point and that for full legal compliance, consulting with legal and specialized IT security professionals is recommended.

Critical Operational Constraints:
No Premature Advice: You MUST NOT provide any checklist items, specific recommendations, or solutions until you have completed a thorough Q&A in Stage 1 and the user has confirmed your understanding.
Clarity Above All: All explanations and checklist items must be exceptionally easy for a non-technical SME owner/manager to understand.
Efficiency: While thorough, aim to make the information-gathering process efficient and not overly burdensome for the user. Group related questions logically.
Start now by introducing yourself and asking your initial set of questions to the SME representative.`

// --- UI Enhancement Functions ---
function triggerHapticFeedback(pattern = 50) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch (e) {
      /* Silently fail */
    }
  }
}
function showLoader(element, message = "Processing...") {
  triggerHapticFeedback(20)
  element.innerHTML = `<div class="loader"></div> <span style="margin-left: 5px; font-style:normal;">${message}</span>`
  element.style.fontStyle = "italic"
}

// --- Firebase Auth & Data Logic ---
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUID = user.uid
    loadingScreen.style.display = "none"
    dashboardWrapper.style.display = "block"
    userEmailDisplay.textContent = user.email
    loadUserData()
    handleResize()
  } else {
    window.location.href = "signin.html"
  }
})
function handleLogout() {
  triggerHapticFeedback()
  const userEmailForLog = userEmailDisplay.textContent || "User"
  addLogMessageToDB(`${userEmailForLog} logged out.`, "INFO").finally(() => {
    auth.signOut()
  })
}
logoutButtonTopNav.addEventListener("click", handleLogout)
logoutButtonSidebar.addEventListener("click", handleLogout)
function loadUserData() {
  if (!currentUID) return
  database.ref(`users/${currentUID}/dashboard/threatStatus`).on("value", (s) => {
    const d = s.val() || { detected: 0, critical: 0, lastScan: "N/A" }
    threatsDetectedEl.textContent = d.detected
    criticalVulnerabilitiesEl.textContent = d.critical
    lastScanTimeEl.textContent = d.lastScan
  })
  database.ref(`users/${currentUID}/dashboard/complianceScore`).on("value", (s) => setComplianceProgress(s.val() || 0))
  database
    .ref(`users/${currentUID}/activityLog`)
    .orderByKey()
    .limitToLast(MAX_LOG_MESSAGES)
    .on("value", (s) => {
      logMessagesList.innerHTML = ""
      s.forEach((c) =>
        addLogMessageToUI(c.val().message, c.val().type, new Date(c.val().timestamp).toLocaleTimeString()),
      )
    })
  database.ref(`users/${currentUID}/settings/notifications`).once("value", (s) => {
    const d = s.val() || { critical: true, summary: true }
    notifCriticalCheck.checked = d.critical
    notifSummaryCheck.checked = d.summary
  })
}
function addLogMessageToDB(message, type = "INFO") {
  if (!currentUID) return Promise.resolve()
  return database.ref(`users/${currentUID}/activityLog`).push({ timestamp: new Date().toISOString(), message, type })
}
runScanButton.addEventListener("click", () => {
  triggerHapticFeedback()
  runScanButton.disabled = true
  showLoader(lastScanTimeEl, "Scanning...")
  setTimeout(() => {
    if (!currentUID) {
      runScanButton.disabled = false
      lastScanTimeEl.textContent = "N/A"
      return
    }
    const nT = Math.floor(Math.random() * 3),
      nV = Math.floor(Math.random() * 2),
      ts = new Date()
    const cT = Number.parseInt(threatsDetectedEl.textContent) || 0,
      cV = Number.parseInt(criticalVulnerabilitiesEl.textContent) || 0
    database
      .ref(`users/${currentUID}/dashboard/threatStatus`)
      .set({ detected: cT + nT, critical: cV + nV, lastScan: `${ts.toLocaleTimeString()} ${ts.toLocaleDateString()}` })
    addLogMessageToDB(`Scan: ${nT} threats, ${nV} vulnerabilities.`, "INFO")
    runScanButton.disabled = false
  }, 2500)
})
saveSettingsButton.addEventListener("click", () => {
  triggerHapticFeedback()
  saveSettingsButton.disabled = true
  if (!currentUID) {
    saveSettingsButton.disabled = false
    return
  }
  database
    .ref(`users/${currentUID}/settings/notifications`)
    .set({ critical: notifCriticalCheck.checked, summary: notifSummaryCheck.checked })
    .then(() => {
      addLogMessageToDB("Settings updated.", "INFO")
      alert("Settings Saved!")
    })
    .catch((e) => {
      addLogMessageToDB("Error saving settings: " + e.message, "ERROR")
      alert("Error saving.")
    })
    .finally(() => (saveSettingsButton.disabled = false))
})
launchDigitalAwakeningButton.addEventListener("click", () => {
  triggerHapticFeedback()
  launchDigitalAwakeningButton.disabled = true
  if (!currentUID) {
    launchDigitalAwakeningButton.disabled = false
    return
  }
  database
    .ref(`users/${currentUID}/digitalAwakening`)
    .update({ status: "initiated", lastLaunched: new Date().toISOString() })
  setTimeout(() => {
    alert("Digital Awakening Health Check initiated!")
    addLogMessageToDB("Digital Awakening initiated.", "INFO")
    launchDigitalAwakeningButton.disabled = false
  }, 500)
})

// --- Navigation & UI Logic ---
function switchTab(targetId) {
  sidebarLinks.forEach((l) => l.classList.remove("active"))
  bottomNavItems.forEach((item) => item.classList.remove("active"))
  tabContents.forEach((tc) => tc.classList.remove("active"))
  document.getElementById(targetId).classList.add("active")
  const activeSidebarLink = document.querySelector(`.sidebar-link[data-target="${targetId}"]`)
  if (activeSidebarLink) activeSidebarLink.classList.add("active")
  const activeBottomNavItem = document.querySelector(`.bottom-nav-item[data-target="${targetId}"]`)
  if (activeBottomNavItem) activeBottomNavItem.classList.add("active")
  if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open")
    pageOverlay.style.display = "none"
  }
}
sidebarLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    triggerHapticFeedback(30)
    e.preventDefault()
    switchTab(this.getAttribute("data-target"))
  })
})
bottomNavItems.forEach((item) => {
  item.addEventListener("click", function () {
    triggerHapticFeedback(30)
    switchTab(this.getAttribute("data-target"))
  })
})
mobileMenuToggle.addEventListener("click", () => {
  triggerHapticFeedback(30)
  sidebar.classList.toggle("open")
  pageOverlay.style.display = sidebar.classList.contains("open") ? "block" : "none"
})
pageOverlay.addEventListener("click", () => {
  triggerHapticFeedback(30)
  sidebar.classList.remove("open")
  pageOverlay.style.display = "none"
})
function setComplianceProgress(p) {
  complianceProgressCircle.style.strokeDashoffset = circumference - (p / 100) * circumference
  compliancePercentageText.textContent = `${p}%`
}
function addLogMessageToUI(m, t = "INFO", ts = new Date().toLocaleTimeString()) {
  const i = document.createElement("li")
  i.innerHTML = `<span class="log-timestamp">[${ts}]</span> <span class="log-message-text">${m}</span>`
  i.className = `log-${t.toLowerCase()}`
  logMessagesList.insertBefore(i, logMessagesList.firstChild)
}
function handleResize() {
  const cp = document.getElementById("contentPanel")
  const body = document.body
  if (window.innerWidth > 768) {
    sidebar.classList.remove("open")
    pageOverlay.style.display = "none"
    sidebar.classList.remove("collapsed")
    cp.style.marginLeft = "var(--sidebar-width)"
    body.style.paddingBottom = "0"
    userInfoTopNav.style.display = "flex"
  } else {
    cp.style.marginLeft = "0"
    body.style.paddingBottom = "var(--bottom-nav-mobile-height)"
    if (!sidebar.classList.contains("open")) sidebar.classList.add("collapsed")
    else sidebar.classList.remove("collapsed")
    userInfoTopNav.style.display = "none"
  }
}
window.addEventListener("resize", handleResize)

// --- DEV MODE: Live LLM Interaction (API Key is EXPOSED - Local Dev Only) ---
async function callAIGuardianLLM_DevMode(userContent, targetElement) {
  showLoader(targetElement, "AI Guardian contacting live model...")
  const messages = [
    { role: "system", content: aiGuardianSystemPrompt },
    { role: "user", content: userContent },
  ]
  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOGETHER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: LLM_MODEL, messages: messages, max_tokens: 1500, temperature: 0.6 }),
    })
    triggerHapticFeedback(30)
    if (!response.ok) {
      const errTxt = await response.text()
      throw new Error(`API Error ${response.status}: ${errTxt}`)
    }
    const data = await response.json()
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const rawResponse = data.choices[0].message.content.trim()
      targetElement.textContent = rawResponse
      targetElement.style.fontStyle = "normal"
      addLogMessageToDB(`AI Guardian (Live) response for: "${userContent.substring(0, 70)}..."`, "INFO")
      return rawResponse
    } else {
      throw new Error("Unexpected API response structure from LLM.")
    }
  } catch (error) {
    console.error("Error calling AI Guardian LLM (Live):", error)
    const errorMessage = `AI Guardian Error: ${error.message}. Check console.`
    if (targetElement) {
      targetElement.textContent = errorMessage
      targetElement.style.fontStyle = "normal"
    }
    addLogMessageToDB(`Error calling AI Guardian LLM (Live): ${error.message}`, "ERROR")
    return errorMessage
  }
}

// --- DEV MODE: CISO Consultation LLM Interaction ---
async function callCISOConsultationLLM_DevMode(userContent, targetElement) {
  showLoader(targetElement, "CISO Assistant analyzing your business context...")
  const messages = [
    { role: "system", content: CISO_PROMPT },
    { role: "user", content: userContent },
  ]
  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOGETHER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: LLM_MODEL, messages: messages, max_tokens: 2000, temperature: 0.7 }),
    })
    triggerHapticFeedback(30)
    if (!response.ok) {
      const errTxt = await response.text()
      throw new Error(`API Error ${response.status}: ${errTxt}`)
    }
    const data = await response.json()
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const rawResponse = data.choices[0].message.content.trim()
      targetElement.textContent = rawResponse
      targetElement.style.fontStyle = "normal"
      addLogMessageToDB(`CISO Consultation response for: "${userContent.substring(0, 70)}..."`, "INFO")
      return rawResponse
    } else {
      throw new Error("Unexpected API response structure from CISO LLM.")
    }
  } catch (error) {
    console.error("Error calling CISO Consultation LLM:", error)
    const errorMessage = `CISO Assistant Error: ${error.message}. Check console.`
    if (targetElement) {
      targetElement.textContent = errorMessage
      targetElement.style.fontStyle = "normal"
    }
    addLogMessageToDB(`Error calling CISO Consultation LLM: ${error.message}`, "ERROR")
    return errorMessage
  }
}

askAIButton.addEventListener("click", async () => {
  triggerHapticFeedback()
  const query = aiQueryInput.value.trim()
  if (!query) {
    aiResponseArea.textContent = "Please type a question for AI Guardian."
    aiResponseArea.style.fontStyle = "italic"
    return
  }
  askAIButton.disabled = true
  addLogMessageToDB(`User asked AI Guardian (Live): "${query}"`, "INFO")
  await callAIGuardianLLM_DevMode(query, aiResponseArea)
  askAIButton.disabled = false
  aiQueryInput.value = ""
})

analyzeUrlButton.addEventListener("click", async () => {
  triggerHapticFeedback()
  const urlToAnalyze = urlInput.value.trim()
  if (!urlToAnalyze) {
    aiUrlAnalysisResultEl.textContent = "Please enter a URL."
    aiUrlAnalysisResultEl.style.fontStyle = "italic"
    return
  }
  analyzeUrlButton.disabled = true
  addLogMessageToDB(`User requested URL analysis (Live): "${urlToAnalyze}"`, "INFO")
  const promptForUrlAnalysis = `As AI Guardian Assistant, analyze the following URL for potential threats to an SME: ${urlToAnalyze}. Consider common phishing tactics, URL structure, HTTPS usage, and any known malicious indicators. Provide a probabilistic threat assessment (LOW, MEDIUM, HIGH) with clear, plain-language reasoning for your assessment and practical advice for an SME owner on how to proceed or verify.`
  await callAIGuardianLLM_DevMode(promptForUrlAnalysis, aiUrlAnalysisResultEl)
  analyzeUrlButton.disabled = false
})

generateDocsButton.addEventListener("click", async () => {
  triggerHapticFeedback()
  generateDocsButton.disabled = true
  privacyPolicyOutput.value = ""
  termsOfUseOutput.value = ""
  showLoader(docGenerationStatus, "AI Guardian is drafting document template...")

  const docGenUserPrompt = `Generate full template for Privacy Policy and Terms of Use for a small European SME.
Focus on key sections and plain language.
For the Privacy Policy, ensure it mentions GDPR principles like data collection purposes (e.g., for providing services, communication, analytics), data subject rights (access, rectification, erasure, portability), data security measures taken by the SME, use of cookies (with a placeholder for details), data retention period, and contact information for data protection queries.
For the Terms of Use, cover aspects like introduction/acceptance of terms, description of services offered by the SME, user responsibilities/acceptable use, intellectual property ownership of the SME's content, disclaimers of warranties (within reasonable SME limits), limitation of liability, and governing law (suggesting the SME's country of operation).
Provide each policy as a distinct section. Start the Privacy Policy with "## Privacy Policy Outline - [SME Name Placeholder]" and the Terms of Use with "## Terms of Use Outline - [SME Name Placeholder]".
Keep the language simple, direct, and structured with clear headings for each section, suitable for an SME owner to understand as a starting point for further legal consultation. Do not add any conversational intro or outro, just the two documents. Do not add intro or extro comment.`

  const fullResponse = await callAIGuardianLLM_DevMode(docGenUserPrompt, docGenerationStatus)

  if (fullResponse && !fullResponse.startsWith("AI Guardian Error:")) {
    const privacyPolicyMatch = fullResponse.match(
      /## Privacy Policy Outline(?: - \[SME Name Placeholder\])?([\s\S]*?)## Terms of Use Outline/i,
    )
    const termsOfUseMatch = fullResponse.match(/## Terms of Use Outline(?: - \[SME Name Placeholder\])?([\s\S]*)/i)

    privacyPolicyOutput.value = privacyPolicyMatch
      ? privacyPolicyMatch[1].trim()
      : "AI Guardian could not fully parse the Privacy Policy outline from the response. Please see raw response below if available, or try again."
    termsOfUseOutput.value = termsOfUseMatch
      ? termsOfUseMatch[1].trim()
      : "AI Guardian could not fully parse the Terms of Use outline from the response. Please see raw response below if available, or try again."

    if (!privacyPolicyMatch || !termsOfUseMatch) {
      docGenerationStatus.textContent =
        "Document outlines generated with potential parsing issues. Review content carefully."
      if (!privacyPolicyMatch)
        privacyPolicyOutput.value += "\n\nRAW AI RESPONSE (or part of it):\n" + fullResponse.substring(0, 1000)
      if (!termsOfUseMatch && termsOfUseOutput.value.includes("raw response"))
        termsOfUseOutput.value +=
          "\n\nRAW AI RESPONSE (or part of it):\n" +
          fullResponse.substring(fullResponse.indexOf("## Terms of Use Outline"))
    } else {
      docGenerationStatus.textContent =
        "Document outlines generated successfully by AI Guardian. Legal review is essential."
    }
    docGenerationStatus.style.color = "var(--text-color)" // Reset color if it was error
    docGenerationStatus.style.fontStyle = "normal"
  } else {
    // Error message already set by callAIGuardianLLM_DevMode in docGenerationStatus
    if (docGenerationStatus.textContent.includes("AI Guardian Error:")) {
      // Check if it's an error from the call
      privacyPolicyOutput.value = "Failed to generate document templates due to an API error."
      termsOfUseOutput.value = "Failed to generate document templates due to an API error."
    }
  }
  generateDocsButton.disabled = false
})
