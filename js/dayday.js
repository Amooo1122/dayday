//動態載入 header
    $(document).ready(function() {
            $("#header").load("header.html");
            $("#footer").load("footer.html");
    });

    $(document).ready(function(){
        $('.new-items').slick({
            slidesToShow: 5,
            centerMode: true,
            centerPadding: '30px',
            arrows: false,
            autoplay: true,
            infinite: true,
            slide: '.product-card',
            responsive: [
                {
                breakpoint: 768,
                settings: {
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
                },
                {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
                }
            ]
        });

        addBalloon();

        function addBalloon() {
            $('.product-balloon').remove();

            // 直接抓 slick-center，因為你用 slide: '.product-card'
            let centerCard = $('.slick-center');

            if (centerCard.length) {
                let title = centerCard.data('title');
                let price = centerCard.data('price');
                let balloon = `
                <div class="product-balloon">
                    ${title}<br>${price}
                </div>
                `;
                centerCard.append(balloon);
            }
        }

        $('.new-items').on('init afterChange', addBalloon);


        const $items = $(".recommend-item");
        const $mainImg = $("#mainImage");

        // 抓取所有圖片路徑
        const imgList = $items.map(function () {
            return $(this).data("img");
        }).get();

        let index = 0;
        let timer;

        function showImage(i) {
            $mainImg.attr("src", imgList[i]);
            index = i;
        }

        function startSlideshow() {
            timer = setInterval(function () {
            index = (index + 1) % imgList.length;
            showImage(index);
            }, 3000);
        }

        function stopSlideshow() {
            clearInterval(timer);
        }

        // 啟動輪播
        startSlideshow();

        // 滑鼠事件：hover 時停止輪播＋切圖
        $items.hover(
            function () {
            stopSlideshow();
            let i = $items.index(this);
            showImage(i);
            },
            function () {
            startSlideshow();
            }
        );

        });
