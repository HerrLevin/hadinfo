$(document).ready(function() {
    const query = window.location.search.substring(1);
    let carousel = $('.carousel');
    if (query.startsWith('page=')) {
        let page = parseInt(query.substr(5));
        carousel.carousel(page);
        carousel.carousel('pause');
    }



});