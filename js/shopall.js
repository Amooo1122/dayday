function getQueryParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

$(document).ready(function () {
    let currentCategory = null;
    let currentSubCategory = null;
    let currentSort = '';

    // ⬇️ 讀取網址參數
    let urlCategory = getQueryParam('category');
    if (urlCategory) {
        currentCategory = urlCategory;

        // 主分類加上 active
        $('.main-category').each(function () {
            if ($(this).data('filter') === currentCategory) {
                $(this).addClass('active');
            }
        });

        // 自動展開對應的 details（如果有）
        $('details').each(function () {
            const summaryText = $(this).find('summary').text().trim();
            if (summaryText === currentCategory) {
                $(this).prop('open', true);
            }
        });
    }

    function filterAndSortProducts() {
        let $cards = $('.product-card');

        $cards.each(function () {
            const category = $(this).data('category');
            const subcategory = $(this).data('subcategory');

            const matchCategory = !currentCategory || category.split(',').includes(currentCategory);
            const matchSub = !currentSubCategory || subcategory === currentSubCategory;

            if (matchCategory && matchSub) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        // 商品數量更新
        let visibleCount = $('.product-card:visible').length;
        $('.product-count').text(`共 ${String(visibleCount).padStart(2, '0')} 項商品`);

        // 排序（若選擇了排序條件才執行）
        let $grid = $('.product-grid');
        $cards = $grid.children('.product-card:visible'); // 只排序顯示中的

        if (currentSort === 'low-to-high') {
            $cards = $cards.sort((a, b) => $(a).data('price') - $(b).data('price'));
        } else if (currentSort === 'high-to-low') {
            $cards = $cards.sort((a, b) => $(b).data('price') - $(a).data('price'));
        }

        $grid.append($cards); // 重新排列

        $('.product-header-left').text(currentSubCategory || currentCategory || '全部商品');
    }

    function updateBreadcrumb() {
        let breadcrumbHTML = `
            <a href="index.html"><img src="./pic/home.png" alt="首頁" class="breadcrumb-icon">首頁</a>
            <span class="separator">›</span>
            <a href="shopall.html">全部商品</a>
        `;

        if (currentCategory) {
            breadcrumbHTML += `
                <span class="separator">›</span>
                <a href="shopall.html?category=${currentCategory}">${currentCategory}</a>
            `;
        }

        if (currentSubCategory) {
            breadcrumbHTML += `
                <span class="separator">›</span>
                <a href="shopall.html?category=${currentCategory}&subcategory=${currentSubCategory}">${currentSubCategory}</a>
            `;
        }

        $('.breadcrumb .breadcrumb-content').html(breadcrumbHTML);
    }

    // 點主分類
    $('.main-category').on('click', function () {
        currentCategory = $(this).data('filter') || null;
        currentSubCategory = null;

        $('details').prop('open', false);
        $('.main-category, details ul li').removeClass('active');
        $(this).addClass('active');

        filterAndSortProducts();
        updateBreadcrumb();
    });

    // 點子分類
    $('details ul li').on('click', function (e) {
        e.preventDefault();
        currentSubCategory = $(this).data('filter') || null;

        const parentDetail = $(this).closest('details');
        const parentSummary = parentDetail.find('summary').text();
        currentCategory = parentSummary.trim();

        $('details').not(parentDetail).prop('open', false);
        $('details ul li, .main-category').removeClass('active');
        $(this).addClass('active');
        parentDetail.prop('open', true);

        filterAndSortProducts();
        updateBreadcrumb();
    });

    // 排序功能
    $('.product-sort select').on('change', function () {
        currentSort = $(this).val(); // '', low-to-high, high-to-low
        filterAndSortProducts();
        updateBreadcrumb();
    });

    // 初始化執行
    filterAndSortProducts();
    updateBreadcrumb();
});
