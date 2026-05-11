
(function(){
  const root = document.querySelector('.wwh7-module');
  if(!root) return;
  const progress = root.querySelector('.wwh7-progress');
  const navLinks = Array.from(root.querySelectorAll('.wwh7-nav a'));
  const sections = Array.from(root.querySelectorAll('.wwh7-section'));
  const reveals = Array.from(root.querySelectorAll('.wwh7-reveal, .wwh7-block'));
  const stepBlocks = Array.from(root.querySelectorAll('.wwh7-block[data-step]'));

  const smoothTo = (selector)=>{
    const target = root.querySelector(selector) || document.querySelector(selector);
    if(!target) return;
    const nav = root.querySelector('.wwh7-nav-wrap');
    const offset = nav ? nav.getBoundingClientRect().height + 26 : 0;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({top:y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  };

  root.querySelectorAll('[data-scroll]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const sel = btn.dataset.scroll;
      if(sel){ e.preventDefault(); smoothTo(sel); }
    });
  });

  const setProgress = ()=>{
    if(!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, pct))})`;
  };
  setProgress();
  window.addEventListener('scroll', setProgress, {passive:true});
  window.addEventListener('resize', setProgress);

  const revealObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
  reveals.forEach(el=>revealObserver.observe(el));

  const sectionObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        navLinks.forEach(link=>link.classList.toggle('is-active', link.getAttribute('href') === id));
      }
    });
  }, {threshold:.45, rootMargin:'-12% 0px -30% 0px'});
  sections.forEach(section=>sectionObserver.observe(section));

  navLinks.forEach(link=>{
    link.addEventListener('click', e=>{
      const href = link.getAttribute('href');
      if(href && href.startsWith('#')){e.preventDefault(); smoothTo(href);}
    });
  });

  const stepObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const block = entry.target;
      const section = block.closest('.wwh7-section');
      if(!section) return;
      const step = block.dataset.step;
      section.querySelectorAll('.wwh7-step-item').forEach(item=>{
        item.classList.toggle('is-active', item.dataset.stepTarget === step);
      });
    });
  }, {threshold:.54, rootMargin:'-8% 0px -24% 0px'});
  stepBlocks.forEach(block=>stepObserver.observe(block));

  const mapCopy = {
    metaverse:{title:'Metaverse Advertising', copy:'가상 캐릭터가 브랜드 경험을 어떻게 확장하는지 읽습니다.'},
    workflow:{title:'AI Workflow', copy:'생성형 AI가 기획·제작·후반 합성에서 어떤 역할을 맡는지 비교합니다.'},
    ecology:{title:'Media Ecology', copy:'AI를 도구가 아니라 창작 환경을 재구성하는 매체로 해석합니다.'},
    perspective:{title:'Integrated Lens', copy:'브랜드 경험, 혁신 확산, 매체 생태학을 연결해 연구 흐름을 구성합니다.'}
  };
  const mapTitle = root.querySelector('#wwh7-map-title');
  const mapText = root.querySelector('#wwh7-map-copy');
  const focusTriggers = Array.from(root.querySelectorAll('.wwh7-focus-trigger'));
  const setFocus = key=>{
    const data = mapCopy[key]; if(!data) return;
    focusTriggers.forEach(el=>el.classList.toggle('is-active', el.dataset.focus === key));
    if(mapTitle) mapTitle.textContent = data.title;
    if(mapText) mapText.textContent = data.copy;
  };
  focusTriggers.forEach(el=>{
    el.addEventListener('mouseenter', ()=>setFocus(el.dataset.focus));
    el.addEventListener('click', ()=>setFocus(el.dataset.focus));
  });

  const typeData = {
    avatar:{label:'Immersion Interface', title:'아바타', body:'사용자가 직접 캐릭터가 되어 브랜드 공간에 들어가도록 만드는 유형입니다. 개인화된 몰입 경험과 참여 행동을 통해 광고를 보는 것에서 행동하는 것으로 전환합니다.', tags:['몰입','개인화','참여']},
    collab:{label:'Expansion Interface', title:'캐릭터 콜라보레이션', body:'기존 IP와 플랫폼을 결합해 브랜드 인지도와 트래픽을 확장하는 유형입니다. 친숙한 캐릭터는 광고 진입 장벽을 낮추고 협업 효과를 강화합니다.', tags:['IP 연계','인지도','확장']},
    idol:{label:'Fandom Interface', title:'가상 아이돌', body:'콘셉트와 세계관을 중심으로 팬덤을 형성하는 유형입니다. 감정적 연결과 반복적 노출을 통해 브랜드와 사용자 사이의 관계를 지속시킵니다.', tags:['팬덤','세계관','감정 연결']},
    nft:{label:'Ownership Interface', title:'NFT 기반 캐릭터', body:'희소성, 소유 경험, 경제적 가치를 결합하는 유형입니다. 광고 경험은 참여뿐 아니라 수집과 거래의 구조로 확장됩니다.', tags:['소유','희소성','경제 가치']}
  };
  const typeTabs = Array.from(root.querySelectorAll('.wwh7-type-tab'));
  const typeLabel = root.querySelector('#wwh7-type-label');
  const typeTitle = root.querySelector('#wwh7-type-title');
  const typeBody = root.querySelector('#wwh7-type-body');
  const typeTags = root.querySelector('#wwh7-type-tags');
  typeTabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      const data = typeData[tab.dataset.type]; if(!data) return;
      typeTabs.forEach(t=>t.classList.toggle('is-active', t===tab));
      if(typeLabel) typeLabel.textContent = data.label;
      if(typeTitle) typeTitle.textContent = data.title;
      if(typeBody) typeBody.textContent = data.body;
      if(typeTags) typeTags.innerHTML = data.tags.map(t=>`<span>${t}</span>`).join('');
    });
  });

  const lensData = {
    sense:{title:'감각 경험', copy:'시각적 캐릭터 이미지와 가상 공간 연출을 통해 광고가 먼저 감각적으로 인식되도록 만듭니다.'},
    feel:{title:'감성 경험', copy:'캐릭터의 표정, 서사, 세계관은 브랜드에 대한 정서적 친밀감과 호감을 형성합니다.'},
    think:{title:'인지 경험', copy:'사용자는 캐릭터와 상호작용하면서 브랜드 메시지와 제품 정보를 더 능동적으로 해석합니다.'},
    act:{title:'행동 경험', copy:'가상 공간 참여, 이벤트 수행, 공유 행동을 통해 광고 경험이 실제 행동으로 이어집니다.'},
    relate:{title:'관계 경험', copy:'캐릭터는 사용자, 브랜드, 커뮤니티를 연결하며 장기적인 충성도와 관계 형성을 돕습니다.'}
  };
  const lensRows = Array.from(root.querySelectorAll('.wwh7-lens-row'));
  const lensTitle = root.querySelector('#wwh7-lens-title');
  const lensCopy = root.querySelector('#wwh7-lens-copy');
  lensRows.forEach(row=>{
    row.addEventListener('click', ()=>{
      const data = lensData[row.dataset.lens]; if(!data) return;
      lensRows.forEach(r=>r.classList.toggle('is-active', r===row));
      if(lensTitle) lensTitle.textContent = data.title;
      if(lensCopy) lensCopy.textContent = data.copy;
    });
  });

  const flowData = {
    planning:{title:'기획 단계', copy:'아이디어 발상, 레퍼런스 탐색, 스토리보드 구성, 프롬프트 설계를 빠르게 실험할 수 있게 합니다.', key:'Idea\nPrompt'},
    production:{title:'제작 단계', copy:'이미지 생성, 모션 생성, 자동화 도구를 통해 모델링과 애니메이션 부담을 낮추지만, 세부 디렉션은 여전히 중요합니다.', key:'Motion\nGenerate'},
    post:{title:'후반 합성', copy:'보정, 합성, 스타일 조정, 출력 속도를 높이는 데 도움을 주며, 최종 품질 검수와 일관성 확보가 핵심입니다.', key:'Edit\nRefine'}
  };
  const flowTabs = Array.from(root.querySelectorAll('.wwh7-flow-tab'));
  const flowTitle = root.querySelector('#wwh7-flow-title');
  const flowCopy = root.querySelector('#wwh7-flow-copy');
  const flowKey = root.querySelector('#wwh7-flow-key');
  flowTabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      const data = flowData[tab.dataset.flow]; if(!data) return;
      flowTabs.forEach(t=>t.classList.toggle('is-active', t===tab));
      if(flowTitle) flowTitle.textContent = data.title;
      if(flowCopy) flowCopy.textContent = data.copy;
      if(flowKey) flowKey.innerHTML = data.key.replace('\n','<br>');
    });
  });

  const attrData = {
    adv:{title:'상대적 이점', copy:'생성형 AI는 제작 비용과 시간을 줄이고, 비전문가나 소규모 창작자의 참여 가능성을 높이는 장점을 보입니다.'},
    compat:{title:'호환성', copy:'기존 3D 툴과 제작 데이터에 연결될 수 있지만, 협업 방식과 감정 표현의 정합성은 추가 설계가 필요합니다.'},
    complex:{title:'복잡성', copy:'인터페이스는 단순해졌지만, 생성 로직의 불투명성과 정밀 제어의 어려움은 여전히 중요한 제약입니다.'},
    trial:{title:'시험 가능성', copy:'무료 체험, 오픈소스, 모듈화 구조 덕분에 사용자가 쉽게 시도하고 비교할 수 있습니다.'},
    obs:{title:'관찰 가능성', copy:'결과물이 시각적으로 바로 확인되고 플랫폼에서 빠르게 공유되기 때문에 성공 사례와 피드백이 쉽게 확산됩니다.'}
  };
  const attrCards = Array.from(root.querySelectorAll('.wwh7-attr-card'));
  const attrTitle = root.querySelector('#wwh7-attr-title');
  const attrCopy = root.querySelector('#wwh7-attr-copy');
  attrCards.forEach(card=>{
    card.addEventListener('click', ()=>{
      const data = attrData[card.dataset.attr]; if(!data) return;
      attrCards.forEach(c=>c.classList.toggle('is-active', c===card));
      if(attrTitle) attrTitle.textContent = data.title;
      if(attrCopy) attrCopy.textContent = data.copy;
    });
  });

  const ecoData = {
    process:{title:'제작 프로세스', copy:'전통적 선형 파이프라인은 프롬프트 입력, 생성 결과 검토, 반복 수정으로 이어지는 비선형 순환 구조로 전환됩니다.'},
    visual:{title:'시각 언어', copy:'고채도 색채, 경계 흐림, 콜라주적 구성처럼 알고리즘이 선호하는 조형 규칙이 새로운 시각 언어를 형성합니다.'},
    author:{title:'저자 정체성', copy:'창작자는 수공적 제작자에서 프롬프트와 파라미터를 조율하는 AI 오퍼레이터로 이동합니다.'},
    reception:{title:'수용 방식', copy:'관객 경험은 서사 중심의 몰입에서 감각 중심의 단편적 소비로 이동하며, 플랫폼 추천 구조와 결합됩니다.'}
  };
  const ecoNodes = Array.from(root.querySelectorAll('.wwh7-eco-node'));
  const ecoTitle = root.querySelector('#wwh7-eco-title');
  const ecoCopy = root.querySelector('#wwh7-eco-copy');
  ecoNodes.forEach(node=>{
    node.addEventListener('click', ()=>{
      const data = ecoData[node.dataset.eco]; if(!data) return;
      ecoNodes.forEach(n=>n.classList.toggle('is-active', n===node));
      if(ecoTitle) ecoTitle.textContent = data.title;
      if(ecoCopy) ecoCopy.textContent = data.copy;
    });
  });

  root.querySelectorAll('.wwh7-acc-head').forEach(head=>{
    head.addEventListener('click', ()=>{
      const item = head.closest('.wwh7-acc-item');
      if(!item) return;
      item.classList.toggle('is-open');
    });
  });
})();
