let its, cardBeginFadeinTs;
const etop = document.getElementById('top');
const promoContainer = document.getElementById('promo-container');
const bypassCards = [
    document.getElementById('bypass-card-1'),
    document.getElementById('bypass-card-2'),
    document.getElementById('bypass-card-3'),
    document.getElementById('bypass-card-4')
];
const promoLinesContainer = document.getElementById('promo-lines-container');
const promoLines = [
    document.getElementById('promo-line-1'),
    document.getElementById('promo-line-2'),
    document.getElementById('promo-line-3'),
    document.getElementById('promo-line-4')
];
const step = ts => {
    if (!its)
        its = ts;
    const dts = ts - its;

    let h = window.innerHeight;
    let w = window.innerWidth;
    let y = Math.abs(etop.getBoundingClientRect().top);

    if (y === 0) {
        cardBeginFadeinTs = ts;
        bypassCards.forEach(card=>card.style.opacity = 0);
    } else {
        let cardDts = ts - cardBeginFadeinTs;
        bypassCards.forEach((card, idx)=>{
            card.style.opacity = Math.max(0, Math.min(1, ((cardDts - 200*idx) / 1000)))
        });
    }

    promoContainer.style.opacity = Math.max(0, Math.min(1, (dts - 200) / 1000));
    //promoContainer.style.height = `${Math.max(h - 3*y, h/2)}px`;
    promoContainer.style.transform = `translate3d(0,${Math.min(2*y/3, w > 500 ? h/3 : h/4)}px,0)`

    let promoLinesRect = promoLinesContainer.getBoundingClientRect();
    let promoLinesOffset = Math.max(0, (promoLinesRect.top - (y + (h/4))) / 2);

    promoLines.forEach((promoLine, idx)=>promoLine.style.transform = `translate3d(${idx % 2 === 0 ? '-' : ''}${promoLinesOffset}px,0,0)`)

    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
window.scroll({left: 0, top: 0});