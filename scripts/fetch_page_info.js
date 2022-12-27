browser.runtime.onInstalled.addListener(() => {
    fetch("https://linkerhub.link/api/v1/search-by-url/?url=uxdesign.cc/have-we-lost-the-plot-on-designing-delights-4964beaea8b7", {"method": "GET"}).then(res => console.log(res)).catch(err => console.error(err))
  });