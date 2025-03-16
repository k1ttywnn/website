const Router = (() => {
    let pagesMapping = null;

    // GitHub API'den pages klasöründeki dosya listesini çek.
    const loadPagesMapping = async () => {
        if (pagesMapping) return pagesMapping;
        const jsonText = await Core.fetchRemote(Config.githubPagesAPI);
        const data = JSON.parse(jsonText);
        // Dosya adlarını .html uzantısı olmadan eşle.
        pagesMapping = data.reduce((acc, file) => {
            const pageName = file.name.replace(/\.html$/i, "");
            acc[pageName] = file.download_url;
            return acc;
        }, {});
        return pagesMapping;
    };

    // URL'den sayfa adını çıkarır; boşsa "home".
    const getPageName = () => {
        const path = window.location.pathname.replace(/^\/|\/$/g, "");
        return path || "home";
    };

    // İlgili sayfa dosyasını GitHub'dan yükler.
    const loadPage = async () => {
        const mapping = await loadPagesMapping();
        const page = getPageName();
        const url = mapping[page];
        if (!url) throw new Error(`Sayfa bulunamadı: ${page}`);
        return await Core.fetchRemote(url);
    };

    return { getPageName, loadPage };
})();
