const etop = document.getElementById('top');

const container = document.querySelector('.container');

container.style.opacity = "0";

const chapterContainer = document.querySelector('.chapter-container');

const chapters = chapterContainer.querySelectorAll('.chapter');

const sections = chapterContainer.querySelectorAll('.section');

const sectionsByChapter = {};
let sectionCount = 0;

const tocContainer = document.querySelector('.toc-container');

const tocSectionListItems = [];

const tocListParent = document.createElement('ol');

for (let i = 0; i < chapters.length; ++i) {
    const currentChapter = chapters[i];
    const sectionsInChapter = currentChapter.querySelectorAll('.section');
    sectionsByChapter[i] = sectionsInChapter;

    const tocChapterListItem = document.createElement('li');
    tocChapterListItem.appendChild(document.createTextNode(currentChapter.dataset.title));

    const tocSectionsListParent = document.createElement('ol');
    for (let j = 0; j < sectionsInChapter.length; ++j) {
        const currentSection = sectionsInChapter[j];
        const tocSectionListItem = document.createElement('li');
        tocSectionListItem.appendChild(document.createTextNode(currentSection.dataset.title));
        tocSectionListItem.setAttribute('data-section-index', sectionCount++);

        tocSectionListItem.addEventListener('click', e=>{
            const h = container.getBoundingClientRect().height;
            const w = window.innerWidth;
            const y = Math.abs(etop.getBoundingClientRect().top);

            const sectionHeight = h / sectionCount;

            const ny = e.target.dataset.sectionIndex * sectionHeight;

            if (ny == y)
                return;

            window.scrollTo({
                top: ny,
                left: 0,
                behavior: 'auto'
            });
        });

        tocSectionsListParent.appendChild(tocSectionListItem);
        tocSectionListItems.push(tocSectionListItem);
    }
    tocChapterListItem.appendChild(tocSectionsListParent);

    tocListParent.appendChild(tocChapterListItem);
}

tocContainer.appendChild(tocListParent);

container.style.height = `${sectionCount}00%`;

/*

*/

document.querySelectorAll('.embed-component-style-link').forEach(component=>{
    component.innerHTML += `<svg class="launchIcon" aria-hidden="false" width="16" height="16" viewBox="0 0 24 24">
    <path fill="currentColor" d="M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z"></path>
    <path fill="currentColor" d="M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z"></path>
    </svg>`
});

const now = new Date();
document.querySelectorAll('.embed-footer.has-date').forEach(footer => {
    const hour = ((now.getHours() % 12) || 12).toString(10);
    const minute = ((now.getMinutes())).toString(10).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    footer.dataset.date = footer.dataset.date || `Today at ${hour}:${minute} ${ampm}`;
});

let its = null;
let pts = null;
let pActiveSection = 0;

const processAnimationFrame = ts => {
    const h = container.getBoundingClientRect().height;
    const w = window.innerWidth;
    const y = Math.abs(etop.getBoundingClientRect().top);

    chapterContainer.style.transform = `translate3d(0,${y}px,0)`;

    const sectionHeight = h / sectionCount;
    const activeSection = Math.floor(y / sectionHeight);
    const inSectionPercent = (100 * y / sectionHeight) % 100;

    if (activeSection !== pActiveSection && !pts) {
        pts = ts;
    }

    for (let i = 0; i < sectionCount; ++i) {
        let currentSection = sections[i];

        if (i === activeSection || i === pActiveSection) {
            currentSection.style.display = `block`;
        } else {
            currentSection.style.display = `none`;
        }

        if (activeSection !== pActiveSection) {
            const dts = ts - pts;
            if (i === pActiveSection) {
                currentSection.style.opacity = `${Math.max(0, (200 - dts) / 100)}`;
            } else if (i === activeSection) {
                currentSection.style.opacity = `${Math.max(0, (dts / 100) - 1)}`;
            }

            if (dts > 200) {
                pts = null;
                pActiveSection = activeSection;
            }
        }
    }

    let j = 0;
    for (let i = 0; i < chapters.length; ++i) {
        let currentChapter = chapters[i];
        if ((j <= activeSection && activeSection < j + sectionsByChapter[i].length) || (j <= pActiveSection && pActiveSection < j + sectionsByChapter[i].length)) {
            currentChapter.style.display = `block`;
        } else {
            currentChapter.style.display = `none`;
        }
        j += sectionsByChapter[i].length;
    }

    tocSectionListItems.forEach((tocSectionListItem, i) => {
        if (i === activeSection) {
            tocSectionListItem.className = 'toc-section-list-item-selected';
        } else {
            tocSectionListItem.className = '';
        }
    });

    if (!its)
        its = ts;

    if (ts - its < 400) {
        container.style.opacity = Math.min((ts - its) / 400, 1);
    }

    requestAnimationFrame(processAnimationFrame);
}

requestAnimationFrame(processAnimationFrame);