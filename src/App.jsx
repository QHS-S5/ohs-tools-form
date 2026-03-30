import { useState, useMemo, useCallback } from "react";

// ─── Official QHS "I can" Progression Statements (from Framework Doc, May 2026) ─
const PROGRESSION = {
  "Problem Solving": [
    "I can describe and explain a problem I am faced with",
    "I can recognise when the problem I am faced with is like one I have tackled before",
    "I can do research to understand a problem better",
    "I can identify the cause of the problem",
    "I can identify several possible solutions to a problem",
    "I can use what I learnt from solving a previous problem to solve a new one",
    "I can evaluate and decide which solution to a problem would work best",
    "I can adapt my problem-solving strategy by learning from what I have tried and making improvements",
    "I can work through a complex problem, coming up with a step-by-step plan to fix it",
    "I can reflect on how I approach problems and identify strategies that work best for me",
  ],
  "Critical Thinking": [
    "I understand the difference between fact and opinion",
    "I can research a topic on my own",
    "I can research a topic on my own, using appropriate information sources",
    "I understand that some sources are more trusted than others, and can assess reliability",
    "I can spot if an argument isn't logical and explain why",
    "I can justify my views based on my evaluation of the evidence I have gathered",
    "I can work with a range of information sources to evaluate evidence and come to my own conclusion",
    "I can evaluate the strength of other people's arguments, offering reasons why they are valid or not",
    "I can construct and present logical arguments on complex issues and respond to counter arguments",
    "I can reflect on my own thinking processes, understand my strengths and weaknesses and use this to adapt my approaches",
  ],
  "Creativity": [
    "I can come up with an idea in response to a task or issue",
    "I can come up with different ideas in response to a task or issue",
    "I can experiment with different ideas when faced with a challenge",
    "I can test ideas out, learning what works and what does not",
    "I can evaluate my own ideas and improve them as a result",
    "I can come up with ideas by looking at and listening to what others have done",
    "I can help others to be creative and come up with new ideas",
    "I can evaluate other people's ideas and offer creative ideas for them to improve",
    "I can reflect on my creative process, recognising what inspires my best ideas and how I develop them",
    "I can apply my creativity across different contexts, adapting my approach and drawing on what I have learned about how I generate and develop ideas",
  ],
  "Curiosity": [
    "I enjoy learning new things",
    "I can learn about new things on my own",
    "I can use different information sources to find out more about topics that interest me",
    "If I don't understand something I like to research it to get a clearer idea",
    "I ask questions of teachers and/or peers to find out more information",
    "I enjoy exploring if something could be done in a different way",
    "I can dig deeply into a topic or theme, using a variety of sources to deepen my understanding",
    "I actively seek out new ideas and opinions on a topic, going beyond what is required",
    "I actively search out opportunities to learn new things, showing independence in my approach",
    "I can make connections between different areas of learning, pursuing questions across subjects",
  ],
  "Resilience": [
    "I can keep trying when something goes wrong",
    "I can handle last minute changes to a plan",
    "I can emotionally deal with failure or rejection",
    "I can manage my response to stress or disappointment and stay focused on my goals",
    "I choose to learn from setbacks, using what I have learned to adapt my approach",
    "I can keep motivated, despite challenges or setbacks and can use strategies to maintain or improve my effort",
    "I can help others to keep going when things are hard",
    "I can help others to manage their responses to setbacks and encourage them to stay focused on their goals",
    "I can achieve what I set out to do despite multiple setbacks",
    "I can reflect upon how I respond to difficulties and understand my own patterns of resilience",
  ],
  "Responsibility": [
    "I take ownership of my tasks, seeing them through to the end",
    "If I can't do something I've said I'll do, I make arrangements, so it doesn't cause problems",
    "I can recognise the consequences of my actions and decisions",
    "If I make a mistake, I own up to it and learn from it",
    "If I see something happening that is wrong, I try to do something about it",
    "I take responsibility for my own learning, setting goals, managing my timelines and holding myself accountable",
    "In team projects, I volunteer to take on responsibilities, and get them done",
    "I pay attention to the impact my actions have on other people",
    "I take responsibility consistently, even when it is difficult or when no-one is watching",
    "I can reflect on my decision-making patterns and understand what influences my choices and actions",
  ],
  "Leadership": [
    "I can share my ideas and listen to others in a group situation",
    "I can take responsibility for my own role in a group, while being mindful of what others are doing",
    "I can motivate and encourage other people in a group situation",
    "I can take the lead in a group, giving clear direction to others",
    "I can lead a group to a shared goal, allocating roles based on people's strengths and areas to develop",
    "I can identify when the group needs support and take positive actions to provide it",
    "I can help someone to get better at something, making the process feel positive for them",
    "I can plan a group strategy when faced with a complex issue, identifying clear tasks, roles, outcomes and timelines to bring people with me",
    "I can reflect on the strengths and weaknesses of my leadership",
    "I can adapt my leadership style to the situation and the people I am leading",
  ],
  "Collaboration": [
    "I can contribute to group tasks by working hard",
    "I can take on different roles within group situations",
    "I can listen to and value other people's ideas and opinions",
    "I can communicate positively in a group, avoiding conflict",
    "I can adapt how I work within a group, responding constructively to feedback from others",
    "I can support other group members to contribute",
    "I can help resolve disagreements in group situations",
    "I can evaluate the strengths of team members and help the group to allocate roles to ensure the best outcomes",
    "I can reflect on my own personality and contributions in a group situation and adapt to ensure that collaboration improves",
    "I can help others to develop their collaboration skills by encouraging and supporting their contributions even if they do not match with my own ideas and opinions",
  ],
  "Open-Mindedness": [
    "I can listen to viewpoints that differ from my own without dismissing them",
    "I am willing to try new approaches to learning",
    "I can take on board other people's ways of doing things even if they may differ from my own",
    "I actively seek out different viewpoints to broaden my understanding",
    "I can change my position on a topic or task when presented with strong evidence or arguments",
    "I can engage thoughtfully with ideas or concepts I may find uncomfortable or challenging",
    "I can recognise and understand my own bias",
    "I can put my own bias to the side when presented with strong evidence or arguments",
    "I can reflect on how my own background and lived experience shape my perspectives",
    "I can reflect on how the backgrounds and experiences of others influences their perspectives and can empathise with them",
  ],
  "Empathy": [
    "I can recognise how others might be feeling",
    "I can consider how my actions affect other people's feelings",
    "I can listen to other people's perspectives even if they differ from my own",
    "I can consider why someone might think or feel differently to me",
    "I can adapt my responses to show sensitivity to how others might be feeling in different situations",
    "I can take other people's circumstances into account when making decisions",
    "When someone is suffering or struggling, I try to learn what help they want and continue to support them",
    "I seek out opportunities to take part in activities that help other people",
    "I can help other people to develop their understanding of different perspectives",
    "I can reflect on how my own assumptions, likes and dislikes influence the way I respond to others and can adapt my approaches as a result",
  ],
};

