const loadingContent = document.getElementById("loading-content");
const successContent = document.getElementById("success-content");
const doesNotexistContent = document.getElementById("does-not-exist-content");
const usContent = document.getElementById("us-content");
const unexpectedErrorContent = document.getElementById("unexpected-error-content");

const LINKER_URL_BASE = "https://linkerhub.link";

let currentBrowser;
if (typeof browser === "undefined") {
    currentBrowser = chrome;
} else {
    currentBrowser = browser;
}

const onUs = () => {
    loadingContent.hidden = true;
    usContent.hidden = false;
}

const onSuccessFetch = (data) => {
    // Get the elements from success section
    const linkerhubLinkElement = document.getElementById("linker-link");
    const titleElement = document.getElementById("linker-title");
    const descriptionElement = document.getElementById("linker-description");
    const ratingElement = document.getElementById("linker-rating");
    const categoryElement = document.getElementById("linker-category");
    const tagsElement = document.getElementById("linker-tags");
    const readTimeElement = document.getElementById("linker-readtime");
    const dateAddedElement = document.getElementById("linker-date-added");

    // Populate the success content first
    const { rating, title, description, tags, id, category, read_time, created_at } = data;

    const linkerhubLink = `${LINKER_URL_BASE}/links/${id}`;
    linkerhubLinkElement.href = linkerhubLink;

    titleElement.innerText = title;
    titleElement.href = linkerhubLink;

    descriptionElement.innerText = description;

    ratingElement.innerText = rating;

    categoryElement.innerText = category.name;
    categoryElement.href = `${LINKER_URL_BASE}/links/?category=${category.slug}`;

    const tagElements = tags.forEach((tag) => {
        const tagElement = document.createElement("div");
        tagElement.className = "tag";
        tagElement.innerText = tag.name;
        tagsElement.appendChild(tagElement);
    });

    readTimeElement.innerText = read_time;

    dateAddedElement.innerText = created_at;

    // Show the correct section and hide others
    loadingContent.hidden = true;
    successContent.hidden = false;
}

const onDoesNotExist = (location) => {
    const addNewLink = document.getElementById("linker-add-new");

    addNewLink.addEventListener("click", () => {
        currentBrowser.windows.create({
            url: `${LINKER_URL_BASE}/add?link_url=${encodeURIComponent(location)}`,
            width: 600,
            height: 1000,
            top: 0,
            type: "popup",
        })
    })

    loadingContent.hidden = true;
    doesNotexistContent.hidden = false;
}

const onUnexpectedError = () => {
    loadingContent.hidden = true;
    unexpectedErrorContent.hidden = false;
}

const makeRequest = (tabUrl) => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Time out, if request exceeds 5 seconds
    setTimeout(() => controller.abort(), 5000);

    const location = new URL(tabUrl);

    if (location.host.replace("www.", "") === new URL(LINKER_URL_BASE).host) {
        onUs();
        return
    }

    const urlSearchParam = encodeURIComponent(location.host + location.pathname + location.search);
    const url = `${LINKER_URL_BASE}/api/v1/search-by-url/?url=${urlSearchParam}`;

    fetch(url, { signal }).then(async (response) => {
        if (!response.ok) {
            if (response.status === 404) {
                onDoesNotExist(location);
            } else {
                onUnexpectedError()
            }
        } else {
            response.json().then(onSuccessFetch)
        }
    }).catch(onUnexpectedError);
}

const runScript = async () => {
    currentBrowser.tabs.query({ currentWindow: true, active: true })
        .then((tabs) => makeRequest(tabs[0].url));
}

runScript();