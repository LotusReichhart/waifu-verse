document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
});

window.addEventListener('resize', () => {
    setupSearch();
});

function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
}

function setupSearch() {
    const isMobileView = isMobile();

    if (isMobileView) {
        setUpMobileSearch();
    } else {
        setUpDesktopSearch();
    }
}

function renderResults(items = [], isHistory = false) {
    const isMobileView = isMobile();

    const resultList = isMobileView
        ? document.getElementById('mobile-search-results')
        : document.getElementById('desktop-search-results');

    resultList.innerHTML = '';

    for (const {model, results, totalResults, q} of items) {
        if (model === 'Character' && results.length > 0) {
            const div = document.createElement('div');
            div.className = 'flex w-full mb-2 items-center justify-between';

            const title = document.createElement('h3');
            if (isHistory) {
                title.className = 'text-lg text-color font-medium';
                title.innerText = window.commonJson.title["history"];

                div.appendChild(title);
            } else {
                title.className = 'text-lg font-medium';
                title.innerText = window.commonJson.title["character"];

                const seeMore = document.createElement('div');
                seeMore.className = 'flex items-center space-x-2 hover:italic';

                const span = document.createElement('span');
                span.className = 'text-sm font-thin';
                span.innerText = `${totalResults} ${window.commonJson.searchbar["results"].toLowerCase()}`;

                const a = document.createElement('a');
                a.className = 'text-sm flex items-center space-x-1';
                a.href = `/${model.toLowerCase()}s?q=${encodeURIComponent(q)}`;
                a.innerHTML = `
                            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                     d="M19 12H5m14 0-4 4m4-4-4-4"/>
                             </svg>
                            `;

                seeMore.appendChild(span);
                seeMore.appendChild(a);

                div.appendChild(title);
                div.appendChild(seeMore);
            }

            resultList.appendChild(div);

            for (const character of results) {
                const li = document.createElement('li');

                const div = document.createElement('div');
                div.className = 'p-1 flex items-center space-x-2 primary-hover rounded';

                const img = document.createElement('img');
                const fallbackImage = character.gender === 'male' ? '/images/male-img.jpg' : '/images/female-img.png';
                img.src = character.avatar || fallbackImage;
                img.className = 'w-9 h-9 object-cover rounded';

                const name = document.createElement('span');
                name.className = 'text-sm font-medium';
                name.innerText = character.name;

                div.appendChild(img);
                div.appendChild(name);
                li.appendChild(div);

                li.onclick = () => {
                    fetch('/api/search/history', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({model, id: character._id}),
                    }).catch(console.error);

                    window.location.href = `/${model.toLowerCase()}s/${character.slug}`;
                };

                resultList.appendChild(li);
            }
        }
    }
}

function showShimmer(isMobileView) {
    const shimmer = isMobileView
        ? document.getElementById('mobile-search-shimmer')
        : document.getElementById('desktop-search-shimmer');

    shimmer?.classList.remove('hidden');
}

function hideShimmer(isMobileView) {
    const shimmer = isMobileView
        ? document.getElementById('mobile-search-shimmer')
        : document.getElementById('desktop-search-shimmer');

    shimmer?.classList.add('hidden');
}

async function showSearchHistory() {
    const isMobileView = isMobile();

    const resultList = isMobileView
        ? document.getElementById('mobile-search-results')
        : document.getElementById('desktop-search-results');

    const empty = isMobileView
        ? document.getElementById('mobile-search-empty')
        : document.getElementById('desktop-search-empty');

    empty.classList.add('hidden');
    showShimmer(isMobileView);
    if (resultList) resultList.innerHTML = '';

    try {
        const res = await fetch('/api/search/history');
        const json = await res.json();

        if (!res.ok) {
            empty.textContent = json.message || window.commonJson.error["somethingIsWrong"];
            empty.classList.remove('hidden');
            return;
        }

        const results = json.results;
        if (Array.isArray(results) && results.length === 0) {
            empty.textContent = json.message;
            empty.classList.remove('hidden');
        } else {
            renderResults(Array.isArray(results) ? results : [], true);
            empty.classList.add('hidden');
        }
    } catch (err) {
        empty.textContent = window.commonJson.searchbar["unableToLoadHistory"];
        empty.classList.remove('hidden');
    } finally {
        hideShimmer(isMobileView);
    }
}

async function performSearch(query) {
    const isMobileView = isMobile();

    const resultList = isMobileView
        ? document.getElementById('mobile-search-results')
        : document.getElementById('desktop-search-results');

    const empty = isMobileView
        ? document.getElementById('mobile-search-empty')
        : document.getElementById('desktop-search-empty');

    empty.classList.add('hidden');
    showShimmer(isMobileView);
    if (resultList) resultList.innerHTML = '';

    try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();

        setTimeout(() => {
            if (!res.ok) {
                empty.textContent = json.message || window.commonJson.error["somethingIsWrong"];
                empty.classList.remove('hidden');
                return;
            }else {
                const results = json.results;
                if(Array.isArray(results) && results.length === 0) {
                    empty.textContent = json.message || window.commonJson.error["somethingIsWrong"];
                    empty.classList.remove('hidden');
                }else {
                    renderResults(json.results || []);
                }
            }

            hideShimmer(isMobileView);
        }, 3000);
    } catch {
        empty.textContent = window.commonJson.searchbar["errorWhileSearching"];
        empty.classList.remove('hidden');

        hideShimmer(isMobileView);
    }
}

