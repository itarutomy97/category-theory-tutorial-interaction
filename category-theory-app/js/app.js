// ===================================
// グローバル変数
// ===================================

let currentLesson = 'intro';

// ===================================
// レッスン切り替え
// ===================================

function nextLesson(lessonId) {
    // すべてのレッスンを非表示
    const lessons = document.querySelectorAll('.lesson');
    lessons.forEach(lesson => {
        lesson.classList.remove('active');
    });

    // すべてのナビボタンの active を削除
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // 指定されたレッスンを表示
    const targetLesson = document.getElementById(`lesson-${lessonId}`);
    if (targetLesson) {
        targetLesson.classList.add('active');
        currentLesson = lessonId;

        // 対応するナビボタンをアクティブに
        const targetBtn = document.querySelector(`[data-lesson="${lessonId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // ページトップへスクロール
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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

    // 初期化
    updateFunctor();
});

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
            <h4>🎉 正解！</h4>
            <p>その通りです！チーズを乗せてからソースをかけても、ソースをかけてからチーズを乗せても、
            デミグラスチーズハンバーグになります。これが圏における「合成」の可換性です。</p>
            <p>見た目は少し違うかもしれませんが、圏論的には同じ対象として扱えます。</p>
        `;
    } else {
        resultDiv.classList.remove('correct');
        resultDiv.classList.add('incorrect');
        resultDiv.innerHTML = `
            <h4>🤔 もう一度考えてみましょう</h4>
            <p>実は、どちらの順序でも「デミグラスチーズハンバーグ」という同じ結果になります。</p>
            <p>これは圏論の重要な性質で、異なる経路（射の合成）でも同じ対象に到達できることを示しています。</p>
        `;
    }

    // 3秒後にアニメーション
    setTimeout(() => {
        resultDiv.style.animation = 'pulse 0.5s ease';
    }, 100);
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

    // 料理名のマッピング
    const dishNames = {
        'hamburger': 'ハンバーグ',
        'cheese': 'チーズハンバーグ',
        'demi': 'デミグラスハンバーグ'
    };

    // セット名のマッピング
    const setNames = {
        'rice': 'ライス定食 🍚',
        'bread': 'パン定食 🍞',
        'salad': 'サラダ定食 🥗'
    };

    const dishName = dishNames[dish] || 'ハンバーグ';
    const setName = setNames[set] || 'ライス定食';

    resultText.textContent = `${dishName}${setName}`;

    // アニメーション効果
    const resultBox = document.getElementById('functor-result');
    if (resultBox) {
        resultBox.style.animation = 'none';
        setTimeout(() => {
            resultBox.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
}

// ===================================
// SVG要素のインタラクティブ機能
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // ハンバーグ圏のSVG要素にツールチップを追加
    const objects = document.querySelectorAll('.object');

    objects.forEach(obj => {
        obj.addEventListener('mouseenter', function() {
            const id = this.getAttribute('id');
            showTooltip(id, this);
        });

        obj.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });

    // 会社組織図のSVG要素
    const companyNodes = document.querySelectorAll('.company-node');

    companyNodes.forEach(node => {
        node.addEventListener('click', function() {
            highlightNode(this);
        });
    });
});

// ツールチップ表示
function showTooltip(id, element) {
    const tooltips = {
        'hamburger': '基本のハンバーグ - すべてのハンバーグの起点となる対象です',
        'cheese-hamburger': 'チーズハンバーグ - ハンバーグに「チーズを乗せる」という射を適用した結果',
        'demi-hamburger': 'デミグラスハンバーグ - ハンバーグに「ソースをかける」という射を適用した結果',
        'demi-cheese-hamburger': 'デミグラスチーズハンバーグ - 2つの射を合成した結果'
    };

    const message = tooltips[id];
    if (!message) return;

    // 既存のツールチップを削除
    hideTooltip();

    // 新しいツールチップを作成
    const tooltip = document.createElement('div');
    tooltip.id = 'svg-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '10px 15px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '14px';
    tooltip.style.maxWidth = '300px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    tooltip.textContent = message;

    document.body.appendChild(tooltip);

    // 位置を設定
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + window.scrollY + 'px';
}

// ツールチップ非表示
function hideTooltip() {
    const tooltip = document.getElementById('svg-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ノードのハイライト
function highlightNode(node) {
    // すべてのノードのストロークをリセット
    const allNodes = document.querySelectorAll('.company-node');
    allNodes.forEach(n => {
        n.style.strokeWidth = '2';
    });

    // クリックされたノードをハイライト
    node.style.strokeWidth = '4';
    node.style.animation = 'pulse 0.5s ease';
}

// ===================================
// 学習進捗の追跡
// ===================================

let lessonProgress = {
    intro: false,
    category: false,
    functor: false,
    natural: false,
    practice: false
};

function markLessonComplete(lessonId) {
    lessonProgress[lessonId] = true;
    updateProgress();

    // ローカルストレージに保存
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('categoryTheoryProgress', JSON.stringify(lessonProgress));
    }
}

function updateProgress() {
    const completedCount = Object.values(lessonProgress).filter(v => v).length;
    const totalCount = Object.keys(lessonProgress).length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    console.log(`学習進捗: ${completedCount}/${totalCount} (${percentage}%)`);
}

// ページ読み込み時に進捗を復元
document.addEventListener('DOMContentLoaded', () => {
    if (typeof(Storage) !== "undefined") {
        const saved = localStorage.getItem('categoryTheoryProgress');
        if (saved) {
            lessonProgress = JSON.parse(saved);
            updateProgress();
        }
    }
});

// ===================================
// ストリング図式のアニメーション
// ===================================

function animateStringDiagram() {
    const elements = document.querySelectorAll('.carbonara-diagram .ingredient, .carbonara-diagram .arrow, .carbonara-diagram .result');

    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// イントロレッスンが表示されたときにアニメーション開始
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        animateStringDiagram();
    }, 500);
});

