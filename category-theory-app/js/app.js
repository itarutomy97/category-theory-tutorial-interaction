// ===================================
// グローバル変数
// ===================================

let currentLesson = 'intro';

// ===================================
// レッスン切り替え
// ===================================

function nextLesson(lessonId) {
    const lessons = document.querySelectorAll('.lesson');
    lessons.forEach(lesson => lesson.classList.remove('active'));

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));

    const targetLesson = document.getElementById(`lesson-${lessonId}`);
    if (targetLesson) {
        targetLesson.classList.add('active');
        currentLesson = lessonId;

        const targetBtn = document.querySelector(`[data-lesson="${lessonId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // ページトップへスクロール
        const lessonContent = document.querySelector('.lesson-content');
        if (lessonContent) {
            lessonContent.scrollTop = 0;
        }
    }
}

// ===================================
// ナビゲーションボタンのイベント
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lessonId = btn.getAttribute('data-lesson');
            nextLesson(lessonId);
        });
    });

    // 用語のクリックイベント
    setupTermEvents();

    // 用語カードのクリックイベント
    setupTermCardEvents();

    // 初期化
    updateFunctor();
});

// ===================================
// 用語のクリック・ホバーイベント
// ===================================

function setupTermEvents() {
    const terms = document.querySelectorAll('.term');

    terms.forEach(term => {
        // クリックで用語詳細を表示
        term.addEventListener('click', function(e) {
            e.preventDefault();
            const termId = this.getAttribute('data-term');
            showTermDetail(termId);
        });

        // ホバーでツールチップ表示
        term.addEventListener('mouseenter', function(e) {
            const termId = this.getAttribute('data-term');
            showTermTooltip(this, termId);
        });

        term.addEventListener('mouseleave', function() {
            hideTermTooltip();
        });
    });
}

function showTermDetail(termId) {
    const termCard = document.getElementById(`term-${termId}`);
    const currentDetail = document.getElementById('current-term-detail');

    if (termCard && currentDetail) {
        // すべての用語カードのactiveを削除
        document.querySelectorAll('.term-card').forEach(card => {
            card.classList.remove('active');
        });

        // 選択された用語カードをハイライト
        termCard.classList.add('active');

        // 詳細を表示
        const title = termCard.querySelector('h5').textContent;
        const content = termCard.querySelector('p').textContent;
        const example = termCard.querySelector('.example-text');

        currentDetail.innerHTML = `
            <strong>${title}</strong><br/>
            ${content}
            ${example ? `<br/><em>${example.textContent}</em>` : ''}
        `;
        currentDetail.classList.add('highlight');

        // サイドバーにスクロール
        termCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            currentDetail.classList.remove('highlight');
        }, 500);
    }
}

function showTermTooltip(element, termId) {
    const tooltips = {
        'category-theory': '関係の関係の関係を扱う数学',
        'category': '対象と射の集まり',
        'object': '圏を構成する「物」',
        'morphism': '対象を繋ぐ「矢印」',
        'composition': '射を繋げること',
        'functor': '圏から圏への写像',
        'natural-transformation': '関手から関手への自然な対応',
        'naturality': 'どの順序でも同じ結果になる性質',
        'limit': '最も普遍的な頂点（最大公約数的）',
        'string-diagram': '射を線で表す図式'
    };

    const text = tooltips[termId];
    if (!text) return;

    hideTermTooltip();

    const tooltip = document.createElement('div');
    tooltip.id = 'term-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 0.85em;
        max-width: 250px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;
    tooltip.textContent = text;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + window.scrollY + 'px';
}

function hideTermTooltip() {
    const tooltip = document.getElementById('term-tooltip');
    if (tooltip) tooltip.remove();
}

// ===================================
// 用語カードのクリックイベント
// ===================================

function setupTermCardEvents() {
    const termCards = document.querySelectorAll('.term-card');

    termCards.forEach(card => {
        card.addEventListener('click', function() {
            // すべてのactiveを削除
            termCards.forEach(c => c.classList.remove('active'));

            // クリックされたカードをactive
            this.classList.add('active');

            // 詳細を現在学習中エリアに表示
            const currentDetail = document.getElementById('current-term-detail');
            const title = this.querySelector('h5').textContent;
            const paragraphs = Array.from(this.querySelectorAll('p'));
            const content = paragraphs.map(p => p.textContent).join('<br/><br/>');

            currentDetail.innerHTML = `
                <strong>${title}</strong><br/><br/>
                ${content}
            `;
            currentDetail.classList.add('highlight');

            setTimeout(() => {
                currentDetail.classList.remove('highlight');
            }, 500);
        });
    });
}

// ===================================
// クイズ機能
// ===================================

function checkAnswer(answer) {
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.classList.add('show');

    if (answer === true) {
        resultDiv.classList.remove('incorrect');
        resultDiv.classList.add('correct');
        resultDiv.innerHTML = `
            <strong>✓ 正解！</strong> チーズ→ソースでも、ソース→チーズでも「デミグラスチーズハンバーグ」になります。
            これが圏の「可換性」です。
        `;
    } else {
        resultDiv.classList.remove('correct');
        resultDiv.classList.add('incorrect');
        resultDiv.innerHTML = `
            <strong>✗ もう一度考えてみましょう</strong><br/>
            実は、どちらの順序でも同じ結果になります。これが圏論の重要な性質です。
        `;
    }
}

// ===================================
// 関手のインタラクティブ機能
// ===================================

function updateFunctor() {
    const dishSelect = document.getElementById('dish-select');
    const setSelect = document.getElementById('set-select');
    const resultText = document.getElementById('result-text');

    if (!dishSelect || !setSelect || !resultText) return;

    const dish = dishSelect.value;
    const set = setSelect.value;

    const dishNames = {
        'hamburger': 'ハンバーグ',
        'cheese': 'チーズハンバーグ',
        'demi': 'デミハンバーグ'
    };

    const setNames = {
        'rice': 'ライス定食 🍚',
        'bread': 'パン定食 🍞',
        'salad': 'サラダ定食 🥗'
    };

    const dishName = dishNames[dish] || 'ハンバーグ';
    const setName = setNames[set] || 'ライス定食';

    resultText.textContent = `${dishName}${setName}`;

    const resultBox = document.getElementById('functor-result');
    if (resultBox) {
        resultBox.style.animation = 'none';
        setTimeout(() => {
            resultBox.style.animation = 'fadeIn 0.4s ease';
        }, 10);
    }
}

// ===================================
// SVG要素のインタラクティブ機能
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const objects = document.querySelectorAll('.object');

    objects.forEach(obj => {
        obj.addEventListener('mouseenter', function() {
            const id = this.getAttribute('id');
            showSVGTooltip(id, this);
        });

        obj.addEventListener('mouseleave', function() {
            hideSVGTooltip();
        });
    });

    const companyNodes = document.querySelectorAll('.company-node');

    companyNodes.forEach(node => {
        node.addEventListener('click', function() {
            highlightNode(this);
        });
    });
});

function showSVGTooltip(id, element) {
    const tooltips = {
        'hamburger': '基本のハンバーグ - すべての起点',
        'cheese-hamburger': 'チーズハンバーグ - 「+チーズ」の射を適用',
        'demi-hamburger': 'デミグラスハンバーグ - 「+ソース」の射を適用',
        'demi-cheese-hamburger': 'デミチーズ - 2つの射を合成した結果'
    };

    const message = tooltips[id];
    if (!message) return;

    hideSVGTooltip();

    const tooltip = document.createElement('div');
    tooltip.id = 'svg-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 0.9em;
        max-width: 300px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;
    tooltip.textContent = message;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideSVGTooltip() {
    const tooltip = document.getElementById('svg-tooltip');
    if (tooltip) tooltip.remove();
}

function highlightNode(node) {
    const allNodes = document.querySelectorAll('.company-node');
    allNodes.forEach(n => {
        n.style.strokeWidth = '2';
    });

    node.style.strokeWidth = '4';
}

// ===================================
// キーボードショートカット
// ===================================

document.addEventListener('keydown', (e) => {
    const lessons = ['intro', 'category', 'functor', 'natural', 'practice'];
    const currentIndex = lessons.indexOf(currentLesson);

    if (e.key === 'ArrowRight' && currentIndex < lessons.length - 1) {
        nextLesson(lessons[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        nextLesson(lessons[currentIndex - 1]);
    }
});

// ===================================
// デバッグ用関数
// ===================================

function debugInfo() {
    console.log('=== Category Theory App Debug Info ===');
    console.log('Current Lesson:', currentLesson);
    console.log('======================================');
}

window.debugInfo = debugInfo;

// ===================================
// 初期化完了メッセージ
// ===================================

console.log('🍔 圏論学習アプリ（コンパクト版）が読み込まれました！');
console.log('💡 ヒント: 左右の矢印キーでレッスン移動、用語をクリックで詳細表示');