// Plain-English explainers for each "I can" statement — shown when learner taps ?
const EXPLAINERS = {
  "Problem Solving": [
    "You can say what the problem is in your own words — like explaining it to a friend.",
    "You notice when a new problem reminds you of something you've dealt with before.",
    "You look things up or ask around to understand the problem better before jumping in.",
    "You can figure out why the problem is happening, not just what the problem is.",
    "You can think of more than one way to fix something, not just the first idea.",
    "You take what worked (or didn't) last time and use that knowledge on a new problem.",
    "You can weigh up your options and pick the best one, explaining why.",
    "When your first plan doesn't work, you change it rather than giving up or starting over.",
    "You can break a big, messy problem into smaller steps and work through them in order.",
    "You think about how you solve problems — what your go-to strategies are and when they work best.",
  ],
  "Critical Thinking": [
    "You know the difference between something that's true and something that's just someone's opinion.",
    "You can go and find out about a topic by yourself, without being told exactly where to look.",
    "You pick good sources — not just the first thing that comes up on Google.",
    "You know that some websites, books or people are more reliable than others, and you check.",
    "You can spot when an argument doesn't make sense and explain what's wrong with it.",
    "You can back up what you think with evidence you've actually looked at, not just a feeling.",
    "You look at information from different places, weigh it up, and form your own view.",
    "You can look at someone else's argument and say clearly why it's strong or weak.",
    "You can build a proper argument on a tricky topic and handle it when someone disagrees.",
    "You think about your own thinking — you know what you're good at and where you might go wrong.",
  ],
  "Creativity": [
    "When given a task, you can come up with at least one idea to get started.",
    "You don't just go with your first idea — you can think of a few different approaches.",
    "You're willing to try things out and experiment, even if you're not sure they'll work.",
    "You test your ideas to see what works and learn from what doesn't.",
    "You can look at your own work honestly, spot what could be better, and improve it.",
    "You get inspiration from other people's work and use it to spark your own ideas.",
    "You help other people come up with ideas — you're good at getting creative thinking going in a group.",
    "You can give useful creative feedback — not just 'it's good' but actual ideas for improvement.",
    "You think about what helps you be creative — what gets your best ideas flowing and how you develop them.",
    "You can use your creativity in different situations, adapting how you work based on what you've learned about yourself.",
  ],
  "Curiosity": [
    "You're interested in finding out new things — learning doesn't feel like a chore.",
    "You can teach yourself something new without someone telling you to.",
    "You use different sources — books, websites, videos, people — to find out more about things you're interested in.",
    "When something confuses you, your instinct is to look into it rather than just leave it.",
    "You ask questions in class or to your mates to understand things better.",
    "You like wondering 'what if we did it differently?' — you enjoy exploring alternatives.",
    "You go deep on topics that interest you, using lots of different sources to really understand them.",
    "You go beyond what's been set — you look for extra information and different viewpoints because you want to.",
    "You actively look for chances to learn, without waiting for someone to point you there.",
    "You connect ideas across different subjects — something from Science makes you think about something in English.",
  ],
  "Resilience": [
    "When something goes wrong, you don't just stop — you have another go.",
    "If plans change suddenly, you can deal with it without falling apart.",
    "When you fail or get knocked back, you can handle the feelings and keep going.",
    "You can manage stress or disappointment without losing sight of what you're working toward.",
    "You don't just bounce back — you actually learn something from setbacks and change your approach.",
    "Even when things are tough, you find ways to keep your effort up — you have strategies.",
    "You notice when others are struggling and help them keep going.",
    "You can support other people through difficult times, helping them stay focused.",
    "You stick with something even when you've hit multiple setbacks — you don't give up on your goals.",
    "You understand your own patterns — you know how you tend to react to difficulty and what helps you through.",
  ],
  "Responsibility": [
    "When you're given something to do, you do it — you don't leave things half-finished.",
    "If you can't keep a commitment, you sort it out so it doesn't cause problems for others.",
    "You understand that your choices have consequences — good and bad.",
    "When you get it wrong, you admit it and learn from it rather than making excuses.",
    "If you see something unfair or wrong happening, you try to do something about it.",
    "You take charge of your own learning — you set goals, manage your time, and hold yourself to account.",
    "In group work, you step up and take on tasks — and you actually do them.",
    "You think about how what you do affects other people, not just yourself.",
    "You do the right thing even when nobody's watching and even when it's hard.",
    "You think about the patterns in your decisions — why you make the choices you do and what influences you.",
  ],
  "Leadership": [
    "In a group, you speak up with your ideas and you listen to what others have to say.",
    "You take responsibility for your part of the work and pay attention to how others are getting on.",
    "You can encourage and motivate people in a group — you help keep energy up.",
    "You can take charge of a group and give people clear direction on what to do.",
    "You allocate roles based on what people are good at, not just randomly.",
    "You notice when the group is struggling and you step in to help.",
    "You can coach someone — help them improve at something in a way that feels positive, not critical.",
    "You can plan a whole group strategy for a complex task — roles, timelines, outcomes, the lot.",
    "You think honestly about your own leadership — what you do well and what you could do better.",
    "You change how you lead depending on the situation and the people you're working with.",
  ],
  "Collaboration": [
    "You get stuck in and do your fair share of the work in a group.",
    "You can take on different roles — you're not stuck always doing the same thing.",
    "You actually listen to other people's ideas and take them seriously, even when they're different from yours.",
    "You communicate well in a group without causing arguments.",
    "When someone gives you feedback, you take it on board and adjust how you work.",
    "You help quieter group members have their say and contribute.",
    "When there's a disagreement in the group, you help sort it out.",
    "You can see what different people are good at and help the group make the most of everyone's strengths.",
    "You think about what kind of team member you are and actively work to improve.",
    "You help other people get better at working in teams — even when their ideas are different from yours.",
  ],
  "Open-Mindedness": [
    "You can hear someone say something you disagree with without shutting them down.",
    "You're willing to try a different way of doing things, even if it's not what you're used to.",
    "You can try someone else's approach even if you'd normally do it differently.",
    "You deliberately look for viewpoints that are different from your own.",
    "When someone makes a really good point, you can change your mind — you don't just stick to your original view out of stubbornness.",
    "You can engage with ideas that make you uncomfortable rather than just avoiding them.",
    "You recognise that you have biases — things you assume without thinking — and you understand them.",
    "You can set your biases aside when the evidence points in a different direction.",
    "You think about how your own background and experiences shape the way you see things.",
    "You understand that other people's backgrounds shape their views too, and you can empathise with that.",
  ],
  "Empathy": [
    "You can tell when someone around you is upset, uncomfortable, or not themselves.",
    "You think about how what you do might make other people feel.",
    "You can listen to someone's point of view properly, even when you see things differently.",
    "You can put yourself in someone else's shoes — you think about why they might feel or think the way they do.",
    "You adjust how you behave depending on how others might be feeling in that moment.",
    "You factor in other people's situations when making decisions — not just what works for you.",
    "When someone's going through a hard time, you ask what they actually need rather than assuming.",
    "You actively look for ways to help other people — volunteering, supporting, getting involved.",
    "You help other people see perspectives they hadn't considered before.",
    "You think about how your own likes, dislikes, and assumptions affect how you treat others, and you work on it.",
  ],
};