// ===================================
// コンセプトカードのインタラクション
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const conceptCards = document.querySelectorAll('.concept-card');

    conceptCards.forEach(card => {
        card.addEventListener('click', function() {
            // カードの内容に応じてアラートを表示
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;

            // より詳細な説明
            const details = {
                '1. 圏（けん）': 'objects（対象）とmorphisms（射）の集まりです。ハンバーグメニューのように、物と物の関係を表現します。',
                '2. 関手（かんしゅ）': '2つの圏の間の構造を保つ写像です。ライスセットのように、圏全体を別の圏に移します。',
                '3. 自然変換': '2つの関手の間の「自然な」対応です。ライスからパンへの変更のように、関係性を保ったまま変換します。'
            };

            const detail = details[title];
            if (detail) {
                // カードをハイライト
                conceptCards.forEach(c => c.style.transform = '');
                this.style.transform = 'scale(1.05)';

                console.log(`${title}: ${detail}`);
            }
        });
    });
});

// ===================================
// アプリケーションカードのインタラクション
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const appCards = document.querySelectorAll('.app-card');

    appCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const applications = {
                '数学': '圏論は抽象代数学、位相幾何学、ホモロジー代数などで重要な役割を果たします。',
                'プログラミング': 'Haskellなどの関数型言語では、モナドなど圏論の概念が直接使われています。',
                'AI・機械学習': 'ニューラルネットワークの構造や学習過程を圏論的に記述する研究が進んでいます。',
                '認知科学': '人間がどのように概念を同一視するか、圏論を使って研究されています。',
                '物理学': '量子力学や場の理論で、圏論的な構造が発見されています。',
                '社会科学': 'ネットワーク理論や組織論で、圏論的な視点が応用されています。'
            };

            console.log(`${title}での応用: ${applications[title]}`);
        });
    });
});

// ===================================
// キーボードショートカット
// ===================================

document.addEventListener('keydown', (e) => {
    // 矢印キーでレッスンを移動
    const lessons = ['intro', 'category', 'functor', 'natural', 'practice'];
    const currentIndex = lessons.indexOf(currentLesson);

    if (e.key === 'ArrowRight' && currentIndex < lessons.length - 1) {
        nextLesson(lessons[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        nextLesson(lessons[currentIndex - 1]);
    }
});

// ===================================
// パフォーマンス最適化
// ===================================

// Intersection Observer でレイジーロード
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // 観察対象の要素
    document.addEventListener('DOMContentLoaded', () => {
        const animateElements = document.querySelectorAll('.example-box, .concept-card, .app-card');
        animateElements.forEach(el => observer.observe(el));
    });
}

// ===================================
// デバッグ用関数
// ===================================

function debugInfo() {
    console.log('=== Category Theory App Debug Info ===');
    console.log('Current Lesson:', currentLesson);
    console.log('Progress:', lessonProgress);
    console.log('======================================');
}

// グローバルスコープに公開
window.debugInfo = debugInfo;

// ===================================
// エクスポート（モジュール使用時）
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        nextLesson,
        checkAnswer,
        updateFunctor,
        markLessonComplete,
        lessonProgress
    };
}

// ===================================
// 初期化完了メッセージ
// ===================================

console.log('🍔 圏論学習アプリが読み込まれました！');
console.log('💡 ヒント: 左右の矢印キーでレッスンを移動できます');
console.log('🔧 デバッグ情報を見るには debugInfo() を実行してください');
