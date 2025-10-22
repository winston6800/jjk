# Jujutsu Kaisen Colored Manga Reader

A beautiful, responsive web-based manga reader specifically designed for your colored Jujutsu Kaisen chapters. This system makes it incredibly easy to add new chapters and provides an excellent reading experience.

## Features

- **Multiple Reading Modes**: Single page, double page, and long strip reading
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Navigate with arrow keys and hotkeys
- **Chapter Management**: Easy-to-use chapter selector
- **Customizable Settings**: Adjust reading preferences
- **Fullscreen Mode**: Immersive reading experience
- **Auto-fit Pages**: Automatically scale pages to fit your screen

## Quick Start

1. **Organize Your Files**: Place your colored manga chapters in folders like this:
   ```
   your-project/
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── config.js
   └── colorized/
       ├── jjkchapter1/
       │   ├── 01_colorized.png
       │   ├── 02_colorized.png
       │   └── ...
       ├── jjkchapter2/
       │   ├── 01_colorized.png
       │   └── ...
       └── jjkchapter3/
           ├── 01_colorized.png
           └── ...
   ```

2. **Open the Reader**: Simply open `index.html` in your web browser

3. **Start Reading**: Click on any chapter to begin reading!

## Adding New Chapters

Adding new chapters is super easy! Just follow these steps:

### Step 1: Add Your Chapter Files
Create a new folder for your chapter (e.g., `jjkchapter4`) and add your colorized pages:
```
colorized/
└── jjkchapter4/
    ├── 01_colorized.png
    ├── 02_colorized.png
    ├── 03_colorized.png
    └── ...
```

### Step 2: Update the Configuration
Open `config.js` and add your new chapter to the `chapters` array:

```javascript
chapters: [
    // ... existing chapters ...
    {
        id: "chapter4",
        title: "Chapter 4", 
        folder: "jjkchapter4",
        pageCount: 16,  // Update this with your actual page count
        description: "Your chapter description here",
        releaseDate: "2018-03-26",
        coverImage: "01_colorized.png"
    }
]
```

### Step 3: That's It!
Your new chapter will automatically appear in the chapter selector and be ready to read!

## File Naming Conventions

The system supports different file naming patterns. Update the `fileNaming` section in `config.js`:

### Current Pattern (Recommended)
- Files: `01_colorized.png`, `02_colorized.png`, etc.
- Pattern: `"numbered"`
- This is already configured and works perfectly

### Alternative Patterns
If your files use different naming, you can change the `fileNaming` settings:

```javascript
fileNaming: {
    pattern: "sequential",  // For: 1_colorized.png, 2_colorized.png
    // or
    pattern: "custom",       // For completely custom naming
    prefix: "page_",         // For: page_01_colorized.png
    suffix: "_colorized",    // Your suffix
    extension: ".png"        // File extension
}
```

## Keyboard Shortcuts

- **Arrow Keys**: Navigate pages and chapters
  - `←` / `→`: Previous/Next page
  - `↑` / `↓`: Previous/Next chapter
- **Reading Modes**: 
  - `1`: Single page mode
  - `2`: Double page mode  
  - `3`: Long strip mode
- **UI Controls**:
  - `F`: Toggle fullscreen
  - `S`: Open settings
  - `C`: Open chapter selector
  - `Esc`: Close panels

## Customization

### Reading Settings
Access settings by clicking the gear icon or pressing `S`:

- **Auto-fit**: Automatically scale pages to fit your screen
- **Page Gap**: Adjust spacing between pages
- **Background Color**: Change the background color

### Styling
The CSS is well-organized and easy to customize:

- **Colors**: Update the CSS custom properties in `styles.css`
- **Layout**: Modify the responsive breakpoints
- **Typography**: Change fonts in the `@import` section

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Tips for Best Experience

1. **Image Optimization**: For faster loading, optimize your images (WebP format recommended)
2. **File Organization**: Keep your folder structure consistent
3. **Page Counts**: Always update the `pageCount` in config.js to match your actual pages
4. **Descriptions**: Add meaningful chapter descriptions for better navigation

## Troubleshooting

### Images Not Loading
- Check that your file paths in `config.js` match your actual folder structure
- Ensure image files exist and are accessible
- Check browser console for any error messages

### Chapter Not Appearing
- Verify the chapter is added to the `chapters` array in `config.js`
- Check that the `folder` name matches your actual folder name
- Ensure the `pageCount` is correct

### Performance Issues
- Optimize your images (compress PNG files)
- Consider using WebP format for better compression
- Use lazy loading (already enabled)

## File Structure

```
your-project/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Main application logic
├── config.js           # Chapter configuration
├── README.md           # This file
└── colorized/          # Your manga chapters
    ├── jjkchapter1/
    ├── jjkchapter2/
    └── jjkchapter3/
```

## Support

This manga reader is designed to be simple and maintainable. The code is well-commented and organized, making it easy to customize and extend.

Enjoy reading your colored Jujutsu Kaisen manga! 🎌
