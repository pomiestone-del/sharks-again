(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const fields = [...document.querySelectorAll('[data-edit]')];
  const storageKey = 'shark-studies-copy-v1';
  let editMode = false;
  let toastTimer;
  const notify = text => { $('#toast').textContent = text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2600); };
  const readCopy = () => Object.fromEntries(fields.map(el => [el.dataset.edit, el.innerHTML]));
  const safeMarkup = value => {
    const template = document.createElement('template');
    template.innerHTML = value.slice(0, 12000);
    const clean = node => {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
      const fragment = document.createDocumentFragment();
      if (node.nodeType !== Node.ELEMENT_NODE) return fragment;
      if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(node.tagName)) return fragment;
      const allowed = ['BR', 'SPAN', 'DIV', 'P'].includes(node.tagName);
      const target = allowed ? document.createElement(node.tagName.toLowerCase()) : fragment;
      if (allowed && node.classList.contains('serif')) target.className = 'serif';
      node.childNodes.forEach(child => target.appendChild(clean(child)));
      return target;
    };
    const result = document.createDocumentFragment();
    template.content.childNodes.forEach(node => result.appendChild(clean(node)));
    return result;
  };
  const applyCopy = copy => fields.forEach(el => { if (typeof copy[el.dataset.edit] === 'string') el.replaceChildren(safeMarkup(copy[el.dataset.edit])); });
  try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (saved && typeof saved === 'object') applyCopy(saved); } catch {}
  const saveCopy = () => { try { localStorage.setItem(storageKey, JSON.stringify(readCopy())); } catch { notify('浏览器无法保存，请导出文案备份'); } };
  const setEditing = value => { editMode = value; document.body.classList.toggle('editing', value); fields.forEach(el => { el.contentEditable = String(value); el.spellcheck = false; }); $('#editor-bar').hidden = !value; $('#edit-toggle').setAttribute('aria-pressed', String(value)); $('#edit-toggle').innerHTML = value ? '正在编辑 <span>✎</span>' : '编辑文字 <span>↗</span>'; if (!value) saveCopy(); };
  $('#edit-toggle').addEventListener('click', () => setEditing(!editMode));
  $('#edit-done').addEventListener('click', () => { setEditing(false); notify('文字已保存在此浏览器'); $('#edit-toggle').focus(); });
  fields.forEach(el => { el.addEventListener('input', saveCopy); el.addEventListener('paste', e => { if (!editMode) return; e.preventDefault(); const text = e.clipboardData.getData('text/plain'); const selection = window.getSelection(); if (!selection.rangeCount) return; const range = selection.getRangeAt(0); range.deleteContents(); const node = document.createTextNode(text); range.insertNode(node); range.setStartAfter(node); range.collapse(true); selection.removeAllRanges(); selection.addRange(range); saveCopy(); }); });
  $('#export-text').addEventListener('click', () => { const blob = new Blob([JSON.stringify({format:'shark-studies-v1',copy:readCopy()}, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'shark-studies-copy.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify('文案已导出，可在其他浏览器导入'); });
  $('#import-text').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', async e => { const file = e.target.files[0]; if (!file) return; try { if (file.size > 500000) throw new Error(); const data = JSON.parse(await file.text()); if (data.format !== 'shark-studies-v1' || !data.copy || typeof data.copy !== 'object') throw new Error(); applyCopy(data.copy); saveCopy(); notify('文案已导入'); } catch { notify('无法导入，请选择本网页导出的 JSON 文案文件'); } e.target.value = ''; });
  const dialog = $('#lightbox');
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => { const img = $('#lightbox-image'); img.src = button.dataset.image; img.alt = button.querySelector('img').alt; $('#lightbox-caption').textContent = button.dataset.caption; dialog.showModal(); document.body.classList.add('modal-open'); }));
  $('#lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) { document.body.classList.add('motion-ready'); const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:0.08}); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); }
  let pending = false;
  const progress = () => { const total = document.documentElement.scrollHeight - innerHeight; $('.reading-progress').style.width = (total > 0 ? Math.min(100, scrollY / total * 100) : 0) + '%'; pending = false; };
  addEventListener('scroll', () => { if (!pending) { requestAnimationFrame(progress); pending = true; } }, {passive:true}); addEventListener('resize', progress); progress();
})();