// Context-aware STAR sentence starters
const STAR_STARTERS = {
  situation: {
    Curriculum: (subject) => [
      `In ${subject || "class"}, we were working on...`,
      `During a ${subject || "lesson"} task, our group had to...`,
      `In ${subject || "my subject"}, the teacher asked us to...`,
    ],
    "Wider Achievement": () => [
      "During a club/activity, we were...",
      "At a school event, I was involved in...",
      "Outside of class, I took part in...",
    ],
    "Skills Academy": () => [
      "In Skills Academy, we were asked to...",
      "During our Skills Academy session, the challenge was...",
      "Our Skills Academy project involved...",
    ],
    Partnership: () => [
      "While working with our partner organisation, we...",
      "During a visit/project with...",
      "As part of our partnership activity, I was...",
    ],
  },
  task: {
    _default: () => [
      "My role was to...",
      "I was responsible for...",
      "I needed to...",
      "The group needed me to...",
    ],
  },
  action: {
    _default: (skill) => [
      `I used my ${skill} by...`,
      "I decided to...",
      "The steps I took were...",
      "To handle this, I...",
    ],
  },
  result: {
    _default: () => [
      "As a result of this,...",
      "This meant that...",
      "I learned that I...",
      "Looking back, I realise that...",
    ],
  },
};

