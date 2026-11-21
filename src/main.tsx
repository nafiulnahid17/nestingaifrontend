import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowRight, BarChart3, Check, ChevronRight, CircleHelp, CreditCard,
  Download, ExternalLink, FileImage, FolderOpen, ImagePlus, Layers3, Menu,
  MonitorDown, Settings2, Sparkles, Upload, UserRound, Wallet, X,
} from 'lucide-react';
import './style.css';

type Page = 'home' | 'create' | 'projects' | 'profile' | 'usage' | 'credits';
type Quality = 'Max' | 'High' | 'Low';
type Modal = '' | 'native' | 'plans' | 'templates' | 'help' | 'provider' | 'credits';
const assistantLogo = '/nesting-assistant.png';
const providers = ['Google', 'Facebook', 'Microsoft', 'Adobe'];
const planCards = [
  { name: 'Plus', price: '$19.99 / month', description: 'For regular artwork creation' },
  { name: 'Pro', price: '$49.99 / month', description: 'Premium access with native device connection' },
  { name: 'Pay As You Go', price: '$0.60–$0.80 / generation', description: 'Pay per artwork generation' },
];

function App() {
  const [page, setPage] = useState<Page>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>('');
  const [name, setName] = useState(() => localStorage.getItem('nesting-name') || 'Nesting Member');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('nesting-avatar') || '');
  const [plan, setPlan] = useState(() => localStorage.getItem('nesting-plan') || 'Normal Member');
  const [quality, setQuality] = useState<Quality>('Max');
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [providerName, setProviderName] = useState('');
  const [notice, setNotice] = useState('');
  const isPremium = plan.toLowerCase().includes('premium') || plan.toLowerCase() === 'pro';
  const imageUrl = useMemo(() => file ? URL.createObjectURL(file) : '', [file]);
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);
  useEffect(() => { document.title = 'Nesting AI — New era of automation'; }, []);

  function navigate(next: Page) {
    setPage(next); setMenuOpen(false); setModal(''); setNotice('');
    history.replaceState(null, '', next === 'home' ? location.pathname : `#${next}`);
  }
  function chooseFile(candidate?: File) {
    if (candidate?.type.startsWith('image/')) setFile(candidate);
  }
  function changeAvatar(candidate?: File) {
    if (!candidate?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => { const value = String(reader.result || ''); setAvatar(value); localStorage.setItem('nesting-avatar', value); };
    reader.readAsDataURL(candidate);
  }
  function setPlanChoice(value: string) {
    // Plans are displayed in the UI; payment verification is not connected, so no plan is activated here.
    setNotice(`${value} প্ল্যানের পেমেন্ট এখনো সংযুক্ত নয়।`);
  }
  const navItems = [
    { title: 'Create', icon: ImagePlus, action: () => navigate('create') },
    { title: 'Projects', icon: FolderOpen, action: () => navigate('projects') },
    { title: 'Templates', icon: Layers3, action: () => { setMenuOpen(false); setModal('templates'); } },
    { title: 'Profile', icon: UserRound, action: () => navigate('profile') },
    { title: 'Usage', icon: BarChart3, action: () => navigate('usage') },
    { title: 'Credits', icon: Wallet, action: () => navigate('credits') },
  ];
  const uploadBox = <label className="design-drop" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); chooseFile(e.dataTransfer.files[0]); }}>
    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => chooseFile(e.target.files?.[0])}/>
    {imageUrl ? <><img className="upload-thumb" src={imageUrl} alt="Uploaded design preview"/><span className="drop-copy"><strong>{file?.name}</strong><small>ডিজাইন বদলাতে ক্লিক করুন</small></span><span className="replace-mark"><Upload size={17}/></span></> : <><span className="upload-icon"><ImagePlus size={20}/></span><span className="drop-copy"><strong>Drop your design</strong><small>ডিজাইন টেনে আনুন, অথবা আপলোড করতে ক্লিক করুন · PNG, JPG, WebP</small></span><span className="upload-cta">আপলোড <Upload size={15}/></span></>}
  </label>;

  return <div className={`app ${page === 'home' ? 'landing-app' : 'workspace-app'}`}>
    {page === 'home' ? <>
      <header className="landing-header"><button className="brand-button" onClick={() => navigate('home')}><img src={assistantLogo} alt=""/><span>Nesting AI</span></button><nav><button onClick={() => navigate('home')}>Home</button><button onClick={() => setModal('help')}>How It Works</button><button onClick={() => setModal('templates')}>Features</button><button onClick={() => setModal('plans')}>Pricing</button></nav><button className="header-profile" onClick={() => navigate('profile')}><Avatar image={avatar} name={name}/><span>{name}</span></button></header>
      <main className="landing"><section className="hero"><div className="herotext"><span className="eyebrow">AI × Illustrator Automation</span><h1>Give your Adobe<br/>Illustrator <em>AI support.</em></h1><h2>New era of automation.</h2><p>Create high-quality artwork with AI and prepare it for production in Adobe Illustrator.</p><div className="actions"><button className="primary" onClick={() => navigate('create')}>Create Artwork <ArrowRight size={18}/></button><button className="outline" onClick={() => setModal('help')}><CircleHelp size={18}/> How It Works</button></div><div className="features"><span><Sparkles/>AI artwork</span><span><Layers3/>Native vector</span><span><Activity/>Production workflow</span></div></div><div className="heroart"><img src="/hero.png" alt="AI artwork and vector automation"/></div></section><footer>Atherious Labs © 2026</footer></main>
    </> : <>
      <button className="menu-trigger" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21}/><img src={assistantLogo} alt="Nesting AI"/></button>
      {menuOpen && <><button className="menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)}/><aside className="sidebar"><div className="sidebar-top"><div className="sidebar-brand"><img src={assistantLogo} alt=""/><span>Nesting AI</span><button className="icon-button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={18}/></button></div><button className="sidebar-profile" onClick={() => navigate('profile')}><Avatar image={avatar} name={name}/><span><strong>{name}</strong><small>{plan}</small></span><ChevronRight size={16}/></button><div className="sidebar-links">{navItems.map(item => <button key={item.title} className={page === item.title.toLowerCase() ? 'selected' : ''} onClick={item.action}><item.icon size={18}/>{item.title}</button>)}{isPremium && <button onClick={() => { setMenuOpen(false); setModal('native'); }}><MonitorDown size={18}/>Connect Device to Native</button>}</div></div><div className="sidebar-bottom"><button onClick={() => { setMenuOpen(false); setModal('help'); }}><CircleHelp size={18}/>Help &amp; Support</button><span>© 2026 Atherious Labs</span></div></aside></>}
      <main className={`workspace-content page-${page}`}>
        {page === 'create' && <>
          <div className="create-title-card"><span className="title-spark"><Sparkles size={17}/></span><div><h1>Create Artwork</h1><p>আপনার ডিজাইন আপলোড করুন, তৈরি শুরু করুন</p></div></div>
          <section className="engine-strip" aria-label="ইঞ্জিনের অবস্থা">
            <EngineCard icon={<Sparkles/>} label="Production Engine" detail="AI artwork engine" status="প্রস্তুত নয়" kind="offline"/>
            <EngineCard icon={<Settings2/>} label="Automation Engine" detail="কাজের অটোমেশন" status="প্রস্তুত নয়" kind="offline"/>
            <EngineCard icon={<MonitorDown/>} label="Illustrator" detail="ডিভাইস সংযোগ" status="সংযুক্ত নয়" kind="offline"/>
            <EngineCard icon={<UserRound/>} label="সদস্যতা" detail={plan} status={isPremium ? 'Premium' : 'সাধারণ'} kind={isPremium ? 'online' : 'neutral'}/>
          </section>
          <div className="workbench">
            <div className="input-column">{uploadBox}<div className="quality-section"><div className="section-label"><span>আর্টওয়ার্কের ধরন</span><small>একটি মান বেছে নিন</small></div><div className="quality-options">{(['Max','High','Low'] as Quality[]).map((item, i) => <button key={item} className={quality === item ? 'quality-option active' : 'quality-option'} onClick={() => setQuality(item)}><span className="quality-name">{item}</span><span className="quality-resolution">{['4K','2K','1K'][i]}</span>{quality === item && <Check size={15}/>}</button>)}</div><p className="quality-note">Quality স্বয়ংক্রিয়ভাবে নির্বাচিত মোড অনুযায়ী সেট হবে।</p></div><button className="primary generate-button" disabled={!file} onClick={() => setNotice('AI artwork engine এখনো সংযুক্ত নয়।')}><Sparkles size={17}/>Artwork তৈরি করুন<ArrowRight size={17}/></button></div>
            <div className="preview-column"><div className="preview-heading"><span>প্রিভিউ</span><small>4:5</small></div><div className="preview-frame">{imageUrl ? <img src={imageUrl} alt="Design preview"/> : <div className="preview-empty"><FileImage size={25}/><span>আপনার ডিজাইন এখানে দেখা যাবে</span></div>}</div></div>
          </div>
          {notice && <p className="notice" role="status">{notice}</p>}
        </>}
        {page === 'profile' && <>
          <div className="page-heading"><div><span className="eyebrow-small">ACCOUNT</span><h1>প্রোফাইল</h1><p>আপনার পরিচিতি, সদস্যতা ও সংযুক্ত অ্যাকাউন্ট পরিচালনা করুন।</p></div></div>
          <section className="profile-card"><div className="profile-cover"><div className="profile-identity"><label className="avatar-upload"><Avatar image={avatar} name={name}/><span>ছবি বদলান</span><input type="file" accept="image/*" onChange={e => changeAvatar(e.target.files?.[0])}/></label><div><h2>{name}</h2><p>{plan}</p></div></div><button className="outline small-button" onClick={() => setModal('plans')}>প্ল্যান আপগ্রেড করুন <ArrowRight size={15}/></button></div><label className="name-field">প্রদর্শিত নাম<input value={name} onChange={e => { setName(e.target.value); localStorage.setItem('nesting-name', e.target.value); }} placeholder="আপনার নাম"/></label></section>
          <section className="profile-section"><div className="section-heading"><div><h2>আপনার সদস্যতা</h2><p>বর্তমান প্ল্যান এবং আপগ্রেডের বিকল্প</p></div><span className="member-pill">{plan}</span></div><div className="plan-grid">{planCards.map((p, i) => <article className={`plan-card ${i === 1 ? 'premium-card' : ''}`} key={p.name}><div className="plan-card-top"><h3>{p.name}</h3>{i === 1 && <span>PREMIUM</span>}</div><strong className="plan-price">{p.price}</strong><p>{p.description}</p><button className={i === 1 ? 'primary' : 'outline'} onClick={() => setPlanChoice(p.name)}>Upgrade to {p.name}</button></article>)}</div></section>
          <section className="profile-section setup-section"><div className="section-heading"><div><h2>প্রোফাইল সেটআপ</h2><p>অন্য অ্যাকাউন্ট দিয়ে Nesting AI-তে সাইন ইন সেটআপ করুন</p></div></div><div className="provider-grid">{providers.map(p => <button key={p} onClick={() => { setProviderName(p); setModal('provider'); }}><span className={`provider-mark provider-${p.toLowerCase()}`}>{p === 'Google' ? 'G' : p === 'Facebook' ? 'f' : p === 'Microsoft' ? '▦' : 'A'}</span><span>{p} অ্যাকাউন্ট</span><ChevronRight size={16}/></button>)}</div></section>
          {notice && <p className="notice" role="status">{notice}</p>}
        </>}
        {page === 'projects' && <SimplePage title="Projects" eyebrow="WORKSPACE" text="আপনার তৈরি করা ডিজাইন ও প্রজেক্টগুলো এখানে থাকবে।" icon={<FolderOpen/>}/>}
        {page === 'usage' && <SimplePage title="Usage" eyebrow="ACTIVITY" text="আপনার জেনারেশন ও ক্রেডিট ব্যবহারের সারাংশ এখানে দেখানো হবে।" icon={<BarChart3/>}/>}
        {page === 'credits' && <SimplePage title="Credits" eyebrow="BILLING" text="ক্রেডিট ও পেমেন্টের তথ্য এখানে পরিচালনা করুন।" icon={<CreditCard/>} action={() => setModal('credits')}/>}
      </main>
      <button className="assistant-float" aria-label="Nesting AI সহায়তা" onClick={() => setModal('help')}><img src={assistantLogo} alt="Nesting AI Assistant"/><span className="assistant-tooltip">AI সহায়তা</span></button>
    </>}

    {modal && <div className="modal-backdrop" onClick={() => setModal('')}><section className="app-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}><button className="modal-close icon-button" aria-label="বন্ধ করুন" onClick={() => setModal('')}><X size={19}/></button>
      {modal === 'native' && <><span className="modal-eyebrow">NESTING AI · DEVICE</span><h2>ডিভাইস নেটিভের সঙ্গে সংযুক্ত করুন</h2><p className="modal-intro">Illustrator অটোমেশন ব্যবহার করতে আপনার কম্পিউটারে Adobe Illustrator ও Nesting AI Native Bridge লাগবে।</p><div className="native-version"><div className="native-icon"><MonitorDown/></div><div><small>সাজেস্টেড অ্যাপ</small><strong>Adobe Illustrator · Desktop</strong><span>সর্বশেষ ডেস্কটপ সংস্করণ · Windows</span></div><a href="https://www.adobe.com/products/illustrator.html" target="_blank" rel="noreferrer" className="outline native-download">ডাউনলোড <ExternalLink size={15}/></a></div><div className="bridge-box"><div><strong>Nesting AI Native Bridge</strong><p>আমাদের BAT ইনস্টলার লিংক যোগ হলে এখান থেকে ডাউনলোড করা যাবে।</p></div><button className="outline" disabled><Download size={15}/> শীঘ্রই আসছে</button></div><p className="modal-footnote">Illustrator সংযোগ শুধুমাত্র Premium প্ল্যানে সক্রিয় হবে।</p></>}
      {modal === 'plans' && <><span className="modal-eyebrow">MEMBERSHIP</span><h2>আপনার জন্য একটি প্ল্যান বেছে নিন</h2><p className="modal-intro">Premium সদস্যতায় নেটিভ Illustrator সংযোগের সুবিধা থাকবে।</p><div className="modal-plan-grid">{planCards.map((p, i) => <article className="plan-card" key={p.name}><h3>{p.name}</h3><strong className="plan-price">{p.price}</strong><p>{p.description}</p><button className={i === 1 ? 'primary' : 'outline'} onClick={() => setNotice(`${p.name} প্ল্যানের পেমেন্ট এখনো সংযুক্ত নয়।`)}>Upgrade to {p.name}</button></article>)}</div>{notice && <p className="notice">{notice}</p>}</>}
      {modal === 'provider' && <><span className="modal-eyebrow">PROFILE SETUP</span><h2>{providerName} অ্যাকাউন্ট</h2><p className="modal-intro">{providerName} দিয়ে অ্যাকাউন্ট সংযোগের ব্যবস্থা প্রস্তুত করা হয়েছে। OAuth সংযোগ চালু হলে এখান থেকে সেটআপ সম্পন্ন হবে।</p><button className="primary" onClick={() => setModal('')}>বুঝেছি</button></>}
      {modal === 'templates' && <><span className="modal-eyebrow">WORKSPACE</span><h2>Templates</h2><p className="modal-intro">প্রস্তুত ডিজাইন টেমপ্লেট শীঘ্রই যোগ করা হবে।</p></>}
      {modal === 'help' && <><span className="modal-eyebrow">NESTING AI ASSISTANT</span><h2>কীভাবে সাহায্য করতে পারি?</h2><p className="modal-intro">আপনার ডিজাইন আপলোড করুন, Max, High বা Low মোড বেছে নিন, তারপর artwork তৈরির ধাপ শুরু করুন। Illustrator automation সংযোগটি Premium প্ল্যানে পাওয়া যাবে।</p><button className="primary" onClick={() => { setModal(''); navigate('create'); }}>Artwork তৈরি করুন <ArrowRight size={16}/></button></>}
      {modal === 'credits' && <><span className="modal-eyebrow">CREDITS</span><h2>ক্রেডিট যোগ করুন</h2><p className="modal-intro">ক্রেডিট কেনার ব্যবস্থা এখনো সংযুক্ত নয়।</p></>}
      <button className="modal-dismiss" onClick={() => setModal('')}>বন্ধ করুন</button>
    </section></div>}
  </div>;
}

function Avatar({ image, name }: { image: string; name: string }) {
  return image ? <img className="avatar-image" src={image} alt={`${name} profile`}/> : <span className="avatar-fallback"><UserRound size={18}/></span>;
}
function EngineCard({ icon, label, detail, status, kind }: { icon: React.ReactNode; label: string; detail: string; status: string; kind: string }) {
  return <article className="engine-card"><span className="engine-symbol">{icon}</span><span className="engine-copy"><strong>{label}</strong><small>{detail}</small></span><span className={`engine-state ${kind}`}><i/>{status}</span></article>;
}
function SimplePage({ title, eyebrow, text, icon, action }: { title: string; eyebrow: string; text: string; icon: React.ReactNode; action?: () => void }) {
  return <section className="simple-page"><span className="eyebrow-small">{eyebrow}</span><div className="simple-icon">{icon}</div><h1>{title}</h1><p>{text}</p>{action && <button className="primary" onClick={action}>ক্রেডিট যোগ করুন <ArrowRight size={16}/></button>}</section>;
}

createRoot(document.getElementById('root')!).render(<App/>);
