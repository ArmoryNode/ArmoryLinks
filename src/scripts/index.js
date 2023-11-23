(() => {
    const localStorageKey = "dark-theme-enabled";

    const darkThemeEnabled = function() {
        return localStorage.getItem(localStorageKey) === "true";
    };
    
    function appendFooterCopyrightNotice() {
        const footer = document.querySelector('footer');
        footer.innerText = `© ${new Date().getFullYear()} ArmoryNode`;
    }

    function init() {
        const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        let localStorageEntry = localStorage.getItem(localStorageKey);

        // Initialize the theme to the user's color scheme if the local storage key isn't present
        if (localStorageEntry === null) {
            const prefersColorSchemeDark = colorSchemeQuery.matches;
            localStorage.setItem(localStorageKey, prefersColorSchemeDark);
            localStorageEntry = prefersColorSchemeDark;
        }

        setDarkThemeOnBody(darkThemeEnabled());

        // Bind event handlers
        colorSchemeQuery.addEventListener("change", onColorSchemeChanged);
        document.getElementById("themeToggle").addEventListener("click", toggleDarkTheme);
        document.getElementById("profile").addEventListener("click", replayAnimation)
    }

    /**
     * @param {MediaQueryListEvent} mediaQueryListEvent
     */
    function onColorSchemeChanged(mediaQueryListEvent) {
        const enableDarkTheme = mediaQueryListEvent.matches;
        localStorage.setItem(localStorageKey, enableDarkTheme);
        setDarkThemeOnBody();
    }

    function toggleDarkTheme() {
        const enableDarkTheme = localStorage.getItem(localStorageKey) === "true";
        localStorage.setItem(localStorageKey, !enableDarkTheme);
        setDarkThemeOnBody();
    }

    function replayAnimation() {
        document.querySelectorAll('.nav-link').forEach(element => {
            for (const animation of element.getAnimations()) {
                animation.cancel();
                animation.play();
            }
        });
    }

    /**
     * Add or remove the "dark" class on the body if the dark theme is enabled
     */
    function setDarkThemeOnBody() {
        darkThemeEnabled() ? document.body.classList.add("dark") : document.body.classList.remove("dark");
    }

    init();
    appendFooterCopyrightNotice();
})();

