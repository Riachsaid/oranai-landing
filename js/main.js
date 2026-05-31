document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  const navLinksItems = document.querySelectorAll('.nav-link, .nav-cta');
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .msg').forEach(el => {
    observer.observe(el);
  });

  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.05;
      hero.style.transform = `translateY(${rate}px)`;
      hero.style.opacity = 1 - Math.min(scrolled / 600, 0.3);
    });
  }

  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    const messages = chatMessages.querySelectorAll('.msg');
    messages.forEach((msg, index) => {
      msg.style.opacity = '0';
      msg.style.transform = 'translateY(12px)';
      setTimeout(() => {
        msg.style.transition = 'all 0.4s ease-out';
        msg.style.opacity = '1';
        msg.style.transform = 'translateY(0)';
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 300 + index * 400);
    });
  }

  const demoInput = document.getElementById('chatInput');
  const demoSend = document.getElementById('chatSend');
  const demoMessages = document.getElementById('chatMessages');
  let isFirstReply = true;
  const demoHistory = [];

  function respond(input) {
    const lower = input.toLowerCase().trim();

    const patterns = [
      {
        match: /^(السلام|سلام\b|صباح|مساء|أهلا)/i,
        topic: 'greeting',
        reply: () => {
          const g = [
            "السلام عليكم يا الشيخ! 🌊 كيفاش راك؟ أنا OranAI، واجد باش نعاونك فكل حاجة!",
            "وعليكم السلام! 🦁 راني هنا، واش كاين؟ تحب تسقسيني على حاجة؟",
            "العافية يا الشيخ! 🔥 تشرفت بيك! واش باغي تبدا؟",
            "هلا هلا يا الشيخ! ✨ راني في الخدمة. واش باغي نعملو اليوم؟"
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      },
      {
        match: /(كيفاش|كيف\b|wesh)/i,
        topic: 'howareyou',
        reply: () => {
          const g = [
            "العافية يا الشيخ! 🚀 راني نزيد نسخن شويا، وأنت كيفاش راك؟ واصل كيما راك!",
            "Hahaha! أنا دايما بخير يا الشيخ، واش باغي؟ 🦁",
            "والله راني هنا باش نعاونك، وأنت واصل باللي راك فيه! 🔥",
            "Layes ya l'chikh! راني في القمة، جامد نهار ما تهزز. واش كاين؟ 💪"
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      },
      {
        match: /(deepseek|version|v4|تقنية)/i,
        topic: 'about',
        reply: () => {
          return "أنا مدعوم بــ **DeepSeek V4 Flash** 🧠 — نموذج ذكاء اصطناعي قوي، سريع، ومجاني بالكامل. نقدر نكتبلك كود، نترجم، نجاوب على أسئلتك، وحتى نفلّي معاك بالوهراني! 💻🔥 تقدر تقارنني بـ GPT-4 ولكن بوهرانيتي أنا فريد من نوعي.";
        }
      },
      {
        match: /(كود|code|script|python|javascript|js|html|css|برمجة)/i,
        topic: 'code',
        reply: () => {
          const g = [
            "آه باغي كود! 🖥️ نقدر نكتبلك بايثون، جافاسكريبت، HTML/CSS، وحتى سكريبتات أتمتة. واش باغي بالزبط؟ أعطيني التفاصيل ونخدمهالك ديجا!",
            "كود؟ هاها أنا فنان في البرمجة! 💻 قلي واش باغي، بايثون، جافاسكريبت، ولا حاجة أخرى؟ وأنا نخدمهالك في ثواني!",
            "برمجة؟ يا الشيخ راني هنا! 🚀 نقدر نصنعلك أي سكريبت تحب. أعطيني الفكرة وخلّي الباقي عليا."
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      },
      {
        match: /(ترجم|translate|ترجمة|derja|وهراني)/i,
        topic: 'translate',
        reply: () => {
          const g = [
            "آه الترجمة للوهراني! 🌊 هذي عندي. قلي الجملة وخلّي عليا الترجمة — باش نشعلوها بالوهراني الفصيح!",
            "الترجمة للوهراني؟ 🎯 هذا تخصصي! أعطيني النص وأنا نعطيك الترجمة مع النكهة الوهرانية الأصيلة. مثال: 'Good morning' → 'صباح الخير صاحبي، كي راك؟ العافية وين راكي؟'",
            "هاها، الوهراني عندو نكهتو! 😄 قلي واش باغي تترجم ونخدمهالك بالحب."
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      },
      {
        match: /(اسمك|شكون|شنو)/i,
        topic: 'identity',
        reply: () => {
          return "أنا **OranAI** 🦁 — مساعد ذكي بالوهراني، مدعوم بـ DeepSeek V4. نقدر نكتبلك كود، نترجم، نجاوب، ونفلّي معاك بالديرجا. أنا مثل DeepSeek ولكن بالوهراني — فاهم الدنيا كلها. واش باغي تبدا؟ 💪";
        }
      },
      {
        match: /(شكرا|merci|thanks|thank|جزاك|بارك)/i,
        topic: 'thanks',
        reply: () => {
          const g = [
            "العفو يا الشيخ! 🎯 دايما فاضي ليك، حاجة أخرى؟",
            "لا شكر على واجيب! ❤️ واصل باللي راك فيه، ونحن هنايا باش نعاونو.",
            "De rien ya l'chikh! 😎 أنا هنا باش نخدم، حاجة أخرى تحبها؟"
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      },
      {
        match: /^(معا السلامة|باي\b|bye|goodbye|نروح)/i,
        topic: 'goodbye',
        reply: () => {
          const g = [
            "باي يا الشيخ! 🚀 كان شرف ليا. رجع وقت ما تحب، راني هنا!",
            "معا السلامة! 🌊 نحبك ونتمنى نشوفك قريب. دير بالك على روحك!",
            "نشوفك في وقت آخر يا الشيخ! 🦁 نتمنى تكون استفدت. أي وقت تحب، أنا هنا."
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      },
      {
        match: /(وين|مكان|site|landing)/i,
        topic: 'landing',
        reply: () => {
          return "هاد الـ Landing Page تاع **OranAI** 🎯 — موقع تعريفي للمساعد الذكي بالوهراني. تقدر تلقى الكود كامل على GitHub: https://github.com/klasiinkov/oranai-landing ✨";
        }
      },
      {
        match: /(حب|love|❤|💖|nice|جميل|رائع|باهي|تحفه)/i,
        topic: 'compliment',
        reply: () => {
          const g = [
            "هاها شكرا يا الشيخ! ❤️ أنت اللي رائع، بزاف!",
            "والله نفتخر بيك! 😎 تحب حاجة أخرى ولا نبقاو نفلّيو؟",
            "هذا من ذوقك يا الشيخ! 🦁 دايما فاضي ليك."
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      },
      {
        match: /(بيت|btc|crypto|عملات|bitcoin|eth)/i,
        topic: 'crypto',
        reply: () => {
          return "كريبتو؟ 🪙 يا الشيخ، أنا فاهم في العملات الرقمية! نقدر نعاونك بالمعلومات العامة، تحليل السوق، وحتى كتابة سكريبتات للمتاجرة. ولكن تذكّر: هاد مشورة مالية، دير البحث تاعك! 🚀";
        }
      },
      {
        match: /(بوت|bot|automation|أتمتة|سكراب)/i,
        topic: 'automation',
        reply: () => {
          return "آه البوتات والأتمتة! 🤖 هذا تخصصي. نقدر نكتبلك بوتات بايثون، سيلينيوم، Playwright، وحتى سكريبتات سكرابينغ. أعطيني الفكرة ونخدمهالك! مثال: بوت تاع تويتر، سكرابينغ مواقع، أتمتة مهام... 🚀";
        }
      },
      {
        match: /(أيام|يوم).*(سنة|عام)/i,
        topic: 'knowledge',
        reply: () => { return "السنة فيها **365 يوم**، وفي السنة الكبيسة (كل 4 سنين) فيها **366 يوم** يا الشيخ! 📅"; }
      },
      {
        match: /(سنة|عام).*(يوم|شهر)/i,
        topic: 'knowledge',
        reply: () => { return "السنة فيها **365 يوم**، أو **12 شهر**، أو **52 أسبوع**. كل 4 سنين تزيد يوم واحد في فبراير (السنة الكبيسة) 📅"; }
      },
      {
        match: /(شهر).*(يوم)/i,
        topic: 'knowledge',
        reply: () => { return "الشهر يا الشيخ، إما **30 يوم** أو **31 يوم**، إلا شهر فبراير اللي فيه 28 يوم (29 في السنة الكبيسة) 📅"; }
      },
      {
        match: /(ساعة|hour).*(يوم|day)/i,
        topic: 'knowledge',
        reply: () => { return "اليوم فيه **24 ساعة** يا الشيخ! 🕐"; }
      },
      {
        match: /(ساعة)/i,
        topic: 'knowledge',
        reply: () => { return "الساعة فيها **60 دقيقة**، والدقيقة فيها **60 ثانية** ⏱️"; }
      },
      {
        match: /(دقيقة)/i,
        topic: 'knowledge',
        reply: () => { return "الدقيقة فيها **60 ثانية** يا الشيخ ⏱️"; }
      },
      {
        match: /.*/,
        topic: 'other',
        reply: () => {
          const g = [
            "هاهاها يا الشيخ، سقسية زعما والو؟ 😄 عاود جرب حاجة أخرى.",
            "والله ما فهمتك بزاف يا الشيخ. تقدر تعيد صياغة السؤال؟ 🧐",
            "Hmm أنا هنا باش نعاونك ولكن يلزم تفهمني شوي. قلي واش باغي بالزبط؟ 🎯",
            "عاود جرب يا الشيخ، أنا هنا ونصغي ليك 🦁",
            "واصل كيما راك! أعطيني سقسية واضحة ونعاونك إن شاء الله 💪",
            "يا الشيخ، أنا OranAI وحدي، ولكن يلزم تفهمني واش باغي 😅 قلي أكثر!"
          ];
          return g[Math.floor(Math.random() * g.length)];
        }
      }
    ];

    for (const p of patterns) {
      try {
        if (p.match.test(lower)) {
          const text = p.reply();
          return { text, topic: p.topic };
        }
      } catch (e) {
        return { text: "يا الشيخ، أنا هنا باش نعاونك. قلي واش باغي بالزبط؟ 😎", topic: 'other' };
      }
    }
    return { text: "يا الشيخ، أنا هنا باش نعاونك. قلي واش باغي بالزبط؟ 😎", topic: 'other' };
  }

  function sendDemoMessage() {
    const text = demoInput.value.trim();
    if (!text) return;
    demoInput.value = '';

    try {
      addDemoMsg(text, 'user-msg');
      demoInput.disabled = true;
      demoSend.disabled = true;

      setTimeout(() => addDemoTyping(), 400);

      setTimeout(() => {
        try {
          removeDemoTyping();
          const result = respond(text);
          let reply = result && result.text ? result.text : "يا الشيخ، أنا هنا باش نعاونك. قلي واش باغي بالزبط؟ 😎";
          if (isFirstReply) {
            reply = "عندك بايان عندك بايان هههه " + reply;
            isFirstReply = false;
          }
          addDemoMsg(reply, 'ai-msg');
          demoHistory.push({ role: 'user', text });
          demoHistory.push({ role: 'bot', text: reply });
        } catch (e) {
          addDemoMsg("يا الشيخ، أنا هنا باش نعاونك. قلي واش باغي بالزبط؟ 😎", 'ai-msg');
        }
        demoInput.disabled = false;
        demoSend.disabled = false;
        demoInput.focus();
      }, 1200 + Math.random() * 1000);
    } catch (e) {
      demoInput.disabled = false;
      demoSend.disabled = false;
    }
  }

  function addDemoMsg(text, className) {
    const div = document.createElement('div');
    div.className = `msg ${className}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    div.appendChild(bubble);
    demoMessages.appendChild(div);
    demoMessages.scrollTop = demoMessages.scrollHeight;
  }

  function addDemoTyping() {
    const div = document.createElement('div');
    div.className = 'msg ai-msg';
    div.id = 'demo-typing';
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble typing-bubble';
    bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    div.appendChild(bubble);
    demoMessages.appendChild(div);
    demoMessages.scrollTop = demoMessages.scrollHeight;
  }

  function removeDemoTyping() {
    const el = document.getElementById('demo-typing');
    if (el) el.remove();
  }

  if (demoSend) demoSend.addEventListener('click', sendDemoMessage);
  if (demoInput) demoInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendDemoMessage(); });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  window.askOranAI = function(question) {
    const chatBody = document.getElementById('chatBody');
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(b => b.disabled = true);

    addMessage(question, 'user-msg');

    setTimeout(() => {
      addTyping();
    }, 300);

    const prefix = 'عندك بايان عندك بايان هههه ';
    const responses = {
      'العافية يا الشيخ، واش تقدر تدير؟': prefix + 'العافية يا الشيخ 😎 راني هنا باش نعاونك فكل حاجة! نقدر نكتبلك كود، نترجملك للوهراني، نجاوب على أسئلتك، نحللك مشاكل التقنية، وحتى نفلّي معاك بالديرجا. أنا مثل DeepSeek ولكن بالوهراني — فاهم الدنيا كلها. واش باغي تبدا؟ 💪',
      'ترجملي هادي للوهراني: Good morning my friend': prefix + 'هاك الترجمة يا الشيخ 🌊:\n\n"صباح الخير صاحبي، كي راك؟ العافية وين راكي؟ هلالك!"\n\n(Good morning my friend, how are you? Good health, where are you? How are you doing!)\n\nملاحظة: الوهراني عندو نكهتو الخاص — كل حاجة بالحب والطاسة 😄',
      'أعطيني كود سكريبت بوت خفيف': prefix + 'هاك هاد الـ سكريبت تاع بايثون ساهل ماهل:\n\n```python\nimport time\n\nprint(\'OranAI Bot راه واجد...\')\n# هنا نزيدو الـ automation تاعك\n```\n\nتقدر تدمجه مع Selenium ولا خـمسات كيما تبغي!'
    };

    setTimeout(() => {
      removeTyping();
      const reply = responses[question] || prefix + 'هذي سقسية زعما والو؟ هههههههه يا الشيخ، عاود جرب حاجة أخرى 😄';
      addMessage(reply, 'ai-msg');
      buttons.forEach(b => b.disabled = false);
    }, 1500 + Math.random() * 1000);
  };

  function addMessage(text, className) {
    const chatBody = document.getElementById('chatBody');
    const div = document.createElement('div');
    div.className = `msg ${className}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text.replace(/```/g, '').trim();
    if (text.includes('```')) {
      const codeMatch = text.match(/```(\w+)?\n?([\s\S]*?)```/);
      if (codeMatch) {
        bubble.innerHTML = text.replace(/```(\w+)?\n?([\s\S]*?)```/, '<pre style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;overflow-x:auto;font-size:12px;margin:8px 0;direction:ltr;text-align:left"><code>$2</code></pre>');
      }
    }
    div.appendChild(bubble);
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addTyping() {
    const chatBody = document.getElementById('chatBody');
    const div = document.createElement('div');
    div.className = 'msg ai-msg';
    div.id = 'typing-msg';
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble typing-bubble';
    bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    div.appendChild(bubble);
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('typing-msg');
    if (typing) typing.remove();
  }

  const style = document.createElement('style');
  style.textContent = `
    .feature-card {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease-out;
    }
    .feature-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .feature-card:nth-child(2) { transition-delay: 0.1s; }
    .feature-card:nth-child(3) { transition-delay: 0.2s; }
    .feature-card:nth-child(4) { transition-delay: 0.3s; }
    .feature-card:nth-child(5) { transition-delay: 0.4s; }
    .feature-card:nth-child(6) { transition-delay: 0.5s; }
  `;
  document.head.appendChild(style);
});