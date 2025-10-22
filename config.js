// Manga Configuration
// This file contains all the metadata for your manga chapters
// To add a new chapter, simply add a new entry to the chapters array

const MANGA_CONFIG = {
    title: "Jujutsu Kaisen",
    subtitle: "Colored Manga Reader",
    author: "Gege Akutami",
    description: "The first ever colored version of Jujutsu Kaisen manga",
    
    // Chapter configuration
    chapters: [
        {
            id: "chapter1",
            title: "Chapter 1",
            folder: "colorizedjjk/jjkchapter1",
            pageCount: 58,
            description: "The beginning of Yuji Itadori's journey",
            releaseDate: "2018-03-05",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter2", 
            title: "Chapter 2",
            folder: "colorizedjjk/jjkchapter2",
            pageCount: 26,
            description: "Meeting the Jujutsu High students",
            releaseDate: "2018-03-12",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter3",
            title: "Chapter 3", 
            folder: "colorizedjjk/jjkchapter3",
            pageCount: 23,
            description: "The first mission at the school",
            releaseDate: "2018-03-19",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter4",
            title: "Chapter 4",
            folder: "colorizedjjk/jjkchapter4", 
            pageCount: 20,
            description: "The cursed spirit investigation",
            releaseDate: "2018-03-26",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter5",
            title: "Chapter 5",
            folder: "colorizedjjk/jjkchapter5", 
            pageCount: 20,
            description: "The battle begins",
            releaseDate: "2018-04-02",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter6",
            title: "Chapter 6",
            folder: "colorizedjjk/jjkchapter6", 
            pageCount: 17,
            description: "The aftermath",
            releaseDate: "2018-04-09",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter7",
            title: "Chapter 7",
            folder: "colorizedjjk/jjkchapter7", 
            pageCount: 21,
            description: "New challenges arise",
            releaseDate: "2018-04-16",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter8",
            title: "Chapter 8",
            folder: "colorizedjjk/jjkchapter8", 
            pageCount: 25,
            description: "The training begins",
            releaseDate: "2018-04-23",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter9",
            title: "Chapter 9",
            folder: "colorizedjjk/jjkchapter9", 
            pageCount: 20,
            description: "Learning new techniques",
            releaseDate: "2018-04-30",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter10",
            title: "Chapter 10",
            folder: "colorizedjjk/jjkchapter10", 
            pageCount: 20,
            description: "The mission continues",
            releaseDate: "2018-05-07",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter11",
            title: "Chapter 11",
            folder: "colorizedjjk/jjkchapter11", 
            pageCount: 20,
            description: "Facing stronger enemies",
            releaseDate: "2018-05-14",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter12",
            title: "Chapter 12",
            folder: "colorizedjjk/jjkchapter12", 
            pageCount: 20,
            description: "The stakes get higher",
            releaseDate: "2018-05-21",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter13",
            title: "Chapter 13",
            folder: "colorizedjjk/jjkchapter13", 
            pageCount: 19,
            description: "A new threat emerges",
            releaseDate: "2018-05-28",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter14",
            title: "Chapter 14",
            folder: "colorizedjjk/jjkchapter14", 
            pageCount: 19,
            description: "The battle intensifies",
            releaseDate: "2018-06-04",
            coverImage: "01_colorized.png"
        },
        {
            id: "chapter15",
            title: "Chapter 15",
            folder: "colorizedjjk/jjkchapter15", 
            pageCount: 18,
            description: "The conclusion of the arc",
            releaseDate: "2018-06-11",
            coverImage: "01_colorized.png"
        }
    ],
    
    // Reading settings
    defaultSettings: {
        readingMode: "single", // "single", "double", "longStrip"
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
        extension: ".png"
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
        filename += pageNumber.toString().padStart(2, '0');
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
        pages.push({
            number: i,
            filename: generatePageFilename(chapter, i),
            path: `${chapter.folder}/${generatePageFilename(chapter, i)}`
        });
    }
    return pages;
}