function setUpDesktopSearch() {
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const clearDesktopSearchInputBtn = document.getElementById('clear-desktop-search-input-btn');

    const desktopSearchDropdown = document.getElementById('desktop-search-dropdown');
    const searchBackdrop = document.getElementById('search-backdrop');
    const leftSidebar = document.getElementById('left-sidebar');

    const isMobileView = isMobile();
    const resultList = isMobileView
        ? document.getElementById('mobile-search-results')
        : document.getElementById('desktop-search-results');

    let debounceTimer;

    desktopSearchInput?.addEventListener('focus', () => {
        const isOpen = !desktopSearchDropdown?.classList.contains('hidden');
        if (!isOpen) {
            desktopSearchDropdown?.classList.remove('hidden');
            searchBackdrop?.classList.remove('hidden');
            leftSidebar?.classList.add('pointer-events-none');
            document.body.classList.add('overflow-hidden');

            if (!desktopSearchInput.value.trim()) {
                showSearchHistory().then(() => {
                });
            }
        }
    });

    desktopSearchInput?.addEventListener('input', () => {
        updateClearDesktopSearchInputVisibility();

        clearTimeout(debounceTimer);

        const value = desktopSearchInput.value.trim();
        if (!value) {
            showSearchHistory().then(r => {
            });
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(value).then(r => {
            });
        }, 1250);
    });

    const clearDesktopSearch = () => {
        resultList.innerHTML = '';
        desktopSearchInput.value = '';
        desktopSearchInput.focus();
        updateClearDesktopSearchInputVisibility();
        showSearchHistory().then(r => {
        });
    };

    clearDesktopSearchInputBtn.addEventListener('click', clearDesktopSearch);

    const updateClearDesktopSearchInputVisibility = () => {
        clearDesktopSearchInputBtn?.classList.toggle('hidden', !desktopSearchInput?.value.trim());
    };

    const closeDesktopSearch = () => {
        desktopSearchDropdown?.classList.add('hidden');
        searchBackdrop?.classList.add('hidden');
        leftSidebar?.classList.remove('pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    }

    searchBackdrop.addEventListener('click', closeDesktopSearch);
}

function openMobileSearch() {
    const openMobileSearchBar = document.getElementById('open-mobile-search-bar');

    const searchBackdrop = document.getElementById('search-backdrop');
    const mobileSearchBar = document.getElementById('mobile-search-bar');
    const mobileSearchDropdown = document.getElementById('mobile-search-dropdown');
    const leftSidebar = document.getElementById('left-sidebar');

    openMobileSearchBar.addEventListener('click', () => {
        searchBackdrop.classList.remove('hidden');
        mobileSearchBar.classList.remove('hidden');
        mobileSearchBar.classList.add('flex');
        mobileSearchDropdown.classList.remove('hidden');
        leftSidebar?.classList.add('pointer-events-none');
        document.body.classList.add('overflow-hidden');
    });

    showSearchHistory().then(r => {
    });
}

function closeMobileSearch() {
    const closeMobileSearchBar = document.getElementById('close-mobile-search-bar');

    const searchBackdrop = document.getElementById('search-backdrop');
    const mobileSearchBar = document.getElementById('mobile-search-bar');
    const mobileSearchDropdown = document.getElementById('mobile-search-dropdown');
    const leftSidebar = document.getElementById('left-sidebar');

    closeMobileSearchBar.addEventListener('click', () => {
        searchBackdrop.classList.add('hidden');
        mobileSearchBar.classList.remove('flex');
        mobileSearchBar.classList.add('hidden');
        mobileSearchDropdown.classList.add('hidden');
        leftSidebar?.classList.remove('pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    });
}

function setUpMobileSearch() {
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const clearMobileSearchInputBtn = document.getElementById('clear-mobile-search-input-btn');

    openMobileSearch();
    closeMobileSearch();

    const isMobileView = isMobile();
    const resultList = isMobileView
        ? document.getElementById('mobile-search-results')
        : document.getElementById('desktop-search-results');

    let debounceTimer;

    mobileSearchInput?.addEventListener('input', () => {
        updateClearMobileSearchInputVisibility();

        clearTimeout(debounceTimer);

        const value = mobileSearchInput.value.trim();
        if (!value) {
            showSearchHistory().then(r => {
            });
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(value).then(r => {
            });
        }, 1250);
    });

    const clearMobileSearch = () => {
        resultList.innerHTML = '';
        mobileSearchInput.value = '';
        mobileSearchInput.focus();
        updateClearMobileSearchInputVisibility();
        showSearchHistory().then(r => {
        });
    };

    clearMobileSearchInputBtn.addEventListener('click', clearMobileSearch);

    const updateClearMobileSearchInputVisibility = () => {
        clearMobileSearchInputBtn?.classList.toggle('hidden', !mobileSearchInput?.value.trim());
    };
}