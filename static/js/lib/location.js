function setLocation(url) {
    const loc = window.location
    window.location.href = `${loc.protocol}//${loc.host}/${
        url === 'index' ? '' : url
    }`
}
