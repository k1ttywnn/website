const Core = (() => {
    // Fetch wrapper: HTTP hata durumunda fırlatır.
    const fetchRemote = async url => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
        return res.text();
    };

    // Container yoksa oluşturur, varsa getirir.
    const createContainer = (id, tag = "div") => {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement(tag);
            el.id = id;
            document.body.appendChild(el);
        }
        return el;
    };

    // İçeriği container'a yerleştirir.
    const setContent = (id, html, tag = "div") => {
        createContainer(id, tag).innerHTML = html;
    };

    // CSS metnini <style> olarak enjekte eder.
    const injectCSS = cssText => {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.appendChild(style);
    };

    const loadCSS = async url => {
        const cssText = await fetchRemote(url);
        injectCSS(cssText);
    };

    // Script yükleyici (asenkron).
    const loadScript = url => new Promise((res, rej) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = () => res(url);
        script.onerror = () => rej(new Error(`Script load error: ${url}`));
        document.body.appendChild(script);
    });

    return { fetchRemote, createContainer, setContent, injectCSS, loadCSS, loadScript };
})();
