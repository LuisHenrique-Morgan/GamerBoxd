class GameService {
    constructor() {
        this.storageKey = 'gamerboxd_games';
        this.lastIdKey = 'gamerboxd_lastId';
    }

    getGames() {
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return Array.isArray(data) ? data : [];
    }

    saveGames(games) {
        localStorage.setItem(this.storageKey, JSON.stringify(games));
    }

    getLastId() {
        return parseInt(localStorage.getItem(this.lastIdKey) || '0', 10);
    }

    updateLastId(id) {
        localStorage.setItem(this.lastIdKey, id.toString());
    }

    addGame(game) {
        if (!game || !game.name) {
            return { success: false, message: 'Nome do jogo é obrigatório' };
        }

        const games = this.getGames();
        const exists = games.some(g => 
            (g.name || '').toLowerCase() === (game.name || '').toLowerCase()
        );

        if (exists) {
            return { success: false, message: 'Jogo já cadastrado' };
        }

        const nextId = this.getLastId() + 1;
        game.id = nextId;
        game.dateAdded = new Date().toISOString();
        
        games.push(game);
        this.saveGames(games);
        this.updateLastId(nextId);

        return { success: true, message: 'Jogo salvo com sucesso!' };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const service = new GameService();
    const form = document.getElementById('game-form');
    const nameEl = document.getElementById('game-name');
    const dateEl = document.getElementById('release-date');
    const devEl = document.getElementById('developer');
    const ratingEl = document.getElementById('rating');
    const descEl = document.getElementById('description');
    const scoreEl = document.getElementById('personal-score');
    const imageEl = document.getElementById('image-url');
    const preview = document.getElementById('preview');
    const noImage = document.getElementById('no-image-text');
    const backBtn = document.getElementById('backbutton');
    const toast = document.getElementById('toast');
    const toastTitle = toast ? toast.querySelector('.toast-title') : null;
    const toastMessage = toast ? toast.querySelector('.toast-message') : null;
    const closeToast = document.getElementById('closeToast');

    function showToast(message, title = '', type = 'info') {
        if (!toast) return;
        
        toast.className = '';
        toast.classList.add(type);
        
        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;
        
        toast.classList.add('show');
        setTimeout(hideToast, 6000);
    }

    function hideToast() {
        if (!toast) return;
        toast.classList.remove('show');
    }

    if (closeToast) {
        closeToast.addEventListener('click', hideToast);
    }

    if (imageEl) {
        imageEl.addEventListener('input', () => {
            const url = imageEl.value.trim();
            
            if (!url) {
                preview.style.display = 'none';
                noImage.style.display = 'block';
                preview.src = '#';
                return;
            }

            preview.style.display = 'none';
            noImage.style.display = 'block';
            preview.src = url;

            preview.onload = () => {
                preview.style.display = 'block';
                noImage.style.display = 'none';
            };

            preview.onerror = () => {
                preview.style.display = 'none';
                noImage.style.display = 'block';
                noImage.textContent = 'Erro ao carregar imagem';
            };
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const newGame = {
                name: (nameEl && nameEl.value.trim()) || '',
                releaseDate: (dateEl && dateEl.value) || '',
                developer: (devEl && devEl.value.trim()) || '',
                rating: (ratingEl && ratingEl.value.trim()) || '',
                description: (descEl && descEl.value.trim()) || '',
                personalScore: (scoreEl && scoreEl.value) ? parseFloat(scoreEl.value) : null,
                image: (imageEl && imageEl.value.trim()) || ''
            };

            if (!newGame.name) {
                showToast('Nome do jogo é obrigatório', 'Erro', 'error');
                nameEl.focus();
                return;
            }

            if (!newGame.releaseDate) {
                showToast('Informe a data de lançamento', 'Erro', 'error');
                dateEl.focus();
                return;
            }

            if (!newGame.developer) {
                showToast('Informe a empresa desenvolvedora', 'Erro', 'error');
                devEl.focus();
                return;
            }

            if (!newGame.rating) {
                showToast('Informe a classificação', 'Erro', 'error');
                ratingEl.focus();
                return;
            }

            if (!newGame.description) {
                showToast('Informe a descrição do jogo', 'Erro', 'error');
                descEl.focus();
                return;
            }

            if (!newGame.image) {
                showToast('Informe a URL da imagem', 'Erro', 'error');
                imageEl.focus();
                return;
            }

            const result = service.addGame(newGame);

            if (result.success) {
                showToast(result.message, 'Sucesso', 'success');
                form.reset();
                preview.src = '#';
                preview.style.display = 'none';
                noImage.style.display = 'block';
                noImage.textContent = 'Nenhuma imagem selecionada';
                
                setTimeout(() => {
                    window.location.href = 'search.html';
                }, 2000);
            } else {
                showToast(result.message, 'Erro', 'error');
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (document.referrer) {
                window.history.back();
            } else {
                window.location.href = 'search.html';
            }
        });
    }
});