// ─── Framework Structure ─────────────────────────────────────────────────────
const FRAMEWORK = {
  "Works Hard": {
    color: "#2563eb",
    pairs: [
      { label: "Solves problems and thinks critically", skills: [
        { name: "Problem Solving", def: "Finding solutions to challenges" },
        { name: "Critical Thinking", def: "Understanding and acting on information to make a well-informed decision" },
      ]},
      { label: "Is creative and curious", skills: [
        { name: "Creativity", def: "Using your imagination and generating new ideas" },
        { name: "Curiosity", def: "Questioning and researching to make sense of new ideas" },
      ]},
      { label: "Is resilient and responsible", skills: [
        { name: "Resilience", def: "Overcoming challenges and setbacks" },
        { name: "Responsibility", def: "Owning your actions, decisions and goals" },
      ]},
    ],
  },
  "Is Kind": {
    color: "#dc2626",
    pairs: [
      { label: "Leads and collaborates", skills: [
        { name: "Leadership", def: "Supporting, encouraging and motivating others to achieve a shared goal" },
        { name: "Collaboration", def: "Working with others to achieve a shared goal" },
      ]},
      { label: "Is open-minded and shows empathy", skills: [
        { name: "Open-Mindedness", def: "Considering different ideas and opinions" },
        { name: "Empathy", def: "Understanding other peoples' feelings and viewpoints" },
      ]},
    ],
  },
};

const CONTEXTS = [
  { value: "Curriculum", label: "In a lesson (Curriculum)", icon: "📚" },
  { value: "Wider Achievement", label: "Wider Achievement", icon: "🏆" },
  { value: "Skills Academy", label: "Skills Academy", icon: "⚡" },
  { value: "Partnership", label: "Partnership Activity", icon: "🤝" },
];

const SUBJECTS = [
  "English", "Mathematics", "Science", "Social Subjects", "Technologies",
  "Expressive Arts", "Health & Wellbeing", "Modern Languages", "RME",
];

const YEAR_GROUPS = ["S1", "S2", "S3", "S4", "S5", "S6"];

function getTerm(dateStr) {
  const m = new Date(dateStr).getMonth();
  if (m >= 7 && m <= 9) return "Term 1";
  if (m >= 10 && m <= 11) return "Term 2";
  if (m >= 0 && m <= 2) return "Term 3";
  return "Term 4";
}

async function submitToWebhook(url, data) {
  const r = await fetch("/.netlify/functions/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, data }),
  });
  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try { const err = await r.json(); msg = err.error || msg; } catch {}
    throw new Error(msg);
  }
  return r;
}

