// Manga Reader Application
class MangaReader {
    constructor() {
        this.currentChapter = null;
        this.currentPage = 1;
        this.currentPanel = 0; // For single page mode panel navigation
        this.readingMode = 'single';
        this.settings = { ...MANGA_CONFIG.defaultSettings };
        this.isLoading = false;
        this.currentView = 'landing'; // 'landing' or 'reader'
        this.panels = []; // Store panel data for single page mode
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.initializeReader();
    }
    
    initializeElements() {
        // Landing page elements
        this.landingPage = document.getElementById('landingPage');
        this.readerView = document.getElementById('readerView');
        this.landingChaptersGrid = document.getElementById('landingChaptersGrid');
        this.chapterSearch = document.getElementById('chapterSearch');
        
        // Reader elements
        this.readerViewport = document.getElementById('readerViewport');
        this.pageContainer = document.getElementById('pageContainer');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.settingsPanel = document.getElementById('settingsPanel');
        
        // Control buttons
        this.menuBtn = document.getElementById('menuBtn');
        this.menuPanel = document.getElementById('menuPanel');
        this.closeMenuBtn = document.getElementById('closeMenu');
        this.homeBtn = document.getElementById('homeBtn');
        this.prevChapterBtn = document.getElementById('prevChapterBtn');
        this.nextChapterBtn = document.getElementById('nextChapterBtn');
        this.readingModeDropdown = document.getElementById('readingModeDropdown');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.menuChapterList = document.getElementById('menuChapterList');
        
        // Info displays
        this.currentChapterSpan = document.getElementById('currentChapter');
        this.pageInfoSpan = document.getElementById('pageInfo');
        
        // Settings elements
        this.autoFitCheckbox = document.getElementById('autoFit');
        this.pageGapSlider = document.getElementById('pageGap');
        this.gapValueSpan = document.getElementById('gapValue');
        this.backgroundColorInput = document.getElementById('backgroundColor');
    }
    
    bindEvents() {
        // Landing page events
        this.chapterSearch.addEventListener('input', (e) => this.filterChapters(e.target.value));
        
        // Menu events
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        this.closeMenuBtn.addEventListener('click', () => this.closeMenu());
        this.homeBtn.addEventListener('click', () => this.showLandingPage());
        this.prevChapterBtn.addEventListener('click', () => this.previousChapter());
        this.nextChapterBtn.addEventListener('click', () => this.nextChapter());
        this.readingModeDropdown.addEventListener('change', (e) => this.setReadingMode(e.target.value));
        
        // UI controls
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Settings
        this.autoFitCheckbox.addEventListener('change', (e) => this.updateSetting('autoFit', e.target.checked));
        this.pageGapSlider.addEventListener('input', (e) => this.updateSetting('pageGap', parseInt(e.target.value)));
        this.backgroundColorInput.addEventListener('change', (e) => this.updateSetting('backgroundColor', e.target.value));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent context menu on images
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }
    
    initializeReader() {
        this.loadLandingPage();
        this.populateMenuChapters();
    }
    
    loadLandingPage() {
        this.landingChaptersGrid.innerHTML = '';
        
        MANGA_CONFIG.chapters.forEach(chapter => {
            const chapterCard = document.createElement('div');
            chapterCard.className = 'chapter-card';
            chapterCard.innerHTML = `
                <div class="page-count">${chapter.pageCount} pages</div>
                <h3>${chapter.title}</h3>
                <p>${chapter.description}</p>
                <div class="release-date">Released: ${new Date(chapter.releaseDate).toLocaleDateString()}</div>
            `;
            
            chapterCard.addEventListener('click', () => {
                this.showReaderView();
                this.loadChapter(chapter.id);
            });
            
            this.landingChaptersGrid.appendChild(chapterCard);
        });
    }
    
