// Manga Configuration
// This file contains all the metadata for your manga chapters
// To add a new chapter, simply add a new entry to the chapters array

const CHAPTER_PAGE_COUNTS = [
    58,
    26,
    23,
    20,
    20,
    19,
    21,
    25,
    20,
    20,
    20,
    20,
    19,
    19,
    18,
    25,
    26,
    20,
    20,
    20,
    20,
    20,
    21,
    20,
    24,
    25,
    19,
    22,
    19,
    19,
    21,
    21,
    19,
    22,
    25,
    20,
    21,
    19,
    21,
    20,
    20,
    20,
    20,
    25,
    19,
    22,
    18,
    19,
    22,
    19,
    20,
    17,
    25,
    20,
    20,
    22,
    20,
    20,
    20,
    18,
    17,
    25,
    22,
    20,
    22,
    20,
    20,
    18,
    19,
    19,
    24,
    19,
    19,
    19,
    19,
    20,
    22,
    20,
    22,
    24,
    17,
    19,
    19,
    17,
    22,
    20,
    18,
    21,
    24,
    21,
    20,
    20,
    19,
    20,
    20,
    20,
    20,
    26,
    19,
    22,
    18,
    22,
    20,
    19,
    20,
    21,
    27,
    17,
    20,
    19,
    22,
    20,
    19,
    19,
    18,
    23,
    20,
    18,
    16,
    18,
    19,
    20,
    23,
    18,
    25,
    18,
    22,
    17,
    18,
    16,
    16,
    17,
    19,
    25,
    17,
    19,
    21,
    20,
    19,
    20,
    20,
    22,
    25,
    0,
    20,
    20,
    20,
    19,
    19,
    22,
    17,
    9,
    25,
    20,
    20,
    20,
    20,
    20,
    19,
    17,
    21,
    26,
    19,
    19,
    20,
    20,
    19,
    22,
    19,
    19,
    18,
    25,
    20,
    19,
    20,
    18,
    18,
    18,
    16,
    22,
    29,
    19,
    18,
    19,
    18,
    18,
    18,
    17,
    19,
    22,
    25,
    18,
    17,
    20,
    20,
    18,
    17,
    19,
    24,
    26,
    19,
    18,
    19,
    19,
    17,
    20,
    20,
    23,
    20,
    19,
    20,
    20,
    16,
    18,
    19,
    19,
    18,
    20,
    20,
    20,
    19,
    20,
    18,
    20,
    18,
    18,
    21,
    19,
    18,
    19,
    19,
    19,
    19,
    19,
    19,
    18,
    20,
    18,
    19,
    21,
    20,
    19,
    17,
    19,
    19,
    20,
    19,
    18,
    18,
    19,
    18,
    18,
    21,
    19,
    19,
    19,
    19,
    14,
    17,
    17,
    16,
    10,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    21
];

const MANGA_CONFIG = {
    title: "Jujutsu Kaisen",
    subtitle: "Colored Manga Reader",
    author: "Gege Akutami",
    description: "The first ever colored version of Jujutsu Kaisen manga",
    
    // Chapter configuration
    chapters: CHAPTER_PAGE_COUNTS.map((pageCount, index) => ({
        id: "chapter" + (index + 1),
        title: "Chapter " + (index + 1),
        folder: "https://pub-64c9aaca3834482ab2167dbf51a3b33b.r2.dev/colorizedjjk/chapter " + (index + 1),
        pageCount,
        coverImage: "01_colorized.webp"
    })),
    
    // Reading settings
    defaultSettings: {
        readingMode: "singlePage", // Default to single page mode
        autoFit: true,
        pageGap: 10,
        backgroundColor: "#1a1a1a",
        showControls: true
    },
    
    // File naming conventions
    fileNaming: {
        // How your files are named
        // Options: "numbered" (01_colorized.png), "sequential" (1_colorized.png), "custom"
        pattern: "numbered",
        prefix: "", // e.g., "page_" for page_01_colorized.png
        suffix: "_colorized", // e.g., "_colorized" for 01_colorized.png
        extension: ".webp"
    }
};

// Helper function to get chapter by ID
function getChapterById(id) {
    return MANGA_CONFIG.chapters.find(chapter => chapter.id === id);
}

// Helper function to get chapter index
function getChapterIndex(id) {
    return MANGA_CONFIG.chapters.findIndex(chapter => chapter.id === id);
}

// Helper function to get next chapter
function getNextChapter(currentId) {
    const currentIndex = getChapterIndex(currentId);
    if (currentIndex < MANGA_CONFIG.chapters.length - 1) {
        return MANGA_CONFIG.chapters[currentIndex + 1];
    }
    return null;
}

// Helper function to get previous chapter
function getPreviousChapter(currentId) {
    const currentIndex = getChapterIndex(currentId);
    if (currentIndex > 0) {
        return MANGA_CONFIG.chapters[currentIndex - 1];
    }
    return null;
}

// Helper function to generate page filename
function generatePageFilename(chapter, pageNumber) {
    const config = MANGA_CONFIG.fileNaming;
    let filename = "";
    
    if (config.prefix) {
        filename += config.prefix;
    }
    
    // Add page number with appropriate padding
    if (config.pattern === "numbered") {
        filename += pageNumber.toString().padStart(2, "0");
    } else if (config.pattern === "sequential") {
        filename += pageNumber.toString();
    }
    
    if (config.suffix) {
        filename += config.suffix;
    }
    
    filename += config.extension;
    
    return filename;
}

// Helper function to get all page filenames for a chapter
function getChapterPages(chapter) {
    const pages = [];
    for (let i = 1; i <= chapter.pageCount; i++) {
        const filename = generatePageFilename(chapter, i);
        pages.push({
            number: i,
            filename,
            path: chapter.folder + "/" + filename
        });
    }
    return pages;
}