// ─── Settings Panel ──────────────────────────────────────────────────────────
function SettingsPanel({ webhookUrl, setWebhookUrl, onClose, testResult, onTest }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", maxWidth: "560px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#1e293b" }}>⚙️ Form Settings</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "6px" }}>Power Automate Webhook URL</label>
          <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://prod-xx.westeurope.logic.azure.com:443/workflows/..."
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "'Fira Code', monospace", boxSizing: "border-box", color: "#334155", outline: "none" }} />
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px", lineHeight: "1.5" }}>
            Paste the HTTP POST URL from your Power Automate flow. Data goes directly to your school OneDrive.
          </div>
        </div>
        <button onClick={onTest} disabled={!webhookUrl}
          style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, background: webhookUrl ? "#6366f1" : "#e2e8f0", color: webhookUrl ? "#fff" : "#94a3b8", border: "none", cursor: webhookUrl ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>
          Send Test Submission
        </button>
        {testResult && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", fontSize: "13px", lineHeight: "1.5", background: testResult.ok ? "#f0fdf4" : "#fef2f2", color: testResult.ok ? "#16a34a" : "#dc2626", border: `1px solid ${testResult.ok ? "#bbf7d0" : "#fecaca"}` }}>
            {testResult.ok ? "✅ Test successful! Check your Excel file on OneDrive." : `❌ ${testResult.msg}`}
          </div>
        )}
        <div style={{ marginTop: "20px", padding: "14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b", lineHeight: "1.6" }}>
          <strong>How this works:</strong> Submissions go as JSON to your Power Automate flow, which writes each reflection as a row in your Excel workbook on the school OneDrive. No data leaves M365.
        </div>
      </div>
    </div>
  );
}

