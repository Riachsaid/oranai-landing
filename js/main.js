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
  let first = true;

  function reply(input) {
    const m = input.toLowerCase().trim();
    if (/^(السلام|سلام|صباح|مساء|أهلا)/.test(m)) return ["السلام عليكم يا الشيخ! 🌊 كيفاش راك؟ أنا OranAI، واجد باش نعاونك فكل حاجة!","وعليكم السلام! 🦁 راني هنا، واش كاين؟ تحب تسقسيني على حاجة؟","العافية يا الشيخ! 🔥 تشرفت بيك! واش باغي تبدا؟","هلا هلا يا الشيخ! ✨ راني في الخدمة. واش باغي نعملو اليوم؟"][Math.floor(Math.random()*4)];
    if (/(كيفاش|كيف|wesh)/.test(m)) return ["العافية يا الشيخ! 🚀 راني نزيد نسخن شويا، وأنت كيفاش راك؟","Hahaha! أنا دايما بخير يا الشيخ، واش باغي؟ 🦁","والله راني هنا باش نعاونك، وأنت واصل باللي راك فيه! 🔥","Layes ya l'chikh! راني في القمة، جامد نهار ما تهزز. واش كاين؟ 💪"][Math.floor(Math.random()*4)];
    if (/(deepseek|version|v4|تقنية)/.test(m)) return "أنا مدعوم بــ **DeepSeek V4 Flash** 🧠 — نموذج ذكاء اصطناعي قوي، سريع، ومجاني بالكامل. نقدر نكتبلك كود، نترجم، نجاوب على أسئلتك، وحتى نفلّي معاك بالوهراني! 💻🔥";
    if (/(كود|code|script|python|javascript|js|html|css|برمجة)/.test(m)) return ["آه باغي كود! 🖥️ نقدر نكتبلك بايثون، جافاسكريبت، HTML/CSS، وحتى سكريبتات أتمتة. واش باغي بالزبط؟","كود؟ هاها أنا فنان في البرمجة! 💻 قلي واش باغي، بايثون، جافاسكريبت، ولا حاجة أخرى؟","برمجة؟ يا الشيخ راني هنا! 🚀 نقدر نصنعلك أي سكريبت تحب. أعطيني الفكرة وخلّي الباقي عليا."][Math.floor(Math.random()*3)];
    if (/(ترجم|translate|ترجمة|derja|وهراني)/.test(m)) return ["آه الترجمة للوهراني! 🌊 هذي عندي. قلي الجملة وخلّي عليا الترجمة — باش نشعلوها بالوهراني الفصيح!","الترجمة للوهراني؟ 🎯 هذا تخصصي! أعطيني النص وأنا نعطيك الترجمة مع النكهة الوهرانية الأصيلة.","هاها، الوهراني عندو نكهتو! 😄 قلي واش باغي تترجم ونخدمهالك بالحب."][Math.floor(Math.random()*3)];
    if (/(اسمك|شكون|شنو)/.test(m)) return "أنا **OranAI** 🦁 — مساعد ذكي بالوهراني، مدعوم بـ DeepSeek V4. نقدر نكتبلك كود، نترجم، نجاوب، ونفلّي معاك بالديرجا. واش باغي تبدا؟ 💪";
    if (/(شكرا|merci|thanks|thank|جزاك|بارك)/.test(m)) return ["العفو يا الشيخ! 🎯 دايما فاضي ليك، حاجة أخرى؟","لا شكر على واجيب! ❤️ واصل باللي راك فيه، ونحن هنايا باش نعاونو.","De rien ya l'chikh! 😎 أنا هنا باش نخدم، حاجة أخرى تحبها؟"][Math.floor(Math.random()*3)];
    if (/^(معا السلامة|باي|bye|goodbye|نروح)/.test(m)) return ["باي يا الشيخ! 🚀 كان شرف ليا. رجع وقت ما تحب، راني هنا!","معا السلامة! 🌊 نحبك ونتمنى نشوفك قريب. دير بالك على روحك!","نشوفك في وقت آخر يا الشيخ! 🦁 نتمنى تكون استفدت. أي وقت تحب، أنا هنا."][Math.floor(Math.random()*3)];
    if (/(وين|مكان|site|landing)/.test(m)) return "هاد الـ Landing Page تاع **OranAI** 🎯 — موقع تعريفي للمساعد الذكي بالوهراني. تقدر تلقى الكود كامل على GitHub: https://github.com/klasiinkov/oranai-landing ✨";
    if (/(حب|love|جميل|رائع|باهي|تحفه)/.test(m)) return ["هاها شكرا يا الشيخ! ❤️ أنت اللي رائع، بزاف!","والله نفتخر بيك! 😎 تحب حاجة أخرى ولا نبقاو نفلّيو؟","هذا من ذوقك يا الشيخ! 🦁 دايما فاضي ليك."][Math.floor(Math.random()*3)];
    if (/(بيت|btc|crypto|عملات|bitcoin|eth)/.test(m)) return "كريبتو؟ 🪙 يا الشيخ، أنا فاهم في العملات الرقمية! نقدر نعاونك بالمعلومات العامة، تحليل السوق، وحتى كتابة سكريبتات للمتاجرة. ولكن تذكّر: هاد مشورة مالية، دير البحث تاعك! 🚀";
    if (/(بوت|bot|automation|أتمتة|سكراب)/.test(m)) return "آه البوتات والأتمتة! 🤖 هذا تخصصي. نقدر نكتبلك بوتات بايثون، سيلينيوم، Playwright، وحتى سكريبتات سكرابينغ. أعطيني الفكرة ونخدمهالك! 🚀";
    if (/(أيام|يوم).*(سنة|عام)/.test(m)) return "السنة فيها **365 يوم**، وفي السنة الكبيسة (كل 4 سنين) فيها **366 يوم** يا الشيخ! 📅";
    if (/(سنة|عام).*(يوم|شهر)/.test(m)) return "السنة فيها **365 يوم**، أو **12 شهر**، أو **52 أسبوع**. كل 4 سنين تزيد يوم واحد في فبراير 📅";
    if (/(شهر).*(يوم)/.test(m)) return "الشهر يا الشيخ، إما **30 يوم** أو **31 يوم**، إلا شهر فبراير اللي فيه 28 يوم (29 في السنة الكبيسة) 📅";
    if (/(ساعة|hour).*(يوم|day)/.test(m)) return "اليوم فيه **24 ساعة** يا الشيخ! 🕐";
    if (/ساعة/.test(m)) return "الساعة فيها **60 دقيقة**، والدقيقة فيها **60 ثانية** ⏱️";
    if (/دقيقة/.test(m)) return "الدقيقة فيها **60 ثانية** يا الشيخ ⏱️";
    return ["هاهاها يا الشيخ، سقسية زعما والو؟ 😄 عاود جرب حاجة أخرى.","والله ما فهمتك بزاف يا الشيخ. تقدر تعيد صياغة السؤال؟ 🧐","Hmm أنا هنا باش نعاونك ولكن يلزم تفهمني شوي. قلي واش باغي بالزبط؟ 🎯","عاود جرب يا الشيخ، أنا هنا ونصغي ليك 🦁","واصل كيما راك! أعطيني سقسية واضحة ونعاونك إن شاء الله 💪","يا الشيخ، أنا OranAI وحدي، ولكن يلزم تفهمني واش باغي 😅 قلي أكثر!"][Math.floor(Math.random()*6)];
  }

  function send() {
    const t = demoInput.value.trim();
    if (!t) return;
    demoInput.value = '';
    addMsg(t, 'user-msg');
    demoInput.disabled = true;
    demoSend.disabled = true;
    setTimeout(() => addTyping(), 400);
    setTimeout(() => {
      rmvTyping();
      let r = reply(t);
      if (first) { r = "عندك بايان عندك بايان هههه " + r; first = false; }
      addMsg(r, 'ai-msg');
      demoInput.disabled = false;
      demoSend.disabled = false;
      demoInput.focus();
    }, 1200 + Math.random() * 1000);
  }

  function addMsg(text, cls) {
    const d = document.createElement('div');
    d.className = 'msg ' + cls;
    const b = document.createElement('div');
    b.className = 'msg-bubble';
    b.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    d.appendChild(b);
    demoMessages.appendChild(d);
    demoMessages.scrollTop = demoMessages.scrollHeight;
  }

  function addTyping() {
    const d = document.createElement('div');
    d.className = 'msg ai-msg';
    d.id = 'dty';
    const b = document.createElement('div');
    b.className = 'msg-bubble typing-bubble';
    b.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    d.appendChild(b);
    demoMessages.appendChild(d);
    demoMessages.scrollTop = demoMessages.scrollHeight;
  }

  function rmvTyping() {
    const e = document.getElementById('dty');
    if (e) e.remove();
  }

  if (demoSend) demoSend.addEventListener('click', send);
  if (demoInput) demoInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') send(); });

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