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
  const API = "/api/chat";
  const conv = [];

  let busy = false;

  function send() {
    const t = demoInput.value.trim();
    if (!t || busy) return;
    busy = true;
    demoInput.value = '';
    demoInput.disabled = true;
    demoSend.disabled = true;
    addMsg(t, 'user-msg');
    conv.push({role:"user",content:t});
    addTyping();

    fetch(API, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:conv})
    })
    .then(r => r.json())
    .then(d => {
      rmvTyping();
      const reply = d.reply || "يا الشيخ، أنا هنا باش نعاونك. قلي واش باغي بالزبط؟ 😎";
      conv.push({role:"assistant",content:reply});
      addMsg(reply, 'ai-msg');
      busy = false;
      demoInput.disabled = false;
      demoSend.disabled = false;
      demoInput.focus();
    })
    .catch(() => {
      rmvTyping();
      addMsg("يا الشيخ، أنا هنا باش نعاونك. قلي واش باغي بالزبط؟ 😎", 'ai-msg');
      busy = false;
      demoInput.disabled = false;
      demoSend.disabled = false;
      demoInput.focus();
    });
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
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(b => b.disabled = true);

    addMessage(question, 'user-msg');
    setTimeout(() => addTyping(), 300);

    fetch(API, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:[{role:"user",content:question}]})
    })
    .then(r => r.json())
    .then(d => {
      removeTyping();
      const reply = d.reply || "يا الشيخ، أنا هنا باش نعاونك. قلي واش باغي بالزبط؟ 😎";
      addMessage(reply, 'ai-msg');
      buttons.forEach(b => b.disabled = false);
    })
    .catch(() => {
      removeTyping();
      buttons.forEach(b => b.disabled = false);
    });
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