// ─── Shared Styles ───────────────────────────────────────────────────────────
const h2Style = { fontSize: "19px", fontWeight: 800, color: "#1e293b", margin: "0 0 5px" };
const descStyle = { fontSize: "13px", color: "#64748b", margin: "0 0 18px", lineHeight: "1.5" };
const labelStyle = { fontSize: "12px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "11px 13px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", color: "#1e293b" };
const chipStyle = (active) => ({ padding: "7px 14px", borderRadius: "8px", cursor: "pointer", border: `1.5px solid ${active ? "#6366f1" : "#e2e8f0"}`, background: active ? "#eef2ff" : "#fff", fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? "#6366f1" : "#475569", transition: "all 0.15s" });

// ─── Step Components ─────────────────────────────────────────────────────────
function StepIdentity({ name, setName, yearGroup, setYearGroup, regClass, setRegClass }) {
  return (
    <div>
      <h2 style={h2Style}>Who are you?</h2>
      <p style={descStyle}>Your name and year group so this reflection is saved to your profile.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lewis Campbell" style={inputStyle} />
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Year Group</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {YEAR_GROUPS.map((y) => <div key={y} onClick={() => setYearGroup(y)} style={chipStyle(yearGroup === y)}>{y}</div>)}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Registration Class (optional)</label>
            <input type="text" value={regClass} onChange={(e) => setRegClass(e.target.value)} placeholder="e.g. 3A1" style={inputStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDomain({ selected, onSelect }) {
  return (
    <div>
      <h2 style={h2Style}>Which area does this skill belong to?</h2>
      <p style={descStyle}>Think about the skill you developed. Does it fit under <strong style={{ color: "#2563eb" }}>Works Hard</strong> or <strong style={{ color: "#dc2626" }}>Is Kind</strong>?</p>
      <div style={{ display: "flex", gap: "14px" }}>
        {Object.entries(FRAMEWORK).map(([domain, data]) => (
          <div key={domain} onClick={() => onSelect(domain)} style={{ flex: 1, padding: "22px 18px", borderRadius: "14px", cursor: "pointer", border: `2.5px solid ${selected === domain ? data.color : "#e2e8f0"}`, background: selected === domain ? `${data.color}08` : "#fff", transition: "all 0.2s" }}>
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>{domain === "Works Hard" ? "💪" : "❤️"}</div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: data.color }}>{domain}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "8px", lineHeight: "1.5" }}>
              {data.pairs.map((p) => p.label).join(" · ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepSkill({ domain, selected, onSelect }) {
  const data = FRAMEWORK[domain];
  return (
    <div>
      <h2 style={h2Style}>Which tool did you use?</h2>
      <p style={descStyle}>Select the specific skill you want to reflect on.</p>
      {data.pairs.map((pair) => (
        <div key={pair.label} style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "7px" }}>{pair.label}</div>
          <div style={{ display: "flex", gap: "10px" }}>
            {pair.skills.map((skill) => (
              <div key={skill.name} onClick={() => onSelect(skill.name)} style={{ flex: 1, padding: "14px", borderRadius: "12px", cursor: "pointer", border: `2px solid ${selected === skill.name ? data.color : "#e2e8f0"}`, background: selected === skill.name ? `${data.color}08` : "#fff", transition: "all 0.2s" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{skill.name}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px", lineHeight: "1.4" }}>{skill.def}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepLevel({ skill, level, onSelect }) {
  const statements = PROGRESSION[skill] || [];
  const explainers = EXPLAINERS[skill] || [];
  const [expandedHelp, setExpandedHelp] = useState(null);
  return (
    <div>
      <h2 style={h2Style}>Where are you on the {skill} ladder?</h2>
      <p style={descStyle}>Read the statements below. Select the <strong>highest level</strong> you can confidently do right now. <span style={{ color: "#6366f1", fontWeight: 600 }}>Tap the ? for a plain-English explanation.</span></p>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {statements.map((stmt, i) => {
          const lv = i + 1;
          const isSel = level === lv;
          const isBelow = level !== null && lv <= level;
          const isHelpOpen = expandedHelp === lv;
          return (
            <div key={lv} style={{ borderRadius: "10px", border: `2px solid ${isSel ? "#6366f1" : isBelow ? "#c7d2fe" : "#f1f5f9"}`, background: isSel ? "#eef2ff" : isBelow ? "#fafaff" : "#fff", transition: "all 0.12s" }}>
              <div onClick={() => onSelect(lv)} style={{ display: "flex", alignItems: "flex-start", gap: "11px", padding: "11px 13px", cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isSel ? "#6366f1" : isBelow ? "#c7d2fe" : "#f1f5f9", color: isSel ? "#fff" : isBelow ? "#6366f1" : "#94a3b8", fontSize: "12px", fontWeight: 800 }}>{lv}</div>
                <div style={{ flex: 1, fontSize: "12.5px", color: isSel ? "#1e293b" : "#475569", fontWeight: isSel ? 600 : 400, lineHeight: "1.5", paddingTop: "3px" }}>{stmt}</div>
                {explainers[i] && (
                  <div onClick={(e) => { e.stopPropagation(); setExpandedHelp(isHelpOpen ? null : lv); }}
                    style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isHelpOpen ? "#6366f1" : "#f1f5f9", color: isHelpOpen ? "#fff" : "#94a3b8", fontSize: "11px", fontWeight: 800, cursor: "pointer", marginTop: "2px", transition: "all 0.15s" }}>?</div>
                )}
              </div>
              {isHelpOpen && explainers[i] && (
                <div style={{ padding: "0 13px 12px 52px", fontSize: "12px", color: "#6366f1", lineHeight: "1.6", fontStyle: "italic" }}>
                  💡 {explainers[i]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepContext({ context, onSelect, subject, onSubject }) {
  return (
    <div>
      <h2 style={h2Style}>Where did you develop this skill?</h2>
      <p style={descStyle}>Select the context where this experience happened.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {CONTEXTS.map((ctx) => (
          <div key={ctx.value} onClick={() => onSelect(ctx.value)} style={{ padding: "16px 14px", borderRadius: "12px", cursor: "pointer", border: `2px solid ${context === ctx.value ? "#6366f1" : "#e2e8f0"}`, background: context === ctx.value ? "#eef2ff" : "#fff", transition: "all 0.2s" }}>
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{ctx.icon}</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{ctx.label}</div>
          </div>
        ))}
      </div>
      {context === "Curriculum" && (
        <div style={{ marginTop: "18px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>Which subject?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {SUBJECTS.map((s) => <div key={s} onClick={() => onSubject(s)} style={chipStyle(subject === s)}>{s}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function StepStar({ star, onChange, skill, context, subject }) {
  const prompts = {
    situation: "Describe the situation. What were you doing? What was the context?",
    task: "What was your task or role? What were you trying to achieve?",
    action: `What actions did you take? How did you use your ${skill} skill?`,
    result: "What was the result? What did you learn about yourself?",
  };
  const labels = { situation: "Situation", task: "Task", action: "Action", result: "Result" };
  const colors = { situation: "#6366f1", task: "#f59e0b", action: "#10b981", result: "#ec4899" };
  const [showStarters, setShowStarters] = useState({});

  const getStarters = (key) => {
    if (key === "situation") {
      const ctxStarters = STAR_STARTERS.situation[context];
      return ctxStarters ? ctxStarters(subject) : STAR_STARTERS.situation["Curriculum"](subject);
    }
    if (key === "action") return STAR_STARTERS.action._default(skill);
    return STAR_STARTERS[key]._default();
  };

  return (
    <div>
      <h2 style={h2Style}>Tell the story of your experience</h2>
      <p style={descStyle}>Use the <strong>STAR</strong> approach. This is the evidence that builds your profile. <span style={{ color: "#6366f1", fontWeight: 600 }}>Need help? Tap "Help me start" for sentence starters.</span></p>
      {["situation", "task", "action", "result"].map((key) => (
        <div key={key} style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: 26, height: 26, borderRadius: "6px", background: colors[key], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 900, color: "#fff" }}>{key[0].toUpperCase()}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{labels[key]}</div>
            </div>
            {star[key].length < 5 && (
              <button onClick={() => setShowStarters((prev) => ({ ...prev, [key]: !prev[key] }))}
                style={{ background: showStarters[key] ? "#6366f1" : "#f1f5f9", color: showStarters[key] ? "#fff" : "#6366f1", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                {showStarters[key] ? "Hide starters" : "Help me start"}
              </button>
            )}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>{prompts[key]}</div>
          {showStarters[key] && star[key].length < 5 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
              {getStarters(key).map((starter, i) => (
                <button key={i} onClick={() => { onChange(key, starter); setShowStarters((prev) => ({ ...prev, [key]: false })); }}
                  style={{ padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #c7d2fe", background: "#fafaff", fontSize: "12px", color: "#475569", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", lineHeight: "1.4", transition: "all 0.15s" }}
                  onMouseOver={(e) => { e.target.style.background = "#eef2ff"; e.target.style.borderColor = "#6366f1"; }}
                  onMouseOut={(e) => { e.target.style.background = "#fafaff"; e.target.style.borderColor = "#c7d2fe"; }}>
                  {starter}
                </button>
              ))}
            </div>
          )}
          <textarea value={star[key]} onChange={(e) => onChange(key, e.target.value)} placeholder={`Write about the ${labels[key].toLowerCase()}...`} rows={3}
            style={{ width: "100%", padding: "11px 13px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", lineHeight: "1.6", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", color: "#1e293b" }}
            onFocus={(e) => e.target.style.borderColor = colors[key]} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
          <div style={{ fontSize: "10px", color: star[key].length < 10 ? "#f59e0b" : "#10b981", textAlign: "right", marginTop: "2px" }}>
            {star[key].length} characters {star[key].length < 10 ? "(aim for more detail)" : "✓"}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepReview({ name, yearGroup, domain, skill, level, context, subject, star }) {
  const domainData = FRAMEWORK[domain];
  const statements = PROGRESSION[skill] || [];
  const colors = { situation: "#6366f1", task: "#f59e0b", action: "#10b981", result: "#ec4899" };
  return (
    <div>
      <h2 style={h2Style}>Review your reflection</h2>
      <p style={descStyle}>Check everything looks right before submitting.</p>
      <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "20px", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#1e293b" }}>{name}</div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{yearGroup} · {context}{subject ? ` · ${subject}` : ""}</div>
            <div style={{ marginTop: "8px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: domainData?.color, textTransform: "uppercase", letterSpacing: "0.8px" }}>{domain}</span>
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#1e293b", marginLeft: "8px" }}>{skill}</span>
            </div>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${domainData?.color || "#6366f1"}14`, border: `3px solid ${domainData?.color || "#6366f1"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 900, color: domainData?.color || "#6366f1" }}>{level}</div>
        </div>
        {level && statements[level - 1] && (
          <div style={{ padding: "8px 12px", borderRadius: "8px", background: "#fff", border: "1px solid #e2e8f022", fontSize: "12px", color: "#475569", marginBottom: "14px", fontStyle: "italic" }}>
            "{statements[level - 1]}"
          </div>
        )}
        {["situation", "task", "action", "result"].map((key) => {
          if (!star[key]) return null;
          return (
            <div key={key} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: 22, height: 22, borderRadius: "5px", background: colors[key], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>{key[0].toUpperCase()}</div>
              <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>{star[key]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function ToolsFormLive() {
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(import.meta.env.VITE_WEBHOOK_URL || "");
  const [testResult, setTestResult] = useState(null);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [yearGroup, setYearGroup] = useState(null);
  const [regClass, setRegClass] = useState("");
  const [domain, setDomain] = useState(null);
  const [skill, setSkill] = useState(null);
  const [level, setLevel] = useState(null);
  const [context, setContext] = useState(null);
  const [subject, setSubject] = useState(null);
  const [star, setStar] = useState({ situation: "", task: "", action: "", result: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const STEPS = ["Identity", "Area", "Skill", "Level", "Context", "STAR", "Review"];

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return name.trim().length >= 2 && yearGroup !== null;
      case 1: return domain !== null;
      case 2: return skill !== null;
      case 3: return level !== null;
      case 4: return context !== null && (context !== "Curriculum" || subject !== null);
      case 5: return star.situation.length >= 10 && star.task.length >= 10 && star.action.length >= 10 && star.result.length >= 10;
      case 6: return true;
      default: return false;
    }
  }, [step, name, yearGroup, domain, skill, level, context, subject, star]);

  const buildPayload = useCallback(() => {
    const now = new Date().toISOString();
    return { timestamp: now, date: now.slice(0, 10), term: getTerm(now), name: name.trim(), studentName: name.trim(), yearGroup, regClass: regClass.trim() || "", domain, skill, level, iCanStatement: (PROGRESSION[skill] || [])[level - 1] || "", context, subject: subject || "", situation: star.situation, task: star.task, action: star.action, result: star.result };
  }, [name, yearGroup, regClass, domain, skill, level, context, subject, star]);

  const handleTest = async () => {
    setTestResult(null);
    try {
      const ts = new Date().toISOString();
      await submitToWebhook(webhookUrl, { timestamp: ts, date: ts.slice(0, 10), term: getTerm(ts), name: "TEST SUBMISSION", studentName: "TEST SUBMISSION", yearGroup: "S1", regClass: "TEST", domain: "Works Hard", skill: "Problem Solving", level: 5, iCanStatement: "I can identify several possible solutions to a problem", context: "Curriculum", subject: "Test Subject", situation: "Test submission from QHS Tools for Success form.", task: "Testing the Power Automate webhook.", action: "Sent a POST request.", result: "If you see this row in Excel, it works." });
      setTestResult({ ok: true });
    } catch (err) { setTestResult({ ok: false, msg: err.message }); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitError(null);
    if (!webhookUrl) { setSubmitError("Webhook URL is not configured. Please contact your administrator."); setSubmitting(false); return; }
    try { await submitToWebhook(webhookUrl, buildPayload()); setSubmitted(true); }
    catch (err) { setSubmitError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleReset = () => {
    setStep(0); setName(""); setYearGroup(null); setRegClass(""); setDomain(null); setSkill(null); setLevel(null); setContext(null); setSubject(null); setStar({ situation: "", task: "", action: "", result: "" }); setSubmitted(false); setSubmitError(null);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: "480px", padding: "40px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", margin: "0 0 10px" }}>Reflection recorded!</h1>
          <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: "0 0 6px" }}>Your <strong>{skill}</strong> reflection (Level {level}) has been saved.</p>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 28px" }}>Your reflection has been saved to your school OneDrive.</p>
          <button onClick={handleReset} style={{ padding: "14px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: 700, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Add another reflection</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "linear-gradient(180deg, #0f172a 0%, #1e293b 110px, #f8fafc 111px)" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {showSettings && <SettingsPanel webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} onClose={() => setShowSettings(false)} testResult={testResult} onTest={handleTest} />}

      <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "9px", background: "linear-gradient(135deg, #2563eb, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: "#fff" }}>Q</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>QHS Tools for Success</div>
            <div style={{ fontSize: "10px", color: "#94a3b8" }}>Skills Reflection</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!webhookUrl && <div style={{ fontSize: "10px", color: "#f59e0b", background: "#f59e0b18", padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>Demo Mode</div>}
          {webhookUrl && <div style={{ fontSize: "10px", color: "#10b981", background: "#10b98118", padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>🟢 Connected</div>}
          <button onClick={() => setShowSettings(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", color: "#94a3b8", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>⚙️</button>
        </div>
      </div>

      <div style={{ maxWidth: "660px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: "3px", marginBottom: "6px" }}>
          {STEPS.map((_, i) => <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i <= step ? "#6366f1" : "#e2e8f0", transition: "background 0.3s" }} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Step {step + 1}/{STEPS.length}: <strong style={{ color: "#64748b" }}>{STEPS[step]}</strong></div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
            {domain && <span style={{ color: FRAMEWORK[domain]?.color, fontWeight: 700 }}>{domain}</span>}
            {skill && <span> · {skill}</span>}
            {level && <span> · Lv{level}</span>}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: "18px", minHeight: "280px" }}>
          {step === 0 && <StepIdentity name={name} setName={setName} yearGroup={yearGroup} setYearGroup={setYearGroup} regClass={regClass} setRegClass={setRegClass} />}
          {step === 1 && <StepDomain selected={domain} onSelect={setDomain} />}
          {step === 2 && domain && <StepSkill domain={domain} selected={skill} onSelect={setSkill} />}
          {step === 3 && skill && <StepLevel skill={skill} level={level} onSelect={setLevel} />}
          {step === 4 && <StepContext context={context} onSelect={setContext} subject={subject} onSubject={setSubject} />}
          {step === 5 && <StepStar star={star} onChange={(k, v) => setStar((p) => ({ ...p, [k]: v }))} skill={skill} context={context} subject={subject} />}
          {step === 6 && <StepReview name={name} yearGroup={yearGroup} domain={domain} skill={skill} level={level} context={context} subject={subject} star={star} />}
        </div>

        {submitError && <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", marginBottom: "14px" }}>Submission failed: {submitError}</div>}

        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "40px" }}>
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            style={{ padding: "11px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, background: "#f1f5f9", color: step === 0 ? "#cbd5e1" : "#475569", border: "none", cursor: step === 0 ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          {step < 6 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}
              style={{ padding: "11px 26px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, background: canAdvance ? "#6366f1" : "#e2e8f0", color: canAdvance ? "#fff" : "#94a3b8", border: "none", cursor: canAdvance ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              style={{ padding: "11px 30px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, background: submitting ? "#94a3b8" : "#10b981", color: "#fff", border: "none", cursor: submitting ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              {submitting ? "Submitting..." : "Submit Reflection ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
