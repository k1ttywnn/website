(async () => {
    // Config: Base URL'leri merkezi tanımlayın.
    window.Config = {
        githubComponents: "https://raw.githubusercontent.com/k1ttywnn/website/main/components",
        githubPages: "https://raw.githubusercontent.com/k1ttywnn/website/main/pages",
        githubPagesAPI: "https://api.github.com/repos/k1ttywnn/website/contents/pages?ref=main",
        githubCSS: "https://raw.githubusercontent.com/k1ttywnn/website/main/css",
        githubScripts: "https://raw.githubusercontent.com/k1ttywnn/website/main/js"
    };

    // Ortak component yükleyici: id ve dosya adı.
    const loadComponent = async (id, file) => {
        try {
            const html = await Core.fetchRemote(Config.githubComponents + "/" + file);
            const tag = id === "header" ? "header" : id === "navbar" ? "nav" : id === "footer" ? "footer" : "div";
            Core.setContent(id, html, tag);
        } catch (e) {
            console.error(`Component yüklenemedi (${id}):`, e);
        }
    };

    // Bileşenler: header, navbar, footer.
    await Promise.all([
        loadComponent("header", "header.html"),
        loadComponent("navbar", "navbar.html"),
        loadComponent("footer", "footer.html")
    ]);

    // URL'ye göre sayfa içeriğini otomatik yükle.
    try {
        const pageHTML = await Router.loadPage();
        Core.setContent("content", pageHTML, "main");
    } catch (e) {
        Core.setContent("content", "<p>404: Sayfa bulunamadı.</p>", "main");
    }

    // CSS yükle.
    try {
        await Core.loadCSS(Config.githubCSS + "/style.css");
    } catch (e) {
        console.error("CSS yüklenemedi:", e);
    }

    // Ek script: örneğin extra.js.
    try {
        await Core.loadScript(Config.githubScripts + "/extra.js");
    } catch (e) {
        console.error("Script yüklenemedi:", e);
    }

    console.log(`Site version ${getVersion()} yüklendi. İyi kodlamalar!`);
})();
