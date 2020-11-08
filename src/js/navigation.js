$(document).ready(function() {
    const query = window.location.search.substring(1);
    let carousel = $('.carousel');
    let carouselItems = document.getElementById('carousel-inner');

    carousel.carousel({
        interval: 20000
    })

    if (query.startsWith('page=')) {
        let page = parseInt(query.substr(5));
        carouselItems.children[page].className += " active";
        carousel.carousel('pause');
    }
});