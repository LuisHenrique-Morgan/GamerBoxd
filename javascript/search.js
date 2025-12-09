const searchInput = document.getElementById('search');
const gameList = document.getElementById('gameList');
const noResults = document.getElementById('noResults');
const items = gameList.querySelectorAll('.item');

searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    items.forEach(item => {
        const title = item.getAttribute('data-title').toLowerCase();
        const content = item.textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        noResults.style.display = 'block';
        gameList.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        gameList.style.display = 'grid';
    }
});