
(function() {
  const properties = [{"id": 1, "title": "Marina Sky Villa", "city": "Hyderabad", "type": "Villa", "status": "For Sale", "price": "₹1.85 Cr", "priceNum": 18500000, "area": "2450 sq ft", "beds": "4", "baths": "3", "img": "assets/img/property/1.jpg", "address": "Financial District, Hyderabad", "desc": "A premium family villa with open living space, modular kitchen, landscaped balcony and easy access to schools, offices and hospitals."}, {"id": 2, "title": "Green View Apartment", "city": "Bengaluru", "type": "Apartment", "status": "For Rent", "price": "₹58,000/mo", "priceNum": 58000, "area": "1580 sq ft", "beds": "3", "baths": "2", "img": "assets/img/property/2.jpg", "address": "Whitefield, Bengaluru", "desc": "A bright apartment near tech parks with city views, natural ventilation, covered parking and a secure gated community."}, {"id": 3, "title": "Palm Grove House", "city": "Chennai", "type": "House", "status": "For Sale", "price": "₹1.25 Cr", "priceNum": 12500000, "area": "2100 sq ft", "beds": "3", "baths": "3", "img": "assets/img/property/3.jpg", "address": "ECR Road, Chennai", "desc": "A peaceful independent home with a private garden, spacious bedrooms and quick access to coastal roads and shopping zones."}, {"id": 4, "title": "Urban Nest Studio", "city": "Pune", "type": "Studio", "status": "For Rent", "price": "₹32,000/mo", "priceNum": 32000, "area": "780 sq ft", "beds": "1", "baths": "1", "img": "assets/img/property/4.jpg", "address": "Koregaon Park, Pune", "desc": "A compact modern studio for professionals with premium fittings, workstation space and excellent café and metro connectivity."}, {"id": 5, "title": "Lakefront Residency", "city": "Mumbai", "type": "Apartment", "status": "For Sale", "price": "₹2.45 Cr", "priceNum": 24500000, "area": "1720 sq ft", "beds": "3", "baths": "3", "img": "assets/img/property/5.jpg", "address": "Powai, Mumbai", "desc": "A lake-facing residence with premium amenities, clubhouse access, gym, children’s play area and a calm urban lifestyle."}, {"id": 6, "title": "Cedar Business Space", "city": "Delhi", "type": "Commercial", "status": "For Rent", "price": "₹1.1 L/mo", "priceNum": 110000, "area": "1950 sq ft", "beds": "0", "baths": "2", "img": "assets/img/property/6.jpg", "address": "Saket, New Delhi", "desc": "Ready-to-use commercial floor with reception space, meeting rooms, pantry and prime road visibility for growing teams."}];
  function get(id){ return document.getElementById(id); }
  function applyFilters(){
    const keyword = (get('keywordSearch')?.value || '').toLowerCase();
    const city = get('cityFilter')?.value || 'all';
    const type = get('typeFilter')?.value || 'all';
    const status = get('statusFilter')?.value || 'all';
    const budget = get('budgetFilter')?.value || 'all';
    const bed = get('bedFilter')?.value || 'all';
    const bath = get('bathFilter')?.value || 'all';
    let visible = 0;
    document.querySelectorAll('.property-card-wrap').forEach(card => {
      const p = {
        title: card.dataset.title || '',
        city: card.dataset.city || '',
        type: card.dataset.type || '',
        status: card.dataset.status || '',
        price: Number(card.dataset.price || 0),
        beds: Number((card.innerText.match(/(\d+) Beds/)||[])[1] || 0),
        baths: Number((card.innerText.match(/(\d+) Baths/)||[])[1] || 0)
      };
      let ok = true;
      if(keyword && !p.title.includes(keyword)) ok = false;
      if(city !== 'all' && p.city !== city) ok = false;
      if(type !== 'all' && p.type !== type) ok = false;
      if(status !== 'all' && p.status !== status) ok = false;
      if(bed !== 'all' && p.beds < Number(bed)) ok = false;
      if(bath !== 'all' && p.baths < Number(bath)) ok = false;
      if(budget === 'rent' && !(p.status === 'For Rent' && p.price <= 120000)) ok = false;
      if(budget === 'sale-low' && !(p.status === 'For Sale' && p.price <= 15000000)) ok = false;
      if(budget === 'sale-high' && !(p.status === 'For Sale' && p.price > 15000000)) ok = false;
      card.style.display = ok ? '' : 'none';
      if(ok) visible++;
    });
    const noResults = get('noResults');
    if(noResults) noResults.style.display = visible ? 'none' : 'block';
  }
  ['keywordSearch','cityFilter','typeFilter','statusFilter','budgetFilter','bedFilter','bathFilter'].forEach(id => {
    const el = get(id); if(el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', applyFilters);
  });
  const reset = get('resetFilters');
  if(reset) reset.addEventListener('click', () => {
    ['keywordSearch','cityFilter','typeFilter','statusFilter','budgetFilter','bedFilter','bathFilter'].forEach(id => { const el=get(id); if(!el) return; el.value = id === 'keywordSearch' ? '' : 'all'; });
    applyFilters();
  });

  function loadDetail(){
    const selector = get('detailSelector');
    if(!selector) return;
    const params = new URLSearchParams(window.location.search);
    const selectedId = Number(params.get('id') || selector.value || 1);
    selector.value = String(selectedId);
    renderDetail(selectedId);
    selector.addEventListener('change', () => {
      const id = Number(selector.value);
      history.replaceState(null, '', 'property-details.html?id=' + id);
      renderDetail(id);
    });
  }
  function renderDetail(id){
    const p = properties.find(x => x.id === id) || properties[0];
    const set=(id,val)=>{ const el=get(id); if(el) el.textContent=val; };
    set('detailTitleHeader', p.title);
    set('detailTitle', p.title);
    set('detailStatus', p.status);
    set('detailAddress', p.address);
    set('detailPrice', p.price);
    set('detailDesc', p.desc);
    set('detailArea', p.area);
    set('detailBeds', p.beds);
    set('detailBaths', p.baths);
    const img=get('detailImage'); if(img){ img.src=p.img; img.alt=p.title; }
    const map=get('propertyMap'); if(map) map.src='https://www.google.com/maps?q=' + encodeURIComponent(p.address) + '&output=embed';
  }
  loadDetail();
})();
