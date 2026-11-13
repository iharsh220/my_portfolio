'use strict';

/* ============================================================
   DEMO CATALOG
   To add a project: drop <name>.mp4 + <name>.jpg (poster) into
   /public/demos/<project-id>/ and add an entry below.
   Convert any .wmv/.mov to web MP4 first, e.g.:
     ffmpeg -i in.wmv -vf "scale='min(1280,iw)':-2,format=yuv420p" \
       -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 96k \
       -movflags +faststart out.mp4
   ============================================================ */
window.DEMO_PROJECTS = [
  {
    id: 'daa',
    icon: '🔐',
    name: 'Data Access Auditor',
    tagline: 'Qlik Sense security auditing',
    description:
      'A Windows desktop tool that audits Qlik Sense security: validates QMC rules, data-connection, session and sheet-level access for any user, so admins can prove who can see what before it hits production.',
    stack: ['Node.js', 'ReactJS', 'Qlik QRS API', 'Windows'],
    download: {
      href: '/download/data-access-auditor',
      label: 'Download for Windows',
      meta: 'DataAccessAuditor.exe · 1.7 MB',
      note: 'Windows 10/11 only. SmartScreen may ask you to confirm: click "More info → Run anyway".',
    },
    videos: [
      { src: '/demos/daa/01-overview.mp4', poster: '/demos/daa/01-overview.jpg', duration: 172,
        title: 'Everything you need to know',
        desc: 'A tour of Data Access Auditor: what it audits, who it is for, and how it fits into a Qlik Sense governance workflow.' },
      { src: '/demos/daa/02-get-it-free.mp4', poster: '/demos/daa/02-get-it-free.jpg', duration: 170,
        title: 'Get Data Access Auditor for free',
        desc: 'How to request and download the free edition of the tool.' },
      { src: '/demos/daa/03-installation.mp4', poster: '/demos/daa/03-installation.jpg', duration: 721,
        title: 'Seamless installation, step-by-step',
        desc: 'A complete walkthrough of installing the app on Windows and connecting it to a Qlik Sense server.' },
      { src: '/demos/daa/04-configure.mp4', poster: '/demos/daa/04-configure.jpg', duration: 231,
        title: 'Configure access control with ease',
        desc: 'Fine-tuning the auditor’s configuration: certificates, endpoints and user directories.' },
      { src: '/demos/daa/05-qmc-rules.mp4', poster: '/demos/daa/05-qmc-rules.jpg', duration: 459,
        title: 'Validate QMC security rules',
        desc: 'Checking rule integrity: see exactly which QMC security rules grant or block access for a given user.' },
      { src: '/demos/daa/06-data-connection-access.mp4', poster: '/demos/daa/06-data-connection-access.jpg', duration: 252,
        title: 'User-level data connection access',
        desc: 'Validating which data connections each user can read, update or delete.' },
      { src: '/demos/daa/07-session-access.mp4', poster: '/demos/daa/07-session-access.jpg', duration: 182,
        title: 'User-level session access',
        desc: 'Auditing session-level access rules per user to catch over-permissioned accounts.' },
      { src: '/demos/daa/08-sheet-access.mp4', poster: '/demos/daa/08-sheet-access.jpg', duration: 90,
        title: 'Check sheet access',
        desc: 'Drilling down to individual sheets: confirm which users can open which sheets in an app.' },
    ],
  },
  {
    id: 'qlik-bots',
    icon: '🤖',
    name: 'Qlik Chatbots',
    tagline: 'BI answers in any chat app',
    description:
      'One Node.js backend that turns natural-language questions into live Qlik Sense charts and KPIs, delivered on Microsoft Teams, WhatsApp, Alexa, Google Assistant and Telegram.',
    stack: ['Node.js', 'Qlik Sense API', 'Dialogflow', 'MS Bot Framework', 'WhatsApp API', 'Alexa Skills'],
    videos: [
      { src: '/demos/qlik-bots/teams.mp4', poster: '/demos/qlik-bots/teams.jpg', duration: 182,
        title: 'Microsoft Teams bot',
        desc: 'Ask for KPIs inside Teams and get guided suggestions plus live Qlik charts back in the conversation.' },
      { src: '/demos/qlik-bots/whatsapp.mp4', poster: '/demos/qlik-bots/whatsapp.jpg', duration: 58,
        title: 'WhatsApp bot',
        desc: 'Business numbers on the go: the bot replies on WhatsApp with a rendered chart, last-reload time and narrative.' },
      { src: '/demos/qlik-bots/alexa.mp4', poster: '/demos/qlik-bots/alexa.jpg', duration: 101,
        title: 'Alexa voice skill', portrait: true,
        desc: 'Hands-free analytics: ask Alexa for a metric and hear the answer read straight from Qlik Sense.' },
    ],
  },
];