    populateMenuChapters() {
        this.menuChapterList.innerHTML = '';
        
        MANGA_CONFIG.chapters.forEach(chapter => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item';
            chapterItem.dataset.chapterId = chapter.id;
            chapterItem.innerHTML = `
                <h5>${chapter.title}</h5>
                <p>${chapter.description}</p>
            `;
            
            chapterItem.addEventListener('click', () => {
                this.loadChapter(chapter.id);
                this.closeMenu();
            });
            
            this.menuChapterList.appendChild(chapterItem);
        });
    }
    
    toggleMenu() {
        this.menuPanel.classList.toggle('active');
    }
    
    closeMenu() {
        this.menuPanel.classList.remove('active');
    }
    
    filterChapters(searchTerm) {
        const cards = this.landingChaptersGrid.querySelectorAll('.chapter-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const searchLower = searchTerm.toLowerCase();
            
            if (title.includes(searchLower) || description.includes(searchLower)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    showLandingPage() {
        this.currentView = 'landing';
        this.landingPage.style.display = 'flex';
        this.readerView.style.display = 'none';
    }
    
    showReaderView() {
        this.currentView = 'reader';
        this.landingPage.style.display = 'none';
        this.readerView.style.display = 'flex';
    }
    
    async loadChapter(chapterId) {
        if (this.isLoading) return;
        
        const chapter = getChapterById(chapterId);
        if (!chapter) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            this.currentChapter = chapter;
            this.currentPage = 1;
            
            // Update SEO meta tags for this chapter
            this.updateSEO(chapter);
            
            // Update UI
            this.updateHeaderInfo(chapter);
            this.updateMenuChapterSelection(chapterId);
            this.updateNavigationButtons();
            
            // Load pages
            await this.loadPages();
            
            // Update reading mode
            this.setReadingMode(this.settings.readingMode);
            
            // Initialize single page mode if needed
            if (this.readingMode === 'singlePage') {
                this.initializeSinglePageMode();
            }
            
        } catch (error) {
            console.error('Error loading chapter:', error);
            this.showError('Failed to load chapter. Please check if the files exist.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }
    
    async loadPages() {
        this.pageContainer.innerHTML = '';
        
        const pages = getChapterPages(this.currentChapter);
        console.log(`Loading ${pages.length} pages for ${this.currentChapter.title}`);
        console.log('First few page paths:', pages.slice(0, 3).map(p => p.path));
        
        for (const page of pages) {
            const img = document.createElement('img');
            img.className = 'manga-page';
            img.src = page.path;
            img.alt = `Page ${page.number}`;
            img.loading = 'lazy';
            
            // Add click to next page
            img.addEventListener('click', (e) => {
                if (this.readingMode === 'singlePage') {
                    // Handle left/right click for single page mode
                    const rect = img.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const centerX = rect.width / 2;
                    
                    if (clickX < centerX) {
                        this.previousPanel();
                    } else {
                        this.nextPanel();
                    }
                } else {
                    this.nextPage();
                }
            });
            
            // Handle image load errors
            img.addEventListener('error', (e) => {
                console.error(`Failed to load page: ${page.path}`, e);
                img.style.display = 'none';
                // Show error message for debugging
                const errorDiv = document.createElement('div');
                errorDiv.className = 'page-error';
                errorDiv.innerHTML = `
                    <div style="background: #ff4444; color: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
                        <strong>Failed to load page ${page.number}</strong><br>
                        <small>Path: ${page.path}</small><br>
                        <small>Check if the file exists in the correct location</small>
                    </div>
                `;
                this.pageContainer.appendChild(errorDiv);
            });
            
            // Handle successful image load
            img.addEventListener('load', () => {
                console.log(`Successfully loaded page: ${page.path}`);
            });
            
            this.pageContainer.appendChild(img);
        }
        
        this.updatePageInfo();
    }
    
    setReadingMode(mode) {
        this.readingMode = mode;
        this.settings.readingMode = mode;
        
        // Update page container class
        this.pageContainer.className = 'page-container';
        this.pageContainer.classList.add(mode + '-page');
        
        // Special handling for single page mode
        if (mode === 'singlePage') {
            this.initializeSinglePageMode();
        }
        
        // Apply auto-fit if enabled
        if (this.settings.autoFit) {
            this.pageContainer.classList.add('auto-fit');
        }
        
        this.saveSettings();
    }
    
    nextPage() {
        if (!this.currentChapter) return;
        
        // Handle single page mode
        if (this.readingMode === 'singlePage') {
            this.nextPanel();
            return;
        }
        
        const totalPages = this.currentChapter.pageCount;
        const pagesPerView = this.readingMode === 'double' ? 2 : 1;
        const maxPage = totalPages - (this.readingMode === 'double' ? 1 : 0);
        
        if (this.currentPage < maxPage) {
            this.currentPage += pagesPerView;
            this.scrollToCurrentPage();
            this.updatePageInfo();
            this.updateNavigationButtons();
        } else if (this.nextChapterBtn && !this.nextChapterBtn.disabled) {
            this.nextChapter();
        }
    }
    
    previousPage() {
        if (!this.currentChapter) return;
        
        // Handle single page mode
        if (this.readingMode === 'singlePage') {
            this.previousPanel();
            return;
        }
        
        const pagesPerView = this.readingMode === 'double' ? 2 : 1;
        
        if (this.currentPage > 1) {
            this.currentPage -= pagesPerView;
            this.scrollToCurrentPage();
            this.updatePageInfo();
            this.updateNavigationButtons();
        } else if (this.prevChapterBtn && !this.prevChapterBtn.disabled) {
            this.previousChapter();
        }
    }
    
    nextChapter() {
        if (!this.currentChapter) return;
        
        const nextChapter = getNextChapter(this.currentChapter.id);
        if (nextChapter) {
            this.loadChapter(nextChapter.id);
        }
    }
    
    previousChapter() {
        if (!this.currentChapter) return;
        
        const prevChapter = getPreviousChapter(this.currentChapter.id);
        if (prevChapter) {
            this.loadChapter(prevChapter.id);
        }
    }
    
    scrollToCurrentPage() {
        const pages = this.pageContainer.querySelectorAll('.manga-page');
        const targetPage = pages[this.currentPage - 1];
        
        if (targetPage) {
            targetPage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
    
    updateHeaderInfo(chapter) {
        // Update chapter navigation
        const chapterNav = document.querySelector('.chapter-nav');
        const pageNav = document.querySelector('.page-nav');
        
        if (chapterNav) {
            chapterNav.querySelector('.chapter').textContent = `Ch. ${chapter.id.replace('chapter', '')}`;
        }
        
        if (pageNav) {
            pageNav.querySelector('.current-page').textContent = this.currentPage;
            pageNav.querySelector('.total-pages').textContent = chapter.pageCount;
        }
    }
    
    updateMenuChapterSelection(chapterId) {
        // Update active chapter in menu
        const chapterItems = this.menuChapterList.querySelectorAll('.chapter-item');
        chapterItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.chapterId === chapterId) {
                item.classList.add('active');
            }
        });
    }
    
    updatePageInfo() {
        if (!this.currentChapter) return;
        
        const pageNav = document.querySelector('.page-nav');
        if (pageNav) {
            if (this.readingMode === 'singlePage') {
                pageNav.querySelector('.current-page').textContent = this.currentPanel + 1;
                pageNav.querySelector('.total-pages').textContent = this.panels.length;
            } else {
                pageNav.querySelector('.current-page').textContent = this.currentPage;
                pageNav.querySelector('.total-pages').textContent = this.currentChapter.pageCount;
            }
        }
    }
    
    updateNavigationButtons() {
        if (!this.currentChapter) return;
        
        // Chapter navigation
        const prevChapter = getPreviousChapter(this.currentChapter.id);
        const nextChapter = getNextChapter(this.currentChapter.id);
        
        this.prevChapterBtn.disabled = !prevChapter;
        this.nextChapterBtn.disabled = !nextChapter;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            document.body.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            document.body.classList.remove('fullscreen');
        }
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        
        // Apply setting immediately
        switch (key) {
            case 'autoFit':
                this.pageContainer.classList.toggle('auto-fit', value);
                break;
            case 'pageGap':
                this.pageContainer.style.gap = `${value}px`;
                this.gapValueSpan.textContent = `${value}px`;
                break;
            case 'backgroundColor':
                document.body.style.backgroundColor = value;
                break;
        }
        
        this.saveSettings();
    }
    
    handleKeyboard(e) {
        // Don't handle shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.previousPage();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.nextPage();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.previousChapter();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.nextChapter();
                }
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 's':
            case 'S':
                e.preventDefault();
                this.toggleSettings();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleMenu();
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                this.showLandingPage();
                break;
            case '1':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.setReadingMode('single');
                }
                break;
            case '2':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.setReadingMode('double');
                }
                break;
            case '3':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.setReadingMode('longStrip');
                }
                break;
            case '4':
                e.preventDefault();
                if (this.currentView === 'reader') {
                    this.setReadingMode('singlePage');
                }
                break;
            case 'Escape':
                this.closeMenu();
                break;
        }
    }
    
    showLoading() {
        this.loadingOverlay.classList.add('active');
    }
    
    hideLoading() {
        this.loadingOverlay.classList.remove('active');
    }
    
    showError(message) {
        // Simple error display - you could enhance this
        alert(message);
    }
    
    loadSettings() {
        const saved = localStorage.getItem('mangaReaderSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // Apply settings
        this.autoFitCheckbox.checked = this.settings.autoFit;
        this.pageGapSlider.value = this.settings.pageGap;
        this.backgroundColorInput.value = this.settings.backgroundColor;
        this.gapValueSpan.textContent = `${this.settings.pageGap}px`;
        
        // Apply to DOM
        this.updateSetting('autoFit', this.settings.autoFit);
        this.updateSetting('pageGap', this.settings.pageGap);
        this.updateSetting('backgroundColor', this.settings.backgroundColor);
    }
    
    saveSettings() {
        localStorage.setItem('mangaReaderSettings', JSON.stringify(this.settings));
    }
    
    // Single Page Mode Methods
    initializeSinglePageMode() {
        this.currentPanel = 0;
        this.panels = [];
        this.detectPanels();
        this.showCurrentPanel();
    }
    
    detectPanels() {
        const pages = this.pageContainer.querySelectorAll('.manga-page');
        this.panels = [];
        
        pages.forEach((page, pageIndex) => {
            // Each page is treated as one panel in single page mode
            this.panels.push({
                pageIndex: pageIndex,
                panelIndex: 0,
                page: page,
                totalPanels: 1
            });
        });
    }
    
    showCurrentPanel() {
        if (this.panels.length === 0) return;
        
        // Hide all pages
        const pages = this.pageContainer.querySelectorAll('.manga-page');
        pages.forEach(page => {
            page.style.display = 'none';
        });
        
        // Show current panel's page
        const currentPanelData = this.panels[this.currentPanel];
        if (currentPanelData) {
            currentPanelData.page.style.display = 'block';
            currentPanelData.page.classList.add('single-panel-active');
            
            // Add panel indicator
            this.updatePanelIndicator();
        }
    }
    
    nextPanel() {
        if (this.currentPanel < this.panels.length - 1) {
            this.currentPanel++;
            this.showCurrentPanel();
            this.updatePageInfo();
        } else {
            // Move to next chapter if available, staying in single page mode
            const nextChapter = getNextChapter(this.currentChapter.id);
            if (nextChapter) {
                this.loadChapter(nextChapter.id);
                // Ensure we stay in single page mode
                setTimeout(() => {
                    this.setReadingMode('singlePage');
                }, 100);
            }
        }
    }
    
    previousPanel() {
        if (this.currentPanel > 0) {
            this.currentPanel--;
            this.showCurrentPanel();
            this.updatePageInfo();
        } else {
            // Move to previous chapter if available, staying in single page mode
            const prevChapter = getPreviousChapter(this.currentChapter.id);
            if (prevChapter) {
                this.loadChapter(prevChapter.id);
                // Ensure we stay in single page mode and go to last panel
                setTimeout(() => {
                    this.setReadingMode('singlePage');
                    this.currentPanel = this.panels.length - 1;
                    this.showCurrentPanel();
                    this.updatePageInfo();
                }, 100);
            }
        }
    }
    
    updatePanelIndicator() {
        // Remove existing indicators
        const existingIndicators = document.querySelectorAll('.panel-indicator');
        existingIndicators.forEach(indicator => indicator.remove());
        
        // Update progress bar instead
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        // Remove existing progress bar
        const existingProgressBar = document.querySelector('.chapter-progress-bar');
        if (existingProgressBar) {
            existingProgressBar.remove();
        }
        
        // Create new progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'chapter-progress-bar';
        
        const progress = ((this.currentPanel + 1) / this.panels.length) * 100;
        const currentPanelData = this.panels[this.currentPanel];
        
        progressBar.innerHTML = `
            <div class="progress-fill" style="width: ${progress}%"></div>
            <div class="progress-info">
                <span class="progress-text">Page ${this.currentPanel + 1} / ${this.panels.length}</span>
                <span class="progress-chapter">Ch. ${this.currentChapter.id.replace('chapter', '')}</span>
            </div>
        `;
        
        document.body.appendChild(progressBar);
    }
    
    // SEO Optimization Methods
    updateSEO(chapter) {
        const chapterNumber = chapter.id.replace('chapter', '');
        const title = `Jujutsu Kaisen Chapter ${chapterNumber} Colored – Read Online Free`;
        const description = `${chapter.description} – Read Chapter ${chapterNumber} of Jujutsu Kaisen manga in full color HD.`;
        
        // Update document title
        document.title = title;
        
        // Update meta description
        this.updateMetaTag('description', description);
        
        // Update Open Graph tags
        this.updateMetaTag('og:title', title, 'property');
        this.updateMetaTag('og:description', description, 'property');
        
        // Update Twitter tags
        this.updateMetaTag('twitter:title', title);
        this.updateMetaTag('twitter:description', description);
        
        // Update JSON-LD schema for this chapter
        this.updateSchema(chapter);
    }
    
    updateMetaTag(name, content, attribute = 'name') {
        let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute(attribute, name);
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
    }
    
    updateSchema(chapter) {
        const chapterNumber = chapter.id.replace('chapter', '');
        const schema = {
            "@context": "https://schema.org",
            "@type": "Book",
            "name": `Jujutsu Kaisen Chapter ${chapterNumber} Colored`,
            "url": `https://github.com/winston6800/jjk#chapter${chapterNumber}`,
            "author": {
                "@type": "Person",
                "name": "Gege Akutami"
            },
            "genre": "Manga",
            "inLanguage": "en",
            "description": chapter.description,
            "isPartOf": {
                "@type": "BookSeries",
                "name": "Jujutsu Kaisen Colored"
            },
            "numberOfPages": chapter.pageCount,
            "datePublished": chapter.releaseDate
        };
        
        // Remove existing schema
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
            existingSchema.remove();
        }
        
        // Add new schema
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(schema);
        document.head.appendChild(schemaScript);
    }
}

// Initialize the manga reader when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MangaReader();
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('fullscreen');
    }
});
