$(document).ready(function() {
    const query = window.location.search.substring(1);
    let carousel = $('.carousel');

    carousel.carousel({
        interval: 20000
    })

    if (query.startsWith('page=')) {
        let page = parseInt(query.substr(5));
        carousel.carousel(page);
        carousel.carousel('pause');
    }
});